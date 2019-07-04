<template>
  <div>
    <el-button @click="getMusic">扫描音乐</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    getMusic () {
      this.$electron.ipcRenderer.send('scnn');
    }
  }
}
</script>

<style>
</style>
