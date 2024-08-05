<template>
  <Particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded" :options="options" />

  <router-view></router-view>
  <van-tabbar v-model="active" placeholder>
    <van-tabbar-item name="friends" icon="friends-o" to="/friends">链接</van-tabbar-item>
    <van-tabbar-item name="mining" icon="diamond-o" to="/mining">挖矿</van-tabbar-item>
    <van-tabbar-item name="charitable" icon="like-o" to="/charitable">慈善</van-tabbar-item>
    <van-tabbar-item name="user" icon="chart-trending-o" to="/user">收益</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>

import { ref, } from 'vue';
import { ethers } from 'ethers';
import { loadFull } from "tsparticles";

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
    console.log("====", ret.parent);
  });

})

const options = {
  background: {
    color: {
      value: '#2d3a4b'
    }
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: false,
        mode: 'push'
      },
      onHover: {
        enable: false,
        mode: 'repulse'
      },
      resize: false
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: '#0d47a1'
    },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    collisions: {
      enable: true
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce'
      },
      random: false,
      speed: 2,
      straight: false
    },
    number: {
      density: {
        enable: true,
        area: 800
      },
      value: 80
    },
    opacity: {
      value: 0.5
    },
    shape: {
      type: 'circle'
    },
    size: {
      value: { min: 1, max: 5 },
    }
  },
  detectRetina: true
}

const particlesInit = async engine => {
  //console.log(engine,loadFull)
  await loadFull(engine);
};

const particlesLoaded = async container => {
  console.log("Particles container loaded", container);
};

</script>

<style>
.van-cell__value {
  min-width: 65%;
}

.cell_icon {
  width: 16px;
  height: 16px;
  margin-top: 4px;
  margin-right: 4px;
}

</style>
