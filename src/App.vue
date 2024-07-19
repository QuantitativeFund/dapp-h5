<template>
  <router-view></router-view>
  <Tabbar v-model="active" placeholder class="tabbar" active-color="#1FAAA8" :border="false">
    <TabbarItem name="friends" to="/friends" class="tabbarItemOne"> 朋友
      <template #icon>
        <img src="./images/gongren.png" style="width: 25px; height: 25px;" alt="">
      </template>
    </TabbarItem>
    <TabbarItem name="mining" to="/mining" class="tabbarItemTwo"> 挖矿
      <template #icon>
        <img src="./images/chanzi.png" style="width: 25px; height: 25px;" alt="">
      </template>
    </TabbarItem>
    <TabbarItem name="activity" to="/activity" class="tabbarItemFour"> 活动
      <template #icon>
        <img src="./images/jiedian.png" style="width: 25px; height: 25px;" alt="">
      </template>
    </TabbarItem>
    <TabbarItem name="user" to="/user" class="tabbarItemFive"> 收益
      <template #icon>
        <img src="./images/user.png" style="width: 25px; height: 25px;" alt="">
      </template>
    </TabbarItem>
  </Tabbar>
</template>

<script setup>
import { ref, } from 'vue';
import { ethers } from 'ethers';
import { Tabbar, TabbarItem } from 'vant';
import { connectMetaMask, getAccount, Provider } from "@/utils/metamask.js";
import { config } from '@/const/config';
import { userStore } from '@/stores/user.js';
const active = ref('friends');

connectMetaMask().then(async () => {
  const user = userStore();
  user.address = (await getAccount())[0];
  const popularized = new ethers.Contract(
    config.popularized_addr,
    config.popularized,
    Provider
  );
  const ret = await popularized.spreads(user.address);
  user.set_paddress(ret.parent);
  //console.log(user.p_address === ret.parent);
})
</script>

<style scoped>
/* 
.tabbar {
  --van-tabbar-background: #f7f8fa;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemOne {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemTwo {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemThree {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemFour {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemFive {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
} */
</style>