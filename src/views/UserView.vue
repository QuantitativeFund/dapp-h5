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

      <van-tab title="捐献管理" v-if="config.admin_addr.toLowerCase() == user.address.toLowerCase()">
        <van-empty description="无数据" v-show="admin_charitable.length == 0" />
        <template v-for="obj, key in admin_charitable" :key="key">
          <van-cell-group inset>
            <van-cell title="捐款金额" :value="obj.usdt" label="USDT">
              <template #icon>
                <van-icon name="cash-o" class="cell_icon" />
              </template>
            </van-cell>
            <van-cell title="捐款时间" :value="timeFormat(obj.utc0)">
              <template #icon>
                <van-icon name="clock-o" class="cell_icon" />
              </template>
            </van-cell>
            <van-cell title="捐款地址" :value="addrFormat(obj.addr)">
              <template #icon>
                <van-icon name="friends-o" color="red" class="cell_icon" />
              </template>

              <template #right-icon>
                <AddressCopy :address="obj.addr"></AddressCopy>
              </template>
            </van-cell>
            <van-cell>
              <template #value>
                <van-space>
                  <van-button v-show="user.U_Approve == false" type="primary" @click="USDT_Approve"
                    size="small">USDT授权</van-button>
                  <van-button type="primary" :disabled="user.U_Approve == false" size="small"
                    @click="confirm(obj.addr, obj.usdt)">捐款确认</van-button>
                </van-space>
              </template>
            </van-cell>
          </van-cell-group>
          <br />
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
import { timeFormat, addrFormat, InitUser } from "@/utils/helper.js";
import BigNumber from "bignumber.js";
import AddressCopy from '@/components/AddressCopy.vue';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
const active = ref(0);
const loading = ref(false);

const user = userStore();
const incomes = ref([]);
const funds = ref([]);
const admin_charitable = ref([]);

async function load() {
  let ret = await axios.get(`${config.api}user/income/${user.address}`);
  incomes.value = ret.data;

  ret = await axios.get(`${config.api}user/fund`);
  funds.value = ret.data;

  loading.value = false;
}
async function confirm(addr, usdt) {
  const value = ethers.parseEther(usdt.toString()) / 2n;
  const USDT = new ethers.Contract(config.usdt_addr, config.erc20, Provider);
  const usdt_v = await USDT.balanceOf(user.address);
  if (value > usdt_v) {
    showFailToast('USDT余额不足');
    return;
  }
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {
    const Charitable = new ethers.Contract(config.charitable_addr, config.charitable, Singer);
    const tx = await Charitable.confirm(addr, value);
    tx.wait().then(async () => {
      load();
      showSuccessToast('成功');
    });
  } catch (err) {
    console.log(err);
    showFailToast('失败');
  }
}

async function USDT_Approve() {
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {
    const USDT = new ethers.Contract(config.usdt_addr, config.erc20, Singer);
    const tx = await USDT.approve(config.charitable_addr, ethers.MaxUint256);
    tx.wait().then(async () => {
      user.set_USDT_approve(true);
      showSuccessToast('授权成功');
    });
  } catch (err) {
    console.log(err);
    showFailToast('授权失败');
  }
}

load();
</script>
