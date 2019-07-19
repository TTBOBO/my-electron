import {
  stat
} from "fs-extra-p";

const state = {
  audioEl: null, // 播放器
  mode: 0, // 0默认循环  1 单曲循环  2随机
  playing: false, //播放状态
  playList: [], //当前播放的音乐列表
  historyList: [], //历史播放列表
  currentIndex: '', //当前播放的下标
  currentLyric: null,
  currentPlayMusic: {}, //当前播放的音乐
  showLyStatus: false, //桌面歌词显示状态
  showSongLtStatus: false,
  likeIds: [], //喜欢的id
  downloadList: {
    downloadingList: [], //正在下载
    downloaded: [] //已下载
  }
}

function setLocalStorage(state, localKey, key) {
  localStorage.setItem(localKey, JSON.stringify(state[key || localKey]));
}

const mutations = {
  INIT_AUDIO_EL(state, params) {
    state.audioEl = params
  },
  SET_AUDIO_PLAYING(state) {
    state.playing = !state.playing
  },
  SET_CURRENT_INDEX(state, index) {
    state.currentIndex = index;
    localStorage.setItem('currentIndex', state.currentIndex);
    state.currentPlayMusic = state.playList[index];
    let Index = state.historyList.findIndex(item => {
      return item.id == state.currentPlayMusic.id
    })
    if (Index === -1) {
      state.historyList.push(state.currentPlayMusic);
      setLocalStorage(state, 'historyList');
    }

  },
  SET_MODE(state) {
    state.mode = state.mode + 1 > 2 ? 0 : state.mode + 1;
  },
  SET_PLAY_LIST(state, list = []) {
    state.playList = list;
    setLocalStorage(state, 'playList');
    // localStorage.setItem('playList', JSON.stringify(state.playList));
  },
  PUSH_MUSIC_TO_LIST(state, item) {
    if (item) {
      state.playList.push(item);
      setLocalStorage(state, 'playList');
    }
  },
  SET_SHOW_LY_STATUS(state) {
    state.showLyStatus = !state.showLyStatus;
  },
  SET_SHOW_SONG_LY_STATUS(state) {
    state.showSongLtStatus = !state.showSongLtStatus;
  },
  CLEAR_HISTORY_LIST(state) {
    state.historyList = [];
    setLocalStorage(state, 'historyList');
  },
  CLEAR_PLAY_LIST(state) {
    state.currentIndex = '';
    localStorage.setItem('currentIndex', state.currentIndex);
    state.playing = false;
    state.playList = [];
    setLocalStorage(state, 'playList');
  },
  SET_LIKE_IDS(state, data) {
    state.likeIds = data;
  },
  PUSH_DOWNLOAD_ITEM(state, data) {
    state.downloadList.downloadingList.push(...data);
    setLocalStorage(state, 'download', 'downloadList');
  },
  SET_DOWNLOAD_CURRENT_DATA(state, { //修改指定下载歌曲的状态
    data,
    index
  }) {
    state.downloadList.downloadingList[index] = Object.assign({}, state.downloadList.downloadingList[index], data);
    state.downloadList = JSON.parse(JSON.stringify(state.downloadList))
    setLocalStorage(state, 'download', 'downloadList');
  },
  SET_DOWNLOAD(state, data) { //设置所有的下载歌曲列表
    state.downloadList = data;
    setLocalStorage(state, 'download', 'downloadList');
  },
  SPLICE_DOWNLOAD_MUSIC(state, id) { //设置正在下载歌曲完成并移动到已下载列表
    state.downloadList.downloaded.push(state.downloadList.downloadingList.splice(state.downloadList.downloadingList.findIndex(item => item.id === id), 1)[0]);
    setLocalStorage(state, 'download', 'downloadList');
  },
  CANCEL_DOWNLOAD_ITEM(state, index) { //取消指定歌曲下载
    state.downloadList.downloadingList.splice(index, 1);
    setLocalStorage(state, 'download', 'downloadList');
  }
}

const actions = {
  init_audio_el({
    commit
  }) {
    // do something async
    commit('INIT_AUDIO_EL')
  },
  set_download_list({
    commit
  }, data) {
    commit('PUSH_DOWNLOAD_ITEM', [data]);
  },
}

const getters = {
  getAudioEl: state => state.audioEl,
  getPlayStatus: state => state.playing,
  getMode: state => state.mode,
  getCurrentIndex: state => state.currentIndex,
  getCurrentPlaylist: state => state.playList, //获取当前播放的列表
  getCurrentPlayMusic: (state) => {
    return (state.currentIndex !== '' && state.playList.length) ? state.playList[state.currentIndex] : {};
  },
  getShowLyStatus: state => state.showLyStatus,
  getShowSongLyStatus: state => state.showSongLtStatus,
  getHistoryList: state => state.historyList,
  getLikeIds: state => state.likeIds,
  getDownload: state => state.downloadList
  // getCurrentPlayMusic: state => state.currentPlayMusic
}

export default {
  state,
  mutations,
  actions,
  getters
}