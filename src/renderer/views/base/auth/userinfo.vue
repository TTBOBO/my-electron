<template>
  <el-popover placement="bottom"
              title=""
              width="250"
              trigger="click"
              v-model="visible">
    <div class="userinfo-con"
         v-loading="loading">
      <div v-if="visible">
        <div class="info-header">
          <div class="auth-con">
            <img class="avatar"
                 :src="userinfo.profile.avatarUrl" />
            <span class="nickname">{{userinfo.profile.nickname}}</span>
            <div class="sign"
                 :class="{'is-sign':userinfo.pcSign}"
                 @click="signin">{{userinfo.pcSign ? '已' : ''}}签到</div>
          </div>
          <div class="tag-con">
            <div class="tag"
                 v-for="(tag,index) in tags"
                 :key="index">
              <span class="num">{{userinfo.profile[tag.key]}}</span>
              <span class="tab-name">{{tag.name}}</span>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="user-info-list"
             v-for="(list,index) in userList"
             :key="index">
          <div class="list-item"
               v-for="(item,itemIndex) in list"
               :key="itemIndex">
            <div class="item-left"
                 @click="handle(item.name)">
              <i class="el-icon-user"></i>
              <span>{{item.name}}</span>
            </div>
            <div class="item-right">
              <template v-if="itemIndex <=1 && index == 0">
                <span v-if="itemIndex == 0">{{userinfo.profile.vipType == 0 ? '未订购' : 'VIP'+userinfo.profile.vipType}}</span>
                <span v-if="itemIndex == 1">LV.{{userinfo.level}}</span>
              </template>

              <i class="iconfont icon-you"></i>
            </div>
          </div>
        </div>
      </div>

    </div>
    <span slot="reference">
      <slot></slot>
    </span>
  </el-popover>
</template> 
 
<script> 
import util from '../../../assets/js/util';
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      loading: true,
      userinfo: {
        profile: {}
      },
      tags: [{
        key: "djStatus",
        name: "动态"
      }, {
        key: "follows",
        name: "关注"
      }, {
        key: "followeds",
        name: "粉丝"
      }],
      userList: [[{
        icon: "",
        name: "会员中心",
        key: "vipType"
      }, {
        icon: "",
        name: "等级",
        key: "level"
      }, {
        icon: "",
        name: "商城",
      }], [{
        icon: "",
        name: "个人信息设置",
      }, {
        icon: "",
        name: "绑定社交账号",
      }], [{
        icon: "",
        name: "退出登录"
      }]],
    }
  },
  props: {
    userId: Number
  },
  methods: {
    ...mapMutations(['LOGINOUT']),
    async signin () { //签到 
      if (!this.userinfo.pcSign) {
        let res = await this.$ajaxPost('signin', { signin: 1, timestamp: new Date().getTime() });
        if (res.code === 200) {
          this.$message({
            message: "签到成功",
            type: 'success'
          });
        }
      }
    },
    async handle (name) {
      switch (name) {
        case "退出登录":
          await this.loginOut();
          this.$router.replace('/findMusic')
          break;

        default:
          break;
      }
    },
    async loginOut () {
      let res = await this.$ajaxPost('loginOut');
      if (res.code === 200) {
        this.$message({
          message: "退出成功",
          type: 'success',
          duration: 1000
        });
        util.clearLocalStorage();
        this.LOGINOUT();
      }
    },
  },
  async created () {

  },
  watch: {
    async visible (newV, oldV) {
      if (newV) {
        let res = await this.$ajaxGet('userDetail', { uid: this.userId })
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.userinfo = res;
        console.log(res);
      }
    }
  }
} 
</script> 
 
<style lang='scss'>
.userinfo-con {
  height: 348.5px;
  .info-header {
    margin: 12px;
    .auth-con {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .nickname {
        margin-left: -45px;
      }
      .sign {
        width: 50px;
        height: 20px;
        border-radius: 3px;
        background: #fff;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        cursor: pointer;
        border: 1px solid #333;
      }
      .is-sign {
        color: #ccc;
        border: 1px solid #ccc;
      }
    }
    .tag-con {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      .tag {
        flex: 1;
        cursor: pointer;
        border-right: 1px solid #ccc;
        color: #333;
        display: flex;
        flex-flow: column;
        align-items: center;
        &:last-child {
          border: none;
        }
        .num {
          font-weight: 700;
        }
      }
    }
  }
  .line {
    border-bottom: 1px solid #ccc;
  }
  .user-info-list {
    border-bottom: 1px solid #ccc;
    &:last-child {
      border: none;
    }
    .list-item {
      padding: 0 12px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      height: 40px;
      cursor: pointer;
      &:hover {
        background: #fafafa;
      }
    }
  }
}
</style> 