<template>
  
 <div class="box">
    <div class="title">朋友</div>
    <div class="bind-inviter">绑定邀请人，请输入邀请人地址</div>
    <van-field required maxlength="42" type="textarea" v-model="p_addr" :placeholder="t('HomeOut.address_placeholder')"
               autocomplete="off" class="input-address" :border="false" />
    <div class="apply-binding" @click="sign">申请绑定</div>
    <div class="binding-record">申请绑定记录</div>
    <template v-for="(obj, key) in signs" :key="key">
      <van-cell-group class="bing-content" :border="false" inset>
        <van-cell title="邀请人地址" :value="addrFormat(obj.p_addr)" class="bing-contentOne"
                  :border="false">
          <template #right-icon>
            <AddressCopy :address="obj.p_addr"></AddressCopy>
          </template>
        </van-cell>

        <van-cell title="申请绑定时间" :value="timeFormat(obj.sign_utc)"
                  class="bing-contentTwo" :border="false" />
      </van-cell-group>
      <br />
    </template>
  </div>

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
  showSuccessToast('签名成功');
}

load();
</script>

<style scoped>
</style>