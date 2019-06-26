<template>
  <div class="music-container">
    <div class="msk"></div>
    <div class="msk2"></div>
    <Scroll ref="lyricList">
      <div class="lyric">
        <p ref="lyricLine"
           v-for="(line,index) in currentLyric.lines"
           :class="{active:currentLineNum === index}"
           :key="index">
          {{line.txt}}
          <!-- <br /> {{line.txt}} -->
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
      musicStr: [
        "[by:winkyisme]\n[00:14.000]You used to call me everyday\n[00:20.000]The words mean nothing without someone to say\n[00:27.000]now I stand besides myself in the pouring rain\n[00:34.110]I just wanna see your face\n[00:40.110]When you're far away\n[00:47.110]I miss you but I know you're here with me\n[00:53.110]When you're far away\n[01:00.110]I need you\n[01:21.110]lie awake it's ten past three\n[01:28.110]this empty feeling and baby I can't sleep\n[01:34.110]only thing I left behind a smile you can't see\n[01:40.110]I need you i need you\n[01:43.110]When you're far away\n[01:50.110]I miss you but time will heal the pain\n[01:44.110]When you're far away\n[01:44.110]I need you\n[02:08.110]And I won't go back and I can't go back, you're all ever I need,\n[02:14.110]I want you back but you can't come back\n[02:18.110]you know I didn't mean it\n[02:21.110]and I take it back and still I pray\n[02:24.110]for one more chance, for one more day with you, with you\n[02:33.110]When you're far away\n[02:40.110]I need you\n[02:43.110]When you're far away\n[02:50.110]I miss you but I know you're here with me\n[02:57.110]When you're far away\n[03:03.110]I need you\n",
        // "[by:winkyisme]\n[00:14.000]曾经的你 每日的电话\n[00:20.000]没有想说的想法，言语不过是语言\n[00:27.000]倾盆大雨，只剩我和自己在对话\n[00:34.110]此刻，我只想看着你的脸\n[00:40.110]当我们相隔遥远\n[00:47.110]虽然想念，但我知道你从未真的离开\n[00:53.110]当我们相隔遥远\n[01:00.110]我，如此需要，你！\n[01:21.110]三点一刻，我还醒着\n[01:28.110]空虚将我淹没，亲爱的，你可知我无法入睡\n[01:34.110]我能留给你的，是你看不见的笑容\n[01:40.110]我，如此需要，你！\n[01:43.110]当我们相隔遥远\n[01:44.110]当我们相隔遥远\n[01:44.110]我，如此需要，你！\n[01:50.110]虽然想念，但时间会治愈痛苦的心\n[02:08.110]我不会回去，也不能回去，你依然是我全部所需\n[02:14.110]我是如此希望你会回来，你却不能\n[02:18.110]你知道那不是我本意\n[02:21.110]我全部收回，虔诚祈祷\n[02:24.110]再给我一次机会，哪怕只有一天，只有我和你\n[02:33.110]当我们相隔遥远\n[02:40.110]我，如此需要，你！\n[02:43.110]当我们相隔遥远\n[02:50.110]虽然想念，但我知道你从未真的离开\n[02:57.110]当我们相隔遥远\n[03:03.110]我，如此需要，你！\n",
        "[by:冰糖炖雪梨Shirley]\n[00:00.000] 作曲 : Shawn Hook/Ethan Thompson/Jonas Jeberg\n[00:00.011] 作词 : Shawn Hook/Ethan Thompson/Jonas Jeberg\n[00:00.33]She keeps reminding me\n[00:03.02]That you’re still gone\n[00:04.82]And I’m still lonely\n[00:07.64]He keeps reminding me\n[00:10.22]How good it was\n[00:11.86]When we were crazy\n[00:14.80]\n[00:14.90]Wine, she’s spitting out the wine\n[00:20.79]I forgot you left behind\n[00:24.44]Our favorite cherry red\n[00:28.55]Oh, love, I know this isn’t love\n[00:35.51]'Cause I’m still thinking of you\n[00:38.75]While she’s getting undressed\n[00:42.53]I never should have left\n[00:46.00]\n[00:47.20]She keeps reminding me\n[00:49.95]That you’re still gone\n[00:51.65]And I’m still lonely\n[00:54.52]She keeps reminding me\n[00:56.94]How good it was\n[00:58.88]When we were crazy\n[01:01.32]In lo-ove\n[01:03.55]Lo-ove\n[01:05.26]She keeps reminding me\n[01:07.75]How good it wa-as\n[01:10.82]Wa-as\n[01:12.47]She keeps reminding me\n[01:14.37]\n[01:16.31]Nights, I miss the faded nights\n[01:22.01]Staying out 'til morning light\n[01:25.62]Having breakfast in bed, wooh\n[01:30.18]Now he, he's laying in the sheets\n[01:36.69]The ones you bought for me\n[01:40.33]All tangled in a mess\n[01:43.89]It should be you instead\n[01:48.00]\n[01:48.87]He keeps reminding me\n[01:51.29]That you’re still gone\n[01:52.98]And I’m still lonely\n[01:55.88]He keeps reminding me\n[01:58.25]How good it was\n[02:00.31]When we were crazy\n[02:02.71]In lo-ove\n[02:04.93]Lo-ove\n[02:06.69]He keeps reminding me\n[02:09.06]How good it wa-as\n[02:11.78]Wa-as\n[02:14.02]He keeps reminding me\n[02:16.80]\n[02:17.97]Well, I’m tryna' forget you\n[02:19.87]With some regrets\n[02:21.64]But I’m still hanging onto\n[02:23.16]The memories that you left\n[02:25.12]I deleted your number\n[02:26.85]With every text\n[02:28.90]I’m still tryna' forget you\n[02:31.14]Forget you\n[02:33.60]\n[02:33.74]She keeps reminding me\n[02:36.19]That you’re still gone\n[02:38.05]And I’m still lonely\n[02:40.92]He keeps reminding me\n[02:43.45]How good it was\n[02:45.29]When we were crazy\n[02:49.51]\n[02:49.74]She keeps reminding me\n[02:52.60]That you’re still gone\n[02:54.54]And I’m still lonely\n[02:57.16]He keeps reminding me\n[02:59.71]How good it was\n[03:01.75]When we were crazy\n[03:05.06]In lo-ove\n[03:06.09]Lo-ove\n[03:08.37]He keeps reminding me\n[03:10.32]How good it wa-as\n[03:13.15]Wa-as\n[03:15.10]She keeps reminding me\n[03:18.00]\n[03:18.21]Wine, she’s spitting out the wine\n[03:24.83]I forgot you left behind\n[03:27.19]\n"
        // "[00:26.370]Always in a rush\n[00:28.690]Never stay on the phone long enough\n[00:31.880]Why am I so self-important?\n[00:39.860]Said I'd see you soon\n[00:42.360]But that was, oh, maybe a year ago\n[00:45.000]Didn't know time was of the essence\n[00:51.530]So many questions\n[00:54.840]But I'm talking to myself\n[00:58.540]I know that you can't hear me any more\n[01:01.630]Not anymore\n[01:04.460]So much to tell you, And most of all goodbye\n[01:11.650]But I know that you can't hear me any more\n[01:16.070]It's so loud inside my head\n[01:23.240]With words that I should've said\n[01:29.040]And as I drown in my regrets\n[01:36.360]I can't take back the words I never said\n[01:45.240]I never said\n[01:49.030]I can't take back the words I never said\n[01:58.010]Always talking shit\n[02:00.260]Took your advice and did the opposite\n[02:03.930]Just being young and stupid\n[02:07.800]I haven't been all that you could've hoped for\n[02:12.770]But if you'd held on a little longer\n[02:16.850]You'd have had more reasons to be proud\n[02:22.720]So many questions\n[02:25.780]But I'm talking to myself\n[02:28.780]I know that you can't hear me any more\n[02:33.650]Not anymore\n[02:35.900]So much to tell you\n[02:39.510]And most of all goodbye\n[02:42.150]But I know that you can't hear me any more\n[02:47.150]It's so loud inside my head\n[02:53.680]with words that I should've said\n[02:58.950]As I drown in my regrets\n[03:06.690]I can't take back the words\n[03:13.280]The longer I stand here\n[03:14.470]The louder the silence\n[03:19.210]I know that you're gone but sometimes I swear that I hear\n[03:26.390]Your voice when the wind blows\n[03:29.320]So I talk to the shadows\n[03:32.220]Hoping you might be listening 'cos I want you to know\n[03:40.960]It's so loud inside my head\n[03:46.130]with words that I should've said\n[03:51.410]As I drown in my regrets\n[03:59.060]I can't take back the words I never said\n[04:08.040]I never said\n[04:13.060]I can't take back the words I never said\n[04:21.040]Never said\n[04:25.060]I can't take back the words I never said\n"
        // "[by:叫朕学长]\n[00:26.370]总是匆匆忙忙\n[00:28.690]打个电话也是匆匆挂断\n[00:31.880]为什么我会这样自私自利\n[00:39.860]嘴上说着我们马上就能见面了\n[00:42.360]实际上却是一年以前的事\n[00:45.000]没意识到时间才是其中的本质\n[00:51.530]面对这么多的疑问\n[00:54.840]但是我告诉自己\n[00:58.540]我知道你再也不会听我说了\n[01:01.630]再也不会\n[01:04.460]想对你说的太多太多，最想说的事一句再见\n[01:11.650]但是我知道你再也不会听我说了\n[01:16.070]本早就应该对你说的话\n[01:23.240]在我的脑海里不断回响\n[01:29.040]直到我淹没在后悔中\n[01:36.360]没说过的话，我要如何收回？\n[01:45.240]没说过的话\n[01:49.030]没说过的话，我要如何收回？\n[01:58.010]总是不会聊天\n[02:00.260]采纳你的建议却反其道而行\n[02:03.930]因为年轻不懂事\n[02:07.800]我从来没达到过你期待的样子\n[02:12.770]但是如果你多一点点耐心\n[02:16.850]你就会不觉得我一无是处了\n[02:22.720]面对这么么多的疑问\n[02:25.780]我对自己说\n[02:28.780]我知道你再也不会听我说了\n[02:33.650]再也不会\n[02:35.900]想跟你说的太多太多\n[02:39.510]最想说的只是再见\n[02:42.150]但是再也没有机会了\n[02:47.150]那些我本来早就应该说的话\n[02:53.680]在脑海里响个不停\n[02:58.950]最后被后悔自责吞没\n[03:06.690]我没法收回那些话\n[03:13.280]站在这越久\n[03:14.470]这里就越寂静\n[03:19.210]我直到你已经走了，但是我发誓有时候还是会听到\n[03:26.390]你的声音，当外面刮着风的时候\n[03:29.320]我只能跟自己影子说话\n[03:32.220]希望你能够听到，因为我想你知道我的想法\n[03:40.960]那些我本来再就应该对你说的话\n[03:46.130]在脑海里不断回响\n[03:51.410]最后淹没在后悔和自责里\n[03:59.060]没说过的话，我要如何收回\n[04:08.040]那些没说过的话\n[04:13.060]没说过的话，我要如何收回\n[04:21.040]那些没说过的话\n[04:25.060]没说过的话，我要如何收回"
      ],
      currentLineNum: '',
      currentLyric: {},
    }
  },
  methods: {
    loop (time) {
      this.$refs.lyricList.scrollTo(0, 0, 1000);
      this.currentLyric.seek(0 * 1000)
    },
    changePro (time) {
      this.currentLyric.seek(time * 1000)
    },
    initPlay (lyric) {
      //this.musicStr[this.getCurrentIndex]
      this.currentLyric = new Lyric(lyric, (params) => {
        const { lineNum, txt } = params;
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)// 滚动到元素
        }
        this.playingLyric = txt
      });
    }
  },
  props: {
    // id: {
    //   type: Number,
    // }
  },
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
      this.$EventBus.$on('loop', this.loop);
      this.$EventBus.$on('changePro', this.changePro);  //设置歌曲进度
      let res = await this.$ajaxGet('lyric', { id: this.getCurrentPlayMusic.id })
      console.log(res);
      if (res.code === 200 && res.lrc.lyric) {
        this.initPlay(res.lrc.lyric);
      }

    })
  },
  created () { },
  components: {
    Scroll
  },
  watch: {
    getPlayStatus (newV) {
      this.currentLyric.togglePlay();  //播放暂停歌词
    },
    getCurrentIndex (newV) {
      this.currentLyric.stop();  //停止歌词
      this.currentLineNum = '';  //清除选中状态
      this.$refs.lyricList.scrollTo(0, 0, 0);
      this.initPlay();
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
  .msk {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    z-index: 2;
    background: url("http://p4.music.126.net/Ed5azUr2ECZq3vM2ikYeyg==/109951163188783387.jpg")
      100%;
    opacity: 0.5;
    background-size: 100%;
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
  .lyric {
    margin: 0 auto;
    text-align: center;
    width: 420px;
    p {
      color: #989898;
      word-wrap: break-word;
      text-align: center;
      line-height: 32px;
      height: auto !important;
      height: 32px;
      min-height: 32px;
      transition: color 0.3s linear;
    }
    .active {
      color: #fff;
      font-size: 14px;
      transition: color 0.3s linear;
    }
  }
}
</style>
