/**
 * Created by seven on 2018/1/16.
 * fighting20xx@126.com
 */

import store from 'src/store/index';


var MAP;

export const initMap  = (map)=>{
  MAP = map;
};


export const  Geolocation = (complete,error)=> {
  MAP.plugin('AMap.Geolocation', function () {
    const geolocation = new AMap.Geolocation({
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

    MAP.addControl(geolocation);
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete',complete);//返回定位信息
    AMap.event.addListener(geolocation, 'error', error);      //返回定位出错信息
  });

};


export const addMarker = (location,name) => {
  const marker=new AMap.Marker({
    position:location,
    map:MAP
  });
  marker.content=name;
  MAP.setFitView();
  return marker;
};

var positionPicker
export const startPositionPicker = (AMapUI) => {
  AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {

    positionPicker = new PositionPicker({
      mode:'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
      map:MAP//依赖地图对象
    });
    positionPicker.on('success', function(positionResult) {
      console.log(positionResult);

      store.commit('RECORD_ADDRESS',{latitude:positionResult.position.lat,longitude:positionResult.position.lng})
    });
    positionPicker.on('fail', function(positionResult) {
      console.log(positionResult);
    });

    positionPicker.start();
  });
};

export  const stopPositionPicker = ()=>{
  positionPicker.stop();
}
