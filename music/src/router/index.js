import Vue from 'vue'
import Router from 'vue-router'
import admin from '@/pages/admin/index'
import index from '@/pages/index/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    }
  ]
})
