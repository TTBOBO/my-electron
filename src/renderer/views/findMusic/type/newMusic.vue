<template>
  <div class="new-music-container">
    <div style="text-align:center;margin-top: 10px;">
      <el-button-group>
        <el-button :type="currentActive == 0 ? 'info' : ''"
                   size="mini"
                   @click="handerType(0)">新歌速递</el-button>
        <el-button :type="currentActive == 1 ? 'info' : ''"
                   size="mini"
                   @click="handerType(1)">新歌上架</el-button>
      </el-button-group>
    </div>
    <div>
      <HeaderLine :titleArr="titleArr"
                  @changeType="changeType"
                  :currentIndex='currentIndex'></HeaderLine>
      <div class="music-con">
        <div class="tool">
          <div></div>
          <div></div>
        </div>
        <table cellspacing="0">
          <tbody>
            <tr v-for="(item,index) in topSongsDatas"
                :key="item.id"
                @dblclick="handleClick(item.id)">
              <td class="indexTd">{{String(index+1).padStart(2,0)}}</td>
              <td class="secTd">
                <div class="pic-img"
                     :style="{background:`url(${item.album.picUrl})`}"></div>
                <!-- <img class="pic-img"
                     :src="item.album.picUrl" /> -->
              </td>
              <td class="musicName">
                <div class="musicName"
                     :class="{'paly-status':item.name == currentPlayMusic.name}">
                  <span class="music-title pointer"
                        @click="palyMusic(item)">{{item.name}}</span>
                  <!-- <span v-if="item.alia.length>0"
                          class="alia"
                          :class="{'paly-status':item.name == currentPlayMusic.name}">({{item.alia[0]}})</span> -->
                </div>
              </td>
              <td class="musicActName">
                <div>{{item.artists[0].name}}</div>
              </td>
              <!-- <td>{{item.al.name}}</td> -->
              <td class="musicAlName">
                <div>{{item.album.name}}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderLine from '@/components/headerLine';
export default {
  data () {
    return {
      currentActive: 0,
      titleArr: [{ name: "全部", id: "0" }, { name: "华语", id: "7" }, { name: "欧美", id: "96" }, { name: "日本", id: "8" }, { name: "韩国", id: "16" }],
      topSongsDatas: [],
      currentIndex: 0,  //id
      currentPlayMusic: {}
    }
  },
  methods: {
    handerType (num) {
      this.currentActive = num;
      this.currentIndex = 0;
      this.getMusic();
    },
    changeType (item) {
      this.currentIndex = item.id;
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
          id: this.currentIndex
        }
      }
      let data = await this.$ajaxGet('topSongs', params);
      if (this.currentActive == 0) {
        this.topSongsDatas = data.data.slice(0, 10);
      }
      console.log(data);
      // if(this.currentActive = )
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
        text-align: right;
        width: 30px;
        padding-right: 5px;
      }
      .secTd {
        // width: 50px;
        .pic-img {
          width: 30px;
          height: 30px;
          object-fit: cover;
          display: inherit;
        }
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
      height: 35px;
      // padding: 5px 10px;
      line-height: 35px;
    }
  }
}
</style>
