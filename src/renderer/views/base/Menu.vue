<template>
  <div class="tab-menu">
    <div class="menu">
      <div class="menu-group"
           v-for="(item,index) in menuConf"
           :key="index">
        <span class="menu-group-name">{{item.label}}</span>
        <div class="menu-group-item"
             @click="handler(_child,item)"
             :class="{active:_child.name===activeName}"
             v-for="(_child,_index) in item.group"
             :key="_index">
          <span class="item-icon el-icon-user"></span>
          <span>{{_child.name}}</span>
        </div>
      </div>
    </div>
    <div class="music-con"
         v-if="Music.currentIndex !== null && getCurrentPlaylist.length">
      <img :src="getCurrentPlayMusic.al.picUrl"
           alt=""
           class="music-pic">
      <div class="music-name">
        <p>{{getCurrentPlayMusic.name}}</p>
        <p>{{getCurrentPlayMusic.al.name}}</p>
      </div>
      <div class="music-icon">
        <i class="iconfont icon-aixin1"></i>
        <i class="iconfont icon-web-icon-"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
export default {
  data () {
    return {
      activeName: "发现音乐",
      menuConf: [{
        label: '推荐',
        group: [{
          name: '发现音乐',
          path: "/findMusic"
        }, {
          name: '私人FM'
        }, {
          name: 'LOOK直播'
        }, {
          name: '视频'
        }, {
          name: '朋友'
        }]
      }, {
        label: '我的音乐',
        group: [{
          name: '本地音乐'
        }, {
          name: '下载管理'
        }]
      }, {
        label: '创建的歌单',
        group: []
      }, {
        label: '收藏的歌单',
        group: []
      }]
    }
  },
  computed: {
    ...mapGetters(['getPlayList', 'getCurrentPlaylist', 'getCurrentPlayMusic']),
    ...mapState(['Music']),
  },
  methods: {
    handler ({ path, name, id }, { label }) {
      this.activeName = name;
      if (path) {
        this.$router.push({ path })
      }
      switch (label) {
        case '创建的歌单':
          this.$router.push({ path: "playList", query: { id, type: 1 } })  //1  自己创建的歌单  2 收藏的歌单
          break;
        case '收藏的歌单':
          this.$router.push({ path: "playList", query: { id, type: 2 } })  //1  自己创建的歌单  2 收藏的歌单
          break;

        default:
          break;
      }
    }
  },
  watch: {
    getPlayList: {
      handler (newV) {
        this.menuConf[2].group.push(...newV.creatPlayList);
        this.menuConf[3].group.push(...newV.collecPlayLit);
      },
      immediate: true
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
        .item-icon {
          margin-right: 10px;
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
    }
  }
}
</style>
