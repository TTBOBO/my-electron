<template>
  <div>
    发现音乐
    <webview id="foo"
             src="https://www.github.com/"
             style="display:inline-flex; width:640px; height:480px"></webview>
    <span class="indicator"></span>
  </div>
</template>

<script>

export default {
  data () {
    return {}
  },
  methods: {
    onload () {
      const webview = document.querySelector('webview')
      const indicator = document.querySelector('.indicator')

      const loadstart = () => {
        indicator.innerText = 'loading...'
      }

      const loadstop = () => {
        indicator.innerText = ''
      }

      webview.addEventListener('did-start-loading', loadstart)
      webview.addEventListener('did-stop-loading', loadstop)
    }
  },
  mounted () {
    console.log(dialog)
    // dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
    console.log(this.$electron.remote.BrowserView.getAllViews())
    this.onload();

  }
}
</script>

<style>
</style>
