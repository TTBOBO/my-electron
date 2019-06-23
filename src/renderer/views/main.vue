<template>
  <div class="container">
    <Header></Header>
    <div class="center">
      <Menu></Menu>
      <div class="tab-content">
        {{$store.state.Music.main}}
        <router-view></router-view>
      </div>
    </div>
    <Play></Play>
  </div>
</template>

<script>
import Header from './base/Header'
import Play from './base/Play'
import Menu from './base/Menu'
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  components: {
    Header,
    Play,
    Menu
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-flow: column;
  .center {
    height: calc(100% - 100px);
    display: flex;
    justify-content: space-between;
    flex: 1;
    .tab-content {
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
</style>
