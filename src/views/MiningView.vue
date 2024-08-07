<template>
  <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
    <van-tabs sticky animated swipeable v-model:active="active">
      <van-tab title="挖矿">
        <van-cell-group inset>
          <van-cell title="预计挖矿收益" :value="income" />
          <van-cell title="挖矿倒计时">
            <template #icon>
              <van-icon name="diamond-o" color="gold" class="cell_icon" />
            </template>
            <template #title>
              <van-count-down :time="cd_mining" format="DD day HH:mm:ss" />
            </template>
            <template #value>
              <van-button type="success" @click="voteMining" :disabled="voteMiningStr == '提交'" size="small">{{
                voteMiningStr }}</van-button>
            </template>
          </van-cell>

          <van-cell title="QFT" :value="BigNumber(user.QFT).toFixed(6)">
            <template #icon>
              <img src="/qft.svg" class="cell_icon" alt="qft">
            </template>
          </van-cell>

          <van-field label="投票数量" type="number" v-model="vote_in" placeholder="请输入投票数量" />
          <van-cell title="投票">
            <template #icon>
              <van-icon name="plus" color="green" class="cell_icon" />
            </template>
            <template #value>
              <van-space>
                <van-button type="primary" v-show="user.Q_Approve == false" @click="QFT_Approve"
                  size="small">授权</van-button>
                <van-button type="primary" :disabled="user.Q_Approve == false" @click="voteIn"
                  size="small">投票</van-button>
              </van-space>
            </template>
          </van-cell>
          <van-cell title="已投数量" :value="BigNumber(ethers.formatEther(info.vote)).toFixed(6)">
            <template #icon>
              <van-icon name="plus" class="cell_icon" />
            </template>
          </van-cell>
          <van-field label="撤投数量" type="number" v-model="vote_out" placeholder="请输入撤投数量" />
          <van-cell title="撤投">
            <template #icon>
              <van-icon name="minus" color="red" class="cell_icon" />
            </template>
            <template #value>
              <van-button type="primary" @click="voteOut1" size="small">撤投</van-button>
            </template>
          </van-cell>
          <van-cell v-show="info.out_vote > 0" title="已撤数量"
            :value="BigNumber(ethers.formatEther(info.out_vote)).toFixed(6)">
            <template #icon>
              <van-icon name="minus" class="cell_icon" />
            </template>
          </van-cell>
          <van-cell v-show="info.out_vote > 0">
            <template #icon>
              <van-icon name="diamond-o" color="gold" class="cell_icon" />
            </template>
            <template #title>
              <van-count-down :time="cd_out2" format="DD day HH:mm:ss" />
            </template>
            <template #value>
              <van-button type="success" :disabled="cd_out2 > 0" @click="voteOut2" size="small">领取撤投</van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="算力明细">
        <van-cell-group inset>
          <van-cell title="空投数量" :value="BigNumber(ethers.formatEther(info.airdrop)).toFixed(6)" />
          <van-cell title="投票数量" :value="BigNumber(ethers.formatEther(info.vote)).toFixed(6)" />
          <van-cell title="基本算力" label="(投票+空投)^1.125/100"
            :value="BigNumber(ethers.formatEther(info.vote_power)).toFixed(6)" />
          <van-cell title="撤投数量" :value="BigNumber(ethers.formatEther(info.out_vote)).toFixed(6)" />
          <van-cell title="撤投高度" :label="`当前高度:${bn}`" :value="Number(info.out_height)" />
          <van-cell title="个人周期" :label="`全局周期:${Number(epoch)}`" :value="Number(info.epoch)" />
          <van-cell title="提交算力" :label="`百分比: ${percentage(info.real_power, whole_power)}%`"
            :value="BigNumber(ethers.formatEther(info.real_power)).toFixed(4)" />
          <van-cell title="全局算力" :value="BigNumber(ethers.formatEther(whole_power)).toFixed(4)" />
        </van-cell-group>

        <template v-for="obj, key in minings" :key="key">
          <br />
          <van-cell-group inset>
            <van-cell :title="getTitle(key)" :value="getValue(key)">
              <template #icon>
                <van-icon :name="key == 1 ? 'user-o' : 'like-o'" :color="getColor(key)" class="cell_icon" />
              </template>
            </van-cell>
            <van-cell title="贡献百分比" :value="get_percentage(key)">
              <template #icon>
                <van-icon name="info-o" :color="getColor(key)" class="cell_icon" />
              </template>
            </van-cell>
            <van-cell title="空投数量" :value="BigNumber(ethers.formatEther(obj.info.airdrop)).toFixed(6)" >
              <template #icon>
                <van-icon name="guide-o" :color="getColor(key)" class="cell_icon" />
              </template>
            </van-cell>
            <van-cell title="投票数量" :value="BigNumber(ethers.formatEther(obj.info.vote)).toFixed(6)" >
              <template #icon>
                <van-icon name="cash-o" :color="getColor(key)" class="cell_icon" />
              </template>
            </van-cell>
          
            <van-cell title="基本算力" :value="BigNumber(ethers.formatEther(obj.info.vote_power)).toFixed(4)">
              <template #icon>
                <van-icon :name="getIcon(key)" :color="getColor(key)" class="cell_icon" />
              </template>
            </van-cell>

            <van-cell title="链接地址" :value="addrFormat(obj.addr)">
              <template #icon>
                <van-icon name="friends-o" :color="getColor(key)" class="cell_icon" />
              </template>
              <template #right-icon>
                <AddressCopy :address="obj.addr"></AddressCopy>
              </template>
            </van-cell>

          </van-cell-group>
        </template>
      </van-tab>
    </van-tabs>
  </van-pull-refresh>
</template>
<script setup>
import { ref, computed, registerRuntimeCompiler } from "vue";
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
import BigNumber from 'bignumber.js';
import { userStore } from '@/stores/user.js';
import { Provider, Singer } from "@/utils/metamask.js";
import { ethers } from "ethers";
import { useI18n } from "vue-i18n";
import { config } from "../const/config";
import { LoadUserQFT, percentage, addrFormat } from "../utils/helper";
import AddressCopy from '@/components/AddressCopy.vue';

const { t } = useI18n();
const user = userStore();

const active = ref(0);

const loading = ref(false);

const cd_mining = ref(0);
const cd_out2 = ref(0);

const minings = ref([]);
const bn = ref(0);
const begin = ref(0);
const epoch = ref(0);
const epoch_height = ref(0);
const totalSupply = ref(0);
const whole_power = ref(0);
const real_power = ref(0);

const info = ref({ airdrop: 0, vote: 0, vote_power: 0, real_power: 0, out_vote: 0, out_height: 0, epoch: 0 });

function getTitle(key) {
  if (key == 0) {
    return "上级贡献";
  } else if (key == 1) {
    return "自身贡献";
  } else {
    return `下级${key - 1}贡献`;
  }
}

function getValue(key) {
  let vp = minings.value[1].info.vote_power;
  if (key == 0) {
    if (minings.value[0].info.vote_power < vp) {
      vp = minings.value[0].info.vote_power;
    }
  } else if (key == 1) {
    vp = vp * 6n;
  } else {
    if (minings.value[key].info.vote_power < vp) {
      vp = minings.value[key].info.vote_power;
    }
  }
  return `${BigNumber(ethers.formatEther(vp)).toFixed(4)}`;
}

function get_percentage(key) {
  let vp = minings.value[1].info.vote_power;
  if (key == 1) {
    vp = vp * 6n;
  } else {
    if (minings.value[key].info.vote_power < vp) {
      vp = minings.value[key].info.vote_power;
    }
  }
  return `${percentage(vp, real_power.value)}%`;
}

function getIcon(key) {
  let vp = minings.value[1].info.vote_power;
  if (key == 1) {
    return "user-circle-o";
  } else {
    if (minings.value[key].info.vote_power < vp) {
      return "down";
      //return "good-job-o";
    } else {
      return "good-job-o";
    }
  }
}

function getColor(key) {
  let vp = minings.value[1].info.vote_power;
  if (key == 1) {
    return "green";
  } else {
    if (minings.value[key].info.vote_power < vp) {
      //return "gold";
      return "red";
    } else {
      return "gold";
    }
  }
}

async function load() {

  const helper = new ethers.Contract(config.helper_addr, config.helper, Provider);

  helper.MiningInfo(user.address).then((ret) => {
    minings.value = ret.infos;

    bn.value = ret.bn;
    begin.value = ret.begin;
    epoch.value = ret.epoch;
    epoch_height.value = ret.epoch_height;
    totalSupply.value = ret.totalSupply;
    whole_power.value = ret.whole_power;
    real_power.value = ret.real_power;

    info.value.airdrop = ret.infos[1].info.airdrop;
    info.value.vote = ret.infos[1].info.vote;
    info.value.vote_power = ret.infos[1].info.vote_power;
    info.value.real_power = ret.infos[1].info.real_power;
    info.value.out_vote = ret.infos[1].info.out_vote;
    info.value.out_height = ret.infos[1].info.out_height;
    info.value.epoch = ret.infos[1].info.epoch;

    cd_mining.value = BigNumber(epoch.value)
      .times(epoch_height.value)
      .plus(begin.value)
      .minus(bn.value)
      .times(1000)
      .toNumber();
    if (cd_mining.value < 0) {
      cd_mining.value = 0;
    }
    const v = (info.value.out_height + epoch_height.value * 2n - bn.value) * 1000n;
    if (v > 0) {
      cd_out2.value = Number(v);
    } else {
      cd_out2.value = 0;
    }
    loading.value = false;
  });
}


const voteMiningStr = computed(() => {
  if (info.value.epoch == 0) {
    return "启动挖矿";
  }
  if (epoch.value > info.value.epoch) {
    return "领取收益";
  }
  // < 
  if (BigNumber(info.value.epoch).times(epoch_height.value).plus(begin.value).lt(bn.value)) {
    return "领取收益";
  } else {
    if (info.value.real_power >= real_power.value) {
      // 按钮禁用
      return "提交";
    } else {
      return "提交算力";
    }
  }
});

const income = computed(() => {
  if (whole_power.value > 0) {
    const height_profit = new BigNumber(1);
    const ret = new BigNumber(
      height_profit.times(epoch_height.value).times(info.value.real_power)
    ).div(whole_power.value);
    return `${ret.toFixed(4)}`;
  } else {
    return "NaN";
  }
});

async function QFT_Approve() {
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })

  const QFT = new ethers.Contract(config.qft_addr, config.erc20, Singer);
  const tx = await QFT.approve(config.mining_addr, ethers.MaxUint256);
  tx.wait().then(async () => {
    user.set_QFT_approve(true);
    showSuccessToast('授权成功');
  });
}

async function voteMining() {
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {
    const Mining = new ethers.Contract(config.mining_addr, config.mining, Singer);
    const tx = await Mining.voteMining();
    tx.wait().then(async () => {
      load();
      LoadUserQFT();
      showSuccessToast('挖矿成功');
    });
  } catch (err) {
    console.log(err);
    showFailToast('挖矿失败');
  }
}

const vote_in = ref(0);
async function voteIn() {
  if (ethers.parseEther(user.QFT.toString()) < ethers.parseEther(vote_in.value.toString())) {
    showFailToast("投票金额过大");
    return;
  }
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {
    const Mining = new ethers.Contract(config.mining_addr, config.mining, Singer);
    const tx = await Mining.voteIn(ethers.parseEther(vote_in.value.toString()));
    tx.wait().then(async () => {
      vote_in.value = 0;
      load();
      LoadUserQFT();
      showSuccessToast('投票成功');
    });
  } catch (err) {
    console.log(err);
    showFailToast('投票失败');
  }
}

const vote_out = ref(0);
async function voteOut1() {
  if (info.value.vote < ethers.parseEther(vote_out.value.toString())) {
    showFailToast("撤投金额过大");
    return;
  }
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {
    const Mining = new ethers.Contract(config.mining_addr, config.mining, Singer);
    const tx = await Mining.voteOut1(ethers.parseEther(vote_out.value.toString()));
    tx.wait().then(async () => {
      vote_out.value = 0;
      load();
      showSuccessToast('撤投成功');
    });
  } catch (err) {
    console.log(err);
    showFailToast('撤投失败');
  }
}

async function voteOut2() {
  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  try {
    const Mining = new ethers.Contract(config.mining_addr, config.mining, Singer);
    const tx = await Mining.voteOut2();
    tx.wait().then(async () => {
      load();
      LoadUserQFT();
      showSuccessToast('领取成功');
    });
  } catch (err) {
    console.log(err);
    showFailToast('领取失败');
  }
}

load();

</script>