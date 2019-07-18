<template>
  <div class="setting-container">
    <div class="tip-con">
      <p class="tip-name">下载目录：</p>
      <div class="tip-con-des">
        <span>{{settingConfig.downloadDir}}</span>
        <el-button size="mini"
                   style="width: 78px;"
                   @click="changeDownloadDir">更换目录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      settingConfig: {
        downloadDir: ""
      }

    }
  },
  methods: {
    changeDownloadDir () {
      this.$electron.remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (file) => {
        this.settingConfig.downloadDir = file[0];
        this.$electron.ipcRenderer.send('settingConf', this.settingConfig);
        localStorage.setItem('settingConfig', JSON.stringify(this.settingConfig))
      })
    }
  },
  mounted () {
    console.log('set')
    // this.$EventBus.$on('changeDownloadDir', this.changeDownloadDir);
  },
  created () {
    if (localStorage.getItem('settingConfig')) {
      this.settingConfig = JSON.parse(localStorage.getItem('settingConfig'));
      this.$electron.ipcRenderer.send('settingConf', JSON.parse(localStorage.getItem('settingConfig')));
    }
  }
}
</script>

<style lang='scss'>
.setting-container {
  padding: 20px;
  max-height: 700px;
  overflow-y: auto;
  .tip-con {
    .tip-name {
      font-size: 14px;
      margin-bottom: 20px;
    }
    .tip-con-des {
      font-size: 12px;
      span {
        margin-right: 20px;
      }
    }
  }
}
</style>
