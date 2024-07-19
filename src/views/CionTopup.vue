<template>
    <div class="box">
        <div class="title">
            <div class="title-img" @click="userPage"><img src="../images/tb-head-FanHui.png" alt=""></div>
            <div class="title-content">{{ t('HomeIn.recharge') }}</div>
        </div>
        <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
            <van-cell-group class="eth-transferContent" :border="false">
                <van-cell :title="`BNB ${t('Common.quantity')}`" :value="BigNumber(bnb).toFixed(4)"
                    class="eth-transferContent-item" :border="false" />
                <van-cell :title="`USDT ${t('Common.quantity')}`" :value="BigNumber(bnb_usdt).toFixed(4)"
                    class="eth-transferContent-item" :border="false" />

                <div class="withdrawal-method">{{ t('HomeIn.recharge_quantity') }}</div>
                <div style="margin-top: 12px;position: relative;">
                    <van-field type="number" v-model="bnb_usdt_in" autocomplete="off" input-align="left"
                        class="input-withdrawalNumber" :border="false" />
                    <div style="position: absolute; font: 17px; color:#ADB6C4; right: 5%; top: 35%;">USDT</div>
                </div>

                <van-button v-if="!approved" @click="accredit" class="withdrawal-btn">BNB-USDT
                    {{ t('Buy.approve') }}</van-button>
                <van-button v-else @click="bnb_in" class="withdrawal-btn">BNB-USDT
                    {{ t('HomeIn.recharge') }}</van-button>

            </van-cell-group>
        </van-pull-refresh>
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
import { ref } from 'vue';
//import axios from 'axios';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
import { ethers } from 'ethers';

import { config } from '@/const/config';
import { userStore } from '@/stores/user.js';
import BigNumber from 'bignumber.js';
import { useI18n } from "vue-i18n";
import router from '@/router';
const { t } = useI18n();

const user = userStore();
const verifyPassword = ref(false);
const password = ref('');

const loading = ref(false);

const provider = new ethers.JsonRpcProvider(config.rpc_bnb);

const approved = ref(false);

const bnb_usdt_in = ref('');
const bnb_usdt = ref('');
const bnb = ref('');

function load() {
    const U = new ethers.Contract(config.bsc_usdt_addr, config.erc20, provider);
    U.allowance(user.address, config.bsc_bridge).then((ret) => {
        if (ret == ethers.MaxUint256) {
            approved.value = true;
        } else {
            approved.value = false;
        }
    });

    U.balanceOf(user.address).then((ret) => {
        bnb_usdt.value = ethers.formatEther(ret);
    });

    provider.getBalance(user.address).then((ret) => {
        bnb.value = ethers.formatEther(ret);
        loading.value = false;
    });
}

load();

let op = async () => {
}


async function accredit() {
    if (ethers.parseEther(bnb.value) < ethers.parseEther('0.01')) {
        showFailToast('BNB < 0.01');
        return;
    }

    verifyPassword.value = true;
    op = async () => {
        if (password.value == user.password) {
            password.value = "";
            showLoadingToast({
                message: t("Common.submitting"), //'提交中...',
                forbidClick: true,
                duration: 0,
            });
            verifyPassword.value = false;
            try {
                const w = new ethers.Wallet(user.privateKey, new ethers.JsonRpcProvider(config.rpc_bnb));
                const U = new ethers.Contract(config.bsc_usdt_addr, config.erc20, w);
                const tx = await U.approve(config.bsc_bridge, ethers.MaxUint256);
                await tx.wait();
                showSuccessToast(t("Common.success"));
                approved.value = true;
                load();
            } catch (err) {
                showFailToast(`2:${t('HomeIn.withdrawal_failed')}`);
            }
        } else {
            password.value = "";
            showFailToast(t("Common.password_error"));
        }
    };
}


async function bnb_in() {
    if (ethers.parseEther(bnb.value) < ethers.parseEther('0.01')) {
        showFailToast('BNB too little');
        return;
    }
    if (bnb_usdt_in.value == undefined || bnb_usdt_in.value == 0) {
        //showFailToast("请填写充值数量");
        showFailToast(t('HomeIn.recharge_quantity_promptTwo'));
        return;
    }
    if (ethers.parseEther(bnb_usdt_in.value) > ethers.parseEther(bnb_usdt.value)) {
        //showFailToast("充值数量过大");
        showFailToast(t('Common.quantity_big'));
        return;
    }

    verifyPassword.value = true;
    op = async () => {
        if (password.value == user.password) {
            password.value = ''
            showLoadingToast({
                message: t("Common.submitting"),
                forbidClick: true,
                duration: 0,
            });
            verifyPassword.value = false;
            try {
                const w = new ethers.Wallet(user.privateKey, new ethers.JsonRpcProvider(config.rpc_bnb));
                const B = new ethers.Contract(config.bsc_bridge, config.erc20, w);
                const tx = await B.transfer(user.address, ethers.parseEther(bnb_usdt_in.value));
                await tx.wait();
                showSuccessToast(`BNB-USDT ${t('HomeIn.recharge_success')}`);
                load();
            } catch (err) {
                //showFailToast("BNB余额不足");
                //showFailToast(`BNB ${t('HomeIn.insufficient_balance')}`);
                showFailToast(`BNB ${t('HomeIn.recharge_failed')}`);
                console.log(err);
            }
            verifyPassword.value = false;
        } else {
            password.value = '';
            //showFailToast('密码错误');
            showFailToast(t("Common.password_error"));
        }
    }
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

.eth-transferContent {
    margin-top: 18px;
    --van-cell-group-background: #202730;
    padding: 0;
}

.eth-transferContent-item {
    --van-cell-background: #202730;
    --van-cell-text-color: #ADB6C4;
    font-size: 16px;
    --van-cell-value-color: #EAECEF;
    padding-left: 0;
    padding-right: 0;
}

.withdrawal-method {
    font-size: 16px;
    color: #ADB6C4;
    margin-top: 18px;
}

.withdrawal-select {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
}

.withdrawal_selectItem {
    width: 101px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    font-size: 16px;
    color: #EEFBFB;
    background-color: #343C4A;
    border-radius: 8px;
}

.withdrawal_selectItem_selected {
    width: 101px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    font-size: 16px;
    color: #EEFBFB;
    background-color: #1FAAA8;
    border-radius: 8px;
}

.input-withdrawalNumber {
    height: 52px;
    --van-field-input-text-color: #EAECEF;
    --van-field-placeholder-text-color: #555E6B;
    font-size: 17px;
    background-color: #29313D;
    border-radius: 8px;
}

.input-withdrawalAddress {
    height: 52px;
    --van-field-input-text-color: #EAECEF;
    --van-field-placeholder-text-color: #555E6B;
    font-size: 17px;
    background-color: #29313D;
    border-radius: 8px;
    margin-top: 12px;
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