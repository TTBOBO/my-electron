<template>
  <div class="container">
    <Header></Header>
    <div class="center">
      <Menu></Menu>
      <div class="tab-content">
        <router-view></router-view>
      </div>
      <transition name='show-ly'>
        <div class="music-ly animated"
             :class="{fadeInDown:getShowSongLyStatus,fadeInDown:!getShowSongLyStatus}"
             v-if="getShowSongLyStatus">
          <PlayMusic v-if="getShowSongLyStatus"></PlayMusic>
        </div>
      </transition>
    </div>
    <Play></Play>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from './base/Header'
import Play from './base/Play'
import Menu from './base/Menu'
import PlayMusic from './PlayMusic'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['getShowSongLyStatus'])
  },
  methods: {

  },
  components: {
    Header,
    Play,
    Menu,
    PlayMusic
  },
  created () {

  }
}
</script>

<style lang="scss">
.container {
  background: #fff;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-flow: column;
  position: relative;
  .center {
    height: calc(100% - 100px);
    position: relative;
    display: flex;
    justify-content: space-between;
    flex: 1;
    overflow: hidden;
    .tab-content {
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
    .show-ly-enter-active,
    .show-ly-leave-active {
      margin-left: 0;
      margin-top: 0;
      -webkit-transition: all 500ms cubic-bezier(0.265, 0.005, 0.875, 0.46);
      -moz-transition: all 500ms cubic-bezier(0.265, 0.005, 0.875, 0.46);
      -o-transition: all 500ms cubic-bezier(0.265, 0.005, 0.875, 0.46);
      transition: all 500ms cubic-bezier(0.265, 0.005, 0.875, 0.46); /* custom */
      // transition: all 0.5s;
    }
    .show-ly-enter,
    .show-ly-leave-to {
      opacity: 0;
      margin-left: -100%;
      margin-top: 100%;
    }
    .music-ly {
      position: absolute;
      left: 0;
      right: 0;
      // margin-right: 100%;
      // margin-top: 100%;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
  }
}
</style>
