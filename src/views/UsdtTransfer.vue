<template>
    <div class="box">
        <div class="title">
            <div class="title-img" @click="user_page"><img src="../images/tb-head-FanHui.png" alt=""></div>
            <div class="title-text">{{ t('Common.USDT_transfer')}}</div>
        </div>
        <div class="mnt-balance">
            <div class="mnt-balanceText">{{ t('Common.USDT_balance') }}</div>
            <div class="mnt-balanceContent">{{ BigNumber(user.USDT).toFixed(6) }}</div>
        </div>
        <div class="transfer-quantity">{{ t('Common.USDT_recharge_amount') }}</div>
        <div class="input-mnt-box">
            <van-field type="number" v-model="usdt_v" :placeholder="t('Common.transfer_v')" autocomplete="off"
                input-align="left" class="input-mnt" :border="false" />
            <div class="icon-title" style="position: absolute; right: 5%; top: 30%; font-size: 17px; color: #ADB6C4;">
                USDT</div>
        </div>
        <div class="transfer-address">{{ t('Common.transfer_destination_address')}}</div>
        <van-field maxlength="42" type="textarea" v-model="usdt_addr"
            :placeholder="t('Common.input_transfer_destination_address')" autocomplete="off" input-align="left"
            class="input-address" :border="false">
        </van-field>
        <van-button class="mnt-btn" @click="usdt_transfer">USDT {{ t("Common.transfer") }}
        </van-button>
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
import { userStore } from "@/stores/user.js";
import BigNumber from "bignumber.js";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
    showSuccessToast,
    showFailToast,
    showLoadingToast /*showConfirmDialog*/,
} from "vant";
import { useRouter } from "vue-router";
import {
    addrFormat,
    timeFormat,
    LoadUserMNT,
    LoadUserUSDT,
} from "@/utils/helper.js";
import { ethers, parseEther, isAddress } from "ethers";
import { config } from "@/const/config";
import axios from "axios";
function mnt_prompt() {
    if (ethers.parseEther(user.MNT) < ethers.parseEther("0.1")) {
        showFailToast(t("Common.mnt_prompt"));
        return true;
    }
    return false;
}
const { t } = useI18n();
const user = userStore();
const router = useRouter();
const verifyPassword = ref(false);
const password = ref("");

const passwordType = ref("password");

const loading0 = ref(false);
const loading1 = ref(false);
const childs0 = ref([]);
const childs1 = ref([]);

load0();
async function load0() {
    const ret = await axios.get(`${config.api}user/income/${user.address}`);
    childs0.value = ret.data;
    loading0.value = false;
}
load1();
async function load1() {
    const ret = await axios.get(`${config.api}user/buy/${user.address}`);
    childs1.value = ret.data;
    loading1.value = false;
}



let op = () => { };

const usdt_v = ref("");
const usdt_addr = ref("");
function usdt_transfer() {
    if (mnt_prompt()) {
        return;
    }
    if (!isAddress(usdt_addr.value)) {
        //showFailToast("地址错误");
        showFailToast(t('Common.address_error'));
        return;
    }
    if (usdt_v.value == "") {
        //showFailToast("请填写USDT数量");
        showFailToast(t('Common.transfer_v_placeholder'));
        return;
    }
    if (parseEther(usdt_v.value) > parseEther(user.USDT)) {
        //showFailToast("转账数量过大");
        showFailToast(t('Common.quantity_big'));
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
            const provider = new ethers.JsonRpcProvider(config.rpc);
            const w = new ethers.Wallet(user.privateKey, provider);
            const USDT = new ethers.Contract(config.usdt_addr, config.erc20, w);
            const tx = await USDT.transfer(usdt_addr.value, parseEther(usdt_v.value));
            const ret = await tx.wait();
            console.log(ret);
            await LoadUserMNT();
            await LoadUserUSDT();
            usdt_addr.value = "";
            usdt_v.value = "";
            //showSuccessToast("转账成功");
            showSuccessToast(t("Common.transfer_success"));
            verifyPassword.value = false;
        } else {
            password.value = "";
            //showFailToast("密码错误");
            showFailToast(t("Common.password_error"));
        }
    };
}


function user_page() {
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

.title-text {
    font-size: 18px;
    color: #EAECEF;
    vertical-align: middle;
}

.mnt-balance {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
}

.mnt-balanceText {
    font-size: 16px;
    color: #ADB6C4;
}

.mnt-balanceContent {
    font-size: 16px;
    color: #EAECEF;
}

.transfer-quantity {
    font-size: 16px;
    color: #ADB6C4;
    margin-top: 18px;
}
.input-mnt-box {
    margin-top: 12px;
    position: relative;
}
.input-mnt {
    --van-field-input-text-color: #EAECEF;
    --van-field-placeholder-text-color: #555E6B;
    border-radius: 8px;
    height: 52px;
    background-color: #29313D;
}

.transfer-address {
    font-size: 16px;
    color: #ADB6C4;
    margin-top: 18px;
}

.input-address {
    --van-field-input-text-color: #EAECEF;
    --van-field-placeholder-text-color: #555E6B;
    border-radius: 8px;
    height: 87px;
    margin-top: 12px;
    background-color: #29313D;
}

.mnt-btn {
    width: 100%;
    display: block;
    height: 42px;
    background-color: #1FAAA8;
    border-radius: 8px;
    font-size: 17px;
    color: #EEFBFB;
    text-align: center;
    line-height: 42px;
    margin-top: 42px;
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