<template>
  <div class="tab-header">
    <div class="logo-info">
      <!-- <img class="tab-logo"
           src="~@/assets/logo.png" /> -->
      <span class="tab-name">
        网易云音乐
        <!-- 网易云音乐 -->
      </span>
      <input class="search"
             placeholder="搜索音乐，视频，歌词，电台" />
    </div>
    <div class="tab-setting">
      <div class="user-info">
        <img class="user-header"
             src="~@/assets/logo.jpg" />
        <div class="user-name font">昔日</div>
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
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  mounted () {
    // app.on('ready', () => {
    //   globalShortcut.register('CommandOrControl+Y', () => {
    //     console.log('Y')
    //   })
    // })
  }
}
</script>

<style lang="scss">
@import "../../../assets/css/base.scss";
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
}
</style>
