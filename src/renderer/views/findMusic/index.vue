<template>
  <div class="find-container">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="个性推荐" name="个性推荐">
        <!-- <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in 6" :key="item">
            <h3 class="medium">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel> -->
      </el-tab-pane>
      <el-tab-pane label="歌单" name="歌单">歌单</el-tab-pane>
      <el-tab-pane label="电台" name="电台">电台</el-tab-pane>
      <el-tab-pane label="排名榜" name="排名榜">排名榜</el-tab-pane>
      <el-tab-pane label="歌手" name="歌手">歌手</el-tab-pane>
      <el-tab-pane label="最新音乐" name="最新音乐">最新音乐</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  data () {
    return {
      activeName:"个性推荐"
    }
  },
  methods: {
    async init () {
      let newSongData = await this.$ajaxGet('newsong');
      console.log(newSongData);
    }
  },
  mounted () {
    this.init();

  }
}
</script>

<style lang="scss">
.find-container{
  padding: 0 20px;
}
</style>
