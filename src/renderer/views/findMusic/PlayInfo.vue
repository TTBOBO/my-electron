<template>
  <div class="center-con player-container">
    <div class="player-header">
      <div class="player-pic"
           v-if="!artistData.artist.picUrl"></div>
      <img v-else
           class="player-pic"
           :src="artistData.artist.picUrl+'?param=200y200'" />
      <div class="player-info">
        <div class="player-info-header">
          <span class="player-name">{{artistData.artist.name}}</span>
          <el-button size="mini"><i class="iconfont icon-wenjianjia-dakai"></i>收藏</el-button>
        </div>
        <span class="alias">{{getAlias}}</span>
        <p><i class="iconfont icon-yinle"></i>单曲数：<span class="player-des">{{artistData.artist.albumSize}}</span></p>
        <p><i class="iconfont icon-zhuanji"></i>专辑数：<span class="player-des">{{artistData.artist.musicSize}}</span></p>
        <p><i class="iconfont icon-shipin"></i>MV数：<span class="player-des">{{artistData.artist.mvSize}}</span></p>
      </div>
    </div>
    <div class="play-bottom">
      <el-tabs v-model="activeName"
               @tab-click="tabClick"
               type="card">
        <el-tab-pane label="歌曲列表"
                     name="歌曲列表">
          <div class="paly-music-info">
            <span>热门{{artistData.hotSongs.length}}首</span>
            <div class="tool">
              <i class="iconfont icon-wenjianjia-dakai"></i>
              <i class="iconfont icon-bofang3"
                 @click="playAll(songs)"></i>
            </div>
          </div>
          <table cellspacing="0">
            <tbody>
              <tr v-for="(item,index) in songs"
                  :key="index">
                <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
                <td class="secTd">
                  <i @click="like(item,index)"
                     class="iconfont"
                     :class="{'icon-aixin1':getLikeIds.indexOf(item.id) === -1,'icon-aixin paly-status':getLikeIds.indexOf(item.id) !== -1}"></i>
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
                    <span v-if="item.mv > 0"
                          class="iconfont icon-bofang2"></span>
                  </div>
                </td>
                <td class="">
                  <div>{{item.dt /1000 | filterTime}}</div>
                </td>
                <td class="">

                </td>
              </tr>
            </tbody>
          </table>
          <span v-if="songs.length < artistData.hotSongs.length"
                @click="showAll"
                class="show-all">查看更多》</span>
        </el-tab-pane>
        <!-- <el-tab-pane label="MV"
                     name="MV">MV</el-tab-pane> -->
        <el-tab-pane label="歌手详情"
                     name="歌手详情">
          <div class="des-con">
            <p>{{artistData.artist.name}}简介</p>
            <span v-html="descData.briefDesc"></span>
          </div>
          <div class="des-con"
               v-for="(item,index) in descData.introduction"
               :key='index'>
            <p>{{item.ti}}</p>
            <div v-html="item.txt"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="相似歌手"
                     name="相似歌手">
          <div class="world-con">
            <div class="world-con-item"
                 v-for="(item,index) in artists"
                 :key="index">
              <div class="item-pic-con">
                <img class="pointer"
                     @click="handerPlayer(item)"
                     :src="item.picUrl+'?param=300y300'">
              </div>
              <a @click="handerPlayer(item)"
                 :title="item.name"
                 class="title pointer">{{item.name}}</a>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import base from '@/mixin/base'
export default {
  mixins: [
    base
  ],
  data () {
    return {
      activeName: "歌曲列表",
      showAllStatus: false,
      songs: [],
      query: {},
      artistData: {
        artist: {},
        hotSongs: []
      },
      descData: {},
      artists: [],//相似歌手
    }
  },
  computed: {
    getAlias () {
      if (this.artistData.artist.alias) {
        return this.artistData.artist.alias.join(';');
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
    async intiPlayInfo () {
      console.log(this.$route.query.id)
      this.artistData = await this.$ajaxGet('artists', { id: this.$route.query.id });
      this.songs = this.artistData.hotSongs.slice(0, 10);
      console.log(this.artistData.hotSongs)
    },
    getStr (str) {
      return str.replace(/\n/g, '<br/>')
    },
    showAll () {
      this.songs = this.artistData.hotSongs;
      this.showAllStatus = true;
    },
    async like ({ id }) {
      let status = this.getLikeIds.indexOf(id) !== -1 ? false : true;
      let res = await this.$ajaxGet('like', { id, like: status, timestamp: new Date().getTime() });
      if (!status) {
        let ids = JSON.parse(JSON.stringify(this.getLikeIds));
        ids.splice(ids.indexOf(id), 1);
        this.SET_LIKE_IDS(ids);
      } else {
        this.likelist();
      }
    },
    async simiArtist () {
      let res = await this.$ajaxGet('simiArtist', { id: this.$route.query.id });
      this.artists = res.artists;

    },
    async artistDesc () {
      let res = await this.$ajaxGet('artistDesc', { id: this.$route.query.id, timestamp: new Date().getTime() });
      res.introduction.forEach(item => {
        item.txt = this.getStr(item.txt);
      })
      this.descData = res;
    },
    async artistMv () {
      let res = await this.$ajaxGet('artistMv', { id: this.$route.query.id });
    },
    tabClick () {
      switch (this.activeName) {
        case '歌曲列表':
          this.intiPlayInfo();
          break;
        case 'MV':
          this.artistMv();
          break;
        case '歌手详情':
          this.artistDesc();
          break;
        case '相似歌手':
          this.simiArtist();
          break;
        default:
          break;
      }
    },
    handerPlayer (item) {

      this.$router.push({
        path: '/playinfo',
        query: { id: item.id }
      });
    }
  },
  mounted () {
    this.intiPlayInfo();
  },
  watch: {
    $route (newV) {
      this.intiPlayInfo();
      this.activeName = '歌曲列表'
    },
  }
}
</script>

<style lang="scss">
.player-container {
  width: 100%;
  height: 100%;
  .player-header {
    display: flex;
    flex-flow: row;
    padding: 20px;
    .player-pic {
      width: 200px;
      height: 200px;
      margin-right: 20px;
      object-fit: cover;
    }
    .player-info {
      line-height: 18px;
      font-size: 12px;
      flex: 1;
      p {
        .player-des {
          color: #8e8888;
          line-height: 18px;
        }
      }
      .alias {
        display: inline-block;
        margin-bottom: 20px;
      }
      .player-info-header {
        display: flex;
        justify-content: space-between;
        .player-name {
          font-size: 30px;
          line-height: 30px;
        }
        .collection-btn {
        }
      }
      .iconfont {
        margin-right: 5px;
      }
    }
  }
  .play-bottom {
    padding: 20px 25px;
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
    .paly-music-info {
      display: flex;
      justify-content: space-between;
      margin: 10px auto;
      font-size: 12px;
      .tool {
      }
    }
    table {
      font-size: 12px;
      width: 100%;
    }
    .show-all {
      font-size: 14px;
      display: inline-block;
      margin: 5px 0;
      color: #8e8888;
      cursor: pointer;
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
        .iconfont {
          padding: 0px 3px 0 7px;
          border: 1px solid $base-color;
          color: $base-color;
          font-size: 12px;
          border-radius: 2px;
        }
        // width: 220px;
        .alia {
          color: gray;
        }
      }
      .musicActName {
        width: 80px;
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
    .des-con {
      margin-bottom: 25px;
      p {
        font-size: 16px;
        margin-bottom: 10px;
      }
      span,
      div {
        font-size: 14px;
        color: #8e8888;
        line-height: 18px;
      }
    }
    .world-con {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;
      .world-con-item {
        width: 140px;
        height: 160px;
        margin-right: 7px;
        margin-bottom: 20px;
        &:nth-child(6n + 0) {
          margin-right: 0;
        }
        .item-pic-con {
          position: relative;
          width: 140px;
          height: 140px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .play-count {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            padding: 3px 0px;
            font-size: 12px;
            color: #fff;
            text-align: right;
            padding-right: 10px;
            background: linear-gradient(to right, transparent 50%, #333);
          }
        }
        .title {
          font-size: 12px;
          line-height: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 169px;
          display: inherit;
          text-align: center;
        }
      }
    }
  }
}
</style>
