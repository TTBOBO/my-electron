<template>
  <div class="song-sheet-container">
    <p>歌单类型
      <el-select v-model="category"
                 @change="changeType"
                 size='mini'
                 style="width:100px;"
                 placeholder="请选择歌单类型">
        <el-option v-for="(item,index) in catlists"
                   :key="index"
                   :label="item.name"
                   :value="item.name">
        </el-option>
      </el-select>
    </p>
    <p class="type-list">热门标签：
      <template v-for="(hotTag,index) in hotList">
        <span :key="index">
          <span class="type-item">{{hotTag.name}}</span>
          <span class="line"
                v-if="index < hotList.length - 1">|</span>
        </span>
      </template>
    </p>
    <div class="player-list">
      <div class="world-con"
           v-infinite-scroll="load"
           :infinite-scroll-disabled="disabled">
        <div class="world-con-item"
             v-for="(item,index) in highquality"
             :key="index">
          <div class="item-pic-con">
            <img :src="item.coverImgUrl+'?param=300y300'">
            <div class="play-count">{{item.playCount | getNumber}}</div>
          </div>
          <a :title="item.name"
             class="title pointer">{{item.name}}</a>
        </div>
        <p v-if="loading"
           class="tip">加载中...</p>
        <p v-if="noMore"
           class="tip">没有更多了</p>
      </div>

      <!-- <div class="world-con">
      <div class="world-con-item"
           v-for="(item,index) in toplist"
           :key="index">
        <div class="item-pic-con">
          <img :src="item.coverImgUrl"
               alt="description">
          <div class="play-count">{{item.playCount | getNumber}}</div>
        </div>
        <p class="title">{{item.name}}</p>
      </div> -->
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catlists: [], //歌单分类
      hotList: [],
      highquality: [],
      category: '全部歌单',
      loading: true,
      noMore: false,
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },
  filters: {
    getNumber (val) {
      return parseInt(val / 10000) + "万"
    }
  },
  methods: {
    async hotPlayList () {
      let hotList = await this.$ajaxGet('hotPlayList');
      let catlists = await this.$ajaxGet('catlist');
      this.hotList = hotList.tags;
      this.catlists.push(catlists.all, ...catlists.sub);

    },
    changeType () {
      this.getPlayLists();
    },
    async getPlayLists (status = false) {
      let params = {
        limit: 20,
        order: 'new',
        cat: this.category,
      }
      let len = this.highquality.length;
      if (len > 0) {
        params.before = this.highquality[len - 1].updateTime;
      }
      let data = await this.$ajaxGet('highquality', params);
      setTimeout(() => {
        this.loading = false;
        if (data.playlists.length == 0) {
          this.noMore = true;
        }
        if (status) {
          this.highquality = data.playlists;
        } else {
          this.highquality.push(...data.playlists);
        }
      }, 500)
    },
    load () {
      this.loading = true;
      this.getPlayLists();
    }
  },
  async created () {
    await this.hotPlayList();
    await this.getPlayLists();
  }
}
</script>

<style lang='scss'>
.song-sheet-container {
  width: 100%;
  height: 100%;
  .type-list {
    font-size: 12px;
    color: darkgray;
    margin: 10px 0;

    .type-item {
      display: inline-block;
      padding: 3px 5px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .line {
      margin: 0 5px;
    }
    .active {
      color: #fff;
      background: darkgray;
    }
  }
  .player-list {
    height: calc(100% - 122px);
    .world-con {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
      .world-con-item {
        width: 169px;
        height: 189px;
        margin-right: 15px;
        margin-bottom: 20px;
        &:nth-child(6n + 0) {
          margin-right: 0;
        }
        .item-pic-con {
          position: relative;
          width: 169px;
          height: 169px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .play-count {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            padding: 3px 0px;
            font-size: 12px;
            color: #fff;
            text-align: right;
            padding-right: 10px;
            background: linear-gradient(to right, transparent 50%, #333);
          }
        }
        .title {
          width: 169px;
          font-size: 12px;
          line-height: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          display: inherit;
        }
      }
    }
    .tip {
      width: 100%;
      margin: 20px auto;
      text-align: center;
    }
  }
}
</style>
