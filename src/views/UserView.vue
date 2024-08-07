<template>
  <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
    <van-tabs sticky animated swipeable v-model:active="active">
      <van-tab title="个人收益">
        <van-empty description="无数据" v-show="incomes.length == 0" />
        <template v-for="obj, key in incomes" :key="key">
          <van-cell-group inset>
            <van-cell title="挖矿周期" :value="obj.epoch" />
            <van-cell title="挖矿时间" :value="timeFormat(obj.utc)" />
            <van-cell title="挖矿数量" :value="BigNumber(obj.mint).toFixed(4)" />
          </van-cell-group>
          <br />
        </template>
      </van-tab>
      <van-tab title="基金收益">
        <van-empty description="无数据" v-show="funds.length == 0" />
        <template v-for="obj, key in funds" :key="key">
          <van-cell-group inset>
            <van-cell title="收益周期" :value="obj.epoch" />
            <van-cell title="收益时间" :value="timeFormat(obj.utc)" />
            <van-cell title="QFT" :value="BigNumber(obj.qft).toFixed(4)" />
            <van-cell title="USDT" :value="BigNumber(obj.usdt).toFixed(4)" />
          </van-cell-group>
          <br/>
        </template>
      </van-tab>
    </van-tabs>
  </van-pull-refresh>
</template>
<script setup>
import { ref } from 'vue';

import axios from "axios";
import { userStore } from '@/stores/user.js';
import { config } from "@/const/config";
import { timeFormat } from "@/utils/helper.js";
import BigNumber from "bignumber.js";

const active = ref(0);
const loading = ref(false);

const user = userStore();
const incomes = ref([]);
const funds = ref([]);


async function load() {
  let ret = await axios.get(`${config.api}user/income/${user.address}`);
  incomes.value = ret.data;

  ret = await axios.get(`${config.api}user/fund`);
  funds.value = ret.data;

  loading.value = false;
}
load();
</script>
