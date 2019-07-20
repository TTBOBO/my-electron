<template>
  <div class="header-line">
    <span class="title"
          v-if="title">{{title}}</span>
    <template v-if="titleArr">
      <span class="title-one pointer"
            :class="{active:currentId == item.id}"
            @click="handerTitle(index,item.id)"
            v-for="(item,index) in titleArr"
            :key="index">{{item.name}}</span>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentId: 0
    }
  },
  props: {
    title: String,
    titleArr: {
      type: Array,
      default: () => []
    },
    currentIndex: [String, Number]
  },
  methods: {
    handerTitle (index, id) {
      this.currentId = id
      this.$emit('changeType', this.titleArr[index])
    }
  },
  mounted () {
    this.currentId = this.currentIndex
  },
  watch: {
    currentIndex (newV) {
      this.currentId = this.currentIndex
    }
  }
}
</script>

<style lang="scss">
.header-line {
  position: relative;
  width: 100%;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  height: 35px;
  .title {
    position: relative;
    display: inline-block;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    font-size: 18px;
    margin-right: 10px;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 1px;
      background: $base-color;
    }
  }
  .title-one {
    position: relative;
    display: inline-block;
    height: 35;
    line-height: 35px;
    font-size: 14px;
    margin-right: 10px;
  }
  .active {
    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 1px;
      background: $base-color;
    }
  }
}
</style>
