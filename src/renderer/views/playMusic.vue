<template>
  <div class="music-container"
       v-loading="loading">
    <span @click="SET_SHOW_SONG_LY_STATUS"
          class="shrink-icon iconfont icon-shrink_icon"></span>
    <img v-if="getCurrentPlayMusic.al || getCurrentPlayMusic.album"
         class="msk"
         :src="getCurrentPlayMusic.al? getCurrentPlayMusic.al.picUrl : getCurrentPlayMusic.album.picUrl" />
    <img v-else
         class="msk"
         :src="avatarUrl" />
    <!-- <img class="msk" v-else
         :src="" /> -->
    <div class="msk2"></div>
    <div class="lyric-container">
      <div class="lyric-play animated fadeInLeft delay-1s faster">
        <div v-if="!loading"
             class="round"
             :class="{paly:palyStatus}">
          <img v-if="getCurrentPlayMusic.al || getCurrentPlayMusic.album"
               :src="getCurrentPlayMusic.al? getCurrentPlayMusic.al.picUrl : getCurrentPlayMusic.album.picUrl" />
          <img v-else
               :src="avatarUrl" />
        </div>
      </div>
      <div class="lyric-right">
        <div class="lyric-info">
          <p class="title">{{getCurrentPlayMusic.name}}</p>
          <div class="tag-list">
            <span class="tag">专辑：<span v-if="getCurrentPlayMusic.ar">{{getCurrentPlayMusic.ar[0].name}}</span><span v-else>未知</span></span>
            <span class="tag">歌手：<span v-if="getCurrentPlayMusic.al || getCurrentPlayMusic.album">{{getCurrentPlayMusic.al? getCurrentPlayMusic.al.name : getCurrentPlayMusic.album.name}}</span><span v-else>未知</span></span>
            <span class="tag">来源：{{getCurrentPlayMusic.path ? '本地' : '网易云'}}</span>
          </div>
        </div>
        <Scroll ref="lyricList"
                v-if="currentLyric.lines"
                class="animated fadeInRight delay-1s faster">
          <div class="lyric">
            <template>
              <p ref="lyricLine"
                 v-for="(line,index) in currentLyric.lines"
                 :class="{active:currentLineNum === index}"
                 :key="index">
                {{line.txt}}
                <!-- <br /> {{line.txt}} -->
              </p>
            </template>

          </div>
        </Scroll>
        <div class="no-lyric"
             v-else>
          暂无歌词
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Lyric from 'lyric-parser'
import Scroll from '@/components/Scroll.vue'
import { mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      musicStr: [],
      currentLineNum: '',
      currentLyric: {},
      loading: false,
      palyStatus: false,
      avatarUrl: require('@/assets/logo.jpg')
    }
  },
  methods: {
    ...mapMutations(['SET_SHOW_SONG_LY_STATUS']),
    loop (time) {
      if (!this.currentLyric.lines) return
      this.$refs.lyricList.scrollTo(0, 0, 1000)
      this.currentLyric.seek(0 * 1000)
    },
    changePro (time) {
      if (!this.currentLyric.lines) return
      this.currentLyric.seek(time * 1000)
      if (!this.getPlayStatus) { // 关闭的时候就直接停止播放
        this.currentLyric.togglePlay()
      }
    },
    initPlay (lyric) {
      this.currentLyric = new Lyric(lyric, (params) => {
        const { lineNum, txt } = params
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          this.$nextTick(() => {
            let lineEl = this.$refs.lyricLine[lineNum - 5]
            this.$refs.lyricList.scrollToElement(lineEl, 1000)// 滚动到元素
          })
        }
        this.playingLyric = txt
      })
      this.$nextTick(() => {
        this.currentLyric.seek(this.getAudioEl.currentTime * 1000) // seek会自动开启播放
        if (!this.getPlayStatus) { // 关闭的时候就直接停止播放
          this.currentLyric.togglePlay()
        }
      })
    },
    async getMusicLyric () {
      if (!this.getCurrentPlayMusic.id) return
      this.loading = true
      let res = await this.$ajaxGet('lyric', { id: this.getCurrentPlayMusic.id })
      if (res.code === 200 && res.lrc) {
        this.initPlay(res.lrc.lyric)
      } else {
        this.currentLyric = {} // 清空
      }
      this.loading = false
    }
  },
  props: {},
  computed: {
    ...mapGetters([
      'getPlayStatus',
      'getAudioEl',
      'getMode',
      'getCurrentIndex',
      'getCurrentPlayMusic'
    ])
  },

  async mounted () {
    this.$nextTick(async () => {
      await this.getMusicLyric()
      this.$EventBus.$on('loop', this.loop)
      this.$EventBus.$on('changePro', this.changePro) // 设置歌曲进度
      this.$EventBus.$on('play', () => {
        this.palyStatus = !this.palyStatus
        if (!this.currentLyric.lines) return
        this.currentLyric.togglePlay() // 播放暂停歌词
      })
    })
  },
  destroyed () {
    if (this.currentLyric.stop) {
      this.currentLyric.stop() // 停止歌词
    }
    this.currentLyric = {}
    this.$EventBus.$off('loop')
    this.$EventBus.$off('changePro')
  },
  async created () {
  },
  components: {
    Scroll
  },
  watch: {
    getCurrentIndex (newV) {
      if (this.currentLyric.lines) {
        this.currentLyric.stop() // 停止歌词
        this.currentLineNum = '' // 清除选中状态
        this.currentLyric = {}
      }
      this.palyStatus = !this.palyStatus
      this.getMusicLyric()
    }
  }
}
</script>

<style lang='scss'>
.music-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  overflow: hidden;
  &:hover {
    .shrink-icon {
      display: block;
    }
  }
  .shrink-icon {
    position: absolute;
    right: 20px;
    top: 20px;
    display: none;
    font-size: 22px;
    font-weight: 700;
    color: #656464;
    cursor: pointer;
    z-index: 6;
  }
  .msk {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    z-index: 2;
    opacity: 0.5;
    background-size: 100%;
    object-fit: cover;
    width: 100%;
    transform: scale(5);
    filter: blur(3px);
  }
  .msk2 {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 3;
    position: absolute;
    background: #121212;
    opacity: 0.01;
  }
  .lyric-container {
    display: flex;
    flex-wrap: nowrap;
    flex-flow: row;
    .lyric-play {
      width: 700px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .round {
        width: 250px;
        height: 250px;
        border: 10px solid #ea5c5c;
        border-radius: 50%;
        overflow: hidden;

        animation: run 5s linear 0s infinite normal;
        transform-origin: center;
        animation-play-state: paused;
        @keyframes run {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(99deg);
          }
          50% {
            transform: rotate(180deg);
          }
          75% {
            transform: rotate(270deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      .paly {
        animation-play-state: running !important;
      }
    }
    .lyric-right {
      flex: 1;
      .lyric-info {
        margin: 0 auto;
        height: 100px;
        padding: 45px 0 25px 0;
        .title {
          font-size: 18px;
          line-height: 24px;
          font-weight: 700;
        }
        .tag-list {
          font-size: 12px;
          line-height: 50px;
          display: flex;
          justify-content: space-around;
        }
      }
      .lyric {
        margin: 0 auto;
        text-align: center;
        width: 420px;
        // height: 100%;

        p {
          color: #fff;
          word-wrap: break-word;
          text-align: center;
          line-height: 32px;
          height: auto !important;
          height: 32px;
          min-height: 32px;
          transition: color 0.3s linear;
        }
        .active {
          color: $base-color;
          font-size: 14px;
          transition: color 0.3s linear;
        }
      }
      .no-lyric {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
