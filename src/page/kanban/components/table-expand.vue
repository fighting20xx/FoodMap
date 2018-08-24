
<template>
    <div>
        <Card :bordered="false">
            <div slot="title">
                <Checkbox  v-model="row.slide" placeholder="default size"  @on-change="rootChange" >轮播</CheckBox>
                <InputNumber v-model="row.interval" placeholder="default size"  ></InputNumber>
                <Select style="width:100px" v-model="row.unit" placeholder="时间单位" >
                    <Option v-for="item in timeUnit" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
                <Button type="dashed"   icon="save" @click="changeCircle">保存</Button>
            </div>
            <div v-for="item ,index in urlList" >
                <singleRow  ref="singleRow" :singleRow=item  v-if="hackReset" :key="index" :navList="navList" :appId="row.appId"  @fresh="doFresh" @changeCheck="changeCheck"> </singleRow>
            </div>
            <Button type="dashed" v-show="!haveNew"  icon="plus-round" @click="createRow">添加</Button>
            <Button type="dashed" v-show="haveNew"  icon="android-delete" @click="deleteRow">去掉新增的</Button>
        </Card>
    </div>
</template>s
<script>
    import singleRow from './single_row.vue';
	import {AJAX_OAUTH, AJAX_VS,AJAX_VS_NODE} from '@/dim/apiName';
    import {CODE_KEY, MESSAGE_KEY, RESULT_KEY, SUCCESS_CODE, FAILD_CODE} from '@/dim/ajaxStruct';
    import DIM_API_PATH from '@/dim/apiPath';
    import Vue from 'vue';
    import ENV from '../../../../build/env';
    import DIM from '../../../../build/env-dim';

    export default {
        name: 'table-expand',
        components:{
            singleRow
        },
        props: {
            row: Object
        },
        data () {
            return {
                hackReset:true,
                viewUrlIds:this.row.viewUrlIds,
                urlList:[],
                navList:[],   //所有的看板列表
                timeUnit:[{value:0,label:"秒"},{value:1,label:"分钟"},{value:2,label:"小时"}],
            };
        },
        computed:{
            haveNew:function () {
                var flag = false;
                this.urlList.forEach(function (item,index) {
                    if (item.urlId == -1){
                        flag = true;
                    }
                })
                return flag;
            },
            isChecked:function () {
                return this.row.slide;
            },
        },
        created () {
            this.getNavList();
        },
        mounted() {
            this.getUrlList();
        },
        methods:{
            /**
             * 获取表格展开后url的数据。
             *
             * @return {void}
             */
            getUrlList() {
                var _this = this;
                _this.urlList.map(function (item) {       //强制 从新渲染列表
                    return {}
                });
                _this.urlList.pop();
                _this.$ajax(AJAX_VS).get('kanban/app/getAppUrlList', {
                    params: {
                        appId: _this.row.appId ,
                    }
                }).then(oAjax => {
                    let nCode = oAjax.data[CODE_KEY];
                    if (nCode == SUCCESS_CODE) {
                        var list = oAjax.data[RESULT_KEY];
                        list.forEach(function (item,index) {
                            _this.row.viewUrlIds.split(",").indexOf(item.urlId+'')>-1
                                ?  item.checked = true
                                :  item.checked = false
                        });

                        _this.urlList = list;
                    } else {
                        this.$Message.error('加载失败，' + oAjax[MESSAGE_KEY]);
                    }

                });
            },
            /**
             * 获取所有的看板列表。
             *
             * @return {void}
             */
            getNavList() {
                let _this = this;
//
//                _this.$ajax(AJAX_VS).get('cockpit/theme/getNavList',{}).then(oAjax => {
//                    let nCode = oAjax.data[CODE_KEY];
//                    if (nCode == SUCCESS_CODE) {
//                        var list = oAjax.data[RESULT_KEY];
//                        list.forEach(function (item,index) {
//                            item.url= DIM_API_PATH.VS+ "page/cockpit/item-preview.html?id="+item.id;
//                        });
//                        _this.navList = list;
//                    } else {
//                        this.$Message.error('加载失败，' + oAjax[MESSAGE_KEY]);
//                    }
//
//                });

				_this.$ajax(AJAX_VS_NODE).get('kanban/case/list', {
					params: {
						page: 1,
						query: 1000,
					}
				}).then(oAjax => {
					let nCode = oAjax.data[CODE_KEY];
					if (nCode != SUCCESS_CODE) {
						_this.$Message.error('加载失败，' + oAjax.data[MESSAGE_KEY]);
					} else {
						var list =  oAjax.data[RESULT_KEY].list;
						list.forEach(function (item,index) {
							item.url= _this.spellURL(item.id);
						});
						_this.navList = list;
					}
				});



            },
            /**
             * 新增一行
             *
             * @return {void}
             */
            createRow:function () {
                this.urlList.push({
                    checked:false,
                    title:'',
                    url:'',
                    urlId:-1,
                });
            },
            /**
             * 删除新增的
             *
             * @return {void}
             */
            deleteRow:function () {
                this.urlList.pop();
            },

            /**
             * 页面刷新，  从新加载数据
             *
             * @return {void}
             */
            doFresh:function () {
                this.getUrlList();
            },

            /**
             * 点击按钮轮播设置保存
             *
             * @return {void}
             */
            changeCircle:function () {
                var _this = this;
                var slide = _this.row.slide? 1:0;
                this.$ajax(AJAX_VS).get('kanban/app/updateAppSlide?' +
                    'appId='+_this.row.appId+'&slide='+slide
                    +'&interval='+_this.row.interval
                    +"&unit="+_this.row.unit
                    +'&viewUrlIds='+_this.viewUrlIds
                ).then(oAjax => {
                    let oAjaxData = oAjax.data;

                    if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
                        _this.$Message.success('修改成功');
                        _this.refresh();

                    } else {
                        _this.$Message.error('删除失败，' + oAjaxData[MESSAGE_KEY]);
                    }
                });
            },

            /**
             * 点击是否轮播的总按钮  handle
             *
             * @return {void}
             */
            rootChange:function () {

                var _this = this;
                var list = this.urlList;

                if(this.isChecked) {
                    if(this.countChecked() == 0){
                        list[0].checked = true;
                    }
                }else {
                    if(this.countChecked() == 0){
                        list[0].checked = true;
                    }else if(this.countChecked() == 1){

                    }else {
                        this.expendall(list,false);
                        list[0].checked = true;
                    }
                }

                this.getViewUrlIds();
                this.doReset();

            },

            /**
             *  每一行的 是否添加到轮播按钮
             *
             * @return {void}
             */
            changeCheck:function (urlId, flag) {

                var _this = this;
                var list = this.urlList;
                var tempObj = {};

                this.urlList.forEach(function (item,index) {
                    if(item.urlId == urlId){
                        tempObj = item;
                        item.checked = flag;
                    }
                });
                if(this.isChecked) {
                    if(this.countChecked() == 0){
                        tempObj.checked = true;
                    }
                }else {
                    if(this.countChecked() == 0){
                        tempObj.checked = true;
                    }else {
                        this.expendall(list,false);
                        tempObj.checked = true;
                    }
                }
                this.getViewUrlIds();
                this.doReset();

            },
            /**
             * 计算总共有多少个 打勾的
             *
             * @return {number}
             */
            countChecked:function () {
                var number = 0;
                var str='';
                this.urlList.forEach(function (item,index) {
                    if (item.checked == true) {
                        number++;
                    }
                    str += item.checked ;
                });
                return number;
            },
            /**
             * 整体修改 列表的状态，  全部变选中， 或者不选中
             *
             * @return {void}
             */
            expendall:function (list,flag) {
                var _this  = this;
                list.forEach(function (item,index) {
                    item.checked = flag;
                });
            },
            /**
             * 把选中的列表的id 拼接成一个字符串，
             *
             * @return {void}
             */
            getViewUrlIds:function () {
                var str = '';
                this.urlList.forEach(function (item,index) {
                    if (item.checked){
                        str += item.urlId+','
                    }
                });
                this.viewUrlIds = str.slice(0,str.length-1);
            },

            /**
             * 强制重新加载 某个组件
             *
             * @return {void}
             */
            doReset:function () {
                this.hackReset = false;
                this.$nextTick(() => {
                    this.hackReset = true
                })
            },

            /**
             * 触发自己的 事件， 让父组件刷新自己
             *
             * @return {void}
             */
            refresh:function () {
                this.$emit('freshDevice');

            },


			/**
			 * 拼接url  分为2个模式，  开发者模式，  生产者模式是打包之后放到vs后台
			 *
			 * @return {url}
			 */
            spellURL:function (id) {

				let url = '${vsDomain}view/vs/index.html#/kanban-preview/'+id;

//                let url = 'http://'+'${vsHost}'+ ":810/#/kanban-preview/"+id;
//                Object.keys(DIM).forEach(function (key) {
//                   let value = DIM[key];
//                   if (ENV === value) {
//                   	    if(key.slice(0,4).toUpperCase() ==='PROD'){
//							url = '${vsDomain}view/vs/index.html#/kanban-preview/'+id;
//                        }
//                   }
//                });
                return url;
			}
        }
    };
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>