<template>
  <div class="box">
    <div class="title">{{ t('HomeIn.miner') }}</div>
    <van-pull-refresh v-model="loading1" @refresh="load1" style="min-height: 80vh;">
      <!-- <van-empty v-show="childs0.length == 0" :description="t('HomeIn.signature_information')" /> -->
      <template v-for="obj, key in childs0" :key="key">
        <div class="your-minner">{{ t('Common.Invitee_application') }}</div>
        <van-cell-group inset class="miner-information" :border="false">
          <van-cell :title="t('HomeIn.miner_address')" :value="addrFormat(obj.c_addr)" class="miner-informationTwo"
            :border="false">
            <template #right-icon>
              <AddressCopy :address="obj.c_addr"></AddressCopy>
            </template>
          </van-cell>
          <van-cell :title="t('Common.time')" :value="timeFormat(obj.sign_utc)" class="miner-informationTwo"
            :border="false" />
          <van-button class="binding-btn" round @click="bind(obj.sign, obj.c_addr, obj.id)">{{
            t('HomeIn.binding') }}</van-button>
        </van-cell-group>
        <br />
      </template>
      <div class="your-minner">{{ t('HomeIn.miner_information_o') }}</div>
      <van-cell-group inset class="miner-information" :border="false">
        <van-cell :title="t('HomeIn.invite_address')" :value="addrFormat(user.p_address)" class="miner-informationOne"
          :border="false">
          <template #right-icon>
            <AddressCopy :address="user.p_address"></AddressCopy>
          </template>
        </van-cell>
        <van-cell :title="t('HomeIn.miner_count')" :value="childs1.length" class="miner-informationTwo"
          :border="false" />
        <van-cell :title="t('HomeIn.account_address')" :value="addrFormat(user.address)" class="miner-informationThree"
          :border="false">
          <template #right-icon>
            <AddressCopy :address="user.address"></AddressCopy>
          </template>
        </van-cell>
        <van-cell title="USDT" :value="BigNumber(user.USDT).toFixed(4)"
          class="miner-informationFour" :border="false" />
        <van-cell title="QFT" :value="BigNumber(user.QFT).toFixed(6)"
          class="miner-informationFive" :border="false" />
      </van-cell-group>
      <div class="minner-team">{{ t('HomeIn.miner_team') }} </div>
      <template v-for="obj,key in childs1" :key="key">
        <van-cell-group inset class="invitation-information" :border="false">
          <van-cell :title="getTitle(obj)" class="invitation-informationOne" :border="false"></van-cell>
          <van-cell :title="t('Common.address')" :value="addrFormat(obj)" class="invitation-informationTwo"
            :border="false">
            <template #right-icon>
              <AddressCopy :address="obj"></AddressCopy>
            </template>
          </van-cell>
        </van-cell-group>
      </template>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
import { ethers } from 'ethers';

import { config } from '@/const/config';
import { InitUser, addrFormat, timeFormat } from '@/utils/helper.js';
import { userStore } from '@/stores/user.js';
import BigNumber from 'bignumber.js';
import AddressCopy from '@/components/AddressCopy.vue';
import { useI18n } from "vue-i18n";
import { onMounted } from 'vue';
import { Provider,Singer } from "@/utils/metamask.js";
const { t } = useI18n();

const user = userStore();

const verifyPassword = ref(false);
const password = ref('');

const loading0 = ref(false);
const childs0 = ref([]);

const loading1 = ref(false);
const childs1 = ref([]);

function getTitle(key) {
  if (key == 0) {
    return t('HomeIn.inviter_information'); //'邀请者信息';
  } else if (key == 1) {
    return t('HomeIn.self_information');// '自身信息';
  } else {
    // 被邀请者信息
    return `${t('HomeIn.invitee_information')}-${key - 1}`;
  }
}

async function load0() {
  const ret = await axios.get(`${config.api}friends/childs/${user.address}/0`);
  childs0.value = ret.data;
  loading0.value = false;
}

async function load1() {
  try {
    const popularized = new ethers.Contract(config.popularized_addr, config.popularized, Provider);
    popularized.spreads(user.address).then((ret) => {
      childs1.value = ret.child;
      loading1.value = false;
    })
  } catch (error) {
    console.log(error)
  }
}

async function bind(sign, c_addr, id) {
  if (childs1.value.length >= 36) {
    //showFailToast('被邀请者不能多余36个');
    showFailToast(t('HomeIn.bind_prompt'));
    return;
  }

  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  const v = '0x' + sign.substring(130);
  const r = sign.substring(0, 66);
  const s = '0x' + sign.substring(66, 130);

  const w = Singer;
  const popularized = new ethers.Contract(config.popularized_addr, config.popularized, w);
  const tx = await popularized.popularize1(c_addr, v, r, s);
  tx.wait().then(async () => {
    await axios.put(`${config.api}friends/${id}`);
    await load0();
    await load1();
    showSuccessToast(t('HomeIn.bind_success'));
  });
  showSuccessToast(t('Common.submitOK'));
}

load0();
load1();

</script>

<style scoped>
.box {
  background-color: #202730;
  min-height: 100vh;
  padding: 0 21px;
}

.title {
  font-size: 18px;
  color: #EAECEF;
  height: 60px;
  line-height: 60px;
}

.your-minner {
  font-size: 15px;
  color: #ADB6C4;
  margin-top: 22px;
}

.miner-information {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.miner-informationOne {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationTwo {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationThree {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationFour {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationFive {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.minner-team {
  font-size: 15px;
  color: #ADB6C4;
  margin-top: 18px;
}

.invitation-information {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.invitation-informationOne {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationTwo {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationThree {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationFour {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationFive {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.binding-btn {
  width: 100%;
  display: block;
  height: 42px;
  background-color: #1FAAA8;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 42px;
  margin-top: 22px;
  margin-bottom: 26px;
  border: none
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
</style>