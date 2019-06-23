<template>
  <div class="tab-play">
    <div class="play-con">
      <span class="prev"
            @click="prev">
        <i class="iconfont icon-shangyishou"></i>
      </span>
      <span class="center"
            @click="play">
        <i class="iconfont"
           :class="{'icon-bofang2':!Music.playing,'icon-iconstop':Music.playing}"
           style="margin-left:2px;"></i>
      </span>
      <span class="next"
            @click="next">
        <i class="iconfont icon-xiayishou"></i>
      </span>
    </div>
    <div class="play-progress">
      <span class="start-time">
        00:00
      </span>
      <el-slider class="progress-con"
                 v-model="progressVal"
                 :show-tooltip="true"
                 :max="300"></el-slider>
      <span class="end-time">
        03:00
      </span>
    </div>
    <div class="volume-con">
      <i class="iconfont icon-yinlianglabashengyin"></i>
      <el-slider class="volume-progress"
                 v-model="volumeVal"
                 :show-tooltip="true"
                 :max="300"></el-slider>
    </div>
    <div class="play-tool">
      <span class="iconfont icon-xunhuan"></span>
      <span>词</span>
      <span class="iconfont icon-wj-bflb"></span>
    </div>
    <audio ref="audio"
           :src="Music.playList[Music.currentIndex]"></audio>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  data () {
    return {
      progressVal: 0,
      volumeVal: 0,
      index: 0
    }
  },
  computed: {
    ...mapGetters(['getAudioEl']),
    ...mapState(['Music']),
    getAudioPlayStatus () {
      console.log(this.$refs.audio && this.$refs.audio.paused)
      return this.$refs.audio && this.$refs.audio.paused
    }
  },
  methods: {
    ...mapMutations(['INIT_AUDIO_EL', 'SET_AUDIO_PLAYING', 'SET_CURRENT_INDEX']),
    play () {
      this.$nextTick(() => {
        this.$refs.audio[this.$refs.audio.paused ? 'play' : 'pause']()
        this.SET_AUDIO_PLAYING()
      })
    },
    prev () {
      this.setCount('prev')
    },
    next () {
      this.setCount('next')
    },
    setCount (status = 'prev') {
      let index = this.Music.currentIndex
      let len = this.Music.playList.length
      index = status === 'prev' ? index -= 1 : index += 1
      if (index < 0) {
        index = len - 1
      } else if (index > len - 1) {
        index = 0
      }
      this.SET_CURRENT_INDEX(index)
      if (!this.$refs.audio.paused) {
        this.SET_AUDIO_PLAYING()
        this.$nextTick(() => {
          setTimeout(() => {
            this.play()
          }, 200)
        })
      }
    }
  },
  mounted () {
    this.INIT_AUDIO_EL(this.$refs.audio)
    console.log(this.Music)
  }
}
</script>

<style lang="scss">
@import "../../../assets/css/base.scss";
.tab-play {
  width: 100%;
  height: 50px;
  background: #fdfbfb;
  border-top: 1px solid #dedede;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  align-items: center;
  .play-con {
    margin: 0 30px;
    height: 100%;
    line-height: 50px;
    .prev,
    .next {
      display: inline-block;
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 25px;
      color: #fff;
      font-size: 10px;
      background: $base-color;
      text-align: center;
      cursor: pointer;
    }
    .center {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 30px;
      color: #fff;
      font-size: 10px;
      background: $base-color;
      text-align: center;
      margin: 0 15px;
      cursor: pointer;
    }
  }
  .play-progress {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #333;
    .progress-con {
      flex: 1;
      margin: 0 20px;
    }
  }
  .volume-con {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .volume-progress {
      width: 100px;
    }
  }
  .play-tool {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    span {
      cursor: pointer;
    }
  }
}
</style>
