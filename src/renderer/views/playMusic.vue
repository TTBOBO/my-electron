<template>
  <div class="music-container">
    <Scroll ref="lyricList">
      <div class="lyric">
        <p ref="lyricLine"
           v-for="(line,index) in currentLyric.lines"
           :class="{active:currentLineNum === index}"
           :key="index">
          {{line.txt}}
        </p>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Lyric from 'lyric-parser';
import Scroll from '@/components/Scroll.vue';
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  data () {
    return {
      musicStr: "[by:winkyisme]\n[00:14.000]曾经的你 每日的电话\n[00:20.000]没有想说的想法，言语不过是语言\n[00:27.000]倾盆大雨，只剩我和自己在对话\n[00:34.110]此刻，我只想看着你的脸\n[00:40.110]当我们相隔遥远\n[00:47.110]虽然想念，但我知道你从未真的离开\n[00:53.110]当我们相隔遥远\n[01:00.110]我，如此需要，你！\n[01:21.110]三点一刻，我还醒着\n[01:28.110]空虚将我淹没，亲爱的，你可知我无法入睡\n[01:34.110]我能留给你的，是你看不见的笑容\n[01:40.110]我，如此需要，你！\n[01:43.110]当我们相隔遥远\n[01:44.110]当我们相隔遥远\n[01:44.110]我，如此需要，你！\n[01:50.110]虽然想念，但时间会治愈痛苦的心\n[02:08.110]我不会回去，也不能回去，你依然是我全部所需\n[02:14.110]我是如此希望你会回来，你却不能\n[02:18.110]你知道那不是我本意\n[02:21.110]我全部收回，虔诚祈祷\n[02:24.110]再给我一次机会，哪怕只有一天，只有我和你\n[02:33.110]当我们相隔遥远\n[02:40.110]我，如此需要，你！\n[02:43.110]当我们相隔遥远\n[02:50.110]虽然想念，但我知道你从未真的离开\n[02:57.110]当我们相隔遥远\n[03:03.110]我，如此需要，你！\n",
      currentLineNum: '',
      currentLyric: {},
    }
  },
  methods: {
    handleMusic (params) {
      console.log(params);
    },
    handleLyric ({ lineNum, txt }) {
      console.log(lineNum, txt)
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)// 滚动到元素
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)// 滚动到顶部
      }
      this.playingLyric = txt
    },
  },
  computed: {
    ...mapGetters([
      'getPlayStatus',
      'getAudioEl'
    ])
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.getAudioEl.oncanplay = this.initMusicInfo
    // })
  },
  methods: {
    // initMusicInfo () {
    //   this
    //   console.log(this.getAudioEl);
    //   console.log(this.getAudioEl.duration)
    //   console.log(this.getAudioEl.currentTime)
    // },
    initPlay () {
      this.currentLyric = new Lyric(this.musicStr, (params) => {
        const { lineNum, txt } = params
        console.log(params)
        // console.log(lineNum, txt)
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)// 滚动到元素
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)// 滚动到顶部
        }
        this.playingLyric = txt
      });
      // this.currentLyric.seek(this.getAudioEl.currentTime*1000)
    }
  },
  created () {
    this.initPlay();
  },
  components: {
    Scroll
  },
  watch: {
    getPlayStatus (newV) {
      if (newV) {
        this.currentLyric.play();
      } else {
        this.currentLyric.stop();
      }
    }
  }
}
</script>

<style lang='scss'>
.music-container {
  width: 100%;
  height: 100%;
  .lyric {
    margin: 0 auto;
    text-align: left;
    p {
      margin: 5px 0;
      font-size: 14px;
    }
    .active {
      color: red;
    }
  }
}
</style>
