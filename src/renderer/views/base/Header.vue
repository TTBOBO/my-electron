<template>
  <!-- style="-webkit-app-region: drag;" -->
  <div class="tab-header">
    <div class="logo-info">
      <!-- <img class="tab-logo"
      src="~@/assets/logo.png" />-->
      <span class="tab-name">
        音乐播放器
        <!-- 网易云音乐 -->
      </span>
      <el-button-group style="margin-left: 150px;">
        <el-button @click="handerRouter('left')"
                   icon="el-icon-arrow-left"
                   size="mini"></el-button>
        <el-button @click="handerRouter"
                   icon="el-icon-arrow-right"
                   size="mini"></el-button>
      </el-button-group>
      <input class="search"
             placeholder="搜索音乐，视频，歌词，电台">
    </div>
    <div class="tab-setting">
      <div class="user-info">
        <img class="user-header"
             :src="getUserInfo.avatarUrl || avatarUrl">
        <div class="user-name font">
          <user-info v-if="getUserInfo.userId"
                     :userId="getUserInfo.userId">
            <span>{{getUserInfo.nickname}}</span>
          </user-info>
          <span v-else
                @click="showLogin">未登录</span>

        </div>
      </div>
      <i class="el-icon-chat-line-round font"></i>
      <i class="el-icon-setting font"
         @click="showSetting"></i>
      <span class="label">|</span>
      <div class="tool">
        <i class="el-icon-minus font"
           @click="sendStatus('miniSize')"></i>
        <i class="font iconfont"
           :class="{'el-icon-full-screen':!isFull,'icon-suoxiao':isFull}"
           @click="sendStatus('maxSize')"></i>
        <i class="el-icon-close font"
           @click="sendStatus('close')"></i>
      </div>
    </div>
    <el-dialog title
               :visible.sync="loginStatus"
               width="300px">
      <el-form :model="ruleForm"
               status-icon
               ref="ruleForm"
               label-width="0"
               class="">
        <el-form-item label=""
                      prop="pass">
          <el-input type="text"
                    v-model="ruleForm.phone"
                    autocomplete="off"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label=""
                      prop="checkPass">
          <el-input type="password"
                    v-model="ruleForm.password"
                    autocomplete="off"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn"
                     @click="submitForm()"
                     :loading='loading'>登录</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="设置"
               :visible.sync="showSettingStatus"
               width="700px">
      <Setting></Setting>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../assets/js/util'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import UserInfo from './auth/UserInfo'
import Setting from './auth/Setting'
export default {
  data () {
    return {
      loginStatus: false,
      showSettingStatus: false,
      ruleForm: {
        phone: '13698006449',
        password: 'tab822520'
      },
      loading: false,
      avatarUrl: require('@/assets/logo.jpg'),
      isFull: false
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    ...mapMutations(['INIT_ACCOUNT', 'INIT_PROFILE', 'SET_PLAYLIST']),
    ...mapActions(['getPlayListAction']),
    showSetting () {
      this.showSettingStatus = !this.showSettingStatus
    },
    handerRouter (type) {
      this.$router[type === 'left' ? 'back' : 'forward']()
    },
    sendStatus (type) {
      if (type === 'maxSize') {
        this.isFull = !this.isFull
      }
      this.$electron.ipcRenderer.send(type || 'miniSize', this.isFull)
      // this.$electron.remote.shell.openExternal('https://github.com/Molunerfinn/PicGo')
    },
    showLogin () {
      this.loginStatus = true
    },
    async submitForm () {
      let valid = await this.$refs['ruleForm'].validate()
      if (!valid) return
      this.loading = true
      try {
        let res = await this.$ajaxPost('login', this.ruleForm)
        // let { ids } = await this.$ajaxGet('likelist');
        // this.SET_LIKE_LIST(ids);
        let { account, profile } = res

        this.INIT_ACCOUNT(account)
        this.INIT_PROFILE(profile)
        util.setLocalStorage('account', JSON.stringify(account))
        util.setLocalStorage('profile', JSON.stringify(profile))
        this.loading = false
        this.loginStatus = false
        this.getSubcount()
        this.getPlayListAction()
      } catch (error) {
        console.log(error)
        this.$message({
          message: error.message,
          type: 'error'
        })
        this.loading = false
      }
    },
    async getSubcount () {
      let subcountData = await this.$ajaxPost('subcount')
      console.log(subcountData)
    }
  },
  components: {
    UserInfo,
    Setting
  },
  mounted () {
    if (util.getLocalStorage('account')) {
      this.INIT_ACCOUNT(JSON.parse(util.getLocalStorage('account')))
      this.INIT_PROFILE(JSON.parse(util.getLocalStorage('profile')))
    }
    this.getPlayListAction()

    // this.getSubcount();
    // this.getPlayList()
  }
}
</script>

<style lang="scss">
.tab-header {
  background: $base-color;
  height: 50px;
  // width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  -webkit-app-region: drag;
  .logo-info {
    color: #fff;
    -webkit-app-region: no-drag;
    .tab-logo {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      object-fit: cover;
    }
    .search {
      height: 15px;
      border-radius: 15px;
      border-color: transparent;
      background: #a72929;
      width: 200px;
      margin-left: 20px;
      padding-left: 10px;
      color: #fff;
      outline: none;
      font-size: 12px;
      font-weight: 400;
      line-height: 15px;
      &::-webkit-input-placeholder {
        color: #ccc;
      }
    }

    .tab-name {
      -webkit-app-region: drag;
    }
  }
  .tab-setting {
    width: 300px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    font-size: 14px;
    -webkit-app-region: no-drag;
    .font {
      cursor: pointer;
      font-size: 13px;
      color: #dcd9d9;
      &:hover {
        color: #fff;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      .user-header {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 10px;
      }
      .user-name {
      }
    }
    .label {
      color: #b9acac;
    }
    .tool {
      display: flex;
      justify-content: space-between;
      width: 80px;
      display: flex;
    }
  }
  .login-btn {
    background: $base-color;
    color: #fff;
    border: none;
    width: 100%;
    &:hover,
    &:focus {
      background: $base-hcolor;
      color: #fff;
      border: none;
    }
  }
}
</style>
