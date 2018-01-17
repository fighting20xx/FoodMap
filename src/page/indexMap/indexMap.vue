<template>
  	<div>
        <div id="MapContainer">1234123</div>

        <head-top signin-up='home'>
            <span slot='logo' class="head_logo"  @click="reload">FoodMap</span>
        </head-top>
        <zoom></zoom>

    </div>
</template>

<script>
import headTop from '../../components/header/head'
import zoom from '../../components/zoom/zoom'
import {cityGuess, hotcity, groupcity} from '../../service/getData'
import { msiteFoodTypes} from 'src/service/getData'
import {shopList} from 'src/service/getData'
import {Geolocation,addMarker,initMap,startPositionPicker} from 'src/util/mapUtil'
import {mapState, mapMutations} from 'vuex'
import store from 'src/store/index';
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
        var self = this;


        initMap(map);
        this.INIT_MAP(map);
        startPositionPicker(AMapUI,function () {
          self.getfood();
        });

        Geolocation(function (rep) {
            store.commit('RECORD_ADDRESS',{latitude:rep.position.lat,longitude:rep.position.lng});
            self.getfood();
          } ,
          this.onError);


//        cityGuess().then(res => {
//            this.guessCity = res.name;
//            this.guessCityid = res.id;
//        })
//
//        //获取热门城市
//        hotcity().then(res => {
//            this.hotcity = res;
//        })
//
//        //获取所有城市
//        groupcity().then(res => {
//            this.groupcity = res;
//        })
    },

    components:{
        headTop,zoom
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
        },
        ...mapState([
          'MAP','geohash','latitude','longitude'
        ]),
    },

    methods:{
        reload(){
            window.location.reload();
        },

        onError(rep){
            console.log("错误信息",rep);
        },
        getfood:() => {
            console.log(this);

//          msiteFoodTypes(self.geohash).then(res => {
//            console.log(res)
//            let resLength = res.length;
//            let resArr = [...res]; // 返回一个新的数组
//            let foodArr = [];
//            for (let i = 0, j = 0; i < resLength; i += 8, j++) {
//              foodArr[j] = resArr.splice(0, 8);
//            }
//            this.foodTypes = foodArr;
//          });

          var r= shopList(store.latitude, store.longitude, store.offset, '', "", "","" );
          r.then(function (list) {
            console.log(list);

            list.forEach(function (value,index) {
              addMarker(value.location,value.name);
            });
          })
        },
      ...mapMutations([
        'INIT_MAP'
      ]),
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



</style>
