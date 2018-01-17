<%--  Created by IntelliJ IDEA.
  User: seven.li
  Date: 2018/1/16
  Time: 15:55
  Emali: fighting20xx@126.com   --%>

<template>
  <div class="zoom_group">
    <div class="zoo_button" @click="zoo_button_1">+</div>
    <div class="zoo_button"  @click="zoo_button_2">-</div>
  </div>
</template>
<script>
  export default {
    name:'zoom',
    methods: {
      zoo_button_1(){
        this.$store.state.MAP.zoomIn();
      },
      zoo_button_2(){
        this.$store.state.MAP.zoomOut();
      },
    }

}

</script>
<style lang="scss">
  @import '../../style/mixin';
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
