<template>
  <div v-show="step == 0" class="box" style="min-height: 100vh; overflow:auto;">
    <div class="nav">
      <div class="nav-left"><img src="../images/tb-head-FanHui.png" alt="" @click="back()"></div>
      <div class="nav-right" @click="importPage">{{ t('Wallet.import_wallet') }}</div>
    </div>
    <div class="wallet-create">{{ t('Wallet.create_wallet') }}</div>
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
    <div class="mnemonic-box">
      <div>{{ t('Wallet.mnemonic') }}</div>
      <div class="copy-mnemonic" @click="copyMnemonic">{{ t('Wallet.copy_mnemonic') }}</div>
    </div>
    <ul class="mnemonic-content">
      <li class="mnemonic-item" v-for="value in mnemonic" :key="value">{{ value }}</li>
    </ul>
    <div class="backup-completed" @click="verify">{{ t('Wallet.mnemonic_backup_completed') }}</div>
    <!-- <van-grid :gutter="20" :column-num="3" class="mnemonic-content" center="true" clickable="true">
        <van-grid-item v-for="value in mnemonic" :key="value" :text="value" class="mnemonic-item" />
      </van-grid> -->
    <!-- <van-cell-group inset>
        <van-cell :title="t('Wallet.wallet_name')"></van-cell>
        <van-field v-model="walletName" :placeholder="t('Wallet.name_prompt')" autocomplete="off" />
        <van-cell :title="t('Wallet.password_prompt1')"></van-cell>
        <van-field v-model="password" :type="passwordType" :name="t('Wallet.password')"
          :placeholder="t('Wallet.password_prompt2')"
          :rules="[{ required: true, message: t('Wallet.password_prompt2') }]" autocomplete="off">
          <template #right-icon>
            <span @click="switchPasswordType">
              <van-icon name="eye" v-if="passwordType === 'password'" />
              <van-icon name="closed-eye" v-else />
            </span>
          </template>
        </van-field>

        <van-field v-model="password2" :type="passwordType" :name="t('Wallet.password')" label=""
          :placeholder="t('Wallet.password_prompt3')"
          :rules="[{ required: true, message:  t('Wallet.password_prompt2')}]" autocomplete="off">
          <template #right-icon>
            <span @click="switchPasswordType">
              <van-icon name="eye" v-if="passwordType === 'password'" />
              <van-icon name="closed-eye" v-else />
            </span>
          </template>
        </van-field>
        <van-cell :title="t('Wallet.prompt')"></van-cell>
        <van-field v-model="promptInfo" :placeholder="t('Wallet.prompt_prompt1')" autocomplete="off" />
      </van-cell-group>
      <van-cell-group inset>
        <van-cell>
          <van-grid :gutter="20" :column-num="3">
            <van-grid-item v-for="value in mnemonic" :key="value" :text="value" />
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset style="text-align: center">
        <van-cell>
          <van-space class="btn_a" fill>
            <van-button type="primary" size="small" :text="t('Wallet.return')" round @click="back()"></van-button>
            <van-button type="success" size="small" :text="t('Wallet.copy_mnemonic')" round @click="copyMnemonic" />
            <van-button type="success" size="small" :text="t('Wallet.backups_mnemonic')" round @click="verify" />
          </van-space>
        </van-cell>
      </van-cell-group> -->
  </div>
  <div v-show="step == 1" class="boxSecond" style="min-height: 100vh; overflow:auto;">
    <div class="navSecond">
      <div class="navSecond-left"><img src="../images/tb-head-FanHui.png" alt="" @click="backSecond"></div>
    </div>
    <div class="verify-mnemonic">{{ t('Wallet.verify_mnemonic') }}</div>
    <ul class="mnemonic-top">
      <li v-for="(value, index) in mnemonicVerify" :key="value" @click="deleteMnemonic(index)"
        class="mnemonic_top_item">
        {{ value }}</li>
    </ul>
    <div class="mnemonic-bottom">
      <div class="mnemonic-bottom-title">{{ t('Wallet.mnemonic_prompt1') }}</div>
      <ul>
        <li class="mnemonic_bottom_item" v-for="(item, index) in mnemonicShuffleClass" :key="item.text"
          @click="selectMnemonic(index)">
          <div v-show="item.color" class="selected">
            {{ item.text }}
          </div>
          <div v-show="!item.color" class="unselected">
            {{ item.text }}
          </div>
        </li>
      </ul>
    </div>
    <!-- <van-cell-group inset>
      <van-cell :title="t('Wallet.mnemonic_prompt1')"></van-cell>
    </van-cell-group>
    <van-cell-group inset>
      <van-grid :gutter="10" :column-num="3">
        <van-grid-item v-for="(value, index) in mnemonicVerify" :key="value" :text="value" style="height: 50px"
          @click="deleteMnemonic(index)" />
      </van-grid>
    </van-cell-group>
    <van-divider></van-divider>
    <van-cell-group inset>
      <van-grid :gutter="10" :column-num="3">
        <van-grid-item v-for="(item, index) in mnemonicShuffleClass" :key="item.text" style="height: 50px"
          @click="selectMnemonic(index)">
          <van-badge v-show="item.color">
            <div>{{ item.text }} &nbsp;</div>
            <template #content>
              <van-icon name="success" />
            </template>
          </van-badge>
          <div v-show="!item.color">
            {{ item.text }}
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <van-cell-group inset style="text-align: center">
      <van-cell>
        <van-space fill>
          <van-button type="primary" size="small" :text="t('Wallet.return')" round @click="back()"></van-button>
          <van-button type="success" size="small" :text="t('Wallet.back')" round @click="step = 0"></van-button>
        </van-space>
      </van-cell>
    </van-cell-group> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ethers } from "ethers";
import { showSuccessToast, showFailToast } from "vant";
import { userStore } from "../stores/user.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();
const walletName = ref("");
const password = ref("");
const password2 = ref("");
const promptInfo = ref("");
const mnemonic = ref([]);
const mnemonicVerify = ref([]);
const mnemonicShuffleClass = ref([]);
const step = ref(0);
const passwordType = ref("password");

const HD = ethers.Wallet.createRandom();
mnemonic.value = HD.mnemonic.phrase.split(" ");

mnemonicVerify.value = new Array(12).fill("");

const mnemonicShuffle = Array.from(mnemonic.value).sort(
  () => Math.random() - 0.5
);
mnemonicShuffleClass.value = mnemonicShuffle.map((item) => {
  return {
    color: false,
    text: item,
  };
});

function copyMnemonic() {
  const copyInput = document.createElement("input");
  copyInput.value = HD.mnemonic.phrase;
  document.body.appendChild(copyInput);
  copyInput.select();
  document.execCommand("Copy");
  document.body.removeChild(copyInput);
  //showSuccessToast("复制成功");
  showSuccessToast(t('Common.success'));
}

function switchPasswordType() {
  if (passwordType.value == "password") {
    passwordType.value = "text";
  } else {
    passwordType.value = "password";
  }
}

async function selectMnemonic(index) {
  if (mnemonicShuffleClass.value[index].color) {
    return;
  }
  const word = mnemonicShuffleClass.value[index].text;
  mnemonicShuffleClass.value[index].color = true;
  const i = mnemonicVerify.value.indexOf("");
  mnemonicVerify.value[i] = word;

  if (mnemonicVerify.value.indexOf("") == -1) {
    let ok = true;
    for (let i = 0; i < 12; i++) {
      if (mnemonicVerify.value[i] != mnemonic.value[i]) {
        ok = false;
        break;
      }
    }
    if (ok) {
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
      user.set_mnemonic(HD.mnemonic.phrase);
      user.set_privateKey(HD.privateKey);
      user.set_address(HD.address);
      user.set_password(password.value);
      user.set_walletName(walletName.value);
      user.set_promptInfo(promptInfo.value);

      //showSuccessToast("验证成功");
      showSuccessToast(t('Common.success'));
      router.push("/friends");
    } else {
      //showFailToast("验证失败");
      showFailToast(t('Common.failed'));
    }
  }
}

function deleteMnemonic(index) {
  const word = mnemonicVerify.value[index];
  if (word == "") {
    return;
  }
  mnemonicVerify.value[index] = "";
  for (let i = 0; i < mnemonicShuffleClass.value.length; i++) {
    if (mnemonicShuffleClass.value[i].text == word) {
      mnemonicShuffleClass.value[i].color = false;
      break;
    }
  }
}

function back() {
  const user = userStore();
  if (ethers.isAddress(user.address)) {
    router.push("/user");
  } else {
    //showFailToast("请完成钱包的创建");
    showFailToast(t('Wallet.return_prompt1'));
  }
}
function backSecond() {
  step.value = 0
}
function importPage() {
  router.push('import')
}

function verify() {
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
    //showFailToast("请输入最少6位密码");
    showFailToast(t("Wallet.create_prompt1"));
    return;
  }
  // if (password.value.trim() != password2.value.trim()) {
  //   //showFailToast("请输入正确的密码");
  //   showFailToast(t("Wallet.create_prompt2"));
  //   return;
  // }
  step.value = 1;
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

.wallet-create {
  font-size: 18px;
  color: var(--color-text);
}

.wallet-name {
  color: var(--color-text);
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

.mnemonic-box {
  margin-top: 17px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text);
  align-items: center;
}

.copy-mnemonic {
  width: 84px;
  height: 26px;
  background-color: #1FAAA8;
  border-radius: 4px;
  text-align: center;
  line-height: 26px;
  color: #fff;
}

.mnemonic-content {
  margin-top: 16px;
  background-color: var(--color-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.mnemonic-item {
  width: 90px;
  height: 42px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  color: var(--color-text);
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  line-height: 42px;
  margin-top: 10px;
}

.backup-completed {
  height: 52px;
  border-radius: 8px;
  background-color: #1FAAA8;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 52px;
  margin-top: 36px;
}

.boxSecond {
  background-color: #202730;
  padding: 0 24px;
}

.navSecond {
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.navSecond-left {
  width: 56px;
  height: 42px;
  text-align: left;
}

.verify-mnemonic {
  font-size: 18px;
  color: #EAECEF;
}

.mnemonic-top {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.mnemonic_top_item {
  width: 100px;
  height: 42px;
  border-radius: 8px;
  background-color: #29313D;
  font-size: 15px;
  color: #EAECEF;
  text-align: center;
  line-height: 42px;
  margin-bottom: 12px;
}

.mnemonic-bottom {
  margin-top: 50px;
  background-color: #29313D;
  padding-top: 19px;
}

.mnemonic-bottom-title {
  font-size: 14px;
  color: #ADB6C4;
  text-align: center;
}

.mnemonic-bottom ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 22px
}

.mnemonic_bottom_item {
  width: 90px;
  height: 42px;
  background-color: #202730;
  font-size: 15px;
  color: #EAECEF;
  text-align: center;
  line-height: 42px;
  margin-bottom: 12px;
  border-radius: 8px;
  margin-right: 10px;
}

.unselected {
  width: 100px;
  height: 42px;
  background-color: #202730;
  font-size: 15px;
  color: #EAECEF;
  text-align: center;
  line-height: 42px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.selected {
  width: 100px;
  height: 42px;
  background-color: #202730;
  font-size: 15px;
  color: #555E6B;
  text-align: center;
  line-height: 42px;
  margin-bottom: 12px;
  border-radius: 8px;
}
</style>