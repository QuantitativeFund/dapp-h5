<template>
   <HomeIn v-if="user.p_address != ZeroAddress" />
   <HomeOut v-else />
</template>

<script setup>
import { ZeroAddress } from 'ethers'
import HomeIn from '@/components/HomeIn.vue'
import HomeOut from '@/components/HomeOut.vue'
import { userStore } from '@/stores/user.js'
//import { useRouter } from 'vue-router'

const user = userStore()
//const router = useRouter()
//console.log(user.p_address, ZeroAddress)
</script>