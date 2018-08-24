<template>
    <Form ref="formInline"  inline>
        <FormItem >
            <Input v-model="singleItem.title"  type="text" placeholder="请输入名称" :disabled="editOrNew == 0"></Input>
        </FormItem>
        <FormItem >
            <Input v-model="singleItem.url"  type="text" style="width: 300px" placeholder="请输入url" :disabled="editOrNew == 0"></Input>
        </FormItem>
        <FormItem >
            <Checkbox  v-model="singleRow.checked" label="Eat" @on-change="changeCheck" :disabled="editOrNew == 1">添加到轮播</Checkbox>
            <Button v-show="editOrNew == 0"  @click="doDelete"  type="dashed"   icon="android-delete">删除</Button>
            <Button v-show="editOrNew == 0"  @click="doEdit"    type="dashed"   icon="edit">编辑</Button>
            <Button v-show="editOrNew != 0"   @click="doSubmit"  type="dashed"   icon="edit">保存</Button>
            <Select v-show="editOrNew != 0"    style="width:200px" @on-change="dataChange" >
                <Option v-for="item,index in navList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
    </Form>

</template>
<script>

	import {AJAX_OAUTH, AJAX_VS} from '@/dim/apiName';
    import {CODE_KEY, MESSAGE_KEY, RESULT_KEY, SUCCESS_CODE, FAILD_CODE} from '@/dim/ajaxStruct';

    export default {
        name: 'single_row',
        props: {
            appId: Number,
            singleRow: Object,
            navList: Array,

        },
        data(){
            return {
                singleItem: this.singleRow,
                isEdit:false,
                isNew:this.singleRow.urlId == -1,
            }
        },
        computed:{
            editOrNew:function () {
                if(this.isNew){
                    return 1;
                }else if(this.isEdit){
                    return 2
                }else {
                    return 0
                }
            }
        },
        mounted() {
        },
        methods:{

            doEdit:function () {
                this.isEdit = true;
            },


            /*
             * 点击保存按钮
             * */
            doSubmit:function () {
                if (this.singleItem.urlId != -1) {
                    this.modifySubmit();
                }else {
                    this.createSubmit();
                }
            },


            /*
            * 新增
            * */
            createSubmit:function () {

                this.$ajax(AJAX_VS).post('kanban/app/createAppUrl?title='+this.singleItem.title+'&url='+this.singleItem.url+'&appId='+this.appId,{
                	title:this.singleItem.title,
					url:this.singleItem.url,
					appId:this.appId,
                }).then(oAjax => {

                    let oAjaxData = oAjax.data;

                    if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
                        this.isEdit = false;
                        this.refresh();
                    } else {
                        this.$Message.error('新增失败，' + oAjaxData[MESSAGE_KEY]);
                    }
                });
            },
            /**
             * 修改请求提交。
             *
             * @return {void}
             */
            modifySubmit() {

            	console.log(this.singleItem.url);
                this.$ajax(AJAX_VS).post('kanban/app/updateAppUrl',
                    {
						urlId:this.singleItem.urlId,
						title:this.singleItem.title,
						url:this.singleItem.url,
                    }
                ).then(oAjax => {
                    let oAjaxData = oAjax.data;

                    if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
                        this.isEdit = false;
                        this.refresh();
                    } else {
                        this.$Message.error('更新失败，' + oAjaxData[MESSAGE_KEY]);
                    }
                });
            },

            /**
             * 下拉框改变，给前面的框 赋值
             *
             * @return {void}
             */
            dataChange:function (id) {
                var _this = this;

                this.navList.forEach(function (item,index) {
                    if (item.id == id) {
                        _this.singleItem.title = item.name;
                        _this.singleItem.url = item.url;
                    }
                })

            },
            /**
             * 触发自己的刷新事件， 让父组件刷新自己
             *
             * @return {void}
             */
            refresh:function () {
                this.$emit('fresh')
            },


            /**
             * 删除确认
             *
             * @return {void}
             */
            doDelete:function () {
                this.$Modal.confirm({
                    title: '删除确认',
                    content: '您确认要删除该记录吗',
                    onOk: () => {
                        this.deleteSubmit();
                    },
                });
            },

            /**
             * 删除一行
             *
             * @return {void}
             */
            deleteSubmit:function () {

                this.$ajax(AJAX_VS).get('kanban/app/deleteAppUrl?urlId='+this.single.urlId).then(oAjax => {

                    let oAjaxData = oAjax.data;

                    if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
                        this.refresh();

                    } else {
                        this.$Message.error('删除失败，' + oAjaxData[MESSAGE_KEY]);
                    }
                });
            },

            /**
             * 每一行的 checked发生改变， 反映到父组件，让父组件判断逻辑
             *
             * @return {void}
             */
            changeCheck:function () {
                var obj  = this.singleRow;
                this.$emit("changeCheck",obj.urlId,obj.checked);
            },


        }
    };
</script>
<style>


</style>
