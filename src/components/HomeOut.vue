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
        <van-cell title="邀请人地址" :value="addrFormat(obj.p_addr)" class="bing-contentOne" :border="false">
          <template #right-icon>
            <AddressCopy :address="obj.p_addr"></AddressCopy>
          </template>
        </van-cell>

        <van-cell title="申请绑定时间" :value="timeFormat(obj.sign_utc)" class="bing-contentTwo" :border="false" />
      </van-cell-group>
      <br />
    </template>
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";
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
const toggleTheme = () => {
  const root = document.documentElement;
  root.style.setProperty('--color-background', '#edf4ff');
  root.style.setProperty('--color-text', '#2A4057');
  root.style.setProperty('--box-background', '#ffffff');
  localStorage.setItem('theme', 'light');
};
const toggleTheme2 = () => {
  const root = document.documentElement;
  // 切换到深色主题
  root.style.setProperty('--color-background', '#181818');
  root.style.setProperty('--color-text', '#ffffff');
  root.style.setProperty('--box-background', '#262727');
  localStorage.setItem('theme', 'dark');
}
onMounted(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    toggleTheme2();
  } else {
    toggleTheme();
  }
});
</script>

<style scoped>
.box {
  background-color: var(--color-background);
  min-height: 100vh;
  padding: 0 24px;
}

.title {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  color: var(--color-text);
}

.bind-inviter {
  font-size: 14px;
  color: var(--color-text);
}

.input-address {
  height: 78px;
  background-color: var(--box-background);
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-top: 12px;
  --van-field-input-text-color: var(--color-text);
  font-size: 17px;
  position: static;
}

.apply-binding {
  height: 52px;
  background-color: #1FAAA8;
  text-align: center;
  line-height: 52px;
  font-size: 17px;
  color: #EEFBFB;
  margin-top: 42px;
  border-radius: 8px;
}

.popup {
  width: 311px;
  height: 286px;
  background-color: var(--box-background);
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
  border-radius: 22px;
  /* overflow: hidden; */
  padding: 0 24px;
}

.popup-title {
  margin-top: 22px;
  font-size: 18px;
  color: var(--color-text);
  text-align: center;
}

.input-password {
  height: 52px;
  border-radius: 8px;
  margin-top: 29px;
  background-color: var(--box-background);
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
  color: var(--color-text);
  font-size: 17px;
  border-radius: 8px;
  --van-field-input-text-color: var(--color-text);
}

.confirm-btn {
  height: 42px;
  background-color: #1FAAA8;
  font-size: 17px;
  color: #EEFBFB;
  margin-top: 35px;
  text-align: center;
  line-height: 42px;
  border-radius: 8px;
}

.cancel-btn {
  text-align: center;
  margin-top: 25px;
  font-size: 17px;
  color: #1FAAA8;
}

.binding-record {
  font-size: 14px;
  color: var(--color-text);
  margin-top: 44px;
}

.bing-content {
  background-color: var(--box-background);
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
}

.bing-contentOne {
  background-color: var(--box-background);
  font-size: 12px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
}

.bing-contentTwo {
  background-color: var(--box-background);
  font-size: 12px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
}
</style>