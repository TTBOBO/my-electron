import {
  mapMutations,
  mapGetters,
  mapState,
  mapActions
} from 'vuex';
export default {
  computed: {
    ...mapGetters(['getUserInfo', 'getCurrentIndex', 'getCurrentPlaylist', 'getLikeIds', 'getCurrentPlayMusic']),
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
        this.getAudioEl.currentTime = 0; //重新播放
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
    playAll(list) {
      this.SET_PLAY_LIST(list || this.playlist.tracks);
      this.$EventBus.$emit('setCurrentIndex', 0)
    },
  }
}