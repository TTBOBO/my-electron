const state = {
  audioEl: null, // 播放器
  mode: 0, // 0默认循环  1 单曲循环  2随机
  playing: false,
  playList: ['https://music.163.com/song/media/outer/url?id=34057974.mp3',
    'https://music.163.com/song/media/outer/url?id=450424527.mp3',
    // 'https://music.163.com/song/media/outer/url?id=557581284.mp3',
    'https://music.163.com/song/media/outer/url?id=452986458.mp3'
  ],
  orderList: [],
  currentIndex: 0,
  historyList: [],
  currentLyric: null
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
  },
  SET_MODE(state) {
    state.mode = state.mode + 1 > 2 ? 0 : state.mode + 1;
    console.log(state.mode);
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
  getMode: state => state.mode
}

export default {
  state,
  mutations,
  actions,
  getters
}