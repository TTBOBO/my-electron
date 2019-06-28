const state = {
  audioEl: null, // 播放器
  mode: 0, // 0默认循环  1 单曲循环  2随机
  playing: false,
  // playList: ['https://music.163.com/song/media/outer/url?id=34057974.mp3',
  //   'https://music.163.com/song/media/outer/url?id=472219602.mp3',
  //   // 'https://music.163.com/song/media/outer/url?id=19150932.mp3',
  //   // 'https://music.163.com/song/media/outer/url?id=450424527.mp3',19150932
  //   // 'https://music.163.com/song/media/outer/url?id=557581284.mp3',
  //   // 'https://music.163.com/song/media/outer/url?id=452986458.mp3'
  // ],
  playList: [],
  orderList: [],
  currentIndex: '',
  historyList: [], //当前播放的音乐列表
  currentLyric: null,
  currentPlayMusic: {} //当前播放的音乐
}

const mutations = {
  INIT_AUDIO_EL(state, params) {
    state.audioEl = params
  },
  SET_AUDIO_PLAYING(state) {
    state.playing = !state.playing
  },
  SET_CURRENT_INDEX(state, index) {
    state.currentIndex = index
    state.currentPlayMusic = state.playList[index];
  },
  SET_MODE(state) {
    state.mode = state.mode + 1 > 2 ? 0 : state.mode + 1;
  },
  SET_PLAY_LIST(state, list = []) {
    state.playList = list;
    console.log(list);
  }
}

const actions = {
  init_audio_el({
    commit
  }) {
    // do something async
    commit('INIT_AUDIO_EL')
  }
}

const getters = {
  getAudioEl: state => state.audioEl,
  getPlayStatus: state => state.playing,
  getMode: state => state.mode,
  getCurrentIndex: state => state.currentIndex,
  getCurrentPlaylist: state => state.playList, //获取当前播放的列表
  getCurrentPlayMusic: (state) => {
    return (state.currentIndex !== '' && state.playList.length) ? state.playList[state.currentIndex] : {}
  },
  // getCurrentPlayMusic: state => state.currentPlayMusic
}

export default {
  state,
  mutations,
  actions,
  getters
}