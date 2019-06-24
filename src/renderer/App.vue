<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'my-electron',
  methods: {

  },
  mounted () {

  }
}
</script>

<style>
@import url("//at.alicdn.com/t/font_1254014_qzj9mlc4n3s.css");
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
}
.el-slider__button {
  width: 4px !important;
  height: 4px !important;
  border: 5px solid #fff !important;
  background: red !important;
  box-shadow: 0px 0px 2px #333 !important;
}
.el-slider__bar {
  background: red !important;
}
/* CSS */
</style>
