const state = {
    account:{},
    profile:{}
  }
  
  const mutations = {
    INIT_ACCOUNT(state,params = {}){
        state.account = params;
    },
    INIT_PROFILE(state,params = {}){
        state.profile = params;
    }
  }
  
  const actions = {
    
  }
  
  const getters = {
    getUserInfo: state => state.profile
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }
  