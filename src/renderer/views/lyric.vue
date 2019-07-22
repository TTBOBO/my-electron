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
      <div class="lyric no-lyric"
           v-if="!this.currentLyric.lines">暂无歌词</div>
      <p class="current-lyric lyric"
         v-if="this.currentLyric.lines"
         :class="{active:currentLineNum === 0}">{{lyricCode[0] || ''}}</p>
      <p class="next-lyric lyric"
         v-if="this.currentLyric.lines"
         :class="{active:currentLineNum === 1}">{{lyricCode[1] || ''}}</p>
      <!-- <marquee behavior="slide"
               direction="left"
               v-if="this.currentLyric.lines"
               class="current-lyric lyric"
               :class="{active:currentLineNum === 0}">
        {{lyricCode[0] || ''}}
      </marquee>
      <marquee behavior="slide"
               direction="left"
               v-if="this.currentLyric.lines"
               class="next-lyric lyric"
               :class="{active:currentLineNum === 1}">
        {{lyricCode[1] || ''}}
      </marquee> -->
    </div>
  </div>
</template>

<script>
import Lyric from 'lyric-parser'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      showMaskStatus: false,
      flag: false,
      position: {},
      count: 0,
      isLookUp: false,
      PlayStatus: false,
      currentLyric: {},
      currentLineNum: '',
      getCurrentPlayMusic: {},
      currentTime: 0,
      lyricCode: ['', '']
    }
  },
  methods: {
    ...mapMutations(['SET_AUDIO_PLAYING']),
    handlerIcon (status) {
      this.$electron.ipcRenderer.send(status)
    },
    setLookUp () {
      this.isLookUp = !this.isLookUp
    },
    mousedown ({ x, y }) {
      this.flag = true
      this.position = { x, y }
    },
    mousemove ({ x, y }) {
      if (!this.isLookUp && this.flag) {
        let moveX = x - this.position.x
        let moveY = y - this.position.y
        this.$electron.ipcRenderer.send('drag', { x: moveX, y: moveY })
        this.position = { x: x - moveX, y: y - moveY } // 以为移动后窗口位置变了，当前一定position应该变回原来的position
      }
    },
    mouseout () {
      this.flag = false
    },
    mouseup ({ x, y }) {
      this.flag = false
    },
    loop (time) {
      if (!this.currentLyric.lines) return
      this.currentLyric.seek(0 * 1000)
    },
    changePro (time) {
      console.log(time)
      if (!this.currentLyric.lines) return
      this.currentLyric.seek(time * 1000)
      if (!this.PlayStatus) { // 关闭的时候就直接停止播放
        this.currentLyric.togglePlay()
      }
    },
    initPlay (lyric) {
      this.currentLyric = new Lyric(lyric, (params) => {
        const { lineNum, txt } = params
        const nextTxt = this.currentLyric.lines[lineNum + 1].txt
        this.lyricCode = lineNum % 2 === 0 ? [txt, nextTxt] : [nextTxt, txt]
        this.currentLineNum = lineNum % 2 === 0 ? 0 : 1
        // if (lineNum % 2 === 0) {
        //   this.lyricCode = [txt, this.currentLyric.line[lineNum + 1].txt];
        //   this.currentLineNum = 0;
        // } else {
        //   this.lyricCode = [this.currentLyric.line[lineNum + 1].txt, txt];
        //   this.currentLineNum = 1;
        // }
      })
      this.lyricCode = [this.currentLyric.lines[0].txt, this.currentLyric.lines[1].txt]
      this.$nextTick(() => {
        this.currentLyric.seek(this.currentTime * 1000) // seek会自动开启播放
        if (!this.PlayStatus) { // 关闭的时候就直接停止播放
          this.currentLyric.togglePlay()
        }
      })
    },
    async getMusicLyric () {
      this.loading = true
      let res = await this.$ajaxGet('lyric', { id: this.getCurrentPlayMusic.id })
      if (res.code === 200 && res.lrc) {
        this.initPlay(res.lrc.lyric)
      } else {
        this.currentLyric = {} // 清空
      }
    }
  },
  mounted () {
    this.$electron.remote.ipcMain.on('playStatus', (e, data) => {
      this.PlayStatus = data
      if (!this.currentLyric.lines) return
      this.currentLyric.togglePlay()
    })
    this.$electron.remote.ipcMain.on('showLy', (e, { getCurrentPlayMusic, currentTime }) => {
      this.getCurrentPlayMusic = getCurrentPlayMusic
      this.currentTime = currentTime
      if (this.currentLyric.lines) {
        this.currentLyric.stop() // 停止歌词
        this.currentLineNum = '' // 清除选中状态
        this.currentLyric = {}
      }
      this.lyricCode = ['', '']
      this.currentLineNum = ''
      this.getMusicLyric()
    })

    this.$electron.remote.ipcMain.on('changePro', (e, time) => {
      this.changePro(time)
    })
    this.$electron.remote.ipcMain.on('loop', () => this.loop())
  }
}
</script>

<style lang='scss'>
.lyric-container {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
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
    overflow: hidden;
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
    overflow: hidden;
    .lyric {
      // background: -webkit-linear-gradient(
      //     top,
      //     rgba(255, 255, 255, 0.5) 0%,
      //     rgba(255, 255, 255, 0) 100%
      //   ),
      //   -webkit-linear-gradient(left, #fff433 0%, #162df1 0%);
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
      // /* -webkit-text-stroke: 1px #f00; */
      // -webkit-filter: drop-shadow(0px 0px 1px #040cfdf2);
      background: -webkit-linear-gradient(
          top,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        -webkit-linear-gradient(left, #fff433 0%, #fff7cc 0%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      /* -webkit-text-stroke: 1px #f00; */
      -webkit-filter: drop-shadow(0px 0px 1px #040cfd);
      white-space: nowrap;
      text-align: left;
    }
    .no-lyric {
      text-align: center !important;
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
