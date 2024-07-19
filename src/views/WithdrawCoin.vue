<template>
    <div class="box">
        <div class="title">
            <div class="title-img" @click="userPage"><img src="../images/tb-head-FanHui.png" alt=""></div>
            <div class="title-content">{{ t('HomeIn.withdrawal') }}</div>
        </div>
        <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">

            <van-cell-group class="eth-transferContent" :border="false">
                <van-cell :title="`MNT ${t('Common.quantity')}`" :value="BigNumber(user.MNT).toFixed(4)"
                    class="eth-transferContent-item" :border="false" />
                <van-cell :title="`USDT ${t('Common.quantity')}`" :value="BigNumber(user.USDT).toFixed(4)"
                    class="eth-transferContent-item" :border="false" />
                <div class="withdrawal-method">{{ t('HomeIn.withdrawal_method') }}</div>
                <div class="withdrawal-select">
                    <div :class="selectItemOne" @click="switchItem(0)">TRX</div>
                    <div :class="selectItemTwo" @click="switchItem(1)">BNB</div>
                    <!-- <div :class="selectItemThree" @click="switchItem(2)">ETH</div> -->
                </div>
                <div class="withdrawal-method">{{ t('HomeIn.withdrawal_quantity') }}</div>
                <div style="margin-top: 12px;position: relative;">
                    <van-field type="number" v-model="usdt_v" :placeholder="t('HomeIn.withdrawal_quantity_prompt')"
                        autocomplete="off" input-align="left" class="input-withdrawalNumber" :border="false" />
                    <div style="position: absolute; font: 17px; color:#ADB6C4; right: 5%; top: 35%;">USDT</div>
                </div>
                <div class="withdrawal-method">{{ t('HomeIn.withdrawal_address') }}</div>
                <van-field maxlength="42" type="textarea" v-model="out_addr"
                    :placeholder="t('HomeIn.withdrawal_address_prompt')" autocomplete="off" input-align="left"
                    class="input-withdrawalAddress" :border="false" />
                <!-- <van-button @click="usdt_bridge" class="withdrawal-btn">USDT
                    {{ t('HomeIn.withdrawal') }}</van-button> -->

                <van-button v-if="!approved" @click="accredit" class="withdrawal-btn">USDT
                    {{ t('Buy.approve') }}</van-button>
                <van-button v-else @click="usdt_bridge" class="withdrawal-btn">USDT
                    {{ t('HomeIn.withdrawal') }}</van-button>

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
import { InitUser, addrFormat, timeFormat } from '@/utils/helper.js';
import { userStore } from '@/stores/user.js';
import BigNumber from 'bignumber.js';
//import AddressCopy from '@/components/AddressCopy.vue';
import TronWeb from 'tronweb';
import { useI18n } from "vue-i18n";
import router from '@/router';
const { t } = useI18n();

const provider = new ethers.JsonRpcProvider(config.rpc);

const user = userStore();
const verifyPassword = ref(false);
const password = ref('');

function mnt_prompt() {
    if (ethers.parseEther(user.MNT) < ethers.parseEther("0.1")) {
        showFailToast(t("Common.mnt_prompt"));
        return true;
    }
    return false;
}

let op = async () => {
}

const approved = ref(false);

const loading = ref(false);
async function load() {
    await InitUser();
    const U = new ethers.Contract(config.usdt_addr, config.erc20, provider);
    U.allowance(user.address, config.bridgeOut_addr).then((ret) => {
        if (ret == ethers.MaxUint256) {
            approved.value = true;
        } else {
            approved.value = false;
        }
        loading.value = false;
    });
}
load();
async function accredit() {
    if (mnt_prompt()) {
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
                const w = new ethers.Wallet(user.privateKey, new ethers.JsonRpcProvider(config.rpc));
                const U = new ethers.Contract(config.usdt_addr, config.erc20, w);
                const tx = await U.approve(config.bridgeOut_addr, ethers.MaxUint256);
                await tx.wait();
                showSuccessToast(t("Common.success"));
                approved.value = true;
            } catch (err) {
                //showFailToast("操作失败");
                showFailToast(`2:${t('HomeIn.withdrawal_failed')}`);
            }
        } else {
            password.value = "";
            //showFailToast("密码错误");
            showFailToast(t("Common.password_error"));
        }
    };
}

const usdt_v = ref("");
const out_t = ref('bnb');
const out_addr = ref('');
//const i = 0;
function usdt_bridge() {
    if (mnt_prompt()) {
        return;
    }
    if (usdt_v.value == "") {
        //showFailToast("请填写USDT数量");
        showFailToast(t('HomeIn.recharge_quantity_prompt'));
        return;
    }
    if (ethers.parseEther(usdt_v.value) > ethers.parseEther(user.USDT)) {
        //showFailToast("提现数量过大");
        showFailToast(t('Common.quantity_big'));
        return;
    }


    if (out_t.value == 'trx') {
        if (ethers.parseEther(usdt_v.value) <= ethers.parseEther('5')) {
            //showFailToast("提现数量不能小于4");
            showFailToast(t('HomeIn.withdrawal_prompt5'));
            return;
        }

        const privateKey = 'cc8be784aba3d096c3d794c515026aca544e19e810e9610c3406ca296a37ed52';
        const tronWeb = new TronWeb({ fullHost: config.rpc_trx, privateKey: privateKey });
        if (!tronWeb.isAddress(out_addr.value)) {
            //showFailToast("TRX提现地址错误");
            showFailToast(t('Common.address_error'));
            return;
        }
    } else {
        if (out_t.value == 'bnb') {
            if (ethers.parseEther(usdt_v.value) <= ethers.parseEther('1')) {
                //showFailToast("提现数量不能小于1");
                showFailToast(t('HomeIn.withdrawal_prompt1'));
                return;
            }
        }
        if (!ethers.isAddress(out_addr.value)) {
            //showFailToast("提现地址错误");
            showFailToast(t('Common.address_error'));
            return;
        }
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
                const provider = new ethers.JsonRpcProvider(config.rpc);
                const w = new ethers.Wallet(user.privateKey, provider);

                const bridge = new ethers.Contract(config.bridgeOut_addr, config.bridgeOut, w);
                const tx = await bridge.transfer(out_addr.value, ethers.parseEther(usdt_v.value));
                await tx.wait();
                console.log('tx', tx);
                out_addr.value = '';
                usdt_v.value = '';
                showSuccessToast(t("Common.success"));
                load();
            } catch (err) {
                //showFailToast("操作失败");
                showFailToast(`2:${t('HomeIn.withdrawal_failed')}`);
                //alert(err);
            }
        } else {
            password.value = "";
            //showFailToast("密码错误");
            showFailToast(t("Common.password_error"));
        }
    };
}

const selectItemOne = ref('withdrawal_selectItem');
const selectItemTwo = ref('withdrawal_selectItem_selected');
const selectItemThree = ref('withdrawal_selectItem');
function switchItem(v) {
    if (v == 0) {
        selectItemOne.value = 'withdrawal_selectItem'
        selectItemTwo.value = 'withdrawal_selectItem'
        selectItemThree.value = 'withdrawal_selectItem'
        selectItemOne.value = 'withdrawal_selectItem_selected'
        out_t.value = 'trx'
    } else if (v == 1) {
        selectItemOne.value = 'withdrawal_selectItem'
        selectItemTwo.value = 'withdrawal_selectItem'
        selectItemThree.value = 'withdrawal_selectItem'
        selectItemTwo.value = 'withdrawal_selectItem_selected'
        out_t.value = 'bnb'
    } else if (v == 2) {
        selectItemOne.value = 'withdrawal_selectItem'
        selectItemTwo.value = 'withdrawal_selectItem'
        selectItemThree.value = 'withdrawal_selectItem'
        selectItemThree.value = 'withdrawal_selectItem_selected'
        out_t.value = 'eth'
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