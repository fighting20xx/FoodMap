<template>
  	<div>
        <div id="MapContainer">1234123</div>

        <head-top signin-up='home'>
            <span slot='logo' class="head_logo"  @click="reload">FoodMap</span>
        </head-top>

        <div class="zoom_group">
           <div class="zoo_button" @click="zoo_button_1">+</div>
           <div class="zoo_button"  @click="zoo_button_2">-</div>
        </div>

    </div>
</template>

<script>
import headTop from '../../components/header/head'
import {cityGuess, hotcity, groupcity} from '../../service/getData'
import { msiteFoodTypes} from 'src/service/getData'
import {shopList} from 'src/service/getData'
export default {
    data(){
        return{
            guessCity: '',   //当前城市
            guessCityid: '', //当前城市id
            hotcity: [],     //热门城市列表
            groupcity: {},   //所有城市列表
        }
    },

	mounted(){
        var Totalwidth =this.Totalwidth= document.body.clientWidth ;
        var Totalhegiht  =this.Totalwidth = document.body.clientHeight ;
        var MapContainer = document.getElementById("MapContainer");
        MapContainer.style.width = Totalwidth+"px";
        MapContainer.style.height = Totalhegiht+"px";
        window.addEventListener('resize',function () {
            Totalwidth = document.body.clientWidth ;
            Totalhegiht = document.body.clientHeight ;
            MapContainer.style.width = Totalwidth+"px";
            MapContainer.style.height = Totalhegiht+"px";
        });



        var map = new AMap.Map('MapContainer', {
          resizeEnable: true,
          zoom:11,
          center: [116.397428, 39.90923]
        });
        this.MAP = map;

        map.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 80),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            // zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });

          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', function (rep) {

            this.latitude = rep.position.lat;
            this.longitude = rep.position.lng;
            this.geohash = this.latitude + ',' + this.longitude;


            msiteFoodTypes(this.geohash).then(res => {
              console.log(res)
              let resLength = res.length;
              let resArr = [...res]; // 返回一个新的数组
              let foodArr = [];
              for (let i = 0, j = 0; i < resLength; i += 8, j++) {
                foodArr[j] = resArr.splice(0, 8);
              }
              this.foodTypes = foodArr;
            })



            var r= shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds );
            r.then(function (list) {
              console.log(list);

              list.forEach(function (value,index) {
                var marker=new AMap.Marker({
                  position:value.location,
                  map:map
                });
                marker.content=value.name;
              })
              map.setFitView();


            })

//            res.forEach(function (value,index) {
//              var marker=new AMap.Marker({
//                position:lnglats[i],
//                map:map
//              });
//              marker.content='我是第'+i+'个信息窗体的内容';
//
//            });










          });//返回定位信息
          AMap.event.addListener(geolocation, 'error', this.onError);      //返回定位出错信息
        });

        cityGuess().then(res => {
            this.guessCity = res.name;
            this.guessCityid = res.id;
        })

        //获取热门城市
        hotcity().then(res => {
            this.hotcity = res;
        })

        //获取所有城市
        groupcity().then(res => {
            this.groupcity = res;
        })
    },

    components:{
        headTop
    },
    computed:{
        //将获取的数据按照A-Z字母开头排序
        sortgroupcity(){
            let sortobj = {};
            for (let i = 65; i <= 90; i++) {
                if (this.groupcity[String.fromCharCode(i)]) {
                    sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
                }
            }
            return sortobj
        }
    },

    methods:{
        //点击图标刷新页面
        reload(){
            window.location.reload();
        },
        zoo_button_1(){
            this.MAP.zoomIn();
        },
        zoo_button_2(){
            this.MAP.zoomOut();
        },
        onError(rep){
            console.log("错误信息",rep);
        },
    },
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    #MapContainer{
      position: absolute;
    }
    .head_logo{
        left: 0.4rem;
        font-weight: 400;
        @include sc(0.7rem, #fff);
        @include wh(2.3rem, 0.7rem);
        @include ct;
    }
    .zoom_group{
        position: absolute;
        right: 10px;
        bottom: 80px;
        z-index: 2;
        .zoo_button{
           background-color: #fff;
           @include wh(40px, 40px);
           border: 1.2px solid $bc;
           text-align: center;
          @include font(30px, 30px);
           :hover{
             background-color: #fee;
           }
        }
    }


</style>
