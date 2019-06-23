const state = {
  audioEl: null, // 播放器
  mode: 0, // 默认循环
  playing: false,
  playList: ['https://music.163.com/song/media/outer/url?id=450424527.mp3',
    // 'https://music.163.com/song/media/outer/url?id=557581284.mp3',
    'https://music.163.com/song/media/outer/url?id=452986458.mp3'
  ],
  orderList: [],
  currentIndex: 0,
  historyList: []
}

const mutations = {
  INIT_AUDIO_EL (state, params) {
    state.audioEl = params
  },
  SET_AUDIO_PLAYING (state) {
    state.playing = !state.playing
  },
  SET_CURRENT_INDEX (state, index) {
    state.currentIndex = index
  }
}

const actions = {
  init_audio_el ({
    commit
  }) {
    // do something async
    commit('INIT_AUDIO_EL')
  }
}

const getters = {
  getAudioEl: state => state.audioEl
}

export default {
  state,
  mutations,
  actions,
  getters
}
