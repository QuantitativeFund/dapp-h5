<template>
  
</template>

<script setup>
import { ref } from "vue";
import {
  showSuccessToast,
  showFailToast,
  showLoadingToast /*showConfirmDialog*/,
  Locale
} from "vant";
import { useRouter } from "vue-router";
import { ethers, parseEther, isAddress } from "ethers";
import axios from "axios";
import BigNumber from "bignumber.js";
import { userStore } from "@/stores/user.js";
import {
  InitUser,
  addrFormat,
} from "@/utils/helper.js";
import { config } from "@/const/config";
import AddressCopy from "@/components/AddressCopy.vue";
import { useI18n } from "vue-i18n";
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
const { t, locale } = useI18n();
const user = userStore();
const router = useRouter();
const showBottom = ref(false);
const language = ref(user.language);
const index = ref(user.index)

const isDarkTheme = ref();
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  const root = document.documentElement;
  if (isDarkTheme.value) {
    // 切换到深色主题
    root.style.setProperty('--color-background', '#181818');
    root.style.setProperty('--color-text', '#ffffff');
    root.style.setProperty('--box-background', '#262727');
    // ... 为其他变量设置深色主题的值
  } else {
    // 切换到浅色主题
    root.style.setProperty('--color-background', '#edf4ff');
    root.style.setProperty('--color-text', '#2A4057');
    root.style.setProperty('--box-background', '#ffffff');
    // root.style.setProperty('--box-border2A4057');
    // ... 为其他变量设置浅色主题的值
  }
};

function languageChoose(v) {
  if (v == 0) {
    language.value = 'en';
  } else if (v == 1) {
    language.value = 'zh';
  } else {
    language.value = 'en'
  }
  locale.value = language.value;
  if (language.value == 'en') {
    Locale.use('en-US', enUS);
  } else {
    Locale.use('zh-CN', zhCN);
  }
  user.set_language(language.value);
}

const showBottomOne = ref(false);


const verifyPassword = ref(false);
const password = ref("");
const passwordType = ref("password");

const loading0 = ref(false);
const childs0 = ref([]);

async function load0() {
  await InitUser();
  const ret = await axios.get(`${config.api}friends/childs/${user.address}/0`);
  childs0.value = ret.data;
  loading0.value = false;
}


let op = () => { };

function copyp(v) {
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      let p = "";
      if (v == 1) {
        p = user.privateKey;
        showSuccessToast(t('Common.copy_success'));
      } else if (v == 2) {
        p = user.mnemonic;
        //showSuccessToast("复制助记词成功");
        showSuccessToast(t('Common.copy_success'));
      } else {
        //showFailToast("操作失败");
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = p;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      verifyPassword.value = false;
    } else {
      //showFailToast("密码错误");
      showFailToast(t('Common.password_error'));
    }
    password.value = "";
  };
}

function createWallet() {
  router.push("/create");
}

function importWallet() {
  router.push("/import");
}


let cancel = () => {
}

let noClick = ref(false);
function deleteWallet(key) {
  if (user.wallets.length == 1) {
    noClick.value = true
    return
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = ''
      showLoadingToast({
        message: t("Common.submitting"),
        forbidClick: true,
        duration: 100,
      });
      if (user.index > key) {
        user.index = user.index - 1;
        index.value = user.index;
      }
      user.wallets.splice(key, 1);
      verifyPassword.value = false;
    } else {
      password.value = '';
      showFailToast(t("Common.password_error"));
    }
  }
  cancel = () => {
    password.value = ''
  }
}

function usdt_transferPage() {
  router.push('usdt')
}

function usdtSteamPage() {
  router.push('usdt_info')
}

function topupPage() {
  //showLoadingToast("Opening");
  router.push('topup')
}
function withdrawPage() {
  router.push('withdraw')
}
function incomePage() {
  router.push('income')
}
function purchasePage() {
  router.push('purchase')
}

</script>
<style scoped>
.box {
  background-color: var(--color-background);
  padding: 0 24px;
  min-height: 100vh;
}

.box-one {
  height: 97px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.box-one-itemOne {
  display: flex;
  justify-content: flex-start;
}

.box-one-itemOne-one {
  margin-right: 6px;
}

.box-one-itemOne-twoTop {
  font-size: 16px;
  /* color: #EAECEF; */
  color: #3cc;
  margin-bottom: 10px;
}

.box-one-itemOne-twoBottom {
  font-size: 16px;
  /* color: #ADB6C4; */
  color: #9c9c9d;
  position: relative;
}

.box-one-itemTwo {
  display: flex;
  justify-content: flex-start;
}

.box-one-itemTwo-0 {
  margin-left: 15px;
}

.box-one-itemTwo-two {
  margin-left: 15px;
}

.box-one-itemTwo-three {
  margin-left: 15px;
}

.walletSwitch-pop {
  --van-popup-background: var(--color-background);
  padding: 16px 25px;
}

.wallet-switch-title {
  font-size: 18px;
  color: var(--color-text);
  text-align: center;
}

.walletSwitch-content {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.walletSwitch-contentLeft {
  display: flex;
  justify-content: flex-start;
}

.walletSwitch-contentLeft-one {
  margin-right: 10px;
}

.walletSwitch-contentLeft-twoTop {
  font-size: 16px;
  color: #3cc;
  margin-bottom: 10px;
}

.walletSwitch-contentLeft-twoBottom {
  font-size: 12px;
  color: var(--color-text);
  position: relative;
}

.walletSwitch-contentRight {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.walletSwitch-contentRight-two {
  width: 22px;
  height: 22px;
  /* background-color: #202730; */
  margin-left: 40px;
}

.close-btn {
  margin: 32px 0 40px;
  height: 52px;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 52px;
  background-color: #1FAAA8;
}

.box-two {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
}

.box-twoLeft {
  width: 9.8125rem;
  height: 6.125rem;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.box-twoRight {
  width: 9.8125rem;
  height: 6.125rem;
  background-color: #29313D;
  border-radius: 12px;
  text-align: center;
}

.box-twoLeft-top {
  width: 9.8125rem;
  height: 3.25rem;
  border-radius: 12px 12px 0 0;
  text-align: center;
  padding-top: 8px;
}

.box-twoLeft-top h3 {
  font-size: 20px;
  color: var(--color-text);
  margin: 0;
}

.box-twoLeft-top p {
  font-size: 16px;
  color: #a8a9af;
  margin: 5px 0 0;
}

.box-twoLeft-bottom {
  width: 9.8125rem;
  height: 2.375rem;
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: space-between;
}

.box-twoLeft-bottom-one {
  width: 4.9063rem;
  height: 2.0625rem;
  border-radius: 0 0 0 12px;
  border-top: #e7e3eb 1px solid;
  border-right: #e7e3eb 1px solid;
  box-sizing: border-box;
  text-align: center;
  /* line-height: 38px; */
  padding-top: 5px;
}

.box-twoLeft-bottom-two {

  width: 4.9063rem;
  height: 33px;
  border-radius: 0 0 12px 0;
  border-top: #e7e3eb 1px solid;
  border-left: #e7e3eb 1px solid;
  box-sizing: border-box;
  text-align: center;
  /* line-height: 38px; */
  padding-top: 5px;
}

.box-three {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
}

.box-threeLeft {
  width: 157px;
  height: 64px;
  background-color: var(--box-background);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
}

.box-threeRight {
  width: 157px;
  height: 64px;
  /* background-color: #29313D; */
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
}

.box-threeLeft-img {
  margin: auto;
  margin-top: 5px;
}

.box-threeLeft-content {
  margin: 3px 0 0;
  font-size: 16px;
  color: #8D96A4;
}

.earnings-record {
  margin: 14px 0 0;
  --van-cell-group-inset-radius: 12px;
  --van-cell-group-background: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.earnings-recordContent {
  /* --van-cell-background: #29313D; */
  background-color: var(--box-background);
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
  --van-cell-active-color: #29313D;
  --van-cell-font-size: 16px;
}

.custom-icon {
  font-size: 24px;
  margin-right: 11px;
}

.footer {
  margin: 20px 0 0;
  --van-cell-group-background: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.footerContent {
  --van-cell-background: var(--box-background);
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: #EAECEF;
  --van-cell-font-size: 16px;
  --van-cell-active-color: #202730;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.popupOne {
  padding: 15px 25px 0;
  background-color: #202730;
  --van-popup-round-radius: 22px;
}

.popupOne-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.language-icon {
  margin-top: 28px;
  display: flex;
  justify-content: center;
}

.close-btn {
  margin: 32px 0 40px;
  height: 52px;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 52px;
  background-color: #1FAAA8;
}

.qr-code {
  width: 197px;
  height: 197px;
}

.save-share {
  margin-top: 79px;
  display: flex;
  justify-content: center;
}

.link-text {
  font-size: 17px;
  color: #EAECEF;
  width: 281px;
  height: 92px;
  background-color: #29313D;
  border-radius: 8px;
  padding: 52px 23px;
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

.walletSwitch-contentRight-one {
  width: 22px;
  height: 22px
}
</style>
