<template>
  <div class="find-container center-con">
    <el-tabs v-model="activeName"
             class="tabs">
      <el-tab-pane label="个性推荐"
                   name="个性推荐">
        <recommend v-if="activeName == '个性推荐'"></recommend>
      </el-tab-pane>
      <el-tab-pane label="歌单"
                   name="歌单">
        <songsheet v-if="activeName == '歌单'"></songsheet>
      </el-tab-pane>
      <!-- <el-tab-pane label="电台"
                   name="电台">电台</el-tab-pane> -->
      <el-tab-pane label="排名榜"
                   name="排名榜">
        <listPeer v-if="activeName == '排名榜'"></listPeer>
      </el-tab-pane>
      <el-tab-pane label="歌手"
                   name="歌手">
        <player v-if="activeName == '歌手'"></player>
      </el-tab-pane>
      <el-tab-pane label="最新音乐"
                   name="最新音乐">
        <newMusic v-if="activeName == '最新音乐'"></newMusic>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import listPeer from './type/ListPeer';
import newMusic from './type/newMusic';
import player from './type/player';
import songsheet from './type/songSheet';
import recommend from './type/recommend';
export default {
  data () {
    return {
      activeName: "歌单"
    }
  },
  filters: {
    getNumber (val) {
      return parseInt(val / 10000) + "万"
    }
  },
  methods: {

  },
  mounted () {


  },
  components: {
    songsheet,
    listPeer,
    newMusic,
    player,
    recommend
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
