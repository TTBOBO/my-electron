<template>
  <div class="tab-menu">
    <div class="menu">
      <div class="menu-group"
           v-for="(item,index) in menuConf"
           :key="index">
        <span class="menu-group-name">{{item.label}}</span>
        <span v-if="item.label == '创建的歌单'"
              @click="createPlay"
              class="creat iconfont icon-jia"></span>
        <div class="menu-group-item"
             @click="handler(_child,item)"
             :class="{active:_child.name===activeName}"
             v-for="(_child,_index) in item.group"
             :key="_index">
          <span class="item-icon el-icon-user"></span>
          <a :title="_child.name"
             class="title">{{_child.name}}</a>
        </div>
      </div>
    </div>
    <div class="music-con"
         v-if="getCurrentPlayMusic.name">
      <img v-if="getCurrentPlayMusic.al || getCurrentPlayMusic.album"
           :src="getCurrentPlayMusic.al? getCurrentPlayMusic.al.picUrl : getCurrentPlayMusic.album.picUrl+'?param=50y50'"
           alt=""
           class="music-pic">
      <div v-else
           class="music-pic no-pic"><span class="iconfont icon-zhuanji"></span></div>
      <div class="music-name">
        <p>{{getCurrentPlayMusic.name}}</p>
        <p v-if="getCurrentPlayMusic.al || getCurrentPlayMusic.album">{{getCurrentPlayMusic.al? getCurrentPlayMusic.al.name : getCurrentPlayMusic.album.name}}</p>
      </div>
      <div class="music-icon">
        <i class="iconfont"
           :class="{'icon-aixin1':getLikeIds.indexOf(getCurrentPlayMusic.id) === -1,'icon-aixin active':getLikeIds.indexOf(getCurrentPlayMusic.id) !== -1}"
           @click="like"></i>
        <i class="iconfont icon-web-icon-"></i>
      </div>
    </div>
    <el-dialog title="歌单名称"
               width='300px'
               :visible.sync="showDialog">
      <el-input v-model="playlistName"
                autocomplete="off"></el-input>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="mini"
                   @click="showDialog = false">取 消</el-button>
        <el-button size="mini"
                   type="primary"
                   @click="addPlaylist">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
export default {
  data () {
    return {
      activeName: "发现音乐",
      menuConf: [{
        label: '推荐',
        group: [{
          name: '发现音乐',
          path: "/findMusic"
        },
          // {
          //   name: '私人FM'
          // }, {
          //   name: 'LOOK直播'
          // }, {
          //   name: '视频'
          // }, 
          // {
          //   name: '朋友'
          // }
        ]
      }, {
        label: '我的音乐',
        group: [{
          name: '本地音乐',
          path: "/scnn"
        },
        {
          name: '下载管理',
          path: '/download'
        }
        ]
      }, {
        label: '创建的歌单',
        group: []
      }, {
        label: '收藏的歌单',
        group: []
      }],
      showDialog: false,
      playlistName: ""
    }
  },
  computed: {
    ...mapGetters(['getPlayList', 'getCurrentPlaylist', 'getCurrentPlayMusic', 'getUserInfo', 'getShowLyStatus', 'getLikeIds']),
    ...mapState(['Music']),
  },
  methods: {
    ...mapMutations(['SET_SHOW_LY_STATUS', 'SET_PLAYLIST', 'SET_LIKE_IDS']),
    ...mapActions(['getPlayListAction']),
    handler ({ path, name, id }, { label }) {
      this.activeName = name;
      if (path) {
        this.$router.push({ path })
      }
      switch (label) {
        case '创建的歌单':
          this.hiddenLy();
          this.$router.push({ path: "playList", query: { id, type: 1 } });  //1  自己创建的歌单  2 收藏的歌单
          break;
        case '收藏的歌单':
          this.hiddenLy();
          this.$router.push({ path: "playList", query: { id, type: 2 } });  //1  自己创建的歌单  2 收藏的歌单
          break;
        default:
          break;
      }
    },
    async like () {
      let id = this.getCurrentPlayMusic.id;
      let status = this.getLikeIds.indexOf(id) !== -1 ? false : true;
      let res = await this.$ajaxGet('like', { id, like: status, timestamp: new Date().getTime() });
      if (!status) {
        let ids = JSON.parse(JSON.stringify(this.getLikeIds));
        ids.splice(ids.indexOf(id), 1);
        this.SET_LIKE_IDS(ids);
      } else {
        let { ids } = await this.$ajaxGet('likelist', { uid: this.getUserInfo.userId, timestamp: new Date().getTime() });
        this.SET_LIKE_IDS(ids);
      }
    },
    createPlay () {
      this.showDialog = true;
    },
    async addPlaylist () {
      if (!this.playlistName) {
        this.$message.warning('歌单名称不能为空');
        return false;
      }
      let data = await this.$ajaxPost('createPlayList', { name: this.playlistName });
      // this.SET_PLAYLIST([data.playlist]);
      this.getPlayListAction();
      this.showDialog = false;
      this.$message.success('添加成功');
    },
    hiddenLy () {
      if (this.getShowLyStatus) {
        this.SET_SHOW_LY_STATUS();
      }
    },
  },
  created () {
    this.defaultData = JSON.parse(JSON.stringify(this.menuConf))
  },
  watch: {
    getPlayList: {
      handler (newV) {
        this.menuConf[2].group = [];
        this.menuConf[3].group = [];
        this.menuConf[2].group.push(...newV.creatPlayList);
        this.menuConf[3].group.push(...newV.collecPlayLit);
      },
      immediate: true
    },
    getUserInfo (newV) {
      if (!newV.userId) {
        this.menuConf = this.defaultData;
      }
    },
    getCurrentPlayMusic (val) {

    }
  }
}
</script>
<style lang="scss">
.tab-menu {
  width: 200px;
  background: #fdfbfb;
  height: 100%;
  border-right: 1px solid #dedede;
  overflow-y: auto;
  position: relative;
  &::-webkit-scrollbar {
    width: 0;
  }
  .menu {
    margin-bottom: 100px;
    .menu-group {
      color: #8c8c8c;
      font-weight: 100;
      .creat {
        float: right;
        line-height: 32px;
        margin-right: 10px;
        font-size: 19px;
        font-weight: 700;
      }
      .menu-group-name {
        height: 32px;
        padding-left: 10px;
        font-size: 13px;
        display: inline-block;
        line-height: 32px;
      }
      .menu-group-item {
        cursor: pointer;
        height: 32px;
        font-size: 13px;
        padding-left: 20px;
        line-height: 32px;
        display: flex;
        align-items: center;
        .item-icon {
          margin-right: 10px;
        }
        .title {
          display: inline-block;
          white-space: nowrap;
          flex: 1;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .active {
        color: #000;
        position: relative;
        background: #ececec;
        &::before {
          position: absolute;
          content: "";
          width: 2px;
          left: 0;
          height: 100%;
          background: $base-color;
        }
      }
    }
  }
  .music-con {
    height: 50px;
    position: fixed;
    bottom: 51px;
    left: 0;
    width: 200px;
    border-top: 1px solid #dedede;
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    background: #fff;
    .music-pic {
      width: 50px;
      height: 50px;
      object-fit: cover;
      line-height: 50px;
      text-align: center;

      color: #dadad3;
      .iconfont {
        font-size: 18px;
      }
    }
    .no-pic {
      border-right: 1px solid #dadad3;
    }
    .music-name {
      font-size: 12px;
      flex: 1;
      padding: 9px 10px;
      display: flex;
      overflow: hidden;
      flex-flow: column;
      justify-content: space-between;

      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .music-icon {
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      margin-right: 5px;
      padding: 5px 0;
      .active {
        color: $base-color;
      }
    }
  }
}
</style>
