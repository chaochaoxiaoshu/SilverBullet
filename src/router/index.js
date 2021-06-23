import Vue from 'vue'
import VueRouter from 'vue-router'
import MyTodo from '../views/MyTodo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Mytodo',
    component: MyTodo
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import( '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
