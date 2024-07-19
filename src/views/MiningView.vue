<template>
  <div class="box">
    <div class="title">{{ t('App.mining') }}</div>
    <van-cell-group inset :border="false" class="mining-information">
      <van-cell :title="t('Mining.vote_information')" is-link :border="false" class="mining-informationOne"
        @click="showBottomOne = true" />
      <van-cell :title="t('Mining.global_information')" is-link :border="false" class="mining-informationTwo"
        @click="showBottomTwo = true" />
      <van-cell :title="t('Mining.contribute_detail')" is-link :border="false" class="mining-informationThree"
        @click="showBottomThree = true" />
    </van-cell-group>
    <van-popup v-model:show="showBottomOne" round position="bottom" class="voting-information">
      <div class="vote-title">{{ t('Mining.vote_information') }}</div>
      <van-cell-group inset class="vote-content" :border="false">
        <van-cell :title="t('Mining.vote_quantity')" :value="BigNumber(formatEther(vote)).toFixed(6)" :border="false"
          class="vote-contentOne" />


        <!-- <van-cell :title="t('Mining.airdrop_quantity')" :value="BigNumber(formatEther(airdrop)).toFixed(6)"
          :border="false" class="vote-contentTwo" /> -->


        <van-cell :title="t('Mining.basic_power')" :value="parseFloat(formatEther(vote_power)).toFixed(4)"
          :label="t('Mining.power_prompt')" :border="false" class="vote-contentThree" />
        <van-cell :title="t('Mining.submit_power')" :value="parseFloat(formatEther(real_power)).toFixed(4)"
          :border="false" class="vote-contentFour" />
        <van-cell :title="t('Mining.power_percentage')" :value="percentage" :border="false" class="vote-contentFive" />
        <van-cell :title="t('Mining.projected_revenue')" :value="income" :border="false" class="vote-contentSix" />
        <van-cell :title="t('Mining.withdraw_quantity')" :value="formatEther(out_vote)" :border="false"
          class="vote-contentSeven" />
        <van-cell :title="t('Mining.address_cycle')" :value="epoch.toString()" :border="false"
          class="vote-contentEight" />
      </van-cell-group>
      <div class="close-btn" @click="showBottomOne = false">{{ t('Mining.close') }}</div>
    </van-popup>
    <van-popup v-model:show="showBottomTwo" round position="bottom" class="global-information">
      <div class="global-title">{{ t('Mining.global_information') }}</div>
      <van-cell-group inset class="global-content" :border="false">
        <!-- <van-cell :title="t('Mining.vote_all')" :value="BigNumber(formatEther(totalSupply)).toFixed(6)"
          class="global-contentOne" :border="false" />
         -->
        <van-cell :title="t('Mining.power_all')" :value="parseFloat(formatEther(whole_power)).toFixed(4)"
          class="global-contentTwo" :border="false" />
        <van-cell :title="t('Mining.system_cycle')" :value="g_epoch.toString()" class="global-contentThree"
          :border="false" />
        <van-cell :title="t('Mining.daily_block')" value="28800" label="3768.30 MNT" class="global-contentFour"
          :border="false" />
      </van-cell-group>
      <div class="close-btn" @click="showBottomTwo = false">{{ t('Mining.close') }}</div>
    </van-popup>
    <van-popup v-model:show="showBottomThree" round position="bottom" class="contribution-details">
      <div class="contribution-title">{{ t('Mining.contribute_detail') }}</div>
      <template v-for="(obj, key) in minings" :key="key">
        <div class="contribution-contentOne">{{ getTitle(key) }}</div>
        <van-cell-group inset class="contribution-contentTwo" :border="false">
          <van-cell :title="t('Common.address')" :value="addrFormat(obj.addr)" class="contribution-contentTwo-itemOne"
            :border="false">
            <template #right-icon>
              <AddressCopy :address="obj.addr"></AddressCopy>
            </template>
          </van-cell>
          <van-cell :title="t('Mining.vote_quantity')" :value="BigNumber(formatEther(obj.info.vote)).toFixed(6)"
            :border="false" class="contribution-contentTwo-itemOne" />


          <!-- <van-cell :title="t('Mining.airdrop_quantity')" :value="BigNumber(formatEther(obj.info.airdrop)).toFixed(6)"
            :border="false" class="contribution-contentTwo-itemOne" /> -->


          <van-cell :title="t('Mining.basic_power')" :value="parseFloat(formatEther(obj.info.vote_power)).toFixed(4)
            " :label="t('Mining.power_prompt')" :border="false" class="contribution-contentTwo-itemOne" />
          <van-cell :title="t('Mining.contribute_power')" :value="getContribute(obj, key)" :border="false"
            class="contribution-contentTwo-itemOne" />
        </van-cell-group>
      </template>
      <div class="close-btn" @click="showBottomThree = false">{{ t('Mining.close') }}</div>
    </van-popup>
    <van-tabs background="#202730" title-inactive-color="#ADB6C4" title-active-color="#EAECEF" color="#1FAAA8">
      <van-tab :title="t('Mining.vote')" name="a">
        <van-cell-group inset :border="false" class="switch-vote">
          <van-cell v-show="user.last_vote" :title="t('Mining.last_voting_time')" :value="user.last_vote"
            :border="false" class="switch-vote-content" />
          <van-cell :title="`MNT ${t('Common.quantity')}`" :value="BigNumber(user.MNT).toFixed(6)" :border="false"
            class="switch-vote-content" />
          <div class="switch-vote-contentTwo">{{ t('Mining.vote_quantity') }}</div>
          <div style="position: relative;">
            <van-field type="number" v-model="voteIn_v" :placeholder="t('Mining.vote_prompt')" autocomplete="off"
              input-align="left" class="input-mnt" :border="false" />
            <!-- <van-field type="number" v-model="voteIn_v" :placeholder="t('Mining.vote_prompt')" autocomplete="off"
            input-align="left" class="input-MNT" :border="fasle" /> -->
            <span class="input-tailText">MNT</span>
          </div>
          <van-button class="submit-btn" @click="voteIn">{{
            t("Mining.vote") }}
          </van-button>
          <!-- <div class="vote-btn" @click="voteIn">{{ t('Mining.vote') }}</div> -->
        </van-cell-group>
      </van-tab>
      <van-tab :title="t('Mining.withdraw')" name="b">
        <van-cell-group inset :border="false" class="switch-withdraw">
          <van-cell :title="t('Mining.vote_quantity')" :value="BigNumber(formatEther(vote)).toFixed(6)" :border="false"
            class="switch-withdraw-content" />
          <div class="switch-withdraw-contentTwo">{{ t('Mining.withdraw_quantity') }}</div>
          <div style="position: relative;">
            <van-field type="number" v-model="voteOut1_v" :placeholder="t('Mining.withdraw_prompt')" autocomplete="off"
              input-align="left" class="input-mnt" :border="false" />
            <!-- <input type="number" class="input-MNT" v-model="voteOut1_v" :placeholder="t('Mining.withdraw_prompt') "> -->
            <span class="input-tailText">MNT</span>
          </div>
          <van-button class="submit-btn" @click="voteOut1">{{ t("Mining.withdraw") }}</van-button>
          <!-- <div class="withdraw-btn" @click="voteOut1">{{ t('Mining.withdraw') }}</div> -->
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <div class="mining-title">{{ t('App.mining') }}</div>
    <van-cell-group inset :border="false" class="mining-content">
      <van-cell class="mining-contentItem" :border="false">
        <CountDown :time="cd_mining" :format="t('Mining.cd_prompt')" style="color: #EAECEF;" />
      </van-cell>
      <van-cell :title="t('Mining.submit_power')" :value="parseFloat(formatEther(real_power)).toFixed(4)"
        class="mining-contentItem" :border="false" />
      <van-cell :title="t('Mining.real_power')" :value="parseFloat(formatEther(real_power_)).toFixed(4)"
        class="mining-contentItem" :border="false" />
      <van-button @click="voteMining" :disabled="voteMiningStr == t('Common.submit')" class="submit-btn">{{
        voteMiningStr }}</van-button>
    </van-cell-group>
    <div class="mining-title">{{ t('HomeIn.withdrawal') }}</div>
    <van-cell-group inset :border="false" class="withdraw-content">
      <van-cell :title="t('Mining.withdraw_quantity')" :value="formatEther(out_vote)" :border="false"
        class="withdraw-contentItem" />
      <van-cell :title="t('Mining.withdrawal_ratio')" :value="`${out2n.toString()}%`" :border="false"
        class="withdraw-contentItem" />
      <van-cell :title="t('Mining.quantity_available')" :value="formatEther(out2)" :border="false"
        class="withdraw-contentItem">
      </van-cell>
      <van-button class="withdrawal-btn" :disabled="out2 == 0" @click="voteOut2">{{
        t("Mining.withdrawal") }}</van-button>
    </van-cell-group>
    <!-- <div class="switch-title">{{ t('Mining.airdrop') }}</div>
    <van-cell-group inset :border="false" class="withdraw-content">
      <van-cell :title="`MNT ${t('Common.quantity')}`" :value="user.MNT" :border="false" class="withdraw-contentItem" />
      <div class="conversion-quantity">{{ t('HomeIn.airdrop_quantity')}}</div>
      <van-field type="number" v-model="airdropsIn_v" :placeholder="t('Common.transfer_v_placeholder')"
        autocomplete="off" input-align="left" :border="false" class="input_transfer_number" />
      <div class="conversion-quantity">{{ t('Common.address')}}</div>
      <van-field maxlength="42" type="textarea" v-model="airdropsIn_addr"
        :placeholder="t('Common.transfer_addr_placeholder')" autocomplete="off" input-align="left" :border="false"
        class="input_transfer_number" />
      <van-button class="withdrawal-btn" @click="airdropsIn">{{ t("Mining.airdrop") }}</van-button>
    </van-cell-group> -->
  </div>
  <van-popup v-model:show="verifyPassword" class="popup" :border="false">
    <div class="popup-title">{{ t('Common.password_authentication') }}</div>
    <van-field v-model="password" type="password" :placeholder="t('Common.input_psaaword')" autocomplete="off"
      class="input-password" :border="false" />
    <div class="confirm-btn" @click="op">{{ t('Common.Sure') }}</div>
    <div class="cancel-btn" @click="verifyPassword = false">{{ t('Common.Cancel') }}</div>
  </van-popup>
</template>
<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import {
  ethers,
  formatEther,
  isAddress,
  parseEther,
  WeiPerEther,
} from "ethers";
import BigNumber from "bignumber.js";
import {
  showSuccessToast,
  showFailToast,
  showLoadingToast,
  CountDown,
} from "vant";
import { useRouter } from "vue-router";

import { config } from "@/const/config";
import { userStore } from "@/stores/user.js";
import { addrFormat, timeFormat } from "@/utils/helper.js";
import AddressCopy from "@/components/AddressCopy.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const user = userStore();
const router = useRouter();
const showBottomOne = ref(false);
const showBottomTwo = ref(false);
const showBottomThree = ref(false);
function mnt_prompt() {
  if (ethers.parseEther(user.MNT) < ethers.parseEther("0.1")) {
    showFailToast(t("Common.mnt_prompt"));
    return true;
  }
  return false;
}

if (user.p_address == ethers.ZeroAddress) {
  //showFailToast("请联系社区找到自己的推荐者");
  showFailToast(t("Common.system_prompt"));
  router.push("/friends");
}

let begin = 0; // 173340
const epoch_height = ref(0); //1200 * 24 * 3

const provider = new ethers.JsonRpcProvider(config.rpc);
const w = new ethers.Wallet(user.privateKey, provider);
const mining = new ethers.Contract(config.mining_addr, config.mining, w);
const helper = new ethers.Contract(config.helper_addr, config.helper, provider);

const activeNames0 = ref([]);
const activeNames1 = ref([]);
const loading = ref(false);

let verifyPassword = ref(false);
const password = ref("");

const airdrop = ref(0);
const vote = ref(0);
const vote_power = ref(0);
const real_power = ref(0);
const out_vote = ref(0);
const epoch = ref(0);
const out_lock = ref(0);
const real_power_ = ref(0);

const totalSupply = ref(0);
const whole_power = ref(0);
const g_epoch = ref(0);

const voteIn_v = ref(null);

const out2 = ref(0);
const out2n = ref(0);

const cd_mining = ref(0);
const bn = ref(0);
const minings = ref([]);

const miningB = ref(0);

mining.totalSupply().then((ret) => {
  miningB.value = ret;
});

function getTitle(key) {
  if (key == 0) {
    return t("HomeIn.inviter_information"); //'邀请者信息';
  } else if (key == 1) {
    return t("HomeIn.self_information"); // '自身信息';
  } else {
    // 被邀请者信息
    return `${t("HomeIn.invitee_information")}-${key - 1}`;
  }
}

function getContribute(obj, key) {
  if (key == 1) {
    const b = BigNumber(vote_power.value * 6n);
    return `${b.div(WeiPerEther).toFixed(2)}(${b
      .times(100)
      .div(real_power.value)
      .toFixed(2)}%)`;
  } else {
    if (obj.info.vote_power < vote_power.value) {
      const b = BigNumber(obj.info.vote_power);
      return `${b.div(WeiPerEther).toFixed(2)}(${b
        .times(100)
        .div(real_power.value)
        .toFixed(2)}%)`;
    } else {
      const b = BigNumber(vote_power.value);
      return `${b.div(WeiPerEther).toFixed(2)}(${b
        .times(100)
        .div(real_power.value)
        .toFixed(2)}%)`;
    }
  }
}

function load() {
  
  try {
    helper.out2(user.address).then((ret) => {
      out2n.value = ret.oln;
      if (out2n.value == 100) {
        out2.value = 0;
      } else {
        out2.value = ret.ret;
      }
      console.log(ret)
    });
  } catch (err) {
    console.log(err);
  }

  helper.MiningInfo(user.address).then((ret) => {
    airdrop.value = ret.infos[1].info.airdrop;
    vote.value = ret.infos[1].info.vote;
    vote_power.value = ret.infos[1].info.vote_power;
    real_power.value = ret.infos[1].info.real_power;
    out_vote.value = ret.infos[1].info.out_vote;
    out_lock.value = ret.infos[1].info.out_lock;
    epoch.value = ret.infos[1].info.epoch;

    minings.value = ret.infos;

    user.set_MNT(BigNumber(formatEther(ret.balance)).toFixed(6));

    begin = ret.begin;
    epoch_height.value = ret.epoch_height;

    g_epoch.value = ret.epoch;
    bn.value = ret.bn;

    totalSupply.value = ret.totalSupply;
    whole_power.value = ret.whole_power;
    real_power_.value = ret.real_power;
    //const cdol = BigNumber(out_lock.value).plus(epoch_height.value * 2n).minus(bn.value).times(3000).toNumber()
    //if (cdol > 0) {
    //  cd_out_lock.value = cdol
    //} else {
    //  cd_out_lock.value = 0
    //}
    cd_mining.value = BigNumber(g_epoch.value)
      .times(epoch_height.value)
      .plus(begin)
      .minus(bn.value)
      .times(3000)
      .toNumber();
    loading.value = false;
  });
}

const percentage = computed(() => {
  if (whole_power.value > 0) {
    const ret = new BigNumber(real_power.value * 100n).div(whole_power.value);
    return `${ret.toFixed(4)}%`;
  } else {
    return "NaN";
  }
});

const income = computed(() => {
  if (whole_power.value > 0) {
    const height_profit = new BigNumber(0.13084);
    const ret = new BigNumber(
      height_profit.times(epoch_height.value).times(real_power.value)
    ).div(whole_power.value);
    return `${ret.toFixed(4)}`;
  } else {
    return "NaN";
  }
});

let op = async () => { };

function voteIn() {
  if (mnt_prompt()) {
    return;
  }
  if (voteIn_v.value == "") {
    //showFailToast("请填写投票值");
    showFailToast(t("Mining.vote_prompt"));
    return;
  }
  if (parseEther(user.MNT) < parseEther(voteIn_v.value)) {
    //showFailToast("投票数量过大");
    showFailToast(t("Common.quantity_big"));
    return;
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = "";
      showLoadingToast({
        message: t("Common.submitting"),
        forbidClick: true,
        duration: 0,
      });
      try {
        const tx = await mining.voteIn({ value: parseEther(voteIn_v.value) });
        const result = await tx.wait();
        console.log(result);
        load();
        voteIn_v.value = "";
        user.set_last_vote(timeFormat(Math.ceil(new Date().getTime() / 1000)));
        //showSuccessToast("投票成功");
        showSuccessToast(t("Mining.vote_success"));
      } catch (err) {
        showFailToast(t("Mining.vote_failed"));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

const voteOut1_v = ref("");
function voteOut1() {
  if (mnt_prompt()) {
    return;
  }
  if (out2.value > 0) {
    //showFailToast("请先完成撤投提现");
    showFailToast(t("Mining.withdraw_prompt1"));
    return;
  }
  if (parseEther(voteOut1_v.value) > vote.value) {
    //showFailToast("撤投数量过大");
    showFailToast(t("Common.quantity_big"));
    return;
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = "";
      showLoadingToast({
        message: t("Common.submitting"),
        forbidClick: true,
        duration: 0,
      });
      try {
        const tx = await mining.voteOut1(
          parseEther(voteOut1_v.value.toString())
        );
        const result = await tx.wait();
        console.log(result);
        load();
        voteOut1_v.value = "";
        //showSuccessToast("撤投成功");
        showSuccessToast(t("Mining.withdraw_success"));
      } catch (err) {
        showSuccessToast(t("Mining.withdraw_failed"));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

function voteOut2() {
  if (mnt_prompt()) {
    return;
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = "";
      showLoadingToast({
        message: t("Common.submitting"),
        forbidClick: true,
        duration: 0,
      });
      try {
        const tx = await mining.voteOut2();
        const result = await tx.wait();
        console.log(result);
        load();
        //showSuccessToast("提现成功");
        showSuccessToast(t("Mining.withdrawal_success"));
      } catch (err) {
        showFailToast(t("Mining.withdrawal_failed"));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

const airdropsIn_v = ref(null);
const airdropsIn_addr = ref("");
function airdropsIn() {
  if (mnt_prompt()) {
    return;
  }
  if (BigNumber(airdropsIn_v.value).gt(user.MNT)) {
    //showFailToast("空投数量过大");
    showFailToast(t("Common.quantity_big"));
    airdropsIn_v.value = null;
    return;
  }
  if (!isAddress(airdropsIn_addr.value)) {
    //showFailToast("空投地址错误");
    showFailToast(t("Common.address_error"));
    airdropsIn_addr.value = "";
    return;
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = "";
      showLoadingToast({
        message: t("Common.submitting"),
        forbidClick: true,
        duration: 0,
      });
      try {
        const tx = await mining.airdropsIn(airdropsIn_addr.value, {
          value: parseEther(airdropsIn_v.value),
        });
        const result = await tx.wait();
        console.log(result);
        load();
        showSuccessToast(t("Mining.airdrop_success"));
      } catch (err) {
        showFailToast(t("Mining.airdrop_failed"));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

const voteMiningStr = computed(() => {
  if (epoch.value == 0) {
    //return "启动挖矿";
    return t("Mining.start_mining");
  }
  if (g_epoch.value > epoch.value) {
    //return "领取收益";
    return t("Mining.claim_income");
  }
  // <
  if (
    BigNumber(g_epoch.value).times(epoch_height.value).plus(begin).lt(bn.value)
  ) {
    //return  "领取收益";
    return t("Mining.claim_income");
  } else {
    if (real_power.value >= real_power_.value) {
      //return "提交";
      return t("Common.submit");
    } else {
      //return "提交算力";
      return t("Mining.submit_power");
    }
  }
});

function voteMining() {
  if (mnt_prompt()) {
    return;
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = "";
      showLoadingToast({
        message: "提交中...",
        forbidClick: true,
        duration: 0,
      });
      const tx = await mining.voteMining({ gasLimit: 9999999 });
      const result = await tx.wait();
      console.log(result);
      load();
      showSuccessToast("提交成功");
      verifyPassword.value = false;
    } else {
      password.value = "";
      showFailToast("密码错误");
    }
  };
}
load();
</script>

<style scoped>
.box {
  background-color: #202730;
  padding: 0 24px;
  min-height: 100vh;
}

.title {
  height: 60px;
  font-size: 18px;
  color: #EAECEF;
  line-height: 60px;
}

.mining-information {
  margin: 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.mining-informationOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  --van-cell-active-color: #29313D;
}

.mining-informationTwo {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  --van-cell-active-color: #29313D;
}

.mining-informationThree {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-border-color: #29313D;
  --van-cell-active-color: #29313D;
}

.voting-information {
  --van-popup-background: #202730;
  --van-popup-round-radius: 22px;
  padding: 14px 24px 0;
}

.vote-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.vote-content {
  margin: 17px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.vote-contentOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentTwo {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentThree {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentFour {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentFive {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentSix {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentSeven {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentEight {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
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

.global-information {
  background-color: #202730;
  padding: 13px 24px 0;
}

.global-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.global-content {
  margin: 17px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.global-contentOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.global-contentTwo {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.global-contentThree {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.global-contentFour {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.contribution-details {
  background-color: #202730;
  padding: 14px 18px 0;
}

.contribution-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.contribution-contentOne {
  font-size: 16px;
  color: #ADB6C4;
  margin-top: 10px;
}

.contribution-contentTwo {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.contribution-contentTwo-itemOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.switch-vote {
  margin: 0;
  background-color: #29313D;
  padding: 0 16px;
}

.switch-vote-content {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  padding-left: 0;
  padding-right: 0;
}

.switch-vote-contentTwo {
  font-size: 16px;
  color: #8D96A4;
}

.input-tailText {
  font-size: 16px;
  color: #EAECEF;
  position: absolute;
  right: 7%;
  top: 30%;
}

.vote-btn {
  height: 42px;
  background-color: #1FAAA8;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 42px;
  margin-top: 22px;
  margin-bottom: 26px;
}

.switch-withdraw {
  margin: 0;
  padding: 0 16px;
  background-color: #29313D;
}

.switch-withdraw-content {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  padding-left: 0;
  padding-right: 0;
}

.switch-withdraw-contentTwo {
  font-size: 16px;
  color: #8D96A4;
}

.input-UNMNT {
  background-color: #202730;
  --van-field-input-text-color: #EAECEF;
  border-radius: 8px;
  margin-top: 13px;
  --van-field-placeholder-text-color: #555E6B;
  position: static;
}

.withdraw-btn {
  height: 42px;
  background-color: #1FAAA8;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 42px;
  margin-top: 22px;
  margin-bottom: 26px;
}

.mining-title {
  font-size: 16px;
  color: #ADB6C4;
  margin-top: 18px;
}

.mining-content {
  margin: 12px 0 0;
  background-color: #29313D;
  padding: 0 16px;
}

.mining-contentItem {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  padding-left: 0;
  padding-right: 0;
}

.submit-btn {
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

.withdraw-content {
  margin: 12px 0 0;
  background-color: #29313D;
  padding: 0 16px;
}

.withdraw-contentItem {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  padding-left: 0;
  padding-right: 0;
}

.withdrawal-btn {
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

.switch-title {
  font-size: 14px;
  color: #ADB6C4;
  margin-top: 18px;
}

.conversion-quantity {
  font-size: 12px;
  color: #8D96A4;
  margin-top: 6px;
}

.input_transfer_number {
  height: 40px;
  --van-field-input-text-color: #EAECEF;
  --van-field-placeholder-text-color: #555E6B;
  font-size: 12px;
  border-radius: 8px;
  background-color: #202730;
  margin-top: 12px;
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

.input-mnt {
  --van-field-input-text-color: #EAECEF;
  --van-field-placeholder-text-color: #555E6B;
  border-radius: 8px;
  height: 50px;
  background-color: #202730;
  margin-top: 13px;
}
</style>
