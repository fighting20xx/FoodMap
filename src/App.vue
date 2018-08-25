<template>
  <div id="app-main">
      <router-view ></router-view>
  </div>
</template>
<script>
  	export default {

  	}
</script>
<style>
  @import './style/common.scss';

  #app-main{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
  }

</style>
