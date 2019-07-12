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
      <table cellspacing="0">
        <thead>
          <th></th>
          <th>音乐标题</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
        </thead>
        <tbody v-if="DownloadedList.length">
          <tr v-for="(item,index) in DownloadedList"
              :key="index">
            <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
            <td class="musicName">
              <!-- item.name == getCurrentPlayMusic.name -->
              <div class="musicName"
                   :class="{'paly-status':false}">
                <span class="music-title pointer"
                      @click="palyMusic(item)">{{item.name}}</span>
              </div>
            </td>
            <td class="musicActName pointer">
              <div>未知歌手</div>
            </td>
            <!-- <td>{{item.al.name}}</td> -->
            <td class="musicAlName">
              <div>未知专辑</div>
            </td>
            <td class="">
              <div>{{item.duration | filterTime}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      正在下载
    </div>
    <!-- <el-button @click="download">下载</el-button>
    <el-button @click="resume">重新下载</el-button>
    <el-button @click="cancel">取消下载</el-button> -->
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import base from '@/mixin/base'
export default {
  mixins: [base],
  data () {
    return {
      currentActive: 1,
      downloadList: [],
      DownloadedList: [] //
    }
  },
  computed: {
    ...mapGetters(['getDownload'])
  },
  methods: {
    handerType (num) {
      this.currentActive = num;
    },
    cancel () {
      this.$electron.ipcRenderer.send('download', this.data, 'cancel');
    },
    download () {
      this.$electron.ipcRenderer.send('download', this.data, 'pause');
    },
    resume () {
      this.$electron.ipcRenderer.send('download', this.data, 'resume');
    }
  },
  created () {

  },
  mounted () {
    // setTimeout(() => {
    //   this.$electron.remote.getCurrentWebContents().downloadURL('http://localhost:8081/reptile.zip')
    // }, 2000)
    this.$electron.ipcRenderer.on('download', (e, data) => {
      this.data = data;
      // setTimeout(() => {
      //   console.log("开始下载");
      //   // this.$electron.ipcRenderer.send('download', data, 'resume');
      // })
    })
    // console.log();
  }
}
</script>

<style lang="scss">
.download-container {
  .local-bottom {
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
        display: inline-block;
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
}
</style>
