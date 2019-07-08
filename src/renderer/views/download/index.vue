<template>
  <div>
    <el-button @click="download">下载</el-button>
    <el-button @click="resume">重新下载</el-button>
    <el-button @click="cancel">取消下载</el-button>
  </div>
</template>

<script>
// const { ipcRenderer } = electron;
export default {
  data () {
    return {

    }
  },
  methods: {
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
    setTimeout(() => {
      this.$electron.remote.getCurrentWebContents().downloadURL('http://localhost:8081/reptile.zip')
    }, 2000)
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

<style>
</style>
