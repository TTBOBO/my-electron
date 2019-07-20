<template>
  <div class="player-container">
    <p class="type-list">语种：
      <template v-for="(language,index) in languages">
        <span :key="index">
          <span @click="handerClick('language',language)"
                class="type-item"
                :class="{'active':active.language == language}">{{language}}</span>
          <span class="line"
                v-if="index < languages.length - 1">|</span>
        </span>
      </template>
    </p>
    <p class="type-list">分类：
      <template v-for="(type,index) in playerType">
        <span :key="index">
          <span @click="handerClick('type',type)"
                class="type-item"
                :class="{'active':active.type == type}">{{type}}</span>
          <span class="line"
                v-if="index < playerType.length - 1">|</span>
        </span>
      </template>
    </p>
    <p class="type-list">筛选：
      <template v-for="(screen,index) in screens">
        <span :key="index">
          <span @click="handerClick('screen',screen)"
                class="type-item"
                :class="{'active':active.screen == screen}">{{screen}}</span>
          <span class="line"
                v-if="index < screens.length - 1">|</span>
        </span>
      </template>
    </p>
    <div class="player-list">
      <div class="world-con"
           v-infinite-scroll="load"
           :infinite-scroll-disabled="disabled">
        <div class="world-con-item"
             v-for="(item,index) in artists"
             :key="index">
          <div class="item-pic-con">
            <img class="pointer"
                 @click="handerPlayer(item)"
                 :src="item.picUrl+'?param=300y300'">
          </div>
          <a @click="handerPlayer(item)"
             :title="item.name"
             class="title pointer">{{item.name}}</a>
        </div>
        <p v-if="loading"
           class="tip">加载中...</p>
        <p v-if="noMore"
           class="tip">没有更多了</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      languages: ['全部', '华语', '欧美', '日本', '韩国', '其他'],
      playerType: ['全部', '男歌手', '女歌手', '组合乐队'],
      screens: ['热门'],
      category: {
        '入驻歌手': 5001,
        '华语男歌手': 1001,
        '华语女歌手': 1002,
        '华语组合乐队': 1003,
        '欧美男歌手': 2001,
        '欧美女歌手': 2002,
        '欧美组合乐队': 2003,
        '日本男歌手': 6001,
        '日本女歌手': 6002,
        '日本组合乐队 ': 6003,
        '韩国男歌手': 7001,
        '韩国女歌手': 7002,
        '韩国组合乐队': 7003,
        '其他男歌手': 4001,
        '其他女歌手': 4002,
        '其他组合乐队': 4003
      },
      active: {
        language: '全部',
        type: '全部',
        screen: '热门'
      },
      offset: 0,
      loading: true,
      noMore: false,
      artists: []
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    initScreen () {
      for (var i = 0; i < 26; i++) {
        this.screens.push(String.fromCharCode(65 + i))
      }
    },
    handerClick (type, data) {
      this.active[type] = data
      this.offset = 0
      this.getPlayers(true)
    },
    async getPlayers (status = false) {
      let params = {
        offset: this.offset
      }
      let { language, type, screen } = this.active
      params.cat = this.category[language + type] || 5001
      if (screen != '热门') {
        params.initial = screen.toLowerCase()
      }
      let data = await this.$ajaxGet('artistList', params)
      setTimeout(() => {
        this.loading = false
        if (data.artists.length == 0) {
          this.noMore = true
        }
        if (status) {
          this.artists = data.artists
        } else {
          this.artists.push(...data.artists)
        }
      }, 500)
    },
    load () {
      this.loading = true
      this.offset++
      this.getPlayers()
    },
    handerPlayer (item) {
      console.log(item)
      this.$router.push({
        path: '/playinfo',
        query: { id: item.id }
      })
    }
  },
  mounted () {
    this.getPlayers()
  },
  created () {
    this.initScreen()
  }
}
</script>

<style lang="scss">
.player-container {
  width: 100%;
  height: 100%;
  .type-list {
    font-size: 12px;
    color: darkgray;
    margin-bottom: 10px;
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
        width: 140px;
        height: 160px;
        margin-right: 16px;
        margin-bottom: 20px;
        &:nth-child(6n + 0) {
          margin-right: 0;
        }
        .item-pic-con {
          position: relative;
          width: 140px;
          height: 140px;
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
          font-size: 12px;
          line-height: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 169px;
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
