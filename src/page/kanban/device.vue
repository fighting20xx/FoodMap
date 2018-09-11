<style scoped>
	.pre-button {
		margin: 20px 20px 20px 0;
	}
</style>
<template>
	<div class="kanban-device-page">

		<Button  type="primary" class="pre-button" @click="reFleshData" >刷新数据</Button>
		<Table v-show="!isEdit" :columns="fields" :data="tableList" @on-row-click="rowClick" ></Table>

		<div v-show="isEdit">
			<div class="action-wrap">
				<Button icon="reply" class="pre-button" @click="backTo"></Button>
			</div>

			<div class="field-wrap">
				<FormField :fields="editFields" :model="editData"  @submit="submitDo" ></FormField>
			</div>
		</div>


	</div>
</template>

<script>

    import expandRow from './components/table-expand.vue';

	import FormField from '@/components/FormField';

	import {AJAX_OAUTH, AJAX_VS} from '@/dim/apiName';

	import {CODE_KEY, MESSAGE_KEY, RESULT_KEY, SUCCESS_CODE, FAILD_CODE} from '@/dim/ajaxStruct';


	export default {
		name: 'kanban_device',
		components: {
            FormField,
		},


		data() {
			let _this = this;
			return {
                fields: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',

                    },
                    {
						width: 120,
                        render: (h, params) => {
                            return  h('Button', {
								props: {

									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: (event) => {
										event.stopPropagation();
										_this.RefreshDevice(params.row);
									}
								}
							}, '刷新设备')
                        },

                    },
					{
                        type: 'expand',
                        key: 'name',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    appId: params.row.appId,
                                    row: params.row
                                },
                                on: {
                                    'freshDevice': (obj) => {
                                        _this.reFresh(obj);
                                    }
                                }
                            })
                        },

                    },
                    {
                        title: '',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (event) => {
                                            event.stopPropagation()
                                            _this.isEdit = ! _this.isEdit;
                                            _this.editData = params.row;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: (event) => {
                                            event.stopPropagation()
                                            _this.editData = params.row;
                                            _this.deleteDo();
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                // 搜索的时候，查询
                query:'',
                backData:{},
				// 表格数据。
				tableList: [],

				// 是否编辑,
				isEdit:false,
				editData:{},
                editFields:[
                    [{
                        label: '用户名',
                        type: 'input',
                        model: 'name',
                    }],
				],
			};
		},
		mounted() {
			this.getTableList();
		},
		computed:{
            isCreateModel:function () {
				return  !this.editData.appId;
            }  
		},
		methods: {

			/**
			 * 获取表格数据。
			 * 
			 * @return {void}
			 */
			getTableList() {
				let _this = this;
				
				_this.$ajax(AJAX_VS).get('kanban/app/getAppList', {
					params: {
						query: _this.query,
					}
				}).then(oAjax => {
					let nCode = oAjax.data[CODE_KEY];
					if (nCode != SUCCESS_CODE) {
						_this.$Message.error(oAjax.data[MESSAGE_KEY]);
					} else {
						_this.tableList = oAjax.data[RESULT_KEY];
                        _this.tableList.forEach(function (item,index) {
							item.isEdit = false;
							item._expanded = false;
                        });
					}
				});
			},

			/*
			* 添加一下新的看板
			* */
			addNewItem(){
                this.editData = {};
                this.isEdit = true;
			},
			/*
			* 返回按钮
			* */
            backTo(){
                this.isEdit = false;
			},



            /**
             * 新增或编辑时的提交操作。
             *
             * @return {void}
             */
            submitDo() {
                if (this.isCreateModel) {
                    this.createSubmit();
                } else {
                    this.modifySubmit();
                }
            },
			/**
			 * 提交请求操作。
			 * 
			 * @return {void}
			 */
			createSubmit() {
			    var _this = this;
				this.$ajax(AJAX_VS).post('kanban/app/createApp?name='+_this.editData.name).then(oAjax => {
					let oAjaxData = oAjax.data;

					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						// 将新增的数据添加到队列。

						this.backTo();
						this.getTableList();

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
				this.$ajax(AJAX_VS).post('kanban/app/updateAppName?appId='+this.editData.appId+'&name='+this.editData.name).then(oAjax => {
					let oAjaxData = oAjax.data;

					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
                        this.backTo();
                        this.getTableList();

					} else {
						this.$Message.error('更新失败，' + oAjaxData[MESSAGE_KEY]);
					}
				});
			},

            /**
             * 删除操作。
             *
             * @param {Number} nDeviceId
             * @returnl {void}
             */
            deleteDo() {
                this.$Modal.confirm({
                    title: '删除确认',
                    content: '您确认要删除该记录吗',
                    onOk: () => {
                        this.deleteSubmit();
                    },
                });
            },

			/**
			 * 删除请求提交。
			 * 
			 * @param {Number} nDeviceId
			 * @returnl {void}
			 */
			deleteSubmit() {
			    var _this =this;
				this.$ajax(AJAX_VS).get('kanban/app/deleteApp?appId='+_this.editData.appId).then(oAjax => {
					let oAjaxData = oAjax.data;

					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						// 重新加载列表数据。
						this.getTableList();

					} else {
						this.$Message.error('删除失败，' + oAjaxData[MESSAGE_KEY]);
					}
				});
			},


            /**
             * 从新加载数据。
             *
             * @return {void}
             */
            reFresh:function () {
			    this.getTableList();
           },

            /**
             * 刷新设备页面。
             *
             * @return {void}
             */
			RefreshDevice:function (row) {
				var _this =this;
				this.$ajax(AJAX_VS).get('kanban/app/refreshDevice?appId='+row.appId).then(oAjax => {
					let oAjaxData = oAjax.data;

					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						this.$Message.success('刷新成功，' + oAjaxData[MESSAGE_KEY]);
					} else {
						this.$Message.error('刷新失败，' + oAjaxData[MESSAGE_KEY]);
					}
				});
           },


            /**
             *  点击一行， 展开
             *
             * @return {void}
             */

            rowClick:function (row, rowIndex) {
                this.tableList[rowIndex]._expanded =  !this.tableList[rowIndex]._expanded;
			    this.$set(this.tableList,rowIndex,this.tableList[rowIndex]);

            }


		}
	};
</script>