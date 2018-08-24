<template>
	<div class="kanban-page">
		<div class="kanban-head">
			<h1 class="kanban-title">{{title}}</h1>
			<div class="date">{{datetime}}</div>
		</div>

		<div class="head-line" />

		<div class="kanban-body">
			<slot />
		</div>
	</div>
</template>


<script>
import './css/kanban.less';
import utiljs from '@/libs/util.min';
import echarts from 'echarts';


export default {
	name: "kanban_temp",


	props: {
		title: {
			type: String
		},
	},


	data() {
		return {
			datetime: '',
		}
	},


	mounted() {
		this.refreshTime();
		this.resizeEvent();
	},


	methods: {
		/**
		 * 设置自动刷新时间。
		 * 
		 * @return {void}
		 */
		refreshTime() {
			let _this = this;

			setInterval(build, 1000);
			build();


			function build() {
				_this.datetime = utiljs.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
			}
		},


		/**
		 * 设置页面重置大小事件。
		 * 触发后会派发 on-resize。
		 * 
		 * @return {void}
		 */
		resizeEvent() {
			let _this = this;
			window.addEventListener('resize', function () {
				_this.$emit('on-resize');
			});
		},
	}
};
</script>
