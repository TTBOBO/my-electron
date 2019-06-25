<template>
  <div ref="wrapper"
       class="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      scroll: null
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    musicData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    scrollEnd: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    initScroll () {
      if (!this.$refs.wrapper) return;
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: this.click,
        probeType: this.probeType,
        bounce: false,
        scrollbar: true
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          console.log(pos)
        })
      }
      if (this.scrollEnd) {
        this.scroll.on('scrollEnd', (pos) => {
          console.log(pos)
        })
      }

    },
    scrollToElement (el, time) {
      this.scroll.scrollToElement(el, time);
    },
    refresh () {
      this.scroll.refresh();
    },
    scrollTo (x, y, time) {
      this.scroll.scrollTo(x, y, time);
    }
  },
  mounted () {
    this.initScroll();
  },
  watch: {
    musicData () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style lang='scss'>
.wrapper {
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 5;
}
</style>
