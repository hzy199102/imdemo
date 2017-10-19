import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login.vue'
import im from '@/components/im/im.vue'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/im',
      name: 'im',
      component: im
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
