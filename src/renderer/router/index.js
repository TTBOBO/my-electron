import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'main',
      component: require('@/views/main.vue').default,
      redirect: '/play',
      children: [{
        path: '/play',
        name: 'main',
        component: require('@/views/playMusic.vue').default,
      }]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})