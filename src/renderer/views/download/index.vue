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
    console.log(2)
    setTimeout(() => {
      this.$electron.remote.getCurrentWebContents().downloadURL('https://music.163.com/song/media/outer/url?id=34057974.mp3')
    }, 2000)
    this.$electron.ipcRenderer.on('download', (e, data) => {
      console.log(data);
      this.data = data;
      setTimeout(() => {
        console.log("开始下载");
        // this.$electron.ipcRenderer.send('download', data, 'resume');
      })
    })
    // console.log();
  }
}
</script>

<style>
</style>
