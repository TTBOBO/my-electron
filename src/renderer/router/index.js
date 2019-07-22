import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'main',
    component: require('@/views/main.vue').default,
    redirect: '/findMusic',
    children: [{
      path: '/play',
      name: 'main',
      component: require('@/views/PlayMusic.vue').default
    }, {
      path: '/findMusic',
      name: 'findMusic',
      component: require('@/views/findMusic/index.vue').default
    }, {
      path: '/playList',
      name: 'playList',
      component: require('@/views/findMusic/PlayList.vue').default
    }, {
      path: '/playinfo',
      name: 'playinfo',
      component: require('@/views/findMusic/PlayInfo.vue').default
    }, {
      path: '/scnn',
      name: 'scnn',
      component: require('@/views/localMusic/index.vue').default
    }, {
      path: '/download',
      name: 'download',
      component: require('@/views/download/index.vue').default
    }]
  }, {
    path: '/lyric',
    name: 'lyric',
    component: require('@/views/lyric.vue').default
  }, {
    path: '*',
    redirect: '/'
  } ]
})
