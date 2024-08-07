<template>
  <van-config-provider theme="dark">
    <Particles></Particles>
    <van-popup v-model:show="showTop" position="top">
      <van-cell-group>
        <van-cell title="软件名称" value="量子基金收益系统" label="" />
        <van-cell title="版本" :value="config.version" label="Copyright ©2023~2024" />
        <van-cell title="代币符号" value="QFT">
          <template #right-icon>
            <van-image src="/qft.svg" />
          </template>
        </van-cell>
        <van-cell title="发行量" value="10亿" />
        <van-cell title="官网" value="https://qft.metabasenet.site" />
        <van-cell title="推特" value="qft" />
        <van-cell title="电报" value="qft" />
        <van-cell title="github" value="https://github.com/QuantumFund" />
      </van-cell-group>
    </van-popup>

    <van-nav-bar id="up" @click-left="showTop = true" placeholder title="💰量子基金收益系统💰">
      <template #left>
        <van-image width="40" height="40" src="/qft.svg" />
        <van-tag round plain type="primary">QFT</van-tag>
      </template>
    </van-nav-bar>
    <router-view></router-view>
    <van-tabbar v-model="active" placeholder>
      <van-tabbar-item name="charitable" icon="like-o" to="/charitable">慈善</van-tabbar-item>
      <van-tabbar-item name="friends" icon="friends-o" to="/friends">链接</van-tabbar-item>
      <van-tabbar-item name="mining" icon="diamond-o" to="/mining">挖矿</van-tabbar-item>
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

const active = ref('charitable');
const showTop = ref(false);

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
