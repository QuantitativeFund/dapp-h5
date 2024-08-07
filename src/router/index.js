import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/charitable'
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import("@/views/FriendsView.vue")
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
      path: '/charitable',
      name: 'charitable',
      component: () => import('@/views/CharitableView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/UserView.vue')
    },
  ]
})

export default router

