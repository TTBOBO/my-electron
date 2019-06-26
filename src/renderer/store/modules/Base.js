const state = {
  account: {},
  profile: {},
  creatPlayList: [], //自己的歌单
  collecPlayLit: [], //收藏的歌单
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
    list.forEach((item) => {
      if (item.userId != state.profile.userId) {
        state.collecPlayLit.push(item);
      } else {
        state.creatPlayList.push(item);
      }
    })
  }
}

const actions = {

}

const getters = {
  getUserInfo: state => state.profile,
  getPlayList: state => {
    return {
      creatPlayList: state.creatPlayList,
      collecPlayLit: state.collecPlayLit
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}