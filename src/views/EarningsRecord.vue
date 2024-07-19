<template>
    <div class="box">
        <div class="title">
            <div class="title-img" @click="userPage"><img src="../images/tb-head-FanHui.png" alt=""></div>
            <div class="title-content">{{ t('User.income_detail') }}</div>
        </div>
        <van-pull-refresh v-model="loading0" @refresh="load0" style="min-height: 100vh;">
            <template v-for="(obj, key) in childs0" :key="key">
                <van-cell-group inset class="income-content" :border="false">
                    <van-cell :title="t('Common.time')" :value="timeFormat(obj.utc)" class="income-contentItem"
                        :border="false" />
                    <van-cell :title="t('Common.quantity')" :value="`${BigNumber(obj.value).toFixed(4)} MNT`"
                        class="income-contentItem" :border="false" />
                    <van-cell :title="t('Common.type')"
                        :value="obj.type == 2 ? t('User.node_income') : t('User.mining_income')"
                        class="income-contentItem" :border="false" />
                    <van-cell />
                </van-cell-group>
                <van-empty v-show="childs0.length == 0" :description="t('User.income_detail')" />
            </template>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ethers, parseEther, isAddress } from "ethers";
import axios from "axios";
import BigNumber from "bignumber.js";
import { userStore } from "@/stores/user.js";
import {
    timeFormat,
} from "@/utils/helper.js";
import { config } from "@/const/config";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const user = userStore();
const router = useRouter();

const loading0 = ref(false);
const childs0 = ref([]);

load0();
async function load0() {
    const coder = ethers.AbiCoder.defaultAbiCoder();
    const topic1 = coder.encode(['address'], [user.address]);
    const ret = await axios.post(
        'https://main.metabasenet.site/main-api/api/getLogs',
        {
            "contractAddress": config.mining_addr,
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
                            "value": "0x4cd36fb76975ab408e67b9ff3c17b4dd03112963aed18ccd8907a0c8b77daec2"
                        },
                        {
                            "name": "topic1",
                            "value": topic1
                        }
                    ]
                }
            ]
        }
    );
    const data = [];
    for (let i = 0; i < ret.data.data.list.length; i++) {
        const obj = ret.data.data.list[i];
        const vs = coder.decode(["uint256", "uint256"], obj.data);
        const value = vs[0];
        const t = vs[1];
        data.push({ value: ethers.formatEther(value), type: t, utc: obj.timestamp });
    }
    childs0.value = data;
    loading0.value = false;
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