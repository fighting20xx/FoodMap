<style lang="less" scoped>
    .icon-wrap {
        display: inline-block;
        position: absolute;
        left: 0;
        top:0;
        bottom: 0;
        right: 0;
        box-sizing: border-box;
        .content-wrap1 {
            display: flex;
            flex-direction: column;
            height: 100%;

            .content-row {
                flex: 1;
                display: flex;
                .content-col {
                    flex: 1;
                }
            }
        }
        .content-wrap2 {
            display: flex;
            height: 100%;
            .content-row {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 100%;
                .content-col {
                    flex: 1;
                }
            }
        }

        .content-item {
            height: 100%;
            width: 100%;
            background-color: #b3d4fc;
            border: solid .1px #000000;
        }
    }

</style>
<template>
    <div class="icon-wrap">
        <div class="content-wrap1" v-show="layout_rowOrCol == 'row' ">
            <div  class="content-row" v-for="count , i in layout_Array" :key="i">
                <div class="content-col" v-for="j in count" :key="j">
                    <div class="content-item" :key="i+'-'+j"></div>
                </div>
            </div>
        </div>
        <div class="content-wrap2" v-show="layout_rowOrCol == 'column'">
            <div  class="content-row" v-for="count , i in layout_Array" :key="i">
                <div class="content-col" v-for="j in count" :key="j">
                    <div class="content-item" :key="i+'-'+j"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
    	name:'layout-icon',
        props:{
			pageLayout:{
				default:'r_2_2'
            }
        },
		computed:{
			layout_rowOrCol:function () {
				return this.$props.pageLayout.substr(0,1) == 'r' ? 'row' :'column';
			},
			layout_Array:function () {
				return this.$props.pageLayout.substr(2).split('_').map(function (value) {
					return parseInt(value);
				});
			},
		},
    }

</script>

