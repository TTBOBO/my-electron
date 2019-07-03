import {
  ajaxPost,
  ajaxGet
} from '@/api/axios.js'
const state = {
  account: {},
  profile: {},
  creatPlayList: [], //自己的歌单
  collecPlayLit: [], //收藏的歌单
  likeLists: [] //喜欢的音乐列表id
}

const mutations = {
  INIT_ACCOUNT(state, params = {}) {
    state.account = params;
  },
  INIT_PROFILE(state, params = {}) {
    state.profile = params;
  },
  LOGINOUT(state) {
    state.account = {};
    state.profile = {};
    state.creatPlayList = [];
    state.collecPlayLit = [];
  },
  SET_PLAYLIST(state, list = []) {
    state.collecPlayLit = [];
    state.creatPlayList = [];
    list.forEach((item) => {
      if (item.userId != state.profile.userId) {
        state.collecPlayLit.push(item);
      } else {
        state.creatPlayList.push(item);
      }
    })
  },
  SET_LIKE_LIST(state, list) {
    state.likeLists = list;
  }
}

const actions = {
  async getPlayListAction({
    state,
    commit,
    dispatch
  }, params) {
    if (!state.profile.userId) return false;
    let playListData = await ajaxGet('playlist', {
      uid: state.profile.userId,
      timestamp: new Date().getTime()
    });
    commit('SET_PLAYLIST', playListData.playlist)
  }
}

const getters = {
  getUserInfo: state => state.profile,
  getPlayList: state => {
    return {
      creatPlayList: state.creatPlayList,
      collecPlayLit: state.collecPlayLit
    }
  },
  getLikeLists: state => state.likeLists
}

export default {
  state,
  mutations,
  actions,
  getters
}