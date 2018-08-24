<style lang="less" scoped>
	.videowall-device-page {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		width:  100% ;
		height: 100%;
		.editPage {
			height: 100%;
			width: 100%;
			position: relative;
            .action-wrap{
				display: flex;
            }
			.content-wrap {
				border: solid .1px gainsboro;
				position: absolute;
				top: 40px;
				width: 100%;
				bottom: 0;
				left: 0;

			}

		}
		.content-item {
			position: relative;
			height: 100%;
			border: solid 1px #2c3e50;
		}
        .layout-button {
            margin-right: 5px;
        }
	}

</style>
<template>
	<div class="videowall-device-page"  ref="videowall-device-page">
			<div class="listPage" v-if="showPage == 1">
				<div class="filter-row">
					<Row>
						<Col span="12" class="action-wrap">
							<Button  type="primary" @click="createDo">新增</Button>
						</Col>
					</Row>
				</div>
				<Table class="table-row" ref="dragable" :columns="columns" :data="tableList" highlight-row border></Table>
				<Page class="page-row" :total="pageCount.recordCount" @on-change="onPageChange" :page-size="pageCount.pageSize"></Page>
			</div>

			<div class="editPage" v-if="showPage == 2">
				<div class="action-wrap">
					<Button icon="reply" @click="goBack">返回 </Button>
					<RadioGroup v-model= caseProp.layout type="button" @on-change="layoutChange"  v-if="!isEdit">
						<Radio class="layout-button" v-for="layout,index in pageLayoutType" :label=layout.type :key="index"><layoutIcon :pageLayout=layout.type></layoutIcon></Radio>
					</RadioGroup>
                    <Input v-model="caseProp.name" style="width: 30%" placeholder="请输入名称">
                        <span slot="prepend">页面名称</span>
                    </Input>
					<Button type="primary" @click=submitDo>保存</Button>
				</div>

				<!--<div class="layoutItem" v-for="item in layout">-->
					<!--<b>{{item.i}}</b>: [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]-->
                    <!--</div>-->
				<div class="content-wrap" >
					<grid-layout
							v-if="rowHeight > 0"
							:layout="layout"
							:col-num="24"
							:row-height="rowHeight"
							:is-draggable="true"
							:is-resizable="true"
							:is-mirrored="false"
							:vertical-compact="true"
							:margin="[0, 0]"
							:use-css-transforms="true">

						<grid-item v-for="item in layout"
								   :x="item.x"
								   :y="item.y"
								   :w="item.w"
								   :h="item.h"
								   :i="item.i" :key="item.i">

							<div class="content-item" >
								<singleChart v-if="isEdit"  :position="'position_'+caseProp.id+'_'+item.i" :dataSourceList=dataSourceList :parentId=caseProp.id ref="single"></singleChart>
							</div>
						</grid-item>
					</grid-layout>
				</div>
			</div>
	</div>
</template>




<script>


	import util from '@/util/util';
	import utiljs from '@/util/util.min';
	import {AJAX_OAUTH, AJAX_VS,AJAX_VS_NODE} from '@/dim/apiName';
	import {CODE_KEY, MESSAGE_KEY, RESULT_KEY, SUCCESS_CODE, FAILD_CODE} from '@/dim/ajaxStruct';
//	import {normalStatusOptions, normalStatusStr} from '@/dim/optionList';
//	import {NAME as LIST_EDIT_PAGE_NAME, CHANGE_MODEL_ATTR_NAME, CREATE_MODEL, MODIFY_MODEL, LIST_MODEL} from '@/components/ListEditPage';

	import layoutIcon from '@/components/layoutIcon';
	import singleChart from './components/single_chart_flex';
	import {GridLayout,GridItem} from 'vue-grid-layout';



	export default {
		name: 'case-flex',

		components: {
			layoutIcon,
			singleChart,
			GridLayout,
			GridItem,
		},

		data() {
			let _this = this;
			return {
				layout:[
					{"x":0,"y":0,"w":12,"h":40,"i":"0"},
					{"x":12,"y":0,"w":12,"h":40,"i":"1"},
					{"x":0,"y":20,"w":12,"h":40,"i":"2"},
					{"x":12,"y":20,"w":12,"h":40,"i":"3"},
				],
				rowHeight:0,
				showPage:1,
				caseProp:{
                    id:'',
                    name:'',
                    layout:'r_2_2'
                },
				pageLayoutType:[
					{type:'r_1',name:'r_1'},
					{type:'r_1_1',name:'r_1_1'},
					{type:'r_2',name:'r_2'},
					{type:'r_2_2',name:'r_2_2'},
					{type:'r_1_2',name:'r_1_2'},
					{type:'r_2_1',name:'r_2_1'},
					{type:'c_2_1',name:'c_2_1'},
				],

				// 表格数据。
				tableList: [],
				// 表格数据分页信息。
				pageCount: {
					page: 1,
					total: 0,
					pageSize: 20,
				},

				// 表格栏目配置。
				columns: [{
					title: '序号',
					type: 'index',
					width: 70,
				}, {
					title: '名称',
					key: 'name',
				}, {
					title: '布局方式',
					key: 'layout'
				}, {
					title: '预览页面',
					render: (h, params) => {
						return [
							h('Button', {
								attrs: {
//									type: 'primary',
									size: 'small',
//									ghost:'ghost',
								},
								on: {
									click: () => {
//										this.$router.push({path:'/kanban-preview/'+params.row.id});
										const {href} = this.$router.resolve({path:'/kanban-preview/'+params.row.id});
										window.open(href, '_blank');
									}
								}
							}, '预览'),
						];
					}
				}, {
					title: '操作',
					width: 200,
					render: (h, params) => {
						return [
							h('Button', {
								attrs: {
									type: 'primary',
									size: 'small',
								},
								on: {
									click: () => {
										this.updateDo(params.row.id);
									}
								}
							}, '编辑'),

							h('Button', {
								attrs: {
									type: 'error',
									size: 'small',
								},
								on: {
									click: () => {
										this.deleteDo(params.row.id);
									}
								}
							}, '删除')
						];
					}
				}],

				chartList:[],
				dataSourceList:[],
			};
		},

		computed:{
			layout_rowOrCol:function () {
				return this.caseProp.layout.substr(0,1);
			},
			layout_Array:function () {
				return this.caseProp.layout.substr(2).split('_').map(function (value) {
					return parseInt(value);
				});
			},
			isEdit:function () {
				return this.caseProp.id != '';
			}

		},
		watch:{
			'caseProp.layout':function (newVal) {
				var _this = this;

				if(this.caseProp.id !== ''){
					return;
				}

				this.layout = [];
				let len = this.layout_Array.length;
				let rowNumber = 24;
				let colNumber = 80;
				let position = 0;

				this.layout_Array.forEach(function (count,index) {
					if(_this.layout_rowOrCol === 'r'){
						var col_range = Math.floor(colNumber/len);
						var row_range = Math.floor(rowNumber/count);
						for (let i=0; i<count ;i++) {
							_this.layout.push({
								"x": i * row_range,
								"y": index * col_range ,
								"w": row_range,
								"h": col_range,
								"i":position+'',
							});
							position++
						}
					}else {
						var row_range = Math.floor(rowNumber/len);
						var col_range = Math.floor(colNumber/count);
						for (let i=0; i<count ;i++) {
							_this.layout.push({
								"x": index * row_range,
								"y": i * col_range ,
								"w": row_range,
								"h": col_range,
								"i":position+'',
							});
							position++
						}
					}

				});

				console.log(_this.layout)

			}
		},

		mounted() {
			this.getTableList();
			this.getDataSource();
		},

		updated:function () {

		},

		methods: {

			/**
			 * 获取表格数据。
			 *
			 * @return {void}
			 */
			getTableList() {
				let _this = this;

				_this.$ajax(AJAX_VS_NODE).get('kanban/case/list', {
					params: {
						page: _this.pageCount.page,
						query: _this.pageCount.pageSize,
					}
				}).then(oAjax => {
					let nCode = oAjax.data[CODE_KEY];
					if (nCode != SUCCESS_CODE) {
						_this.$Message.error(oAjax.data[MESSAGE_KEY]);
					} else {
						_this.tableList = oAjax.data[RESULT_KEY].list;
						_this.pageCount = oAjax.data[RESULT_KEY].count;
					}
				});
			},

			/**
			 * 当翻页后的回调。
			 *
			 * @param {Number} nPage 翻页后的页码。
			 * @return {void}
			 */
			onPageChange(nPage) {
				this.pageCount.page = nPage;
				this.getTableList();
			},



			/**
			 * 提交请求操作。
			 *
			 * @return {void}
			 */
			createSubmit() {
				var _this = this;
				this.$ajax(AJAX_VS_NODE).post('kanban/case/create', {name:this.caseProp.name,layout:this.caseProp.layout,config:JSON.stringify(this.layout)}).then(oAjax => {
					let oAjaxData = oAjax.data;


					let nCode = oAjax.data[CODE_KEY];
					if (nCode != SUCCESS_CODE) {

						this.$Message.error('新增页面失败，' + oAjaxData[MESSAGE_KEY]);
					} else {
						this.$Message.success('新增页面成功，' + oAjaxData[MESSAGE_KEY]);

						this.createAllChart(oAjaxData[RESULT_KEY].insertId);
						this.showPage = 1;
						// 重新加载列表数据。
						this.getTableList();
					}
				});
			},


			/**
			 * 修改请求提交。
			 *
			 * @return {void}
			 */
			modifySubmit() {
				var obj = this.caseProp;
				obj.config = JSON.stringify(this.layout);
				return this.$ajax(AJAX_VS_NODE).post('kanban/case/update', obj).then(oAjax => {
					let oAjaxData = oAjax.data;

					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						this.$Message.success('更新页面成功，' + oAjaxData[MESSAGE_KEY]);
						this.showPage = 1;
						this.getTableList();
//						this.reCreate(this.caseProp.id);    //编辑页面不允许改变布局， 所以不需要重建所有 chart
					} else {
						this.$Message.error('更新页面失败，' + oAjaxData[MESSAGE_KEY]);
					}
				});
			},


			/**
			 * 删除请求提交。
			 *
			 * @param {Number} nDataModelId
			 * @returnl {void}
			 */
			deleteSubmit(id) {
				return this.$ajax(AJAX_VS_NODE).get('kanban/case/delete?id='+id).then(oAjax => {
					let oAjaxData = oAjax.data;

					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						// 重新加载列表数据。
						this.getTableList();
						this.deleteAllChart(id);

					} else {
						this.$Message.error('删除页面失败，' + oAjaxData[MESSAGE_KEY]);
					}
				});
			},


			/**
			 * 新增或编辑时的提交操作。
			 *
			 * @return {void}
			 */
			submitDo() {
				if (!this.isEdit) {
					this.createSubmit();
				} else {
					this.modifySubmit();
				}
			},


			/**
			 * 点击更新按钮。
			 *
			 * @param {Number} nDataModelId
			 * @returnl {void}
			 */
			updateDo(id) {


				var _this =this;
				_this.tableList.forEach(function (item) {
					if (item.id  === id) {
						_this.caseProp.id = item.id;
						_this.caseProp.name = item.name;
						_this.caseProp.layout = item.layout;
						_this.layout = JSON.parse(item.config);
						_this.showPage = 2;
						_this.getRowHeight();

					}
				});

			},
			/**
			 * 删除操作。
			 *
			 * @param {Number} nDataModelId
			 * @returnl {void}
			 */
			deleteDo(id) {
				this.$Modal.confirm({
					title: '删除确认',
					content: '您确认要删除该记录吗',
					onOk: () => {
						this.deleteSubmit(id);
					},
				});
			},


			/**
			 * 切换至创建模式。
			 *
			 * @return {void}
			 */
			createDo() {
				this.caseProp = {
					id:'',
					name:'',
					layout:'r_2_2'
				};
				this.showPage = 2;
				this.getRowHeight()
			},


			/*
			* 类型改变
			* */
			layoutChange:function () {
				var _this = this;
				_this.showPage = 0;
				setTimeout(function () {
					_this.showPage = 2
				},0)
			},





			/**
			 * 获取chartlist数据。
			 *
			 * @return {void}
			 */
			getChartList() {
				let _this = this;

				_this.$ajax(AJAX_VS_NODE).get('kanban/chart/list?sourceId='+this.caseProp.id ).then(oAjax => {
					let nCode = oAjax.data[CODE_KEY];
					if (nCode != SUCCESS_CODE) {
						_this.$Message.error(oAjax.data[MESSAGE_KEY]);
					} else {
						_this.chartList = oAjax.data[RESULT_KEY];

					}
				});
			},

			/**
			 * 从新创建所有图形。
			 *
			 * @return {void}
			 */

			reCreate(parentId) {
				var _this = this;
				this.deleteAllChart(parentId).then(_this.createAllChart(parentId));
			},

			/**
			 * 创建所有的chart图。
			 *
			 * @return {void}
			 */

			createAllChart(parentId) {
				var _this = this;
				var list = this.layout.map(function (item,index) {
					return {
						position:'position_'+parentId+'_'+item.i,
						parentId:parentId,
						chartType:'bar',
						sql:'select 1 ',
					}
				});

				this.$ajax(AJAX_VS_NODE).post('kanban/chart/createAll',list).then(oAjax => {
					let oAjaxData = oAjax.data;
					if (oAjaxData[CODE_KEY] != SUCCESS_CODE) {
						_this.$Message.error('创建所有图形失败',oAjax.data[MESSAGE_KEY]);
					} else {
						_this.$Message.success('创建所有图形成功',oAjax.data[MESSAGE_KEY]);
					}
				});
			},

			/**
			 * 删除所有所属的chart图。
			 *
			 * @return {void}
			 */

			deleteAllChart(parentId) {
				let _this = this;

				return _this.$ajax(AJAX_VS_NODE).get('kanban/chart/deleteAll?parentId='+ parentId).then(oAjax => {
					let nCode = oAjax.data[CODE_KEY];
					if (nCode != SUCCESS_CODE) {
						_this.$Message.error('删除所有图形失败',oAjax.data[MESSAGE_KEY]);
					} else {
						_this.$Message.success('删除所有图形成功',oAjax.data[MESSAGE_KEY]);
					}
				});
			},




			/**
			 * 获取数据源。
			 *
			 * @return {void}
			 */
			getDataSource() {

				this.$ajax(AJAX_VS_NODE).get('kanban/chart/datasource').then(oAjax => {
					let oAjaxData = oAjax.data;

					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						this.dataSourceList = oAjax.data[RESULT_KEY];
					} else {
						this.$Message.error('失败，' + oAjaxData[MESSAGE_KEY]);
					}
				});
			},

			goBack:function () {
				this.showPage = 1;
				this.caseProp = {};
			},

			getRowHeight:function () {
				let hight = this.$refs['videowall-device-page'].offsetHeight-40;
				this.rowHeight =  parseFloat((hight/800).toFixed(2)* 10);

			}

		}
	};
</script>
