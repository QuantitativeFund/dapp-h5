<template>
  <div style="min-height: 100vh" class="box">
    <div class="nav">
      <div class="nav-left"><img src="../images/tb-head-FanHui.png" alt="" @click="back()"></div>
      <div class="nav-right" @click="createPage">{{ t('Wallet.create_wallet') }}</div>
    </div>
    <div class="wallet-import">{{ t('Wallet.import_wallet') }}</div>
    <div class="wallet-name">{{ t('Wallet.wallet_name') }}</div>
    <van-field v-model="walletName" :placeholder="t('Wallet.name_prompt')" autocomplete="off" class="input-text"
      :border="false" />
    <div class="wallet-password">{{ t('Wallet.password_prompt1') }}</div>
    <van-field v-model="password" :type="passwordType" :name="t('Wallet.password')"
      :placeholder="t('Wallet.password_prompt2')" :rules="[{ required: true, message: t('Wallet.password_prompt2') }]"
      autocomplete="off" class="input-password" :border="false">
      <template #right-icon>
        <span @click="switchPasswordType">
          <van-icon name="closed-eye" v-if="passwordType === 'password'" size="32" color="#1FAAA8" />
          <van-icon name="eye" v-else size="32" color="#1FAAA8" />
        </span>
      </template>
    </van-field>
    <div class="wallet-hint">{{ t('Wallet.prompt') }}</div>
    <van-field v-model="promptInfo" :placeholder="t('Wallet.prompt_prompt1')" autocomplete="off" class="input-hint"
      :border="false" />
    <div class="switch">
      <div :class="switch_left" @click="mnemonicImport">{{ t('Wallet.import_mnemonic') }}</div>
      <div :class="switch_right" @click="keyImport">{{ t('Wallet.import_key') }}</div>
    </div>
    <van-cell class="switch-import" :border="false">
      <van-field v-if="importWay == '1'" autosize v-model="mnemonic" :placeholder="t('Wallet.mnemonic_prompt')"
        type="textarea" autocomplete="off" class="key-import" :border="false" />
      <van-field v-else v-model="privateKey" :placeholder="t('Wallet.key_prompt')" type="textarea" autosize
        autocomplete="off" class="mnemonic-import" :border="false" />
    </van-cell>
    <div class="button" @click="create">{{ t('Wallet.import_wallet') }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showFailToast, showSuccessToast, showLoadingToast } from "vant";
import { ethers } from "ethers";
import { useI18n } from "vue-i18n";
import { userStore } from "@/stores/user.js";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();
const walletName = ref("");
const passwordType = ref("password");
const password = ref("");
// const password2 = ref("");
const promptInfo = ref("");
const importWay = ref("1");
const mnemonic = ref("");
const privateKey = ref("");
const switch_left = ref('switch_left')
const switch_right = ref('switch_right')
function switchPasswordType() {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
}

function back() {
  const user = userStore();
  if (ethers.isAddress(user.address)) {
    router.push("/user");
  } else {
    //showFailToast("请完成钱包的创建");
    showFailToast(t("Wallet.return_prompt1"));
  }
}

async function create() {
  if (walletName.value.trim() === "") {
    //showFailToast("请输入钱包名称");
    showFailToast(t("Wallet.name_prompt"));
    return;
  }
  if (password.value.trim() === "") {
    //showFailToast("请输入密码");
    showFailToast(t("Wallet.password_prompt2"));
    return;
  }
  if (password.value.trim().length < 6) {
    //showFailToast("最少输入6位密码");
    showFailToast(t("Wallet.create_prompt1"));
    return;
  }
  // if (password.value.trim() !== password2.value.trim()) {
  //   //showFailToast("请输入正确的密码");
  //   showFailToast(t("Wallet.create_prompt2"));
  //   return;
  // }
  let HD = null;
  if (importWay.value === "1") {
    try {
      HD = ethers.Wallet.fromPhrase(mnemonic.value);
    } catch (e) {
      //showFailToast("导入失败");
      showFailToast(t("Common.failed"));
      return;
    }
  }
  if (importWay.value === "2") {
    try {
      HD = new ethers.Wallet(privateKey.value);
    } catch (e) {
      //showFailToast("导入失败");
      showFailToast(t("Common.failed"));
      return;
    }
  }
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  });
  const user = userStore();
  user.wallets.push({
    mnemonic: user.mnemonic,
    address: user.address,
    privateKey: user.privateKey,
    password: user.password,
    p_address: user.p_address,
    USDT: user.USDT,
    MNT: user.MNT,
    USDT_approve: user.USDT_approve,
    walletName: user.walletName,
    promptInfo: user.promptInfo,
    last_vote: user.last_vote,
  });
  user.index = user.wallets.length - 1;
  if (importWay.value === "1") {
    user.set_mnemonic(HD.mnemonic.phrase);
  } else {
    user.set_mnemonic("");
  }
  user.set_privateKey(HD.privateKey);
  //console.log('HD.privateKey',HD.privateKey)
  user.set_address(HD.address);
  user.set_password(password.value);
  user.set_walletName(walletName.value);
  user.set_promptInfo(promptInfo.value);
  //showSuccessToast("导入成功");
  showSuccessToast({
    message: t("Common.success"),
    className: 'custom-toast'
  });
  router.push("/friends");
}
function init() {
  switch_left.value = "switch_left_selected"
}
init()
function mnemonicImport() {
  importWay.value = "1"
  switch_right.value = "switch_right"
  switch_left.value = "switch_left_selected"
}
function keyImport() {
  importWay.value = "2"
  switch_left.value = "switch_left"
  switch_right.value = "switch_right_selected"
}
function createPage() {
  router.push('create')
}
</script>
<style scoped>
.box {
  background-color: var(--color-background);
  padding: 0 24px;
}

.nav {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  width: 56px;
  height: 42px;
  text-align: left;
}

.nav-right {
  color: #1FAAA8;
  font-size: 16px;
}

.wallet-import {
  font-size: 18px;
  color: var(--color-text);
}

.wallet-name {
  color: var(--color-text);
  ;
  font-size: 14px;
  margin-top: 36px;
}

.input-text {
  height: 52px;
  border-radius: 8px;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 12px 0 0;
  font-size: 17px;
  color: #555E6B;
  position: static;
  --van-field-input-text-color: #EAECEF;
}

.wallet-password {
  font-size: 14px;
  color: var(--color-text);
  margin-top: 18px;
}

.input-password {
  height: 52px;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 12px;
  border-radius: 8px;
  font-size: 17px;
  color: #555E6B;
  position: static;
  --van-field-input-text-color: #EAECEF;
}

.wallet-hint {
  font-size: 14px;
  color: var(--color-text);
  margin-top: 18px;
}

.input-hint {
  height: 52px;
  font-size: 17px;
  color: var(--color-text);
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 12px;
  position: static;
  --van-field-input-text-color: var(--color-text);
}

.switch {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text);
}

.switch_left {
  width: 156px;
  height: 34px;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  line-height: 34px;
}

.switch_left_selected {
  width: 156px;
  height: 34px;
  background-color: #1FAAA8;
  border-radius: 8px;
  text-align: center;
  line-height: 34px;
  color: #fff;
}

.switch_right {
  width: 156px;
  height: 34px;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  line-height: 34px;
}

.switch_right_selected {
  width: 156px;
  height: 34px;
  background-color: #1FAAA8;
  border-radius: 8px;
  text-align: center;
  line-height: 34px;
  color: #fff;
}

.switch-import {
  margin-top: 16px;
  /* height: 70px; */
  border-radius: 8px;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: static;
}

.key-import {
  height: 90px;
  border-radius: 8px;
  background-color: var(--box-background);
  position: static;
  --van-field-input-text-color: var(--color-text);
  /* --van-field-text-area-min-height: 200px; */
}

.mnemonic-import {
  height: 90px;
  border-radius: 8px;
  background-color: var(--box-background);
  position: static;
  --van-field-input-text-color: var(--color-text);
}

.button {
  height: 52px;
  border-radius: 8px;
  background-color: #1FAAA8;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 52px;
  margin-top: 35px;
}

/* .btn_a {
  justify-content: space-evenly;
} */
</style>
