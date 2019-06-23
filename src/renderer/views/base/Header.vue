<template>
  <div class="tab-header">
    <div class="logo-info">
      <!-- <img class="tab-logo"
      src="~@/assets/logo.png" />-->
      <span class="tab-name">
        网易云音乐
        <!-- 网易云音乐 -->
      </span>
      <input class="search" placeholder="搜索音乐，视频，歌词，电台">
    </div>
    <div class="tab-setting">
      <div class="user-info">
        <img class="user-header" :src="getUserInfo.avatarUrl || '~@/assets/logo.jpg'">
        <div class="user-name font">
          <span v-if="getUserInfo.userId">{{getUserInfo.nickname}}</span>
          <span v-else  @click="showLogin">未登录</span>
        </div>
      </div>
      <span class="font">开通会员</span>
      <i class="el-icon-chat-line-round font"></i>
      <i class="el-icon-setting font"></i>
      <span class="label">|</span>
      <div class="tool">
        <i class="el-icon-minus font"></i>
        <i class="el-icon-full-screen font"></i>
        <i class="el-icon-close font"></i>
      </div>
    </div>
    <el-dialog title :visible.sync="loginStatus" width="300px">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="0"
        class=""
      >
        <el-form-item label="" prop="pass">
          <el-input type="text" v-model="ruleForm.phone" autocomplete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="" prop="checkPass">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" @click="submitForm()" :loading='loading'>登录</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../assets/js/util';
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
	  loginStatus: false,
	  ruleForm:{
		  phone:"13698006449",
		  password:"tab822520"
	  },
	  loading:false
    };
  },
  computed:{
	...mapGetters(['getUserInfo']),  
  },
  methods: {
	...mapMutations(['INIT_ACCOUNT','INIT_PROFILE']),
    showLogin() {
      this.loginStatus = true;
    },
    async submitForm(){
		let valid = await  this.$refs['ruleForm'].validate();
		if (!valid) return;
		this.loading = true;
		try {
			 let res = await this.$ajaxPost('login',this.ruleForm);
			 console.log(res);
			 let {account,profile} = res;
			
			this.INIT_ACCOUNT(account);
			this.INIT_PROFILE(profile);
			util.setLocalStorage('account',JSON.stringify(account));
			util.setLocalStorage('profile',JSON.stringify(profile));
			this.loading = false;
			this.loginStatus = false;
		} catch (error) {
			console.log(error)
			this.$message({
				message: error.message,
				type: 'error'
			});
			this.loading = false;
		}
		
		
	},
	login(){

	}
  },
  mounted() {
	if(util.getLocalStorage('account')){
		this.INIT_ACCOUNT(JSON.parse(util.getLocalStorage('account')));
		this.INIT_PROFILE(JSON.parse(util.getLocalStorage('profile')));
	}
  }
};
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
  .logo-info {
    color: #fff;
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
      margin-left: 150px;
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

    .font {
      cursor: pointer;
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
  .login-btn{
		background: $base-color;
		color: #fff;
		border:none;
		width: 100%;
		&:hover,&:focus{
			background: $base-hcolor;
			color: #fff;
			border:none;
		}
	}
}
</style>
