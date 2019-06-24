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
        {{currentTime | filterTime}}
      </span>
      <el-slider class="progress-con"
                 v-model="progressVal"
                 :show-tooltip="true"
                 :min="0"
                 @change="changePro"
                 :max="duration"></el-slider>
      <span class="end-time">
        {{duration | filterTime}}
      </span>
    </div>
    <div class="volume-con">
      <i class="iconfont icon-yinlianglabashengyin"></i>
      <el-slider class="volume-progress"
                 v-model="volumeVal"
                 :show-tooltip="true"
                 :min="0"
                 :max="100"></el-slider>
    </div>
    <div class="play-tool">
      <span class="iconfont"
            :class="getModeStaus"
            @click="changeMode"></span>
      <span>词</span>
      <span class="iconfont icon-wj-bflb"></span>
    </div>
    <audio ref="audio"
           :src="Music.playList[Music.currentIndex]"
           :loop="getMode === 1"></audio>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  data () {
    return {
      progressVal: 0,
      volumeVal: 50,
      index: 0,
      duration: 0,
      currentTime: ''
    }
  },
  computed: {
    ...mapGetters(['getAudioEl', 'getMode']),
    ...mapState(['Music']),
    getAudioPlayStatus () {
      return this.$refs.audio && this.$refs.audio.paused
    },
    getModeStaus () {
      return {
        'icon-xunhuan': this.getMode === 0,
        'icon-danquxunhuan': this.getMode === 1,
        'icon-suijibofang': this.getMode === 2
      }
    }
  },
  filters: {
    filterTime (val) {
      if (!val) return '00:00';
      val = Math.ceil(val);
      let minute = Math.floor(val / 60);
      let second = Math.floor(val % 60)
      return `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
    }
  },
  methods: {
    ...mapMutations(['INIT_AUDIO_EL', 'SET_AUDIO_PLAYING', 'SET_CURRENT_INDEX', 'SET_MODE']),
    changeMode () {
      this.SET_MODE();
    },
    initMusicInfo () {
      this.duration = this.getAudioEl.duration;
      // this.getAudioEl.currentTime = 190;

      this.currentTime = this.getAudioEl.currentTime;
      this.getAudioEl.ontimeupdate = this.timeChange
    },
    timeChange () {
      this.currentTime = this.getAudioEl.currentTime;
      this.progressVal = this.currentTime;
      if (this.progressVal == this.duration) {
        this.SET_AUDIO_PLAYING();
        this.getMode === 2 ? this.setCurrentIndex(this.getRandom()) : this.next();
      }
    },
    getRandom () {
      let res = Math.ceil(Math.random() * (this.Music.playList.length - 1));
      if (res === this.Music.currentIndex) {
        return this.getRandom()
      }
      return res;
    },
    play () {
      this.$nextTick(() => {
        this.SET_AUDIO_PLAYING()
        this.$refs.audio[this.$refs.audio.paused ? 'play' : 'pause']()
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
      if (this.getMode === 2) {
        index = this.getRandom();
      } else {
        index = status === 'prev' ? index -= 1 : index += 1;
        if (index < 0) {
          index = len - 1
        } else if (index > len - 1) {
          index = 0
        }
      }

      this.setCurrentIndex(index);
    },
    setCurrentIndex (index) {
      this.SET_CURRENT_INDEX(index)
      if (!this.$refs.audio.paused) {
        this.SET_AUDIO_PLAYING()
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.play()
        }, 100)
      })
    },
    changePro (val) {
      this.getAudioEl.currentTime = val;
    }
  },
  mounted () {
    this.INIT_AUDIO_EL(this.$refs.audio);
    this.$nextTick(() => {
      // this.getAudioEl.currentTime = 190;
      this.getAudioEl.oncanplay = this.initMusicInfo
    })
    this.getAudioEl.volume = this.volumeVal / 100;  //设置音量大小
  },
  watch: {
    volumeVal (newV) {
      this.getAudioEl.volume = newV / 100;
    },
    // progressVal (newV) {
    //   // this.getAudioEl.currentTime = newV;
    // }
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
