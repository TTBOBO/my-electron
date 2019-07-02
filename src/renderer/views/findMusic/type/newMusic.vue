<template>
  <div class="new-music-container">
    <div style="text-align:center;margin-top: 10px;">
      <el-button-group>
        <el-button :type="currentActive == 0 ? 'info' : ''"
                   size="mini"
                   @click="handerType(0)">新歌速递</el-button>
        <el-button :type="currentActive == 1 ? 'info' : ''"
                   size="mini"
                   @click="handerType(1)">新碟上架</el-button>
      </el-button-group>
    </div>
    <!-- <div> -->
    <HeaderLine :titleArr="titleArr"
                @changeType="changeType"
                :currentIndex='currentIndex'></HeaderLine>
    <div class="music-con"
         v-loading="loading"
         v-if="currentActive == 0">
      <div class="tool">
        <div class="pointer"
             @click="playAll">播放全部</div>
        <div class="pointer">收藏全部</div>
      </div>
      <table cellspacing="0">
        <tbody>
          <tr v-for="(item,index) in topSongsDatas"
              :key="item.id">
            <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
            <td class="secTd">
              <img class="pic-img"
                   :src="item.album.picUrl+'?param=45y45'" />
            </td>
            <td class="musicName">
              <div class="musicName"
                   :class="{'paly-status':item.name == currentPlayMusic.name}">
                <a :title="item.name"
                   class="music-title pointer"
                   @click="palyMusic(item)">{{item.name}}</a>
                <!-- <span v-if="item.alia.length>0"
                          class="alia"
                          :class="{'paly-status':item.name == currentPlayMusic.name}">({{item.alia[0]}})</span> -->
              </div>
            </td>
            <td class="musicActName">
              <a :title="item.name">{{item.artists[0].name}}</a>
            </td>
            <!-- <td>{{item.al.name}}</td> -->
            <td class="musicAlName">
              <a :title="item.name">{{item.album.name}}</a>
            </td>
            <td class="time">
              <div>{{item.duration / 1000 | filterTime}}</div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
    <div v-else
         class="album-con"
         v-infinite-scroll="load"
         :infinite-scroll-disabled="disabled">
      <div class="world-con">
        <div class="world-con-item"
             v-for="(item,index) in albumData"
             :key="index">
          <div class="item-pic-con pointer">
            <img :src="item.blurPicUrl+'?param=300y300'"
                 alt="description">
            <!-- <div class="play-count">{{item.playCount}}</div> -->
          </div>
          <a :title="item.name"
             class="title pointer">{{item.name}}</a>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import HeaderLine from '@/components/headerLine';
export default {
  data () {
    return {
      currentActive: 0,
      titleArr: [{ name: "全部", id: "0" }, { name: "华语", id: "7" }, { name: "欧美", id: "96" }, { name: "日本", id: "8" }, { name: "韩国", id: "16" }],
      topSongsDatas: [],
      albumData: [],
      offset: 0,
      currentIndex: 0,  //id
      currentPlayMusic: {},
      loading: true,
      noMore: false
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
  computed: {
    ...mapGetters(['getCurrentPlaylist', 'getAudioEl', 'getCurrentIndex']),
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    ...mapMutations(['PUSH_MUSIC_TO_LIST', 'SET_PLAY_LIST']),
    handerType (num) {
      this.currentActive = num;
      this.currentIndex = 0;
      this.loading = true;
      this.getMusic();
    },
    changeType (item) {
      this.currentIndex = item.id;
      this.loading = true;
      this.getMusic();
    },
    async getMusic () {
      let url, params;
      if (this.currentActive == 0) {
        url = 'topSongs';
        params = {
          type: this.currentIndex
        }
      } else {
        url = 'album';
        params = {
          id: this.currentIndex,
          offset: this.offset,
          limit: 30
        }
      }
      let data = await this.$ajaxGet(url, params);
      this.loading = false;
      if (this.currentActive == 0) {
        this.topSongsDatas = data.data;
      } else {
        if (!data.albums.length) {
          this.noMore = true;
          return false;
        }
        this.albumData.push(...data.albums);
      }
    },
    palyMusic (item) {
      if (this.getCurrentIndex !== '' && this.getCurrentPlaylist[this.getCurrentIndex].name === item.name) {
        this.getAudioEl.currentTime = 0;  //重新播放
        this.$EventBus.$emit('changePro', 0);
      } else {
        let index = this.getCurrentPlaylist.findIndex(item => item.name === name);
        if (index == -1) {  //如果当前音乐没有在播放列表里面直接添加进去再播放
          this.PUSH_MUSIC_TO_LIST(item);
          this.$EventBus.$emit('setCurrentIndex', this.getCurrentPlaylist.length - 1);
        } else {
          this.$EventBus.$emit('setCurrentIndex', index)
        }
      }
    },
    load () {
      this.loading = true;
      this.offset++;
      this.getMusic();
    },
    playAll () {
      this.SET_PLAY_LIST(this.topSongsDatas);
      this.$EventBus.$emit('setCurrentIndex', 0)
    }
  },
  created () {
    this.getMusic();
  },
  components: {
    HeaderLine
  }
}
</script>

<style lang="scss">
.new-music-container {
  width: 100%;
  height: 100%;
  .el-button {
    &:hover {
      border: 1px solid #dcdfe6 !important;
      color: #606266 !important;
    }
  }
  .el-button--info {
    &:hover {
      color: #fff !important;
    }
  }
  .music-con {
    margin-top: 20px;
    .tool {
      display: flex;
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
        text-align: center;
        width: 30px;
        padding-right: 5px;
      }
      .secTd {
        width: 50px;
        .pic-img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          display: inherit;
        }
      }
      .musicName {
        width: 300px;
        max-width: 300px;
        padding-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .alia {
          color: gray;
        }
      }
      .musicActName {
        width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .musicAlName {
        width: 230px;
        max-width: 230px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        width: 80px;
        text-align: center;
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
      height: 45px;
      // padding: 5px 10px;
      line-height: 45px;
    }
    .tool {
      height: 20px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
    }
  }
  .album-con {
    height: calc(100% - 66px);
    width: 100%;
    .world-con {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
      .world-con-item {
        width: 169px;
        height: 189px;
        margin-right: 15px;
        margin-bottom: 20px;
        &:nth-child(6n + 0) {
          margin-right: 0;
        }
        .item-pic-con {
          position: relative;
          width: 169px;
          height: 169px;
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
          width: 169px;
          font-size: 12px;
          line-height: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          display: inherit;
        }
      }
    }
  }
}
</style>
