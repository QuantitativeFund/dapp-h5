<template>
  <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
    <van-tabs sticky animated swipeable v-model:active="active">
      <van-tab title="链接申请">
        <van-cell-group inset>
          <van-field label="链接地址" required maxlength="42" type="textarea" v-model="p_addr" placeholder="请输入链接地址"
            autocomplete="off" />
          <van-cell>
            <template #value>
              <van-button type="primary" round @click="sign">申请</van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="申请记录">
        <van-empty description="无数据" v-show="signs.length == 0" />
        <template v-for="(obj, key) in signs" :key="key">
          <van-cell-group inset>
            <van-cell title="链接地址" :value="addrFormat(obj.p_addr)">
              <template #icon>
                <van-icon name="cluster-o" color="green" class="cell_icon" />
              </template>
              <template #right-icon>
                <AddressCopy :address="obj.p_addr"></AddressCopy>
              </template>
            </van-cell>
            <van-cell title="申请时间" :value="timeFormat(obj.sign_utc)">
              <template #icon>
                <van-icon name="underway-o" color="green" class="cell_icon" />
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
import { ref } from "vue";
import { isAddress, SigningKey } from "ethers";
import { showSuccessToast, showFailToast, showLoadingToast } from "vant";
import axios from "axios";

import { config } from "@/const/config";
import {
  signParams,
  addrFormat,
  timeFormat,
  InitUser,
} from "@/utils/helper.js";
import { userStore } from "@/stores/user.js";
import { ethers } from "ethers";
import { useI18n } from "vue-i18n";
import AddressCopy from "@/components/AddressCopy.vue";
import { Provider } from "@/utils/metamask.js";
const active = ref(0);
const { t } = useI18n();
const loading = ref(false);
const p_addr = ref("");
const signs = ref([]);
const user = userStore();

async function load() {
  const ret = await axios.get(`${config.api}friends/signs/${user.address}`);
  signs.value = ret.data;
  console.log(ret.data)
  loading.value = false;
}

async function sign() {
  if (!isAddress(p_addr.value)) {
    showFailToast("邀请者地址错误");
    return;
  }
  const P = new ethers.Contract(
    config.popularized_addr,
    config.popularized,
    Provider
  );
  const ret = await P.spreads(p_addr.value);
  if (ret.parent == ethers.ZeroAddress) {
    showFailToast("邀请者地址未绑定");
    return;
  }
  if (ret.child.length >= 36) {
    showFailToast("邀请者绑定地址已满36个");
    return;
  }
  if (p_addr.value.toLowerCase() == user.address.toLowerCase()) {
    showFailToast("自己不能给自己签名");
    return;
  }
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0,
  });

  const msgParams = signParams(config.chainId, config.popularized_addr, p_addr.value, user.address);
  console.log(JSON.stringify(msgParams));

  const sign = await window.ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [user.address, JSON.stringify(msgParams)],
  });
  console.log(sign)
  const obj = { sign: sign, p_addr: p_addr.value, };
  const ret0 = await axios.post(`${config.api}friends/${user.address}`, obj);
  console.log(ret0.data);
  await load();
  p_addr.value = "";
  showSuccessToast('签名成功');
}

load();
</script>