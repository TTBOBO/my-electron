<template>
  <div class="find-container center-con">
    <el-tabs v-model="activeName"
             class="tabs">
      <el-tab-pane label="个性推荐"
                   name="个性推荐">
        <el-carousel :interval="4000"
                     :autoplay="false"
                     type="card"
                     height="200px">
          <el-carousel-item v-for="(item,index) in banners"
                            :key="index">
            <div class="banner-con">
              <img class="banner-pic"
                   :src="item.imageUrl" />
              <!-- targetId titleColor targetType-->
              <span class="banner-tag">{{item.typeTitle}}</span>
            </div>
          </el-carousel-item>
        </el-carousel>
        <HeaderLine title="推荐歌单"></HeaderLine>
        <div class="resource">
          <div class="resource-item"
               v-for="(item,index) in recommend"
               :key="index">
            <div class="pic-con">
              <img class="pic pointer"
                   :src="item.picUrl" />
              <span class="play-count">
                <i class="iconfont icon-erji"></i>{{item.playcount | getNumber}}</span>
            </div>
            <p class="name pointer">{{item.name}}</p>
          </div>
        </div>
        <HeaderLine title="新歌速递"></HeaderLine>
        <div class="resource">
          <div class="resource-item"
               v-for="(item,index) in newSongs"
               :key="index">
            <div class="pic-con">
              <img class="pic pointer"
                   :src="item.album.blurPicUrl" />
              <!-- <span class="play-count">
                <i class="iconfont icon-erji"></i>{{item.playcount}}</span> -->
            </div>
            <p class="name pointer">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌单"
                   name="歌单">歌单</el-tab-pane>
      <el-tab-pane label="电台"
                   name="电台">电台</el-tab-pane>
      <el-tab-pane label="排名榜"
                   name="排名榜">
        <listPeer v-if="activeName == '排名榜'"></listPeer>
      </el-tab-pane>
      <el-tab-pane label="歌手"
                   name="歌手">歌手</el-tab-pane>
      <el-tab-pane label="最新音乐"
                   name="最新音乐">
        <newMusic v-if="activeName == '最新音乐'"></newMusic>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HeaderLine from '@/components/headerLine';
import listPeer from './type/ListPeer';
import newMusic from './type/newMusic';
export default {
  data () {
    return {
      banners: [],
      recommend: [],
      newSongs: [],
      activeName: "最新音乐"
    }
  },
  filters: {
    getNumber (val) {
      return parseInt(val / 10000) + "万"
    }
  },
  methods: {
    async init () {
      let newBanner = await this.$ajaxGet('banner');
      this.banners = newBanner.banners;
      let resource = await this.$ajaxGet('resource');
      this.recommend = resource.recommend.slice(0, 12);
      let newSongs = await this.$ajaxGet('topSongs', { type: 0 });
      this.newSongs = newSongs.data.slice(0, 12);
      console.log(newSongs)
    }
  },
  mounted () {
    this.init();

  },
  components: {
    HeaderLine,
    listPeer,
    newMusic
  }
}
</script>

<style lang="scss">
.find-container {
  height: 100%;
  padding: 0 20px;
  .tabs {
    width: 100%;
    height: 100%;
  }
  .is-active {
    color: #d63131 !important;
  }
  .banner-con {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0px 1px 1px #ccc;
    .banner-pic {
      width: 100%;
      height: 100%;
    }
    .banner-tag {
      position: absolute;
      right: 0;
      bottom: 0;
      background: $base-color;
      color: #fff;
      padding: 5px 7px;
      font-size: 12px;
      border-radius: 3px 0 3px 0;
    }
  }
  // <div class="resource">
  //         <div class="resource-item">
  //           <div class="pic-con">
  //             <img  />
  //             <span class="play-count"></span>
  //           </div>
  //           <p  class="name"></p>
  //         </div>
  //       </div>
  .resource {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .resource-item {
      width: 20%;
      margin-bottom: 20px;
      flex-direction: column;
      margin-right: 30px;
      &:nth-child(4) {
        margin-right: 0;
      }
      .pic-con {
        // width: 140px;
        // height: 140px;
        overflow: hidden;
        position: relative;
        .pic {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &:hover {
          .play-count {
            top: 0;
          }
        }
        .play-count {
          position: absolute;
          left: 0;
          right: 0;
          top: -100%;
          height: 27px;
          color: #ccc;
          background: #000;
          opacity: 0.5;
          line-height: 27px;
          transition: 0.5s linear;
          .iconfont {
            margin: 0 3px;
          }
        }
      }
    }
    .name {
      padding: 5px 0;
      font-size: 12px;
      display: inline-block;
      max-width: 100%;
      width: 100%;
      vertical-align: middle;
      word-wrap: break-word;
      word-break: normal;
      line-height: 18px;
    }
  }
  .tabs {
    .el-tabs__content{
    height: calc(100% - 65px);
    .el-tab-pane{
      height: 100%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
  }
}
</style>
