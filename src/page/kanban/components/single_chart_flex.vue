<style lang="less" scoped>
 .chart-wrap {
     height: 100%;
     width: 100%;
     display: flex;
     flex-direction: column;

     .chart-title{
         display: flex;
     }
     .chart-main {
         flex: 1;
         position: relative;

         .chart-content{
             position: relative;
             /*flex: 1;*/
             height: 100%;
             display: flex;
             .chart-item{
                flex: 1;
                 width: 100% !important;
             }
         }


         .chart-type {
             position: absolute;
             top: 50%;
             left: 5px;
             transform: translateY(-50%);
             width: 40px;
         }

         .padding-space{
             padding-left: 40px;
         }
     }
 }

#beHidden {
    display: none;
}
</style>

<template>
    <div class="chart-wrap">
        <div class="chart-title" :id="!isEdit ? 'beHidden' :''" >
            <Select v-model="sourceId" style="width:100px">
                <Option v-for="item,index in dataSourceList" :value="item.sourceId" :key="item.sourceId" >{{ item.name }}</Option>
            </Select>

            <Input v-model="chartSql" placeholder="请输入sql">
                <span slot="prepend">Sql</span>
                <Button slot="append" type="ghost" @click="modifySubmit">执行</Button>
            </Input>
        </div>
        <div class="chart-main">

            <div class="chart-content"  :id="chartId+'_height'" :class="isEdit ? 'padding-space' :''">
                <div v-if="chartType !='table'"  class="chart-item" :id="chartId"></div>
                <Table v-if="chartType ==='table'"  class="chart-item" :columns="tableColume" :data="tableData" :height=tableHeight></Table>
            </div>

            <div class="chart-type" :id="!isEdit ? 'beHidden' :''" >
                <RadioGroup v-model="chartType"  vertical  @on-change="OnChange">
                    <Radio class="item" label="bar">柱</Radio>
                    <Radio class="item" label="line">线</Radio>
                    <Radio class="item" label="pie">饼</Radio>
                    <Radio class="item" label="table">表</Radio>
                </RadioGroup>
            </div>
        </div>
    </div>
</template>
<script>

	import {AJAX_OAUTH, AJAX_VS, AJAX_VS_NODE} from '@/dim/apiName';
    import {CODE_KEY, MESSAGE_KEY, RESULT_KEY, SUCCESS_CODE, FAILD_CODE} from '@/dim/ajaxStruct';
	import echarts  from 'echarts';
	import utiljs from '@/util/util.min';
	import ChartParam from '../js/chartParam';


	export default  {
        name: 'single_chart',
        props: {
			isEdit:{
				default:true,
            },
            parentId:{
				default:'',
            },
            position:{
				default:'position_0',
            },
			dataSourceList:{
				default:[],
                type:Array
            },
        },
        data(){
            return {
                chartType:'bar',
				sourceId:0,
				chartSql:'',
				option:{},
				chartId: this.$props.position,
				tableColume:[],
				tableData:[],
                tableHeight:0,
            }
        },
		computed:{
			dataSource:function () {
				var _this = this;
				let sourceTemp = {};
				this.dataSourceList.forEach(function (source,index) {
					if (source.sourceId ==  _this.sourceId) {
						sourceTemp =  source.config;
					};
				});
				return sourceTemp;
			},
		},
        mounted() {
			this.getOption();
        },
        methods:{

            /**
             * 修改请求提交。
             *
             * @return {void}
             */
			getOption() {
                let _this = this;
                if (this.parentId === '') {
                	return
                }
                this.$ajax(AJAX_VS_NODE).post('kanban/chart/getOption',{ parentId: this.parentId , position: this.position}).then(oAjax => {
                    let oAjaxData = oAjax.data;
                    if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						const op = oAjaxData[RESULT_KEY]
                        if (op) {
							_this.chartType = op.chartType;
							_this.sourceId = parseInt(op.sourceId);
							_this.chartSql = op.sql;
							_this.option = JSON.parse(op.option);
							_this.executeSql();
                        }else {
							this.$Message.error('没有对应的配置' + oAjaxData[MESSAGE_KEY]);
                        }
                    } else {
                        this.$Message.error('获取配置失败，' + oAjaxData[MESSAGE_KEY]);
                    }
                });
            },



            /**
             * 修改chart提交。
             *
             * @return {void}
             */
            modifySubmit() {
                let _this = this;
                this.$ajax(AJAX_VS_NODE).post('kanban/chart/update',{
					parentId:this.parentId,
					position:this.position,
					chartType:this.chartType,
					sourceId:this.sourceId,
					sql:this.chartSql,
					option:{},
				}).then(oAjax => {
                    let oAjaxData = oAjax.data;
                    if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						this.$Message.success('保存配置成功，' + oAjaxData[MESSAGE_KEY]);
						_this.executeSql();

                    } else {
                        this.$Message.error('保存配置失败，' + oAjaxData[MESSAGE_KEY]);
                    }
                });
            },


			/**
			 * 执行sql。
			 *
			 * @return {void}
			 */
			executeSql() {
				let _this = this;

				this.$ajax(AJAX_VS_NODE).post('kanban/chart/executeSql',{sql:this.chartSql,id:this.sourceId,config:this.dataSource}).then(oAjax => {
					let oAjaxData = oAjax.data;
					if (oAjaxData[CODE_KEY] == SUCCESS_CODE) {
						this.$Message.success('执行sql成功，' + oAjaxData[MESSAGE_KEY]);

						_this.renderCharts(oAjaxData[RESULT_KEY] || []);
					} else {
						this.$Message.error('执行sql失败，' + oAjaxData[MESSAGE_KEY]);
					}
				});
			},



			/**
			 * 渲染图形。
			 *
			 * @return {void}
			 */
			renderCharts(resultList) {
				if(this.chartType =="table" ) {
					this.tableHeight = document.querySelector('#'+this.chartId+'_height').offsetHeight;

					this.tableColume= Object.keys(resultList[0]).map(function (key) {
                        return {title:key,key:key}
					}) ;
					this.tableData = resultList;
                        return;
                };
                let oChart = echarts.init(document.querySelector('#' + this.chartId));
                oChart.setOption(crteateOption(this , resultList),true);
			},

			OnChange:function () {
				if( this.isEdit){
					if (this.sourceId !== "" &&  this.chartSql !== "") {
						this.modifySubmit();
					}
				}
			},

        }
    };





    /**
     * 预处理数据，根据类型创建对应的series
     */

	function preDealData(vm,li) {
		let list = utiljs.clone(li) || [];
		let key_xaxis = '';
		let keys_series = [];
		let structData = {
			x_data:[],
			series:{},
			legent :[]
        };

		if (list.length) {
			 key_xaxis = canBeXaxis(list[0]);
			 keys_series = canBeNumber(list[0]);
		}
        if (vm.chartType == 'bar'  || vm.chartType == 'line') {

            list.forEach(function (item) {
				structData.legent.push(key_xaxis);
                structData.x_data.push(item[key_xaxis]);
                keys_series.forEach(function (key) {
                    let value = item[key];
                    structData.series[key]
                        ? structData.series[key].push(value)
                        : structData.series[key] = [parseInt(value)];
                });
            });
            structData.legent = keys_series;

        } else if (vm.chartType == 'pie'){
				list.forEach(function (item) {
					structData.legent.push(key_xaxis);
//					structData.x_data.push(item[key_xaxis]);
					keys_series.forEach(function (key) {
						let value = item[key];
						structData.series[key]
                            ? structData.series[key].push({value:value,name:item[key_xaxis]})
                            : structData.series[key] = [{value:value,name:item[key_xaxis]}];
					});
				});
				structData.legent = keys_series;

//				console.log(structData);
        }
        return structData;
	}

	/**
     * 创建图形需要的optiion
     * */

	function crteateOption(vm,resultList) {
		let structData = preDealData(vm,resultList);

		let seriesArry = [];
		let count_series = Object.keys(structData.series).length;
		Object.keys(structData.series).map(function (item,index) {
			seriesArry.push({
				type: vm.chartType,
                center: '50%',
				radius: pieSize(count_series,index),
				barMaxWidth:'30%',
				label: chartLabel(vm.chartType),
				itemStyle: {
					barGap: '100%',
					borderWidth: '100px',
				},
				data: structData.series[item]
            });
		});

		let obj = {
//			color: ChartParam.COLOR_ARRY,
			grid: utiljs.extends(true, ChartParam.GRID, {}),

			legend: utiljs.extends(true, ChartParam.LEGENT, {
				data: structData.legent,
			}),
			xAxis:utiljs.extends(true, utiljs.clone(ChartParam.AXIS_X_STYLE), {
				type: 'category',
				data: structData.x_data,
			}),

			yAxis:utiljs.extends(true, ChartParam.AXIS_Y_STYLE, {
				type: 'value',
			}),
			series: seriesArry,
		};
		if (vm.chartType === 'pie') {delete obj.yAxis ; delete obj.xAxis }
		return  utiljs.clone(obj)
	}

	/**
	*
	* 判断那些字段是作为数据的
	* */

	function canBeNumber(item) {
		let list = [];

		Object.keys(item).forEach(function (key) {
			let value = item[key];
			if (typeof value == 'number'){
				list.push(key);
			}else if (typeof  value == 'string' && !(typeof parseInt(value) !=NaN)  ) {
				list.push(key);
			}
		});
        return list;
	}



	/**
	* 判断那个字段是作为x轴的
	* */

	function canBeXaxis(item) {
		let keys = Object.keys(item);
		let resultKey = '';

		if(keys.indexOf('name') >= 0) {          //首先含有name字段的，默认name
			return 'name'
        }

		for (let i=0; i<keys.length;i++) {     // 没有name字段的， 包含name 也行
			let key = keys[i];
			if(key.indexOf('name') >= 0){
                return key;
            }
        }

        let zhongwen = /^[\u4e00-\u9fa5]{0,}$/;  //没办法，  值包含中文的
		for (let i=0; i<keys.length;i++) {
			let key = keys[i];
			if(zhongwen.test(item[key])){
                return key;
            }
        }

        return keys[0];
	}




	/**
     * 根据饼图的数量，设置圈数的大小
     * */

	function pieSize(count,index) {
		var arry = [];
		switch (count){
            case 1:
				arry = [['0', '45%']];
            	break;
            case 2:
				arry = [['0', '25%'],['35%', '45%']];
            	break;
            case 3:
				arry = [['0', '20%'],['30%', '40%'],['50%', '60%']];
            	break;
            case 4:
				arry = [['0', '20%'],['30%', '35%'],['45%', '50%'],['60%', '65%']];
            	break;
            default:
				arry = function () {
					let list= [];
                    for(let i=1 ;i<=count;i++){
						list.push([80/count*index+"%" , 80/count*index+ 80/count/2+"%"])
                    }
                    return list
				}();
        }
        return arry[index]

	}

	/**
     * 根据图形设置label
     * */

	function chartLabel(type) {
		let label = {};

		switch (type) {
			case 'pie':
				label =  {
					normal: {
						formatter: ' {b|{b}：}{c|{c}} ',  //  {per|{d}%}
//						backgroundColor: '#eee',
						borderColor: '#aaa',
						borderWidth: .5,
						borderRadius: 2,
						rich: {
							b: {
								fontSize: ChartParam.FONT_LABEL_SIZE,
								lineHeight: 33
							},
							c: {
								fontSize: ChartParam.FONT_LABEL_SIZE,
//								backgroundColor: '#334455',
                            },
//							per: {
////								color: '#eee',
////								backgroundColor: '#334455',
//								padding: [2, 4],
//								borderRadius: 2,
//
//							}
						}
					}
				};
				break;
			case 'bar':
			case 'line':
            default:
				label = {
					normal: {
						show: true,
						position: 'inside',
						fontSize: ChartParam.FONT_VALUE_SIZE
					}
				};

		}
        return label

	}

</script>
