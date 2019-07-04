<template>
  <div class="playlist center-con">
    <div class="play-top">
      <img :src="currentPlayList.coverImgUrl"
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
          <span>{{currentPlayList.creator && currentPlayList.creator.nickname}}</span>
          <span>{{currentPlayList.createTime | time}}创建</span>
        </p>
        <div class="play-tool">
          <div class="btn"
               @click="playAll">播放全部</div>
          <div class="btn btn-dis"
               @click="subscribe"
               v-if="currentPlayList.creator && currentPlayList.creator.userId != getUserInfo.userId">{{currentPlayList.subscribed ? '已' : ''}}收藏</div>
          <div class="btn">分享</div>
          <div class="btn">下载</div>
        </div>
      </div>
      <div class="linten-count">
        <i class="iconfont icon-yinle"></i>{{currentPlayList.playCount}}
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
                  :key="index">
                <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
                <td class="secTd">
                  <i @click="like(item,index)"
                     class="iconfont"
                     :class="{'icon-aixin1':getLikeIds.indexOf(item.id) === -1,'icon-aixin active':getLikeIds.indexOf(item.id) !== -1}"></i>
                  <i class="iconfont icon-xiazai"></i>
                </td>
                <td class="musicName">
                  <div class="musicName"
                       :class="{'paly-status':item.name == getCurrentPlayMusic.name}">
                    <span class="music-title pointer"
                          @click="palyMusic(item)">{{item.name}}</span>
                    <span v-if="item.alia.length>0"
                          class="alia"
                          :class="{'paly-status':item.name == getCurrentPlayMusic.name}">({{item.alia[0]}})</span>
                  </div>
                </td>
                <td class="musicActName pointer">
                  <div @click="handlePlayer(item.ar[0])">{{item.ar[0].name}}</div>
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
        <el-tab-pane label="收藏者"
                     name="收藏">
          <Subscribe v-if="activeName=='收藏'"
                     :id="currentPlayList.id"></Subscribe>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- -->
    <div class="music-ly animated"
         :class="{tada:getShowLyStatus,fadeInDown:!getShowLyStatus}"
         v-if="getShowLyStatus">
      <PlayMusic v-if="getShowLyStatus"></PlayMusic>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import util from '@/assets/js/util'
import PlayMusic from '../PlayMusic'
import Subscribe from './Subscribe'
export default {
  data () {
    return {
      currentPlayList: {},
      playlist: {},
      activeName: "歌曲列表",
      currentPlayMusic: {}, //当前播放的音乐
      currentId: this.$route.query.id
    }
  },
  computed: {
    ...mapGetters(['getPlayList', 'getUserInfo', 'getCurrentIndex', 'getCurrentPlaylist', 'getAudioEl', 'getShowLyStatus', 'getLikeLists', 'getLikeIds', 'getCurrentPlayMusic']),
    getTitle () {
      if (!this.currentPlayList.name) return '';
      return this.currentPlayList.name.replace(this.getUserInfo.nickname, '我')
    },
  },
  filters: {
    time (val) {
      if (!val) return '';
      return util.time.getNowTime(parseInt(val / 1000));
    }
  },
  methods: {
    ...mapMutations(['SET_PLAY_LIST', 'SET_CURRENT_INDEX', 'INIT_AUDIO_EL', 'PUSH_MUSIC_TO_LIST', 'SET_LIKE_IDS']),
    ...mapActions(['getPlayListAction']),
    async initPlaylistDetail () {
      this.likelist();
      const { id, type } = this.$route.query;

      let data = await this.$ajaxGet('playlistDetail', { id, timestamp: new Date().getTime() });

      let { playlist, code, privileges } = data;
      this.loading.close();
      if (code == 200) {
        this.currentPlayList = playlist;
        this.playlist = playlist;
      }
    },
    async likelist () {
      let { ids } = await this.$ajaxGet('likelist', { uid: this.getUserInfo.userId, timestamp: new Date().getTime() });
      this.SET_LIKE_IDS(ids);
    },
    playAll () {
      this.SET_PLAY_LIST(this.playlist.tracks);
      this.$EventBus.$emit('setCurrentIndex', 0)
    },
    palyMusic (item) {
      if (this.getCurrentIndex !== '' && this.getCurrentPlaylist[this.getCurrentIndex].name === item.name) {
        this.getAudioEl.currentTime = 0;  //重新播放
        this.$EventBus.$emit('changePro', 0);
      } else {
        let index = this.getCurrentPlaylist.findIndex(_item => _item.name === item.name);
        if (index == -1) {  //如果当前音乐没有在播放列表里面直接添加进去再播放
          this.PUSH_MUSIC_TO_LIST(item);
          this.$EventBus.$emit('setCurrentIndex', this.getCurrentPlaylist.length - 1)
        } else {
          this.$EventBus.$emit('setCurrentIndex', index)
        }
      }
    },
    handlePlayer (item) {
      this.$router.push({
        path: '/playinfo',
        query: { id: item.id }
      });
    },
    async like ({ id }, index) {
      let status = this.getLikeIds.indexOf(id) !== -1 ? false : true;
      let res = await this.$ajaxGet('like', { id, like: status, timestamp: new Date().getTime() });
      if (!status) {
        let ids = JSON.parse(JSON.stringify(this.getLikeIds));
        ids.splice(ids.indexOf(id), 1);
        this.SET_LIKE_IDS(ids);
        if (this.currentPlayList.name === `${this.getUserInfo.nickname}喜欢的音乐`) {
          this.playlist.tracks.splice(index, 1);
        }
      } else {
        this.likelist();
      }
    },
    createLoading () {
      this.loading = this.$Loading.service({
        background: "#fff",
      })
    },
    async subscribe () {
      const { creator: { userId }, subscribed, id } = this.currentPlayList;
      if (userId != this.getUserInfo.userId) {
        let data = await this.$ajaxGet('subscribe', { t: subscribed ? 2 : 1, id, timestamp: new Date().getTime() });
        this.$message.success(`${subscribed ? '取消' : ''}收藏成功`);
        this.getPlayListAction();
        this.currentPlayList.subscribed = !this.currentPlayList.subscribed;
      }

    }
  },
  mounted () {
    this.initPlaylistDetail();//初始化页面数据
    this.$EventBus.$on('showLy', this.showLy);
    this.$EventBus.$on('palyMusic', this.palyMusic);
  },
  destroyed () {
    this.$EventBus.$off('showLy');
    this.$EventBus.$off('palyMusic');
  },
  created () {
    this.createLoading();
  },
  components: {
    PlayMusic,
    Subscribe
  },
  watch: {
    $route (newV) {
      this.createLoading();
      this.initPlaylistDetail();
    },
    // getCurrentIndex (newV, oldV) {
    //   this.currentPlayList = this.getCurrentPlaylist[newV] || {};
    // }
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
        .alia {
          color: gray;
        }
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
      color: $base-color !important;
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
  .active {
    color: $base-color;
  }
}
</style>
