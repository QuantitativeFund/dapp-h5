<template>
  <div class="box">
    <div class="title">
      <div class="title-img" @click="onClickLeft"><img src="../images/tb-head-FanHui.png" alt=""></div>
      <div class="title-content">{{ t('UsdtMnt.MNT_running_water') }}</div>
    </div>
    <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 90vh" v-show="mnt.length != 0">
      <van-cell-group v-for="(obj, key) in mnt" :key="key" class="mnt-stream" inset>
        <van-cell title="MNT"
          :value="obj.from.toLowerCase() == user.address.toLowerCase() ? t('Common.transfer_out') : t('Common.transfer_in')"
          :class="obj.from.toLowerCase() == user.address.toLowerCase() ? 'mnt-stream-contentOne' : 'mnt-stream-contentOneOUT'"
          :border="false" />
        <van-cell :title="t('Common.time')" :value="timeFormat(obj.timestamp)" class="mnt-stream-content"
          :border="false" />
        <van-cell :title="t('Common.quantity')" :value="BigNumber(ethers.formatEther(obj.value)).toFixed(4)"
          class="mnt-stream-content" :border="false" />

        <van-cell :title="t('Common.address')"
          :value="getStr(obj.from.toLowerCase() == user.address.toLowerCase() ? obj.to : obj.from)"
          class="mnt-stream-content" :border="false">
          <template #right-icon>
            <AddressCopy :address="obj.from.toLowerCase() == user.address.toLowerCase() ? obj.to : obj.from">
            </AddressCopy>
          </template>
        </van-cell>
      </van-cell-group>
      <div style="height: 1px; background-color: #202730; margin-top:100vh"></div>
    </van-pull-refresh>
    <van-empty :description="t('UsdtMnt.data_empty')" v-show="mnt.length == 0" />
  </div>
</template>

<script setup>
import { userStore } from "@/stores/user.js";
import axios from "axios";
import { ref } from "vue";
import { timeFormat, addrFormat, AddrName } from "@/utils/helper.js";
import BigNumber from "bignumber.js";
import AddressCopy from "@/components/AddressCopy.vue";
import { config } from "@/const/config";
import { useI18n } from "vue-i18n";
import HomeIn from "@/components/HomeIn.vue";
import { ethers } from "ethers";
const { t } = useI18n();

const user = userStore();
const mnt = ref([]);
const loading = ref(false);

function getStr(f) {
  const a = AddrName(f);
  if (ethers.isAddress(a)) {
    return addrFormat(a);
  } else {
    return a;
  }
}

async function load() {
  /*
  const ret = await axios.get(
    `https://main.metabasenet.site/main-api/transaction/getLastedTransfer/0x000000000000000000000000000000000000000/${user.address}`
  );
  mnt.value = ret.data.data;
  console.log(mnt.value);
  loading.value = false;
  */

  const coder = ethers.AbiCoder.defaultAbiCoder();
  const topic1 = coder.encode(['address'], [user.address]);
  const topic2 = topic1;
  const ret = await axios.post(
    'https://main.metabasenet.site/main-api/api/getLogs',
    {
      "contractAddress": ethers.ZeroAddress,
      "fromNumber": "0",
      "toNumber": "latest",
      "limit": 40,
      "page": 0,
      "pageSize": 0,
      "order": "desc",
      "topics": [
        {
          "operate": [
            "and"
          ],
          "topic": [
            {
              "name": "topic0",
              "value": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            },
            {
              "name": "topic1",
              "value": topic1
            }
          ]
        },
        {
          "operate": [
            "and"
          ],
          "topic": [
            {
              "name": "topic0",
              "value": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            },
            {
              "name": "topic2",
              "value": topic2
            }
          ]
        }
      ]
    }
  );
  console.log('===========',topic1, topic2);
  const data = [];
  for (let i = 0; i < ret.data.data.list.length; i++) {
    const obj = ret.data.data.list[i];
    const from = coder.decode(["address"], obj.topic1)[0];
    const to = coder.decode(["address"], obj.topic2)[0];
    const value = coder.decode(["uint256"], obj.data)[0];
    const timestamp = obj.timestamp;
    //console.log(obj);
    //    from
    //: 
    //"0x78fA2B0D588Ef15F6D6AAB3d11b31DB9161586C9"
    //hash
    //: 
    //"0x0305b6e3319713c0b51a2d959e5d08a2de0dd4bf471cae3c4cecf0a05ce386c8"
    //timestamp
    //: 
    //1716588361
    //to
    //: 
    //"0x39190bd57F5B9159DffFcA39bB5b685E02720883"
    //value
    //: 
    //"5683641492470200000000"

    data.push({ from: from, to: to, value: value, timestamp: timestamp, hash: obj.transactionHash });
    console.log(i, obj.transactionHash);
  }

  console.log(data);
  mnt.value = data;
  console.log(mnt.value);
  loading.value = false;

}

load();

function onClickLeft() {
  history.back();
}
</script>

<style scoped>
.box {
  background-color: #202730;
  padding: 0 24px;
  min-height: 100vh;
}

.title {
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.title-img {
  vertical-align: middle;
}

.title-content {
  vertical-align: middle;
  font-size: 18px;
  color: #EAECEF;
}

.mnt-stream {
  --van-cell-group-background: #29313D;
  --van-cell-group-inset-radius: 12px;
  margin: 18px 0;
}

.mnt-stream-content {
  --van-cell-background: #29313D;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  font-size: 16px;
  position: static;
}

.mnt-stream-contentOne {
  --van-cell-background: #29313D;
  --van-cell-text-color: #EAECEF;
  --van-cell-value-color: #F15057;
  font-size: 17px;
  position: static;
}

.mnt-stream-contentOneOUT {
  --van-cell-background: #29313D;
  --van-cell-text-color: #EAECEF;
  --van-cell-value-color: #00B275;
  font-size: 17px;
  position: static;
}
</style>