<template>
  <div class="lyric-container"
       @mouseup='mouseup'
       @mousedown="mousedown"
       @mousemove="mousemove">
    <div class="mask"></div>
    <div class="lyric-con">歌词</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showMaskStatus: false,
      flag: false,
      position: {}
    }
  },
  methods: {
    mousedown ({ x, y }) {
      this.flag = true;
      this.position = { x, y };
      // this.position = JSON.parse(JSON.stringify({ x, y }));
    },
    mousemove ({ x, y }) {
      if (this.flag) {

        console.log({ x: x - this.position.x, y: y - this.position.y })
        this.$electron.ipcRenderer.send('drag', { x: x - this.position.x, y: y - this.position.y })
        this.position = { x, y }
        // { x: x - this.position.x, y: y - this.position.y };
        // this.position = JSON.parse(JSON.stringify({ x, y }));
      }

    },
    mouseup ({ x, y }) {
      // this.position = JSON.parse(JSON.stringify({ x, y }));
      this.flag = false;
    }
  }
}
</script>

<style lang='scss'>
.lyric-container {
  width: 100%;
  height: 100%;
  position: relative;
  color: red;
  // -webkit-app-region: no-drag;
  &:hover {
    color: #fff;
    background: #00000080 !important;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    z-index: 1;
    text-align: center;
    // background: #00000080 !important;
  }
  .lyric-con {
    z-index: 50;
    display: block;
    // -webkit-app-region: drag;
    // background: transparent !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // -webkit-app-region: no-drag;
    // -webkit-app-region: drag;
  }
}
</style>
