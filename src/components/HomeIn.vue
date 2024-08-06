<template>
  <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
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
              <van-icon name="friends-o" color="red" class="cell_icon" />
            </template>
            <template #right-icon>
              <AddressCopy :address="user.p_address"></AddressCopy>
            </template>
          </van-cell>
          <van-cell title="链接数量" :value="childs1.length">
            <template #icon>
              <van-icon name="cluster-o" color="green" class="cell_icon" />
            </template>
          </van-cell>
          <van-cell icon="location-o" title="BNB" :value="BigNumber(user.BNB).toFixed(6)">
            <template #icon>
              <img src="/bnb.png" class="cell_icon" alt="bnb">
            </template>
          </van-cell>
          <van-cell icon="location-o" title="USDT" :value="BigNumber(user.USDT).toFixed(6)">
            <template #icon>
              <img src="/usdt.png" class="cell_icon" alt="usdt">
            </template>
          </van-cell>
          <van-cell icon="location-o" title="QFT" :value="BigNumber(user.QFT).toFixed(6)">
            <template #icon>
              <img src="/qft.svg" class="cell_icon" alt="qft">
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待连接">
        <van-empty description="无数据" v-show="childs0.length == 0" />
        <template v-for="obj, key in childs0" :key="key">
          <van-cell-group inset>
            <van-cell title="申请地址" :value="addrFormat(obj.c_addr)">
              <template #icon>
                <van-icon name="friends-o" color="red" class="cell_icon" />
              </template>
              <template #right-icon>
                <AddressCopy :address="obj.c_addr"></AddressCopy>
              </template>
            </van-cell>
            <van-cell title="申请时间" :value="timeFormat(obj.sign_utc)">
              <template #icon>
                <van-icon name="underway-o" color="green" class="cell_icon" />
              </template>
            </van-cell>
            <van-cell>
              <template #value>
                <van-button type="primary" round @click="bind(obj.sign, obj.c_addr, obj.id)">绑定</van-button>
              </template>
            </van-cell>
          </van-cell-group>
        </template>
      </van-tab>
      <van-tab title="已链接">
        <van-empty description="无数据" v-show="childs1.length == 0" />
        <template v-for="obj, key in childs1" :key="key">
          <van-cell-group inset>
            <van-cell :title="key + 1">
              <template #icon>
                <van-icon name="cluster-o" color="green" class="cell_icon" />
              </template>
            </van-cell>
            <van-cell title="链接地址" :value="addrFormat(obj)">
              <template #icon>
                <van-icon name="friends-o" color="red" class="cell_icon" />
              </template>

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
import { Provider, Singer } from "@/utils/metamask.js";
const { t } = useI18n();

const user = userStore();
const active = ref(0);

const loading = ref(false);
const childs0 = ref([]);
const childs1 = ref([]);

async function load() {
  await load0();
  await load1();
  loading.value = false;
}

async function load0() {
  const ret = await axios.get(`${config.api}friends/childs/${user.address}/0`);
  childs0.value = ret.data;
}

async function load1() {
  try {
    const popularized = new ethers.Contract(config.popularized_addr, config.popularized, Provider);
    popularized.spreads(user.address).then((ret) => {
      childs1.value = ret.child;
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
    load();
    showSuccessToast(t('HomeIn.bind_success'));
  });
  showSuccessToast(t('Common.submitOK'));
}

load();

</script>