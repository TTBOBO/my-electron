<template>
  <div class="tab-menu">
    <div class="menu">
      <div class="menu-group"
           v-for="(item,index) in menuConf"
           :key="index">
        <span class="menu-group-name">{{item.name}}</span>
        <div class="menu-group-item"
             :class="{active:_index===1 && index === 0}"
             v-for="(_child,_index) in item.group"
             :key="_index">
          <span class="item-icon el-icon-user"></span>
          <span>{{_child.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuConf: [{
        name: '推荐',
        group: [{
          name: '发现音乐'
        }, {
          name: '私人FM'
        }, {
          name: 'LOOK直播'
        }, {
          name: '视频'
        }, {
          name: '朋友'
        }]
      }, {
        name: '我的音乐',
        group: [{
          name: '本地音乐'
        }, {
          name: '下载管理'
        }, {
          name: '本地音乐'
        }, {
          name: '下载管理'
        }, {
          name: '本地音乐'
        }, {
          name: '下载管理'
        }, {
          name: '本地音乐'
        }, {
          name: '下载管理'
        }]
      }]
    }
  }
}
</script>
<style lang="scss">
.tab-menu {
  width: 200px;
  background: #fdfbfb;
  height: 100%;
  border-right: 1px solid #dedede;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  .menu {
    .menu-group {
      color: #8c8c8c;
      font-weight: 100;
      .menu-group-name {
        height: 32px;
        padding-left: 10px;
        font-size: 13px;
        display: inline-block;
        line-height: 32px;
      }
      .menu-group-item {
        cursor: pointer;
        height: 32px;
        font-size: 13px;
        padding-left: 20px;
        line-height: 32px;
        .item-icon {
          margin-right: 10px;
        }
      }
      .active {
        color: #000;
        position: relative;
        background: #ececec;
        &::before {
          position: absolute;
          content: "";
          width: 2px;
          left: 0;
          height: 100%;
          background: $base-color;
        }
      }
    }
  }
}
</style>
