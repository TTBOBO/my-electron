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
        component: require('@/views/PlayMusic.vue').default,
      }, {
        path: '/findMusic',
        name: 'findMusic',
        component: require('@/views/findMusic/index.vue').default,
      }, {
        path: '/playList',
        name: 'playList',
        component: require('@/views/findMusic/PlayList.vue').default,
      }]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})