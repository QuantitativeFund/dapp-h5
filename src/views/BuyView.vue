<template>
  <div class="box">
    <div class="title">{{ t('App.node') }}</div>
    <van-tabs sticky animated swipeable background="#202730" title-inactive-color="#ADB6C4" title-active-color="#EAECEF"
      color="#1FAAA8">
      <van-tab :title="t('Buy.node_construction')">
        <van-pull-refresh v-model="loading" @refresh="load">
          <van-cell-group inset :border="false" class="node-construction">
            <van-cell :title="t('Buy.node_name')" :value="nodeName" label="" :border="false"
              class="node-constructionContent" />
            <van-cell :title="t('Buy.pool_quantity')" :value="BigNumber(formatEther(buyPool)).toFixed(4)"
              :border="false" class="node-constructionContent" />
            <van-cell :title="`MNT ${t('Buy.price')}`" :value="price" :border="false"
              class="node-constructionContent" />
            <van-cell title="USDT" :value="BigNumber(user.USDT).toFixed(4)" :border="false"
              class="node-constructionContent" />
            <div class="node-constructionContentTwo">{{ t('Buy.purchase_usdt')}}</div>
            <van-field type="number" v-model="buy_v" autocomplete="off" input-align="left" class="input-USDT"
              :border="false" />
            <span class="input-tailText">USDT</span>
            <van-button v-show="!user.USDT_approve" class="buyMnt-btn" @click="approveUsdt()">USDT
              {{ t("Buy.approve") }}</van-button>
            <van-button @click="buy" class="buyMnt-btn">{{ t("Buy.buy") }} MNT</van-button>
            <!-- <van-field :label="`USDT ${t('Common.quantity')}`" type="number" v-model="buy_v"
              :placeholder="t('Buy.buy_prompt')" autocomplete="off" input-align="right" /> -->
            <!-- <van-cell>
              <van-row type="flex">
                <van-col span="22" style="text-align: right">
                  <van-space>
                    <van-button v-show="!user.USDT_approve" type="success" size="small" round
                      @click="approveUsdt()">USDT
                      {{ t("Buy.approve") }}</van-button>
                    <van-button round type="success" size="small" @click="buy">{{ t("Buy.buy") }} MNT</van-button>
                  </van-space>
                </van-col>
              </van-row>
            </van-cell> -->
          </van-cell-group>
        </van-pull-refresh>
      </van-tab>
      <van-tab :title="t('Buy.exchange')">
        <van-pull-refresh v-model="loading" @refresh="load" styel="height:100vh;">
          <div class="echart" ref="mychartU" style="width: 100%; height: 400px;">
          </div>
          <div class="echart" ref="mychartK" style="width: 100%; height: 400px;"></div>
          <van-cell-group inset :border="false" class="trading-depth">
            <van-cell :title="t('Buy.transaction_depth')" :value="BigNumber(formatEther(swapPool)).toFixed(4)"
              :border="false" class="trading-depth-content" />
            <van-cell :title="`MNT ${t('Buy.price')}`" :value="price" label="" :border="false"
              class="trading-depth-content" />
            <van-cell :title="`USDT ${t('Common.quantity')}`" :value="BigNumber(user.USDT).toFixed(4)" :border="false"
              class="trading-depth-content" />
            <van-cell :title="`MNT ${t('Common.quantity')}`" :value="BigNumber(user.MNT).toFixed(6)" :border="false"
              class="trading-depth-content" />
            <div style="position: relative;">
              <van-field type="number" class="input-switch" label=" " v-model="reserve0swap"
                :placeholder="t('Buy.input_number')" @update:model-value="update0" :border="false" input-align="right"
                clearable clear-icon="cross" />
              <div style="position: absolute; top: 20%; left: 0; font-size: 16px; color: #8D96A4; ">
                {{ reserveItemOne }}
              </div>
            </div>
            <div @click="swap" style="text-align: center; margin-top: 4px;">
              <img src="../images/i-qihuan.png" alt="" style="width: 32px; height: 32px; transform: rotate(90deg);">
            </div>
            <div style="position: relative;">
              <van-field type="number" label=" " class="input-switch" v-model="reserve1swap"
                :placeholder="t('Buy.input_number')" @update:model-value="update1" :border="false" input-align="right"
                clearable clear-icon="cross" />
              <div style="position: absolute; top: 20%; left: 0; font-size: 16px; color: #8D96A4; ">
                {{ reserveItemThree }}
              </div>
            </div>
            <van-button v-show="!router02approve" class="buyMnt-btn" @click="approveSwap()">{{
              t("Buy.approve") }}</van-button>
            <van-button class="buyMnt-btn" @click="trade">{{ t("Buy.transaction") }}</van-button>
          </van-cell-group>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
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
import { ref } from "vue";
import { ethers, formatEther, parseEther } from "ethers";
import { showSuccessToast, showFailToast, showLoadingToast } from "vant";
import axios from "axios";
import BigNumber from "bignumber.js";
import * as echarts from "echarts";
import { useRouter } from "vue-router";
import { config } from "@/const/config";
import { userStore } from "@/stores/user.js";
import { LoadUserUSDT, LoadUserMNT } from "@/utils/helper.js";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";
const { t } = useI18n();

const user = userStore();
const router = useRouter();

const loading = ref(false);

const verifyPassword = ref(false);
const password = ref("");

const provider = new ethers.JsonRpcProvider(config.rpc);
const w = new ethers.Wallet(user.privateKey, provider);
const Buy = new ethers.Contract(config.buy_addr, config.buy, w);
const Router02 = new ethers.Contract(config.router02_addr, config.router02, w);
const USDT = new ethers.Contract(config.usdt_addr, config.erc20, w);
const helper = new ethers.Contract(config.helper_addr, config.helper, provider);

const reserve0 = ref("USDT");
const reserve1 = ref("MNT");
let reserveItemOne = ref(t('Common.USDT_quantity'));
let reserveItemTWO = ref(t('Common.sell_MNT_quantity'));
let reserveItemThree = ref(t('Common.buy_MNT_quantity'));
let reserveItemFour = ref(t('Common.USDT_quantity'));


const reserve0swap = ref("");
const reserve1swap = ref("");

function swap() {
  let temp = reserve0.value;
  reserve0.value = reserve1.value;
  reserve1.value = temp;
  temp = reserveItemOne.value;
  reserveItemOne.value = reserveItemTWO.value;
  reserveItemTWO.value = temp;
  temp = reserveItemThree.value;
  reserveItemThree.value = reserveItemFour.value;
  reserveItemFour.value = temp;
  reserve0swap.value = "";
  reserve1swap.value = "";
}

let state = 1;


function mnt_prompt() {
  if (ethers.parseEther(user.MNT) < ethers.parseEther("0.1")) {
    showFailToast(t("Common.mnt_prompt"));
    return true;
  }
  return false;
}

async function update0() {
  if (reserve0swap.value == "" || reserve0swap.value == 0) {
    reserve1swap.value = "";
    return true;
  }
  try {
    const amountIn = parseEther(reserve0swap.value);
    const path = ["", ""];
    if (reserve0.value == "USDT") {
      path[0] = config.usdt_addr;
      path[1] = config.weth_addr;
      state = 1;
    } else {
      path[0] = config.weth_addr;
      path[1] = config.usdt_addr;
      state = 2;
    }
    const amounts = await Router02.getAmountsOut(amountIn, path);
    const amountOutMin = amounts[1];
    reserve1swap.value = formatEther(amountOutMin);
    if (reserve0swap.value == "" || reserve0swap.value == 0) {
      reserve1swap.value = "";
      return true;
    }
  } catch (err) {
    console.log(err);
  }
}

async function update1() {
  if (reserve1swap.value == "" || reserve1swap.value == 0) {
    reserve0swap.value = "";
    return true;
  }
  try {
    const amountOut = parseEther(reserve1swap.value);
    const path = ["", ""];
    if (reserve0.value == "USDT") {
      path[0] = config.usdt_addr;
      path[1] = config.weth_addr;
      state = 3;
    } else {
      path[0] = config.weth_addr;
      path[1] = config.usdt_addr;
      state = 4;
    }
    const amounts = await Router02.getAmountsIn(amountOut, path);
    const amountInMax = amounts[0];
    reserve0swap.value = formatEther(amountInMax);
    if (reserve1swap.value == "" || reserve1swap.value == 0) {
      reserve0swap.value = "";
      return true;
    }
  } catch (err) {
    console.log(err);
  }
}

const router02approve = ref(false);

function approveSwap() {
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
        const tx = await USDT.approve(config.router02_addr, ethers.MaxUint256);
        const result = await tx.wait();
        console.log(result);
        //user.set_USDT_approve(true)
        router02approve.value = true;
        //showSuccessToast("交易授权成功");
        showSuccessToast(t("Buy.approve_success"));
      } catch (err) {
        showFailToast(t("Buy.approve_failed"));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

async function trade() {
  if (mnt_prompt()) {
    return;
  }
  if (reserve0swap.value == "" || reserve1swap.value == "") {
    //showFailToast("请填写数据");
    showFailToast(t("Buy.transaction_prompt1"));
    return;
  }
  if (!router02approve.value) {
    //showFailToast("请授权交易");
    showFailToast(t("Buy.transaction_prompt2"));
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
        let tx;
        if (state == 1) {
          const amountIn = parseEther(reserve0swap.value); //constants.WeiPerEther
          const path = [config.usdt_addr, config.weth_addr];
          //const amounts = await Router02.getAmountsOut(amountIn, path)
          const amountOutMin = 0; // amounts[1]
          tx = await Router02.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            path,
            user.address,
            ethers.MaxUint256,
            { gasLimit: 9999999 }
          );
          //console.log(state, '1不精确买入MNT')
        } else if (state == 2) {
          const amountIn = parseEther(reserve0swap.value);
          const path = [config.weth_addr, config.usdt_addr];
          //const amounts = await Router02.getAmountsOut(constants.WeiPerEther, path)
          const amountOutMin = 0; // amounts[1]
          tx = await Router02.swapExactETHForTokens(
            amountOutMin,
            path,
            user.address,
            ethers.MaxUint256,
            { value: amountIn, gasLimit: 9999999 }
          );
          //console.log(state, '2精确卖出MNT')
        } else if (state == 3) {
          const amountOut = parseEther(reserve1swap.value);
          const path = [config.usdt_addr, config.weth_addr];
          //const ret = await Router02.getAmountsIn(amountOut, path)
          const amountInMax = ethers.MaxUint256; //ret[0]
          tx = await Router02.swapTokensForExactETH(
            amountOut,
            amountInMax,
            path,
            user.address,
            ethers.MaxUint256,
            { gasLimit: 9999999 }
          );
          //console.log(state, '3精确买入MNT')
        } else if (state == 4) {
          const amountOut = parseEther(reserve1swap.value);
          const path = [config.weth_addr, config.usdt_addr];
          const amounts = await Router02.getAmountsIn(amountOut, path);
          tx = await Router02.swapETHForExactTokens(
            amountOut,
            path,
            user.address,
            ethers.MaxUint256,
            { value: amounts[0], gasLimit: 9999999 }
          );
          //console.log(state, '4不精确卖出MNT')
        }
        const result = await tx.wait();
        console.log(result);
        reserve0swap.value = "";
        reserve1swap.value = "";
        LoadUserUSDT();
        LoadUserMNT();
        load();
        //showSuccessToast("交易成功");
        showSuccessToast(t("Buy.transaction_success"));
      } catch (err) {
        console.log(err);
        //showFailToast("交易失败");
        showFailToast(t("Buy.transaction_failed"));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

const price = ref(0);

const buyPool = ref(0);

const swapPool = ref(0);

const nodeName = ref("");
async function load() {
  USDT.allowance(user.address, config.router02_addr).then((ret) => {
    if (ret == ethers.MaxUint256) {
      router02approve.value = true;
    }
  });

  USDT.balanceOf(config.pair_addr).then((ret) => {
    swapPool.value = ret;
  });

  provider.getBalance(config.buy_addr).then((ret) => {
    buyPool.value = ret;
  });

  let ret = await Buy.getReserves();
  price.value = BigNumber(ret.pair_usdt).div(ret.pair_mnt).toFixed(4);

  const nodeAddr = await helper.GetNodeAddr(user.address);
  axios.get(`${config.api}friends/info/${nodeAddr}`).then((ret) => {
    nodeName.value = ret.data.community;
  });
  U();
  K();
  loading.value = false;
}

load();




let op = async () => {};

function approveUsdt() {
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
        const tx = await USDT.approve(config.buy_addr, ethers.MaxUint256);
        const result = await tx.wait();
        console.log(result);
        user.set_USDT_approve(true);
        //showSuccessToast("授权成功");
        showSuccessToast(t("Buy.approve_success"));
      } catch (err) {
        //showFailToast("授权失败");
        showFailToast(t("Buy.approve_failed"));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

const buy_v = ref(null);
function buy() {
  if (mnt_prompt()) {
    return;
  }
  if (buy_v.value == "") {
    //showFailToast("请填写USDT数量");
    showFailToast(t("Buy.usdt_prompt"));
    return;
  }
  if (!user.USDT_approve) {
    //showFailToast("请先授权");
    showFailToast(t("Buy.approve_prompt1"));
    return;
  }
  if (parseEther(user.USDT) < parseEther(buy_v.value)) {
    //showFailToast("购买数量过大");
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
        const tx = await Buy.buy(parseEther(buy_v.value), 0, {
          gasLimit: 9999999,
        });
        const result = await tx.wait();
        console.log(result);
        buy_v.value = "";
        LoadUserUSDT();
        load();
        //showSuccessToast("购买成功");
        showSuccessToast(t('Buy.buy_success'));
      } catch (err) {
        showFailToast(t('Buy.transaction_failed'));
      }
      verifyPassword.value = false;
    } else {
      password.value = "";
      //showFailToast("密码错误");
      showFailToast(t("Common.password_error"));
    }
  };
}

const mychartK = ref(null);
let myChartK_ = null;

async function K() {
  const option = {
    title: {
      text: "K",
      textStyle: {
        color: '#8D96A4',
      },
    },
    tooltip: {},
    legend: {},
    xAxis: {
      data: [],
    },
    yAxis: { scale: true },
    series: [
      {
        type: "candlestick",
        itemStyle: {
          color0: "#f64e56",
          color: "#54ea92",
          borderColor0: "#f64e56",
          borderColor: "#54ea92",
        },
        data: [],
      },
    ],
  };

  const ret = await axios.get(`${config.api}K`);
  option.xAxis.data = ret.data.x;
  option.series[0].data = ret.data.series;
  if (myChartK_ == null) {
    myChartK_ = echarts.init(mychartK.value);
  }
  myChartK_.setOption(option);
  if (user.p_address == ethers.ZeroAddress) {
    //showFailToast("请联系社区找被邀请者");
    showFailToast(t("Common.system_prompt"));
    router.push("/friends");
  }
}

const mychartU = ref(null);
let myChartU_ = null;

async function U() {
  const option = {
    title: {
      text: t('Common.quantity'),
      textStyle: {
        color: '#8D96A4',
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      textStyle: {
        color: '#EAECEF'
      }
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: t('Buy.buy'),
        color: "#54ea92",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: t('Buy.sell'),
        color: "#f64e56",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
    ],
  };
  const ret = await axios.get(`${config.api}U`);
  option.xAxis[0].data = ret.data.x;
  // 买入
  option.series[0].data = ret.data.series0;
  // 卖出
  option.series[1].data = ret.data.series1;

  if (myChartU_ == null) {
    myChartU_ = echarts.init(mychartU.value);
  }
  myChartU_.setOption(option);
}
</script>

<style scoped>
.box {
  background-color: #202730;
  padding: 0 24px;
  min-height: 100vh;
}
.title {
  font-size: 18px;
  color: #EAECEF;
  height: 60px;
  line-height: 60px;
}
.node-construction {
  margin: 18px 0 0;
  background-color: #29313D;
  padding: 0 16px;
  --van-cell-group-inset-radius: 12px;
}
.node-constructionContent {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  padding-left: 0;
  padding-right: 0; 
}
.node-constructionContentTwo {
  font-size: 16px;
  color: #8D96A4;
}
.input-USDT {
  background-color: #202730;
  height: 48px;
  border: none;
  border-radius: 8px;
  margin-top: 13px;
  color: #EAECEF;
  padding-left: 16px;
  --van-field-input-text-color: #EAECEF;
}
input[type="number"]::placeholder {
  color: #555E6B;
  font-size: 14px;
}

.input-tailText {
  font-size: 16px;
  color: #EAECEF;
  position: absolute;
  right: 7%;
  top: 55%;
}
.buyMnt-btn {
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
.trading-depth {
  margin: 0;
  background-color: #29313D;
  padding: 0 6px;
  --van-cell-group-inset-radius: 12px;
}
.trading-depth-content {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  padding-left: 0;
  padding-right: 0; 
}
.input-switch {
  background-color: #202730;
  height: 48px;
  border: none;
  border-radius: 8px;
  color: #EAECEF;
  padding-left: 0;
  padding-right: 0;
  --van-field-input-text-color: #EAECEF;
  --van-field-label-color: #8D96A4;
  font-size: 16px;
  --van-field-label-width: 5.0em;
}
/* .input-tailTextLeft {
  font-size: 12px;
  color: #EAECEF;
  position: absolute;
  right: 15%;
  top: 35%;
}
.input-tailTextRight {
  font-size: 12px;
  color: #EAECEF;
  position: absolute;
  right: 15%;
  top: 35%;
} */
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
.rotate {
  transform: rotate(90deg);
}
</style>