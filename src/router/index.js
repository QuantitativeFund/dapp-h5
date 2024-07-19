import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/friends'
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/views/FriendsView.vue')
    },
    {
      path: '/mining',
      name: 'mining',
      component: () => import('@/views/MiningView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/views/ActivityView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/UserView.vue')
    },
  ]
})

export default router

