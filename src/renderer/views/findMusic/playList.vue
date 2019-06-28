<template>
  <div class="playlist">
    <div class="play-top">
      <img :src="getCurretList.coverImgUrl"
           alt=""
           class="paly-img" />
      <div>
        <p class="title">
          {{
          getTitle
          }}
        </p>
        <p class="play-info">
          <i class="iconfont icon-yinle"></i>
          <span>{{getUserInfo.nickname}}</span>
          <span>{{getCurretList.createTime | time}}创建</span>
        </p>
        <div class="play-tool">
          <div class="btn"
               @click="playAll">播放全部</div>
          <div class="btn btn-dis">收藏</div>
          <div class="btn">分享</div>
          <div class="btn">下载</div>
        </div>
      </div>
      <div class="linten-count">
        <i class="iconfont icon-yinle"></i>{{getCurretList.playCount}}
      </div>
    </div>
    <div class="play-bottom">
      <el-tabs v-model="activeName"
               type="card">
        <el-tab-pane label="歌曲列表"
                     name="歌曲列表">
          <table cellspacing="0">
            <thead>
              <th></th>
              <th>操作</th>
              <th>音乐标题</th>
              <th>歌手</th>
              <th>专辑</th>
            </thead>
            <tbody>
              <tr v-for="(item,index) in playlist.tracks"
                  :key="item.id"
                  @dblclick="handleClick(item.id)">
                <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
                <td class="secTd">
                  <i class="iconfont icon-aixin1"></i>
                  <i class="iconfont icon-xiazai"></i>
                </td>
                <td class="musicName">
                  <div class="musicName">
                    <span class="music-title pointer"
                          :class="{'paly-status':item.name == currentPlayMusic.name}"
                          @click="palyMusic(item.name)">{{item.name}}</span>
                    <span v-if="item.alia.length>0"
                          style="color:gray">({{item.alia[0]}})</span>
                  </div>
                </td>
                <td class="musicActName">
                  <div>{{item.ar[0].name}}</div>
                </td>
                <!-- <td>{{item.al.name}}</td> -->
                <td class="musicAlName">
                  <div>{{item.al.name}}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="评论"
                     name="评论">评论</el-tab-pane>
        <el-tab-pane label="收藏"
                     name="收藏">收藏</el-tab-pane>
      </el-tabs>
    </div>
    <!-- -->
    <div class="music-ly animated"
         :class="{tada:showLyStatus,fadeInDown:!showLyStatus}"
         v-if="showLyStatus">
      <PlayMusic></PlayMusic>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import util from '@/assets/js/util'
import PlayMusic from '../playMusic'
export default {
  data () {
    return {
      currentPlayList: this.getCurretList || {},
      playlist: {},
      activeName: "歌曲列表",
      showLyStatus: false,
      currentPlayMusic: {}, //当前播放的音乐
    }
  },
  computed: {
    ...mapGetters(['getPlayList', 'getUserInfo', 'getCurrentIndex', 'getCurrentPlaylist', 'getAudioEl']),
    getCurretList () {
      const { id, type } = this.$route.query;
      this.currentPlayList = this.getPlayList[type == 1 ? 'creatPlayList' : 'collecPlayLit'].filter(item => item.id == id)[0] || {};
      return this.getPlayList[type == 1 ? 'creatPlayList' : 'collecPlayLit'].filter(item => item.id == id)[0] || {};
    },
    getTitle () {
      if (!this.getCurretList.name) return '';
      return this.getCurretList.name.replace(this.getUserInfo.nickname, '我')
    },
  },
  filters: {
    time (val) {
      return util.time.getNowTime(parseInt(val / 1000));
    }
  },
  methods: {
    ...mapMutations(['SET_PLAY_LIST', 'SET_CURRENT_INDEX', 'INIT_AUDIO_EL']),
    async initPlaylistDetail () {
      let { playlist, code, privileges } = await this.$ajaxGet('playlistDetail', { id: this.getCurretList.id });
      if (code == 200) {
        this.playlist = playlist;
      }
    },
    handleClick (params) { },
    playAll () {
      this.SET_PLAY_LIST(this.playlist.tracks);
      this.$EventBus.$emit('setCurrentIndex', 0)
    },
    showLy () {
      if (this.getCurrentIndex === null) {
        return false;
      }
      this.showLyStatus = !this.showLyStatus;
    },
    palyMusic (name) {
      if (this.currentPlayMusic.name === name) {
        this.getAudioEl.currentTime = 0;  //重新播放
        this.$EventBus.$emit('changePro', 0);
      } else {
        let index = this.playlist.tracks.findIndex(item => item.name === name);
        index != -1 && this.$EventBus.$emit('setCurrentIndex', index)
      }

    }
  },
  mounted () {
    this.$EventBus.$on('showLy', this.showLy);
  },
  created () { },
  components: {
    PlayMusic
  },
  watch: {
    getCurretList: {
      handler (newV, oldV) {
        this.initPlaylistDetail();
      },
      immediate: true
    },
    getCurrentIndex (newV) {
      this.currentPlayMusic = this.getCurrentPlaylist[this.getCurrentIndex];
    }
  }
}
</script>

<style lang="scss">
.playlist {
  display: flex;
  flex-flow: column;
  height: 100%;
  position: relative;
  .play-top {
    padding: 20px 25px;
    display: flex;
    .paly-img {
      width: 200px;
      height: 200px;
      margin-right: 20px;
    }
    .title {
      font-size: 18px;
      margin-bottom: 12px;
    }
    .play-info {
      font-size: 14px;
      color: #5f5b5b;
      margin-bottom: 20px;
    }
    .play-tool {
      display: flex;
      height: 25px;
      .btn {
        padding: 0px 10px;
        margin-right: 10px;
        line-height: 25px;
        text-align: center;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        color: #333;
        box-shadow: 1px 1px 1px #d8d8d8;
      }
      .btn-dis {
        opacity: 0.8;
      }
    }
    .linten-count {
      color: #5f5b5b;
      margin-left: 50px;
    }
  }
  .play-bottom {
    padding: 20px 25px;
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
    table {
      font-size: 12px;
      width: 100%;
    }
    th {
      text-align: left;
      color: #7c7c7c;
      // border: 1px solid #d4d4d4 {
      //   top: 0;
      //   right: 0;
      // }
      padding: 5px 10px;
    }
    tr {
      line-height: 20px;
      &:nth-child(odd) {
        background-color: #f4f4f4;
      }
      .indexTd {
        text-align: right;
        width: 30px;
        padding-right: 5px;
      }
      .secTd {
        width: 50px;
      }
      .musicName {
        width: 220px;
      }
      .musicActName {
        width: 80px;
      }
      .musicAlName {
        width: 230px;
      }
      td > div {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:hover {
        background-color: #d4d4d4;
      }
    }
    td {
      padding: 5px 10px;
    }
    .paly-status {
      color: $base-color;
    }
    .icon-zan1 {
      color: rgb(217, 22, 23);
    }
    .icon-plus-download {
      color: #b6b6b6;
      margin-left: 5px;
    }
  }
  .music-ly {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}
</style>
