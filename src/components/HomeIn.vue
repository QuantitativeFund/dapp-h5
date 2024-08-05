<template>
  <van-pull-refresh v-model="loading1" @refresh="load1" style="min-height: 80vh;">
    <van-tabs sticky animated swipeable v-model:active="active">
      <van-tab title="个人信息">
        <van-cell-group inset>
          <van-cell title="当前地址" :value="addrFormat(user.address)">
            <template #icon>
              <van-icon name="location-o" color="blue" class="cell_icon" />
            </template>
            <template #right-icon>
              <AddressCopy :address="user.address"></AddressCopy>
            </template>
          </van-cell>
          <van-cell title="链接地址" :value="addrFormat(user.p_address)">
            <template #icon>
              <van-icon name="cluster-o" color="red" class="cell_icon" />
            </template>
            <template #right-icon>
              <AddressCopy :address="user.p_address"></AddressCopy>
            </template>
          </van-cell>
          <van-cell title="链接数量" :value="childs1.length" >
            <template #icon>
              <van-icon name="friends-o" color="green" class="cell_icon" />
            </template>
          </van-cell>
          <van-cell icon="location-o" title="BNB" :value="BigNumber(1.1).toFixed(6)">
            <template #icon>
              <img src="/bnb.png" class="cell_icon" alt="bnb">
            </template>
          </van-cell>
          <van-cell icon="location-o" title="USDT" :value="BigNumber(1.2).toFixed(6)" >
            <template #icon>
              <img src="/usdt.png" class="cell_icon" alt="usdt">
            </template>
          </van-cell>
          <van-cell icon="location-o" title="QFT" :value="BigNumber(1.3).toFixed(6)" >
            <template #icon>
              <img src="/usdt.png" class="cell_icon" alt="qft">
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待连接">
        <template v-for="obj, key in childs0" :key="key">
          <van-cell-group inset :border="false">
            <van-cell :title="t('HomeIn.miner_address')" :value="addrFormat(obj.c_addr)" :border="false">
              <template #right-icon>
                <AddressCopy :address="obj.c_addr"></AddressCopy>
              </template>
            </van-cell>
            <van-cell :title="t('Common.time')" :value="timeFormat(obj.sign_utc)" :border="false" />
            <van-button round @click="bind(obj.sign, obj.c_addr, obj.id)">{{
              t('HomeIn.binding') }}</van-button>
          </van-cell-group>
        </template>
      </van-tab>
      <van-tab title="已链接">
        <template v-for="obj, key in childs1" :key="key">
          <van-cell-group inset class="invitation-information" :border="false">
            <van-cell :title="getTitle(obj)" class="invitation-informationOne" :border="false"></van-cell>
            <van-cell :title="t('Common.address')" :value="addrFormat(obj)" class="invitation-informationTwo"
              :border="false">
              <template #right-icon>
                <AddressCopy :address="obj"></AddressCopy>
              </template>
            </van-cell>
          </van-cell-group>
        </template>
      </van-tab>
    </van-tabs>

  </van-pull-refresh>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
import { ethers } from 'ethers';

import { config } from '@/const/config';
import { InitUser, addrFormat, timeFormat } from '@/utils/helper.js';
import { userStore } from '@/stores/user.js';
import BigNumber from 'bignumber.js';
import AddressCopy from '@/components/AddressCopy.vue';
import { useI18n } from "vue-i18n";
import { onMounted } from 'vue';
import { Provider, Singer } from "@/utils/metamask.js";
const { t } = useI18n();

const user = userStore();
const active = ref(0);

const loading0 = ref(false);
const childs0 = ref([]);

const loading1 = ref(false);
const childs1 = ref([]);

function getTitle(key) {
  if (key == 0) {
    return t('HomeIn.inviter_information'); //'邀请者信息';
  } else if (key == 1) {
    return t('HomeIn.self_information');// '自身信息';
  } else {
    // 被邀请者信息
    return `${t('HomeIn.invitee_information')}-${key - 1}`;
  }
}

async function load0() {
  const ret = await axios.get(`${config.api}friends/childs/${user.address}/0`);
  childs0.value = ret.data;
  loading0.value = false;
}

async function load1() {
  try {
    const popularized = new ethers.Contract(config.popularized_addr, config.popularized, Provider);
    popularized.spreads(user.address).then((ret) => {
      childs1.value = ret.child;
      loading1.value = false;
    })
  } catch (error) {
    console.log(error)
  }
}

async function bind(sign, c_addr, id) {
  if (childs1.value.length >= 36) {
    //showFailToast('被邀请者不能多余36个');
    showFailToast(t('HomeIn.bind_prompt'));
    return;
  }

  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  const v = '0x' + sign.substring(130);
  const r = sign.substring(0, 66);
  const s = '0x' + sign.substring(66, 130);

  const w = Singer;
  const popularized = new ethers.Contract(config.popularized_addr, config.popularized, w);
  const tx = await popularized.popularize1(c_addr, v, r, s);
  tx.wait().then(async () => {
    await axios.put(`${config.api}friends/${id}`);
    await load0();
    await load1();
    showSuccessToast(t('HomeIn.bind_success'));
  });
  showSuccessToast(t('Common.submitOK'));
}

load0();
load1();

</script>