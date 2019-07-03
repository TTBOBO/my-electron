<template>
  <div class="playview-container scrollbar">
    <div style="text-align:center;margin-top: 10px;">
      <el-button-group>
        <el-button :type="currentActive == 0 ? 'info' : ''"
                   size="mini"
                   @click="handerType(0)">播放列表</el-button>
        <el-button :type="currentActive == 1 ? 'info' : ''"
                   size="mini"
                   @click="handerType(1)">历史记录</el-button>
      </el-button-group>
    </div>
    <div class="music-con"
         v-if="currentActive == 0">
      <div class="tool">
        <div class="pointer">共{{getCurrentPlaylist.length}}首</div>
        <div class="pointer">
          <span @click="clearPlayList">清空</span>
        </div>
      </div>
      <table cellspacing="0">
        <tbody>
          <tr v-for="(item,index) in getCurrentPlaylist"
              :key="index">
            <td class="icon iconfont"
                :class="{'icon-iconstop':getPlayStatus == item.id}"></td>
            <td class="pointer"
                @click="palyMusic(item)">{{item.name}}</td>
            <td class="musicAlName pointer">
              <a :title="item.artists ? item.artists[0].name :item.ar[0].name">{{item.artists ? item.artists[0].name :item.ar[0].name}}</a>
            </td>
            <td class="">
              <i class="iconfont icon-lianjie"
                 @click="copy(item)"></i>
            </td>
            <td class="">
              <div>{{item.dt / 1000 | filterTime}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="music-con"
         v-else>
      <div class="tool">
        <div class="pointer">共{{getHistoryList.length}}首</div>
        <div class="pointer">
          <span @click="clearHis">清空</span>
        </div>
      </div>
      <table cellspacing="0">
        <tbody>
          <tr v-for="(item,index) in getHistoryList"
              :key="'his_'+index">
            <td class="icon iconfont"
                :class="{'icon-iconstop':getPlayStatus == item.id}"></td>
            <td class="pointer"
                @click="palyMusic(item)">{{item.name}}</td>
            <td class="musicAlName pointer">
              <a :title="item.artists ? item.artists[0].name :item.ar[0].name">{{item.artists ? item.artists[0].name :item.ar[0].name}}</a>
            </td>
            <td class="">
              <i class="iconfont icon-lianjie"></i>
            </td>
            <td class="">
              <div>{{item.dt / 1000 | filterTime}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
export default {
  data () {
    return {
      currentActive: 0,
      currentIndex: 0,  //id
      currentPlayMusic: {}
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
    ...mapGetters(['getCurrentPlaylist', 'getAudioEl', 'getCurrentIndex', 'getHistoryList']),
    getPlayStatus () {
      return this.getCurrentPlaylist[this.getCurrentIndex].id
    }
  },
  methods: {
    ...mapMutations(['PUSH_MUSIC_TO_LIST', 'SET_PLAY_LIST', 'CLEAR_HISTORY_LIST', 'CLEAR_PLAY_LIST']),
    handerType (num) {
      this.currentActive = num;
      this.currentIndex = 0;
    },
    palyMusic (item) {
      if (this.getCurrentIndex !== '' && this.getCurrentPlaylist[this.getCurrentIndex].name === item.name) {
        this.getAudioEl.currentTime = 0;  //重新播放
        this.$EventBus.$emit('changePro', 0);
      } else {
        let index = this.getCurrentPlaylist.findIndex(_item => _item.name === item.name);
        if (index == -1) {  //如果当前音乐没有在播放列表里面直接添加进去再播放
          this.PUSH_MUSIC_TO_LIST(item);
          this.$EventBus.$emit('setCurrentIndex', this.getCurrentPlaylist.length - 1);
        } else {
          this.$EventBus.$emit('setCurrentIndex', index)
        }
      }
    },
    clearHis () {
      this.CLEAR_HISTORY_LIST();
    },
    clearPlayList () {
      this.CLEAR_PLAY_LIST();
    },
    copy (item) {
      // https://music.163.com/song/media/outer/url?id=${item.id}.mp3
      this.$electron.clipboard.writeText(` https://music.163.com/#/song?id=${item.id}`)
    }
  },
  created () {
    console.log(this.getCurrentPlaylist);
  }
}
</script>

<style lang="scss">
.playview-container {
  width: 100%;
  height: 350px;
  overflow-y: auto;

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
      .icon {
        text-align: center;
        width: 30px;
        padding-right: 5px;
      }
      .icon-iconstop {
        color: $base-color;
      }
      .musicAlName {
        width: 150px;
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
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
      height: 35px;
      // padding: 5px 10px;
      line-height: 35px;
    }
    .tool {
      height: 20px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      color: #9c9898;
    }
  }
}
</style>
