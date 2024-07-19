<template>
 与原来的功能相同，保证界面与以前风格不同
</template>

<script setup>
import { ref } from "vue";
import { isAddress, SigningKey } from "ethers";
import { showSuccessToast, showFailToast, showLoadingToast } from "vant";
import axios from "axios";

import { config } from "@/const/config";
import {
  getPopularizeDigest,
  addrFormat,
  timeFormat,
  InitUser,
} from "@/utils/helper.js";
import { userStore } from "@/stores/user.js";
import { ethers } from "ethers";
import { useI18n } from "vue-i18n";
import AddressCopy from "@/components/AddressCopy.vue";

const { t } = useI18n();
const loading = ref(false);
const verifyPassword = ref(false);
const uncancel = ref(true);
const p_addr = ref("");
const password = ref("");

const signs = ref([]);

const user = userStore();

async function load() {
  const ret = await axios.get(`${config.api}friends/signs/${user.address}`);
  signs.value = ret.data;
  //console.log(ret.data)
  loading.value = false;

  InitUser();
}

let op = async () => {};

async function sign() {
  if (!isAddress(p_addr.value)) {
    showFailToast(t("HomeOut.address_error"));
    return;
  }
  const provider = new ethers.JsonRpcProvider(config.rpc);
  const P = new ethers.Contract(
    config.popularized_addr,
    config.popularized,
    provider
  );
  const ret = await P.spreads(p_addr.value);
  if (ret.parent == ethers.ZeroAddress) {
    showFailToast(t("HomeOut.sign_error1"));
    return;
  }
  if (ret.child.length >= 36) {
    showFailToast(t("HomeOut.sign_error2"));
    return;
  }
  if (p_addr.value.toLowerCase() == user.address.toLowerCase()) {
    showFailToast(t("HomeOut.sign_error3"));
    return;
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = "";
      showLoadingToast({
        message: t("Common.submitting"), //'提交中...',
        forbidClick: true,
        duration: 0,
      });

      const digest = await getPopularizeDigest(
        config.chainId,
        config.popularized_addr,
        p_addr.value,
        user.address
      );
      let key = user.privateKey;
      if (key.substring(0, 2) != "0x") {
        key = "0x" + key;
      }
      const sk = new SigningKey(key);
      const { r, s, v } = sk.sign(digest);
      const sign = `${r}${s.slice(2)}${v.toString(16)}`;
      //console.log("sign", sign)
      const obj = {
        sign: sign,
        p_addr: p_addr.value,
      };
      const ret = await axios.post(`${config.api}friends/${user.address}`, obj);
      console.log(ret.data);
      await load();
      //showSuccessToast('签名成功');
      showSuccessToast(t("HomeOut.sing_info1"));
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast('密码错误');
      showFailToast(t("Common.password_error"));
    }
  };
}

load();
</script>

<style scoped>
.box {
  background-color: #202730;
  min-height: 100vh;
  padding: 0 24px;
}
.title {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  color: #EAECEF;
}
.bind-inviter {
  font-size: 14px;
  color: #ADB6C4;
}
.input-address {
  height: 78px;
  background-color: #29313D;
  margin-top: 12px;
  --van-field-input-text-color: #EAECEF;
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
  background-color: #202730;
  border-radius: 22px;
  /* overflow: hidden; */
  padding: 0 24px;
}
.popup-title {
  margin-top: 22px;
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}
.input-password {
  height: 52px;
  border-radius: 8px;
  margin-top: 29px;
  background-color: #29313D;
  color: #555E6B;
  font-size: 17px;
  border-radius: 8px;
  --van-field-input-text-color: #EAECEF;
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
  color: #ADB6C4;
  margin-top: 44px;
}
.bing-content {
  background-color: #29313D;
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
}
.bing-contentOne {
  background-color: #29313D;
  font-size: 12px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}
.bing-contentTwo {
  background-color: #29313D;
  font-size: 12px;
  --van-cell-value-color: #EAECEF;
  --van-cell-text-color: #8D96A4;
}
</style>