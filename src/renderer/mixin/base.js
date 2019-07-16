import {
  mapMutations,
  mapGetters,
  mapState,
  mapActions
} from 'vuex';
export default {
  computed: {
    ...mapGetters(['getUserInfo', 'getCurrentIndex', 'getCurrentPlaylist', 'getLikeIds', 'getCurrentPlayMusic', 'getAudioEl']),
  },
  filters: {
    filterTime(val) {
      if (!val) return '00:00';
      val = Math.ceil(val);
      let minute = Math.floor(val / 60);
      let second = Math.floor(val % 60)
      return `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
    },
  },
  methods: {
    ...mapMutations(['SET_PLAY_LIST', 'PUSH_MUSIC_TO_LIST', 'SET_LIKE_IDS']),
    async likelist() {
      let {
        ids
      } = await this.$ajaxGet('likelist', {
        uid: this.getUserInfo.userId,
        timestamp: new Date().getTime()
      });
      this.SET_LIKE_IDS(ids);
    },
    palyMusic(item) {
      if (this.getCurrentIndex !== '' && this.getCurrentPlaylist[this.getCurrentIndex].name === item.name) {
        console.log(222)
        this.getAudioEl.currentTime = 0; //重新播放
        console.log(223)
        this.$EventBus.$emit('changePro', 0);
      } else {
        let index = this.getCurrentPlaylist.findIndex(_item => _item.name === item.name);
        if (index == -1) { //如果当前音乐没有在播放列表里面直接添加进去再播放
          this.PUSH_MUSIC_TO_LIST(item);
          this.$EventBus.$emit('setCurrentIndex', this.getCurrentPlaylist.length - 1)
        } else {
          this.$EventBus.$emit('setCurrentIndex', index)
        }
      }
    },
    playLocalMusic(item) {
      let musicItem = JSON.parse(JSON.stringify(item));
      if (/^http/.test(musicItem.path)) { //网络链接
        console.log(41)
        this.palyMusic(musicItem);
      } else {
        console.log(42)
        this.$electron.ipcRenderer.send('get_local_music', musicItem.dir || musicItem.path);
        this.$electron.ipcRenderer.on('local_music_cbk', (event, buffer) => {
          const blob = new Blob([buffer], {
            type: "application/mp3"
          });
          musicItem.path = URL.createObjectURL(blob);
          this.palyMusic(musicItem);
        })
      }
    },
    handlePlayer(item) {
      this.$router.push({
        path: '/playinfo',
        query: {
          id: item.id
        }
      });
    },
    playAll(list) {
      this.SET_PLAY_LIST(list || this.playlist.tracks);
      this.$EventBus.$emit('setCurrentIndex', 0)
    },
  }
}