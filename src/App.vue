<template>
  <van-config-provider theme="dark">
    <Particles></Particles> 
    <router-view></router-view>
    <van-tabbar v-model="active" placeholder>
      <van-tabbar-item name="friends" icon="friends-o" to="/friends">链接</van-tabbar-item>
      <van-tabbar-item name="mining" icon="diamond-o" to="/mining">挖矿</van-tabbar-item>
      <van-tabbar-item name="charitable" icon="like-o" to="/charitable">慈善</van-tabbar-item>
      <van-tabbar-item name="user" icon="chart-trending-o" to="/user">收益</van-tabbar-item>
    </van-tabbar>
  </van-config-provider>
</template>

<script setup>

import Particles from '@/components/Particles.vue';
import { ref, } from 'vue';
import { ethers } from 'ethers';

import { InitUser } from "@/utils/helper.js";
import { connectMetaMask, getAccount, Provider } from "@/utils/metamask.js";

import { config } from '@/const/config';
import { userStore } from '@/stores/user.js';
const active = ref('friends');

connectMetaMask().then(async () => {

  const user = userStore();
  user.set_address((await getAccount())[0]);
  const popularized = new ethers.Contract(
    config.popularized_addr,
    config.popularized,
    Provider
  );
  popularized.spreads(user.address).then((ret) => {
    user.set_paddress(ret.parent);
    InitUser();
    console.log("====", ret.parent);
  });
})
</script>

<style>
.van-cell__value {
  min-width: 60%;
}

.cell_icon {
  width: 16px;
  height: 16px;
  margin-top: 4px;
  margin-right: 4px;
}
</style>
