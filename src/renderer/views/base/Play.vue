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
      <span @click="showLy(getShowLyStatus)"
            :class="{active:getShowLyStatus}">词</span>
      <el-popover placement="top-start"
                  width="700"
                  trigger="click"
                  v-model="visible">
        <play-view v-if="visible"></play-view>
        <span slot="reference"
              class="iconfont icon-wj-bflb"></span>
      </el-popover>

    </div>

    <!-- v-if="getCurrentPlaylist[Music.currentIndex]" -->
    <audio ref="audio"
           :src="'' ||getMusicUrl"
           :loop="getMode === 1"></audio>
    <!-- C:\\Users\\Administrator\\Desktop\\测试文件\\18b33f91060e11e00237239daa864c98.mp3 -->
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import PlayView from './auth/PlayView'
export default {
  data () {
    return {
      progressVal: 0,
      volumeVal: 50,
      index: 0,
      duration: 0,
      currentTime: 0,
      showLyStatus: false,
      visible: false,
    }
  },
  computed: {
    ...mapGetters(['getAudioEl', 'getMode', 'getCurrentPlaylist', 'getShowLyStatus', 'getCurrentPlayMusic', 'getPlayStatus']),
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
    },
    getMusicUrl () {
      if (this.Music.currentIndex === '' || !this.getCurrentPlaylist[this.Music.currentIndex]) return "";
      if (this.getCurrentPlaylist[this.Music.currentIndex].id) {
        return `https://music.163.com/song/media/outer/url?id=${this.getCurrentPlaylist[this.Music.currentIndex].id}.mp3`;
      } else {
        return this.getCurrentPlaylist[this.Music.currentIndex].path;
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
    },
  },
  methods: {
    ...mapMutations(['INIT_AUDIO_EL', 'SET_AUDIO_PLAYING', 'SET_CURRENT_INDEX', 'SET_MODE', 'SET_SHOW_LY_STATUS']),
    showLy () {
      if (this.Music.currentIndex !== '') {
        this.SET_SHOW_LY_STATUS();
      }
      this.$electron.ipcRenderer.send('showLyric', this.getShowLyStatus);
    },
    changeMode () {
      this.SET_MODE();
    },
    initMusicInfo () {
      this.duration = this.getAudioEl.duration;
      this.currentTime = this.getAudioEl.currentTime;
      this.getAudioEl.ontimeupdate = this.timeChange
    },
    timeChange () {
      this.currentTime = this.getAudioEl.currentTime;
      this.$EventBus.$emit('timeChange', this.currentTime); //告诉歌词那边当前播放时间
      if (!this.currentTime) {
        if (this.getMode === 1) {
          this.$EventBus.$emit('loop');
        }

      }
      this.progressVal = this.currentTime;
      if (this.progressVal == this.duration) {
        this.SET_AUDIO_PLAYING();
        this.getMode === 2 ? this.setCurrentIndex(this.getRandom()) : this.next();
      }

    },
    getRandom () {
      let res = Math.ceil(Math.random() * (this.getCurrentPlaylist.length - 1));
      if (res === this.Music.currentIndex) {
        return this.getRandom()
      }
      return res;
    },
    play () {
      this.$nextTick(() => {
        this.SET_AUDIO_PLAYING()
        this.$EventBus.$emit('play');
        this.$refs.audio[this.$refs.audio.paused ? 'play' : 'pause']()
      })
    },
    prev () {
      this.setCount('prev')
    },
    next () {
      this.setCount('next')
    },
    async setCount (status = 'prev') {
      let index = parseInt(this.Music.currentIndex);
      index = index === '' ? 0 : index;
      let len = this.getCurrentPlaylist.length;
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
    setCurrentIndex (index, playStatus = true) {
      this.SET_CURRENT_INDEX(index)
      if (playStatus) {
        if (!this.$refs.audio.paused) {
          this.SET_AUDIO_PLAYING()
        }
        this.$nextTick(() => {
          this.play()
        })
      }
    },
    changePro (val) {
      this.getAudioEl.currentTime = val;
      this.$EventBus.$emit('changePro', val);
    },
    ipcEvent () {
      this.$electron.ipcRenderer.on('playPrev', () => {
        this.prev();
      })
      this.$electron.ipcRenderer.on('playNext', () => {
        this.next();
      })
      this.$electron.ipcRenderer.on('togglePlay', () => {
        this.play();
      })
      this.$electron.ipcRenderer.on('closeMusic', () => {
        // console.log(111)
        this.showLy();
      })

    },
    initPlay (newV) {
      if (newV) {
        if (!this.getAudioEl) {
          this.INIT_AUDIO_EL(this.$refs.audio);//第一次的时候 初始化 播放器
        }
        this.$nextTick(() => {
          this.getAudioEl.oncanplay = this.initMusicInfo
        })

        this.getAudioEl.volume = this.volumeVal / 100;  //设置音量大小
      }
    }
  },
  mounted () {
    this.$EventBus.$on('setCurrentIndex', this.setCurrentIndex);
    this.ipcEvent();
  },
  destroyed () {
    this.$EventBus.$off('setCurrentIndex');
  },
  components: {
    PlayView
  },
  watch: {
    volumeVal (newV) {
      this.getAudioEl && (this.getAudioEl.volume = newV / 100);
    },
    async getMusicUrl (newV) {
      if (this.Music.currentIndex === '') return;
      // console.log()
      let item = this.getCurrentPlaylist[this.Music.currentIndex];
      if (item.id) {
        try {
          let data = await this.$ajaxGet("checkMusic", { id: item.id });
          this.initPlay(newV);
        } catch (error) {
          this.$message.error(error.message)
          this.next();  //播放下一首歌
        }
      } else {
        this.initPlay(newV);
      }
    },
    'Music.playing' (newV) {
      this.$electron.ipcRenderer.send('playStatus', newV);
    },
    getPlayStatus (newV) {
      console.log(newV)
    }
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
    .active {
      color: $base-color;
    }
  }
}
</style>
