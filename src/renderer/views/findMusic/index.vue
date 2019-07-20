<template>
  <div class="find-container center-con">
    <el-tabs v-model="activeName"
             class="tabs">
      <el-tab-pane label="个性推荐"
                   name="个性推荐">
        <Recommend v-if="activeName == '个性推荐'"></Recommend>
      </el-tab-pane>
      <el-tab-pane label="歌单"
                   name="歌单">
        <song-sheet v-if="activeName == '歌单'"></song-sheet>
      </el-tab-pane>
      <!-- <el-tab-pane label="电台"
                   name="电台">电台</el-tab-pane> -->
      <el-tab-pane label="排名榜"
                   name="排名榜">
        <list-peer v-if="activeName == '排名榜'"></list-peer>
      </el-tab-pane>
      <el-tab-pane label="歌手"
                   name="歌手">
        <Player v-if="activeName == '歌手'"></Player>
      </el-tab-pane>
      <el-tab-pane label="最新音乐"
                   name="最新音乐">
        <new-music v-if="activeName == '最新音乐'"></new-music>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import ListPeer from './type/ListPeer'
import NewMusic from './type/NewMusic'
import Player from './type/Player'
import SongSheet from './type/SongSheet'
import Recommend from './type/Recommend'
export default {
  data () {
    return {
      activeName: '个性推荐'
    }
  },
  filters: {
    getNumber (val) {
      return parseInt(val / 10000) + '万'
    }
  },
  methods: {

  },
  mounted () {

  },
  components: {
    SongSheet,
    ListPeer,
    NewMusic,
    Player,
    Recommend
  }
}
</script>

<style lang="scss">
.find-container {
  height: 100%;
  padding: 0 20px;
  .tabs {
    width: 100%;
    height: 100%;
  }
  .is-active {
    color: #d63131 !important;
  }

  .tabs {
    .el-tabs__content {
      height: calc(100% - 65px);
      .el-tab-pane {
        height: 100%;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          width: 0;
        }
      }
    }
  }
}
</style>
