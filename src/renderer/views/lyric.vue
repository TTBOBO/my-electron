<template>
  <div class="lyric-container">
    <div class="mask"
         @mouseup='mouseup'
         @mousedown="mousedown"
         @mousemove="mousemove"
         @mouseout="mouseout"></div>
    <div class="lyric-tool-con">
      <div class="lyric-tool">
        <i class="iconfont icon-yinle"
           v-if="!isLookUp"
           @click="handlerIcon('showmain')"></i>
        <i class="iconfont icon-shangyishou"
           v-if="!isLookUp"
           @click="handlerIcon('prev')"></i>
        <i class="iconfont"
           :class="{'icon-bofang2':!PlayStatus,'icon-iconstop':PlayStatus}"
           v-if="!isLookUp"
           @click="handlerIcon('play')"></i>
        <i class="iconfont icon-xiayishou"
           v-if="!isLookUp"
           @click="handlerIcon('next')"></i>
        <i class="iconfont icon-guanbi"
           v-if="!isLookUp"
           @click="handlerIcon('closeMusic')"></i>
        <i class="iconfont icon-suo"
           :class="{'look-up':isLookUp,'no-look-up':!isLookUp}"
           @click="setLookUp"></i>
      </div>

    </div>
    <div class="lyric-con">
      <p class="current-lyric lyric active">上一句歌词展示</p>
      <p class="next-lyric lyric">下一句歌词展示</p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
export default {
  data () {
    return {
      showMaskStatus: false,
      flag: false,
      position: {},
      count: 0,
      isLookUp: false,
      PlayStatus: false
    }
  },
  methods: {
    ...mapMutations(['SET_AUDIO_PLAYING']),
    handlerIcon (status) {
      this.$electron.ipcRenderer.send(status);
      // switch (status) {
      //   case 'showmain':
      //     this.$electron.ipcRenderer.send('status');
      //     break;
      //   case showmain:
      //     this.$electron.ipcRenderer.send('showmain');
      //     break;
      //   case showmain:
      //     this.$electron.ipcRenderer.send('showmain');
      //     break;
      //   case showmain:
      //     this.$electron.ipcRenderer.send('showmain');
      //     break;
      //   case showmain:
      //     this.$electron.ipcRenderer.send('showmain');
      //     break;

      //   default:
      //     break;
      // }
    },
    setLookUp () {
      this.isLookUp = !this.isLookUp;
    },
    mousedown ({ x, y }) {
      this.flag = true;
      this.position = { x, y };
    },
    mousemove ({ x, y }) {
      if (!this.isLookUp && this.flag) {
        let moveX = x - this.position.x;
        let moveY = y - this.position.y;
        this.$electron.ipcRenderer.send('drag', { x: moveX, y: moveY })
        this.position = { x: x - moveX, y: y - moveY }  //以为移动后窗口位置变了，当前一定position应该变回原来的position
      }

    },
    mouseout () {
      this.flag = false;
    },
    mouseup ({ x, y }) {
      this.flag = false;
    }
    // #00000080
  },
  mounted () {
    console.log(this.getPlayStatus);
    setTimeout(() => {
      this.SET_AUDIO_PLAYING();
    }, 5000)
  }
}
</script>

<style lang='scss'>
.lyric-container {
  width: 100%;
  height: 100%;
  position: relative;
  &:hover {
    .mask {
      background: #04040461 !important;
    }
    .lyric-tool-con {
      .lyric-tool {
        display: flex;
      }
    }
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    text-align: center;
  }
  .lyric-tool-con {
    z-index: 5;
    display: block;
    position: absolute;
    top: 0;
    left: 15%;
    width: 70%;
    height: 30px;
    // background: #efeaea;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .lyric-tool {
      margin: 0 auot;
      display: flex;
      color: #ccc;
      justify-content: space-around;
      line-height: 30px;
      display: none;
      .iconfont {
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
      .look-up {
        color: $base-color;
        &:hover {
          color: #8c2525;
        }
      }
    }
  }
  .lyric-con {
    position: absolute;
    left: 10%;
    right: 10%;
    top: 50px;
    z-index: 3;
    height: 80px;
    font-size: 24px;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    .lyric {
      background: -webkit-linear-gradient(
          top,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        -webkit-linear-gradient(left, #fff433 0%, #162df1 0%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      /* -webkit-text-stroke: 1px #f00; */
      -webkit-filter: drop-shadow(0px 0px 1px #040cfdf2);
    }
    .current-lyric {
    }
    .next-lyric {
      text-align: right;
    }
    .active {
      // color: $base-color;
      background: -webkit-linear-gradient(
          top,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        -webkit-linear-gradient(left, #fff65e 0%, $base-color 0%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      /*-webkit-text-stroke:1px #f00;*/
      -webkit-filter: drop-shadow(0px 0px 1px #fff);
    }
  }
}
</style>
