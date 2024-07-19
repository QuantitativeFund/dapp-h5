<template>
  <iframe id="dapp" :src="dapp_url"></iframe>
  <van-dialog
    v-model:show="verifyPassword"
    :title="t('Common.password_authentication')"
    show-cancel-button
    @confirm="op"
  >
    <van-field
      v-model="password"
      type="password"
      :label="t('Common.password')"
      :placeholder="t('Common.password_placeholder')"
      autocomplete="off"
    />
  </van-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "@/stores/user.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showFailToast } from "vant";
import { ethers } from "ethers";
const { t } = useI18n();

const router = useRouter();
const user = userStore();
const verifyPassword = ref(false);
const password = ref("");

function mnt_prompt() {
  if (ethers.parseEther(user.MNT) < ethers.parseEther("0.1")) {
    showFailToast(t("Common.mnt_prompt"));
    return true;
  }
  return false;
}

const dapp_url = ref("");
dapp_url.value = `https://mnt.metabasenet.site?t=${new Date().getTime()}`;

let op = async () => {};

window.addEventListener("message", (event) => {
  const iframe = document.getElementById("dapp");
  if (mnt_prompt()) {
    iframe.contentWindow.postMessage("err", "*");
    return;
  }
  if (event.data == "getKey") {
    verifyPassword.value = true;
    op = async () => {
      if (password.value == user.password) {
        iframe.contentWindow.postMessage(user.privateKey, "*");
      } else {
        iframe.contentWindow.postMessage("err", "*");
      }
    };
  } else if (event.data == "getAddr") {
    iframe.contentWindow.postMessage(user.address, "*");
  } else if (event.data == "In") {
    user.set_dapp("In");
  } else if (event.data == "Out") {
    user.set_dapp("Out");
    router.push("/friends");
  }
});

onMounted(() => {
  const iframe = document.getElementById("dapp");
  iframe.style.height = document.documentElement.clientHeight + "px";
});
</script> 

<style scoped>
#dapp {
  border: none;
  width: 100vw;
  height: 100vh; 
}
</style>
