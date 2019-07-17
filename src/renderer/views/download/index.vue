<template>
  <div class="download-container">
    <div style="text-align:center;margin-top: 10px;">
      <el-button-group>
        <el-button :type="currentActive == 0 ? 'info' : ''"
                   size="mini"
                   @click="handerType(0)">已下载</el-button>
        <el-button :type="currentActive == 1 ? 'info' : ''"
                   size="mini"
                   @click="handerType(1)">正在下载</el-button>
      </el-button-group>
    </div>
    <div class="local-bottom"
         v-if="currentActive === 0">
      <table cellspacing="0"
             v-if="getDownload.downloaded.length">
        <thead>
          <th></th>
          <th>音乐标题</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
          <th>操作</th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in getDownload.downloaded"
              :key="index">
            <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
            <td class="musicName">
              <div class="musicName"
                   :class="{'paly-status':item.name == getCurrentPlayMusic.name}">
                <span class="music-title pointer"
                      @click="playLocalMusic(item)">{{item.name}}</span>
              </div>
            </td>
            <td class="musicActName pointer">
              <div @click="handlePlayer(item.ar[0])">{{item.ar[0].name}}</div>
            </td>
            <td class="musicAlName">
              <div>{{item.al.name}}</div>
            </td>
            <td class="">
              <div>{{item.dt / 1000 | filterTime}}</div>
            </td>
            <td class="icon pointer">
              <i class="iconfont icon-wenjianjia_o pointer"
                 @click="openDir(item)"></i>
            </td>

          </tr>
        </tbody>
      </table>
      <div v-else
           class="no-data">
        <span class="iconfont icon-xiazai1"></span>
      </div>
    </div>
    <div class="local-bottom"
         v-else>
      <table cellspacing="0"
             v-if="getDownload.downloadingList.length">
        <thead>
          <th></th>
          <th>音乐标题</th>
          <th>下载进度</th>
          <th>大小</th>
          <th>操作</th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in getDownload.downloadingList"
              :key="index">
            <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
            <td class="musicName">
              <!-- item.name == getCurrentPlayMusic.name -->
              <div class="musicName">
                <span class="music-title pointer"
                      @click="handlePlayer(item.ar[0])">{{item.name}}</span>
              </div>
            </td>
            <td class="musicActName pointer">
              <el-progress :percentage="progressCount(item)"
                           color="#d63131"></el-progress>
            </td>
            <td class="size">
              <span v-if="item.chunk != item.size">{{item.chunk | FileSize}}/</span>{{item.size | FileSize}}
            </td>
            <td class="icon pointer">
              <i class="iconfont pointer"
                 @click="changeStatus(item)"
                 :class="{'icon-iconstop' :item.state == 'progressing','icon-bofang2':item.state == 'interrupted'}"></i>
              <i class="iconfont icon-guanbi pointer"
                 @click="cancel(item,index)"></i>
              <i class="iconfont icon-wenjianjia_o pointer"
                 @click="openDir(item)"></i>
              <i class="iconfont icon-lianjie pointer"
                 @click="copy(item)"></i>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else
           class="no-data">
        <span class="iconfont icon-xiazai1"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import base from '@/mixin/base'
export default {
  mixins: [base],
  data () {
    return {
      currentActive: 0,
      DownloadList: {
        downloadingList: [], //正在下载
        downloaded: [] //已下载
      },
      isDownload: {

      }
    }
  },
  filters: {
    FileSize (bytes) {
      if (!bytes) return 0;
      bytes = parseFloat(bytes);
      if (bytes === 0) return '0B';
      let k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
    }
  },
  computed: {
    ...mapGetters(['getDownload'])
  },
  methods: {
    ...mapMutations(['CANCEL_DOWNLOAD_ITEM']),
    handlePlayer (item) {
      this.$router.push({
        path: '/playinfo',
        query: { id: item.id }
      });
    },
    handerType (num) {
      this.currentActive = num;
    },
    changeStatus (item, status) {
      this.$electron.ipcRenderer.send('download', item.taskId, item.state === 'progressing' ? 'pause' : 'resume');
    },
    copy (item) {
      this.$electron.clipboard.writeText(` https://music.163.com/#/song?id=${item.id}`)
    },
    progressCount (item) {
      if (!item.size) return 0;
      return parseInt((item.chunk / item.size) * 100);
    },
    cancel (item, index) {
      this.CANCEL_DOWNLOAD_ITEM(index);
      this.$electron.ipcRenderer.send('download', item.taskId, 'cancel');
    },
    openDir (item) {
      this.$electron.shell.showItemInFolder(item.path);
    },
    startDown () {
    }
  },
  created () {

  },
  mounted () {
    // console.log(this.$store.state.Music.downloadList)
    // if (localStorage.getItem('download')) {
    //   // this.set_download_list(JSON.parse(localStorage.getItem('download')));
    // }
    // this.DownloadList = JSON.parse(JSON.stringify(this.getDownload));
    // console.log(this.DownloadList)
    // this.startDown();
  }
}
</script>

<style lang="scss">
.download-container {
  height: 100%;
  .local-bottom {
    padding: 20px 25px;
    flex: 1;
    height: calc(100% - 88px);
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
    .no-data {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont {
        font-size: 40px;
      }
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
        display: inline-block;
      }
      .musicName {
        width: 220px;
        .alia {
          color: gray;
        }
      }
      .musicActName {
        width: 200px;
      }
      .icon {
        color: #333;
      }
      .musicAlName {
        width: 230px;
      }
      .size {
        width: 150px;
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
}
</style>
