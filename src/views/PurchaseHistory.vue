<template>
    <div class="box">
        <div class="title">
            <div class="title-img" @click="userPage"><img src="../images/tb-head-FanHui.png" alt=""></div>
            <div class="title-content">{{ t('User.buy_detail') }}</div>
        </div>
        <van-pull-refresh v-model="loading1" @refresh="load1" style="min-height: 100vh;">
            <van-empty v-show="childs1.length == 0" :description="t('User.buy_detail')" />
            <template v-for="(obj, key) in childs1" :key="key">
                <van-cell-group inset class="income-content" :border="false">
                    <van-cell :title="t('Common.time')" :value="timeFormat(obj.utc)" class="income-contentItem"
                        :border="false" />
                    <van-cell :title="t('Common.quantity')" :value="`${BigNumber(obj.value).toFixed(6)} USDT`"
                        class="income-contentItem" :border="false" />
                    <van-cell :title="t('Common.type')"
                        :value="obj.type == 1 ? t('User.node_buy') : t('User.exchange_buy')" class="income-contentItem"
                        :border="false" />
                    <van-cell />
                </van-cell-group>
            </template>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { userStore } from "@/stores/user.js";
import {
    timeFormat,
} from "@/utils/helper.js";
import { config } from "@/const/config";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const user = userStore();
const router = useRouter();

const loading1 = ref(false);
const childs1 = ref([]);

load1();
async function load1() {
    /*
    const ret = await axios.get(`${config.api}user/buy/${user.address}`);
    childs1.value = ret.data;
    loading1.value = false;
    */

    const coder = ethers.AbiCoder.defaultAbiCoder();
    const topic1 = coder.encode(['address'], [user.address]);
    const topic2_1 = coder.encode(['address'], [config.pair_addr]);
    const topic2_2 = coder.encode(['address'], [config.buy_addr]);

    const ret = await axios.post(
        'https://main.metabasenet.site/main-api/api/getLogs',
        {
            "contractAddress": config.usdt_addr,
            "fromNumber": "0",
            "toNumber": "latest",
            "limit": 40,
            "page": 0,
            "pageSize": 0,
            "order": "desc",
            "topics": [
                {
                    "operate": [
                        "and", "and"
                    ],
                    "topic": [
                        {
                            "name": "topic0",
                            "value": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                        },
                        {
                            "name": "topic1",
                            "value": topic1
                        },
                        {
                            "name": "topic2",
                            "value": topic2_1
                        }
                    ]
                },
                {
                    "operate": [
                        "and", "and"
                    ],
                    "topic": [
                        {
                            "name": "topic0",
                            "value": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                        },
                        {
                            "name": "topic1",
                            "value": topic1
                        },
                        {
                            "name": "topic2",
                            "value": topic2_2
                        }
                    ]
                }
            ]
        }
    );
    const data = [];
    for (let i = 0; i < ret.data.data.list.length; i++) {
        const obj = ret.data.data.list[i];
        const to = coder.decode(["address"], obj.topic2)[0];
        const value = ethers.formatEther(coder.decode(["uint256"], obj.data)[0]);
        const timestamp = obj.timestamp;
        let t = 2;
        if (to.toLowerCase() === config.buy_addr.toLowerCase()) {
            t = 1;
        }
        data.push({ type: t,  value: value, utc: timestamp });
        console.log(obj);
    }
    childs1.value = data;
    console.log(childs1.value);
    loading1.value = false;
}

function userPage() {
    router.push('user')
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
    font-size: 18px;
    color: #EAECEF;
    vertical-align: middle;
}

.income-content {
    background-color: #29313D;
    --van-cell-group-inset-radius: 12px;
    margin-top: 15px;
}

.income-contentItem {
    --van-cell-background: #29313D;
    --van-cell-text-color: #8D96A4;
    font-size: 16px;
    --van-cell-value-color: #EAECEF;
}

:deep(.van-cell) {
    background: none;
}
</style>