<template>
  <div class="list-container center-con"
       v-loading="loading">
    <HeaderLine title="官方榜"></HeaderLine>
    <div class="list-box">
      <div class="list-item"
           v-for="(item,index) in listData"
           :key="index">
        <div class="item-top">
          <img class="item-pic"
               :src="item.coverImgUrl" />
          <!-- <div class="item-pic-con">
            <img class="item-pic"
                 :src="index < 4 ? item.coverImgUrl : item" />
            <span class="item-time"></span>
          </div>
          <div class="icon-con">
            <i class="iconfont icon-bofang2"></i>
          </div> -->
        </div>
        <div class="list-item-con">
          <template v-for="(song,_index) in item.tracks">
            <div class="song-con"
                 :key="_index"
                 v-if="_index < 8">
              <span class="num"
                    :class="{'top-num':_index < 3}">{{_index+1}}</span>
              <span class="tag"
                    v-if="index === 0">{{item.trackIds[_index].ratio}}%</span>
              <span class="name pointer"
                    :title="song.name"
                    @click="palyMusic(song)">{{song.name}}</span>
              <span class="singer">{{song.ar[0].name}}</span>
            </div>
          </template>
        </div>
        <div class="seeAll">查看全部</div>
      </div>
    </div>
    <HeaderLine title="全球榜"></HeaderLine>
    <div class="world-con">
      <div class="world-con-item"
           v-for="(item,index) in toplist"
           :key="index">
        <div class="item-pic-con">
          <img :src="item.coverImgUrl"
               alt="description">
          <div class="play-count">{{item.playCount | getNumber}}</div>
        </div>
        <p class="title">{{item.name}}</p>
      </div>
    </div>
  </div>

</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import HeaderLine from '@/components/headerLine'
import base from '@/mixin/base'
export default {
  mixins: [base],
  data () {
    return {
      loading: true,
      listData: [], // 排行榜数据
      toplist: [], // 全球榜单
      currentPlayMusic: {}
    }
  },
  computed: {
    ...mapGetters(['getCurrentPlaylist', 'getAudioEl', 'getCurrentIndex'])
  },
  methods: {
    ...mapMutations(['PUSH_MUSIC_TO_LIST']),
    async init () {
      let data = await Promise.all([this.$ajaxGet('topList', { idx: 3 }), this.$ajaxGet('topList', { idx: 0 }), this.$ajaxGet('topList', { idx: 2 }),
        this.$ajaxGet('topList', { idx: 1 }), this.$ajaxGet('topList', { idx: 4 }), this.$ajaxGet('topList', { idx: 17 })])
      data.forEach((item, index) => {
        if (item.code == 200) {
          this.listData.push(item.playlist)
          // this.listData.push(index != 4 ? item.playlist : item.list);
        }
      })
      let toplist = await this.$ajaxGet('toplist')
      this.toplist = toplist.list
      this.loading = false
    }
  },
  filters: {
    getNumber (val) {
      return parseInt(val / 10000) + '万'
    }
  },
  components: {
    HeaderLine
  },
  created () {
    this.init()
  }
}
</script>

<style lang='scss'>
.list-container {
  width: 100%;
  height: 100%;

  .list-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20px;
    .list-item {
      width: 260px;
      margin-bottom: 20px;
      .item-top {
        width: 100%;
        height: 100px;
        display: flex;
        .item-pic-con {
          width: 200px;
          position: relative;
          .item-pic {
          }
          .item-time {
            position: absolute;
            font-size: 12px;
            color: #fff;
          }
        }
        .icon-con {
          width: 50px;
          height: 50px;
          border: 1px solid #fff;
          border-radius: 50%;
          font-size: 18px;
          margin: auto;
          text-align: center;
          line-height: 50px;
        }
      }
      .item-pic {
        width: 100%;
        height: 100px;
        object-fit: cover;
      }
      .list-item-con {
        .song-con {
          display: flex;
          font-size: 12px;
          line-height: 20px;
          padding: 5px 10px;
          &:nth-child(odd) {
            background: #f4f4f4;
          }
          .num {
            font-size: 14px;
            margin-right: 2px;
          }
          .top-num {
            color: $base-color !important;
          }
          .tag {
            color: #bbb;
            margin-right: 2px;
            transform: scale(0.8);
          }
          .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 130px;
            margin-right: 2px;
          }
          .singer {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-right: 2px;
          }
        }
      }
      .seeAll {
        height: 40px;
        text-align: right;
        line-height: 40px;
        background: #f4f4f4;
        font-size: 14px;
        padding-right: 10px;
      }
    }
  }
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
      }
    }
  }
}
</style>
