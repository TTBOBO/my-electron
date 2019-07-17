<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
export default {
  name: 'my-electron',
  data () {
    return {
      DownloadList: {
        downloadingList: [], //正在下载
        downloaded: [] //已下载
      },
      isDownload: {

      }
    }
  },
  methods: {
    ...mapMutations(['SET_DOWNLOAD', 'SET_DOWNLOAD_CURRENT_DATA', 'SPLICE_DOWNLOAD_MUSIC', 'SET_PLAY_LIST']),
    initDownload () {
      this.getDownload.downloadingList.forEach((item, index) => {
        if (!item.size && item.downloadUrl) { //没有被下载即可下载  反之不下载
          this.$electron.remote.getCurrentWebContents().downloadURL(item.downloadUrl);
        }

      });
      this.$electron.ipcRenderer.on('download', (e, data) => {
        for (var i = 0; i < this.getDownload.downloadingList.length; i++) {
          const id = this.getDownload.downloadingList[i].id;
          if (data.url[0] === (`https://music.163.com/song/media/outer/url?id=${id}.mp3`)) {
            this.SET_DOWNLOAD_CURRENT_DATA({
              data: data,
              index: i
            })
            if (data.chunk === data.size && !this.isDownload[id]) {
              setTimeout(() => {
                this.SPLICE_DOWNLOAD_MUSIC(id)
              }, 600)
              this.isDownload[id] = true;
            }
            break;
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters(['getDownload'])
  },
  mounted () {
    this.$EventBus.$on('download', this.initDownload);
    if (localStorage.getItem('download')) {
      this.SET_DOWNLOAD(JSON.parse(localStorage.getItem('download')));
    }

    if (localStorage.getItem('playList')) {
      this.SET_PLAY_LIST(JSON.parse(localStorage.getItem('playList')));
      console.log(localStorage.getItem('currentIndex'))
      let index = localStorage.getItem('currentIndex') || 0
      this.$EventBus.$emit('setCurrentIndex', index, false)
    }
    setTimeout(() => {
      if (localStorage.getItem('settingConfig')) {
        this.$electron.ipcRenderer.send('settingConf', JSON.parse(localStorage.getItem('settingConfig')));
      }
    }, 500)
  }
}
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css");
@import url("//at.alicdn.com/t/font_1254014_l9rpe4n7uz.css");
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
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.el-tabs--card > .el-tabs__header .el-tabs__item {
  transition: color 0s !important;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #d63131;
  color: #fff;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active:hover {
  color: #fff !important;
}
.el-tabs__item:hover {
  color: #303133 !important;
}
.el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}
.el-tabs__active-bar {
  background: #d63131 !important;
  height: 1px !important;
}
.el-tabs__nav-wrap::after {
  height: 1px !important;
}
/* CSS */
</style>
