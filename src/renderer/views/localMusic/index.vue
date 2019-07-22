<template>
  <div class="local-music">
    <span class="label">本地音乐</span><span>共{{musicUrl.length}}首音乐，</span><span class="search"
          @click="showDialog"><i class="iconfont icon-chakanwenjian"></i>扫描文件</span>
    <el-divider></el-divider>
    <div class="local-bottom"
         v-if="musicUrl.length">
      <table cellspacing="0">
        <thead>
          <th></th>
          <th>音乐标题</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
        </thead>
        <tbody v-if="musicUrl.length">
          <tr v-for="(item,index) in musicUrl"
              :key="index">
            <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
            <td class="musicName">
              <!-- item.name == getCurrentPlayMusic.name -->
              <div class="musicName"
                   :class="{'paly-status':item.name == getCurrentPlayMusic.name}">
                <span class="music-title pointer"
                      @click="playLocalMusic(item)">{{item.name}}</span>
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
    <el-dialog title="选择本地文件夹"
               :visible.sync="showShell"
               width="500px">
      <p style="margin-bottom:50px;">将自动扫描您勾选的目录</p>
      <el-checkbox-group v-model="checkDir">
        <el-checkbox v-for="(item,index) in checkDirOptions"
                     :label="item"
                     :key="index">{{item}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="getMusic"
                   size="mini"
                   :disabled="checkDir.length ==  0"
                   type="primary">{{search ? '扫描中...' : '确定'}}</el-button>
        <el-button size="mini"
                   type="primary"
                   @click="openShell">添加文件夹</el-button>
      </span>
    </el-dialog>
    <!-- <el-button @click="getMusic">扫描音乐</el-button> -->
  </div>
</template>

<script>
import base from '@/mixin/base'

export default {
  mixins: [base],
  data () {
    return {
      musicUrl: [],
      showShell: false,
      checkDirOptions: [],
      checkDir: [],
      search: false
    }
  },
  methods: {
    openShell () {
      this.$electron.remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (file) => {
        this.checkDirOptions.push(...file)
        localStorage.setItem('checkDirOptions', JSON.stringify(this.checkDirOptions))
      })
    },
    getMusic () {
      this.search = true
      if (!this.checkDir.length) return
      this.$electron.ipcRenderer.send('scnn', this.checkDir)
    },

    getMusicUrl (data) {
      let audioCtx = new AudioContext()
      data.forEach(async (item, index) => {
        const blob = new Blob([item.path], {
          type: 'application/' + item.type
        })
        let arrBuff = new Uint8Array(item.path).buffer
        let { duration } = await audioCtx.decodeAudioData(arrBuff)
        item.duration = duration
        item.path = URL.createObjectURL(blob)
        this.$set(this.musicUrl, index, item)
      })
      this.musicUrl = JSON.parse(JSON.stringify(data))
      data.forEach(item => { // 因为 buffer数据占用空间大  执行删除操作
        delete item.path
      })
      localStorage.setItem('localMusic', JSON.stringify(data))// 存储本地音乐数据
    },
    showDialog () {
      this.showShell = true
    }
  },

  mounted () {
    this.$electron.ipcRenderer.on('playMusic', (event, arg) => {
      this.search = false
      this.showShell = false
      this.getMusicUrl(arg)
    })
    if (localStorage.getItem('checkDirOptions')) {
      this.checkDirOptions = JSON.parse(localStorage.getItem('checkDirOptions'))
    }
  },
  created () {
    if (localStorage.getItem('localMusic')) {
      this.musicUrl = JSON.parse(localStorage.getItem('localMusic'))
    }
  }
}
</script>

<style lang='scss'>
.local-music {
  padding: 20px;
  font-size: 12px;
  .label {
    font-size: 18px;
    margin-right: 5px;
  }
  .search {
    font-size: 12px;
    line-height: 15px;
    color: $base-color;
    cursor: pointer;
    .iconfont {
      font-size: 12px;
    }
  }
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
