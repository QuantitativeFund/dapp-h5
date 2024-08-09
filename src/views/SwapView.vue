<template>
  <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
    <van-tabs sticky animated swipeable v-model:active="active">
      <van-tab title="交易所">
        <van-cell-group inset>
          <van-cell title="交易深度" :value="usdt_depth" label="USDT">
            <template #icon>
              <img src="/usdt.png" class="cell_icon" alt="usdt">
            </template>
            <template #right-icon>
              <van-icon name="exchange" color="blue" style="margin-left: 10px;" class="cell_icon" />
            </template>
          </van-cell>
          <van-cell title="QFT价格" :value="price" label="USDT">
            <template #icon>
              <img src="/qft.png" class="cell_icon" alt="qft">
            </template>
            <template #right-icon>
              <van-icon name="exchange" color="blue" style="margin-left: 10px;" class="cell_icon" />
            </template>
          </van-cell>
          <van-cell title="USDT数量" :value="BigNumber(user.USDT).toFixed(6)">
            <template #icon>
              <img src="/usdt.png" class="cell_icon" alt="usdt">
            </template>
            <template #right-icon>
              <van-icon name="user-o" color="green" style="margin-left: 10px;" class="cell_icon" />
            </template>
          </van-cell>
          <van-cell title="QFT数量" :value="BigNumber(user.QFT).toFixed(6)">
            <template #icon>
              <img src="/qft.png" class="cell_icon" alt="qft">
            </template>
            <template #right-icon>
              <van-icon name="user-o" color="green" style="margin-left: 10px;" class="cell_icon" />
            </template>
          </van-cell>
          <van-field v-model="USDT" label="USDT" @update:model-value="update(true)" type="number" placeholder="输入数量"
            :class="{ B: true, exchangeTop: exchange }" autocomplete="false" clearable>
            <template #left-icon>
              <img src="/usdt.png" class="cell_icon" alt="usdt">
            </template>
            <!-- <template #right-icon>
              <img src="/sale.png" class="cell_icon" alt="sale">
            </template> -->
          </van-field>
          <van-cell value-class="exchange">
            <van-button size="small" icon="exchange" style="transform: rotate(90deg);" color="green"
              @click="Exchange" />
          </van-cell>
          <van-field v-model="QFT" label="QFT" @update:model-value="update(false)" type="number" placeholder="输入数量"
            :class="{ B: true, exchangeBottom: exchange }" autocomplete="true" clearable>
            <template #left-icon>
              <img src="/qft.png" class="cell_icon" alt="qft">
            </template>
            <!-- <template #right-icon>
              <img src="/sale.png" class="cell_icon" alt="sale">
            </template> -->
          </van-field>
          <van-cell value-class="exchange">
            <van-space>
              <van-button v-if="!USDT_A" size="small" type="primary"
                @click="Approve(config.usdt_addr)">授权USDT</van-button>
              <van-button v-if="!QFT_A" size="small" type="primary" @click="Approve(config.qft_addr)">授权QFT</van-button>
              <van-button v-show="USDT_A && QFT_A" size="small" type="primary" @click="Swap">交易</van-button>
            </van-space>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="量子社区">
        <van-cell-group inset>
        </van-cell-group>
      </van-tab>
    </van-tabs>
  </van-pull-refresh>
</template>
<script setup>
import { ref } from 'vue';
import axios from "axios";
import { userStore } from '@/stores/user.js';
import { config } from "@/const/config";
import { timeFormat, addrFormat, InitUser } from "@/utils/helper.js";
import { ethers } from 'ethers';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
import { useI18n } from "vue-i18n";
import { Provider, Singer } from "@/utils/metamask.js";
import BigNumber from 'bignumber.js';

const { t } = useI18n();
const active = ref(0);
const loading = ref(false);
const user = userStore();

const exchange = ref(false);

const USDT = ref();
const QFT = ref();

const USDT_A = ref(true);
const QFT_A = ref(true);


function Exchange() {
  exchange.value = !exchange.value;
  USDT.value = undefined;
  QFT.value = undefined;
}

async function Swap() {
  if (isUsdtEdit) {
    if (USDT.value == undefined || USDT.value == 0) {
      showFailToast("USDT不能为空");
      return;
    }
  } else {
    if (QFT.value == undefined || QFT.value == 0) {
      showFailToast("QFT不能为空");
      return;
    }
  }
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {

    let tx;
    const Router01 = new ethers.Contract(config.router01_addr, config.router01, Singer);
    if (exchange.value) {
      if (isUsdtEdit) {
        tx = await Router01.swapTokensForExactTokens(ethers.parseEther(USDT.value.toString()), ethers.MaxUint256, [config.qft_addr, config.usdt_addr], user.address, ethers.MaxUint256);
      } else {
        tx = await Router01.swapExactTokensForTokens(ethers.parseEther(QFT.value.toString()), 0n, [config.qft_addr, config.usdt_addr], user.address, ethers.MaxUint256);
      }
    } else {
      if (isUsdtEdit) {
        tx = await Router01.swapExactTokensForTokens(ethers.parseEther(USDT.value.toString()), 0n, [config.usdt_addr, config.qft_addr], user.address, ethers.MaxUint256);
      } else {
        tx = await Router01.swapTokensForExactTokens(ethers.parseEther(QFT.value.toString()), ethers.MaxUint256, [config.usdt_addr, config.qft_addr], user.address, ethers.MaxUint256);
      }
    }
    tx.wait().then(async () => {
      USDT.value = undefined;
      QFT.value = undefined;
      load();
      showSuccessToast('交易成功');
    });

  } catch (err) {
    console.log(err);
    showFailToast('交易失败');
  }
}

let isUsdtEdit = false;

async function update(isUSDT) {
  console.log(isUSDT, USDT.value, QFT.value);
  if (isUSDT) {
    if (USDT.value == undefined || USDT.value == 0) {
      return;
    }
  } else {
    if (QFT.value == undefined || QFT.value == 0) {
      return;
    }
  }
  isUsdtEdit = isUSDT;
  const Router01 = new ethers.Contract(config.router01_addr, config.router01, Provider);
  if (exchange.value) {
    if (isUSDT) {
      const rets = await Router01.getAmountsIn(ethers.parseEther(USDT.value.toString()), [config.qft_addr, config.usdt_addr]);
      QFT.value = ethers.formatEther(rets[0]);
    } else {
      const rets = await Router01.getAmountsOut(ethers.parseEther(QFT.value.toString()), [config.qft_addr, config.usdt_addr]);
      USDT.value = ethers.formatEther(rets[1]);
    }
  } else {
    if (isUSDT) {
      const rets = await Router01.getAmountsOut(ethers.parseEther(USDT.value.toString()), [config.usdt_addr, config.qft_addr]);
      QFT.value = ethers.formatEther(rets[1]);
    } else {
      const rets = await Router01.getAmountsIn(ethers.parseEther(QFT.value.toString()), [config.usdt_addr, config.qft_addr]);
      USDT.value = ethers.formatEther(rets[0]);
    }
  }
}

async function Approve(addr) {
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {
    const C = new ethers.Contract(addr, config.erc20, Singer);
    const tx = await C.approve(config.router01_addr, ethers.MaxUint256);
    tx.wait().then(async () => {
      load();
      showSuccessToast('授权成功');
    });
  } catch (err) {
    console.log(err);
    showFailToast('授权失败');
  }
}

const price = ref(0);
const usdt_depth = ref(0);

async function load() {
  //let ret = await axios.get(`${config.api}charitable/user/${user.address}`);
  //charitable.value = ret.data;
  //ret = await axios.get(`${config.api}charitable/admin/0`);
  //admin_charitable.value = ret.data;
  const P = new ethers.Contract(config.pair_addr, config.pair, Provider);
  const reserves = await P.getReserves();
  let res_u;
  let res_q;
  if (config.usdt_addr < config.qft_addr) {
    res_u = BigNumber(ethers.formatEther(reserves[0]));
    res_q = BigNumber(ethers.formatEther(reserves[1]));

  } else {
    res_u = BigNumber(ethers.formatEther(reserves[1]));
    res_q = BigNumber(ethers.formatEther(reserves[0]));
  }

  price.value = res_u.div(res_q).toFixed(6);
  usdt_depth.value = res_u.toFixed(4);

  const U = new ethers.Contract(config.usdt_addr, config.erc20, Provider);
  const Q = new ethers.Contract(config.qft_addr, config.erc20, Provider);
  if (ethers.MaxUint256 == await U.allowance(user.address, config.router01_addr)) {
    USDT_A.value = true;
  } else {
    USDT_A.value = false;
  }
  if (ethers.MaxUint256 == await Q.allowance(user.address, config.router01_addr)) {
    QFT_A.value = true;
  } else {
    QFT_A.value = false;
  }
  InitUser();
  loading.value = false;
}

load();

</script>

<style>
.B {
  transition: transform 1s ease-in-out;
}

.exchangeTop {
  transform: translateY(96.5px);
}

.exchangeBottom {
  transform: translateY(-96.5px);
}

.exchange {
  text-align: center;
}
</style>
