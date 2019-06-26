<template>
  <div>
    发现音乐
    <!-- <webview id="foo"
             src="https://www.github.com/"
             style="display:inline-flex; width:640px; height:480px"></webview> -->
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="date"
                       label="日期"
                       width="180">
      </el-table-column>
      <el-table-column prop="name"
                       label="姓名"
                       width="180">
      </el-table-column>
      <el-table-column prop="address"
                       label="地址">
      </el-table-column>
    </el-table>
    <span class="indicator"></span>
  </div>
</template>

<script>

export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    onload () {
      // const webview = document.querySelector('webview')
      // const indicator = document.querySelector('.indicator')

      // const loadstart = () => {
      //   indicator.innerText = 'loading...'
      // }

      // const loadstop = () => {
      //   indicator.innerText = ''
      // }

      // webview.addEventListener('did-start-loading', loadstart)
      // webview.addEventListener('did-stop-loading', loadstop)
    }
  },
  mounted () {
    // console.log(dialog)
    // // dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
    // console.log(this.$electron.remote.BrowserView.getAllViews())
    this.onload();

  }
}
</script>

<style>
</style>
