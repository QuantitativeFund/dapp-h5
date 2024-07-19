<template>
    <div class="box">
        <div class="box-one">MNT2.0</div>
        <div class="language" @click="showPicker = true">{{ t('Common.choose_wallet') }}</div>
        <div class="box-two" @click="importWallet">{{ t('User.import_wallet') }}</div>
        <div class="box-three" @click="createWallet">{{ t('User.create_wallet')}}</div>
    </div>
    <van-popup v-model:show="showPicker" round position="bottom" class="popup">
        <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" class="popupItem" />
    </van-popup>
</template>
<script setup>
import { ref } from 'vue';
import {Locale} from 'vant';
import { useRouter } from 'vue-router';
import { userStore } from '@/stores/user.js';
import { useI18n} from "vue-i18n";
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import viVN from 'vant/es/locale/lang/vi-VN';
import koKR from 'vant/es/locale/lang/ko-KR';
import thTH from 'vant/es/locale/lang/th-TH';
const { t,locale } = useI18n();
const router = useRouter();
let user = userStore();
let language = ref('')
const showPicker = ref(false);
const columns = [
    { text: 'English', value: 'en' },
    { text: '中文', value: 'zh' },
    { text: 'Tiếng Việt', value: 'vi' },
    { text: '한국인', value: 'ko' },
    { text: 'แบบไทย', value: 'th' },
    { text: 'Melayu', value: 'ms' },
];

const onConfirm = ({ selectedOptions }) => {
    showPicker.value = false;
    language.value = selectedOptions[0].value;
    if (language.value == 'en') {
        Locale.use('en-US', enUS);
    } else if (language.value == 'vi') {
        Locale.use('vi-VN', viVN);
    } else if (language.value == 'ko') {
        Locale.use('ko-KR', koKR)
    } else if (language.value == 'th') {
        Locale.use('th-TH', thTH);
    } else if (language.value == 'ms') {
        Locale.use('en-US', enUS);
    } else {
        Locale.use('zh-CN', zhCN);
    }
    locale.value = language.value;
    user.set_language(language.value);
};


function createWallet() {
    router.push('/create')
}

function importWallet() {
    router.push('/import')
}

</script>

<style scoped>
.box {
    background-color: #202730;
    min-height: 100vh;
    padding: 40px 0 0;
}
.box-one {
    font-size: 21px;
    color: #1FAAA8;
    text-align: center;
}
.box-two {
    text-align: center;
    font-size: 49px;
    color: #1FAAA8;
    margin-top: 130px;
}
.box-three {
    text-align: center;
    font-size: 49px;
    color: #1FAAA8;
    margin-top: 46px;
}
.language {
    text-align: center;
    font-size: 25px;
    color: #1FAAA8;
    margin-top: 50px;
    text-decoration: underline;
}
.popup {
    --van-popup-background: #202730;
}
.popupItem {
    --van-picker-background: #29313D;
    --van-picker-title-font-size: 16px;
    --van-picker-option-font-size: 16px;
    --van-picker-option-text-color: #EAECEF;
    --van-picker-mask-color: #29313D;
}

</style>