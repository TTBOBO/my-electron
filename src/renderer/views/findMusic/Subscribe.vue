<template>
  <div class="subscribe-container">
    <div class="subscriber-item"
         v-for="(item,index) in subscriveArr"
         :key='index'>
      <img class="auth-pic"
           :src="item.avatarUrl" />
      <p class="title">{{item.nickname}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      offset: '',
      subscriveArr: []
    }
  },
  props: {
    id: [Number, Object]
  },
  methods: {
    async initSubscribeData () {
      let data = await this.$ajaxGet('subscribers', {
        id: this.id,
        limit: 30,
        offset: this.offset
      })
      this.subscriveArr.push(...data.subscribers);
    }
  },
  mounted () {
    this.initSubscribeData();
    console.log(this.id);
  }
}
</script>

<style lang='scss'>
.subscribe-container {
  max-width: 920px;
  min-width: 920px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .subscriber-item {
    width: 120px;
    margin-right: 64px;
    &:nth-child(5n + 0) {
      margin-right: 0;
    }
    .auth-pic {
      width: inherit;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .title {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 12px;
      text-align: center;
    }
    margin-bottom: 30px;
  }
}
</style>
