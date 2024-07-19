import { createRouter, createWebHistory } from 'vue-router'
import WalletCreate from '@/views/WalletCreate.vue'
import WalletImport from '@/views/WalletImport.vue'
import WalletNew from '@/views/WalletNew.vue'
import MntView from '@/views/MntView.vue'
import UsdtView from '@/views/UsdtView.vue'
import MntTransfer from '@/views/MntTransfer.vue'
import UsdtTransfer from '@/views/UsdtTransfer.vue'
import CionTopup from '@/views/CionTopup.vue'
import WithdrawCoin from '@/views/WithdrawCoin.vue'
import EarningsRecord from '@/views/EarningsRecord.vue'
import PurchaseHistory from '@/views/PurchaseHistory.vue'

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
      path: '/buy',
      name: 'buy',
      component: () => import('@/views/BuyView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/UserView.vue')
    },
    {
      path: '/usdt_info',
      name: 'usdt_info',
      components: {
        wallet: UsdtView,
      },
    },
    {
      path: '/mnt_info',
      name: 'mnt_info',
      components: {
        wallet: MntView,
      },
    },
    {
      path: '/import',
      name: 'import',
      components: {
        wallet: WalletImport,
      },
    },
    {
      path: '/create',
      name: 'create',
      components: {
        wallet: WalletCreate,
      },
    },
    {
      path: '/wallet',
      name: 'wallet',
      components: {
        wallet: WalletNew,
      },
    },
    {
      path: '/mnt',
      name: 'mnt',
      components: {
        wallet: MntTransfer
      }
    },
    {
      path: '/usdt',
      name: 'usdt',
      components: {
        wallet: UsdtTransfer
      }
    },
    {
      path: '/topup',
      name: 'topup',
      components: {
        wallet: CionTopup
      }
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      components: {
        wallet: WithdrawCoin
      }
    },
    {
      path: '/income',
      name: 'income',
      components: {
        wallet: EarningsRecord
      }
    },
    {
      path: '/purchase',
      name: 'purchase',
      components: {
        wallet: PurchaseHistory
      }
    },
  ]
})

export default router

