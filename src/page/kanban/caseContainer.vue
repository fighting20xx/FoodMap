<style lang="less" scoped>

	.contain-main{
		flex: 1;
		margin: 0;
		padding: 0;

		.content-item {
			height: 100%;
			padding: 10px;
			position: relative;
			/*border: solid 1px #2c3e50;*/
		}
	}

</style>
<template>
	<kanban :title="caseProp.name"  ref="kanban"
			@on-resize="resize">
		<div class="contain-main" ref="HeightWrap" id="HeightWrap" >
			<grid-layout
					v-if="caseProp.id != '' && rowHeight > 0 "
					:layout="layout"
					:col-num="24"
					:row-height="rowHeight"
					:is-draggable="false"
					:is-resizable="false"
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
					<div class="content-item">
						<singleChart v-if="isRepaint" :position="'position_'+caseProp.id+'_'+item.i" :dataSourceList=dataSourceList :parentId=caseProp.id :isEdit="false"></singleChart>
					</div>
				</grid-item>
			</grid-layout>
		</div>

	</kanban>
</template>

<script>

	import {AJAX_OAUTH, AJAX_VS, AJAX_VS_NODE} from '@/dim/apiName';
	import {CODE_KEY, MESSAGE_KEY, RESULT_KEY, SUCCESS_CODE, FAILD_CODE} from '@/dim/ajaxStruct';

	import singleChart from './components/single_chart_flex';
	import kanban from './kanban-temp';
	import {GridLayout,GridItem} from 'vue-grid-layout';
	import './css/kanban.less';
	import utiljs from '@/libs/util.min';


	export default {
		name: 'caseContainer',

		components: {
			singleChart,
			kanban,
			GridLayout,
			GridItem,
		},
		data(){
			return {
				isShow:false,
				isRepaint:true,
				id:'',
				caseProp:{
					id:'',
					name:'',
					layout:''
				},
				dataSourceList:[],
				layout:[
					{"x":0,"y":0,"w":6,"h":20,"i":"0"},
				],
				rowHeight:0
			}
		},
		watch:{
			'$route' (to, from) {
				this.id = this.$route.params.id;
				this.getCase();
			}
		},

		computed:{
			layout_rowOrCol:function () {
				return this.caseProp.layout.substr(0,1);
			},
			layout_Array:function () {
				let arr = this.caseProp.layout.substr(2).split('_').map(function (value) {
					return value.length ? parseInt(value) :value;
				});
				return arr;
			},
		},
		mounted:function () {
			this.getDataSource();
			this.getCase();
		},


		methods:{

			/**
			 * 修改请求提交。
			 *
			 * @return {void}
			 */
			getCase() {
				let _this = this;
				this.$ajax(AJAX_VS_NODE).get('kanban/case/query?id='+this.$route.params.id).then(oAjax => {
					let oAjaxData = oAjax.data;
					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						const op = oAjaxData[RESULT_KEY];

						if (op) {
							_this.caseProp.id = op.id;
							_this.caseProp.layout = op.layout;
							_this.caseProp.name = op.name;
							_this.layout = JSON.parse(op.config);

							_this.repaint();

						}else {
							this.$Message.error('没有对应的图形页面' + oAjaxData[MESSAGE_KEY]);
							_this.caseProp.id = '';
						}
					} else {
						this.$Message.error('获取页面失败，' + oAjaxData[MESSAGE_KEY]);
						_this.caseProp.id = '';
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

			repaint:function () {
				var _this = this;
				_this.isRepaint = false;
				setTimeout(function () {
					_this.isRepaint = true;
					_this.getRowHeight();
				},200)
			},


			/**
			 * 重置大小事件。
			 *
			 * @return {void}
			 */
			resize() {
				this.repaint();
			},


			getRowHeight:function () {
				let hight = this.$refs.HeightWrap.offsetHeight;
				this.rowHeight = parseFloat((hight/800).toFixed(4)* 10);

			}


		}
	};
</script>