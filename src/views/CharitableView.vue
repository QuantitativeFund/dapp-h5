<template>
  <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
    <van-tabs sticky animated swipeable v-model:active="active">
      <van-tab title="捐献">

        <van-cell-group inset>
          <van-cell>
            <van-highlight keywords="QFT" source-string="柬埔寨慈善基金会与量子基金QFT合作,一起推出QFT挖矿系统来回报广大社会爱心人士,在量子基金的加持下,相信慈善事业会走的更远..." />
          </van-cell>
        </van-cell-group>
      </van-tab>

      <van-tab title="捐献明细">
        <van-empty description="无数据" v-show="charitable.length == 0" />
        <template v-for="obj, key in charitable" :key="key">
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
            <van-cell title="确定时间" :value="obj.utc1 == 0 ? '?' : timeFormat(obj.utc1)">
              <template #icon>
                <van-icon name="clock-o" :color="obj.utc1 == 0 ? 'red' : 'gold'" class="cell_icon" />
              </template>
            </van-cell>
          </van-cell-group>
          <br />
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
import { timeFormat, addrFormat } from "@/utils/helper.js";
import AddressCopy from '@/components/AddressCopy.vue';
import { ethers } from 'ethers';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
import { useI18n } from "vue-i18n";
import { Provider, Singer } from "@/utils/metamask.js";

const { t } = useI18n();
const active = ref(0);
const loading = ref(false);
const charitable = ref([]);
const admin_charitable = ref([]);
const user = userStore();

async function load() {
  let ret = await axios.get(`${config.api}charitable/user/${user.address}`);
  charitable.value = ret.data;
  ret = await axios.get(`${config.api}charitable/admin/0`);
  admin_charitable.value = ret.data;
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