<template>
   与原来的功能相同，保证界面与以前风格不同
</template>
<script setup>

</script>

<style scoped>
.box {
  background-color: #202730;
  padding: 0 24px;
  min-height: 100vh;
}

.title {
  height: 60px;
  font-size: 18px;
  color: #EAECEF;
  line-height: 60px;
}

.mining-information {
  margin: 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.mining-informationOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  --van-cell-active-color: #29313D;
}

.mining-informationTwo {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  --van-cell-active-color: #29313D;
}

.mining-informationThree {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-border-color: #29313D;
  --van-cell-active-color: #29313D;
}

.voting-information {
  --van-popup-background: #202730;
  --van-popup-round-radius: 22px;
  padding: 14px 24px 0;
}

.vote-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.vote-content {
  margin: 17px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.vote-contentOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentTwo {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentThree {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentFour {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentFive {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentSix {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentSeven {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.vote-contentEight {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.close-btn {
  margin: 32px 0 40px;
  height: 52px;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 52px;
  background-color: #1FAAA8;
}

.global-information {
  background-color: #202730;
  padding: 13px 24px 0;
}

.global-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.global-content {
  margin: 17px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.global-contentOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.global-contentTwo {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.global-contentThree {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.global-contentFour {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.contribution-details {
  background-color: #202730;
  padding: 14px 18px 0;
}

.contribution-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.contribution-contentOne {
  font-size: 16px;
  color: #ADB6C4;
  margin-top: 10px;
}

.contribution-contentTwo {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.contribution-contentTwo-itemOne {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.switch-vote {
  margin: 0;
  background-color: #29313D;
  padding: 0 16px;
}

.switch-vote-content {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  padding-left: 0;
  padding-right: 0;
}

.switch-vote-contentTwo {
  font-size: 16px;
  color: #8D96A4;
}

.input-tailText {
  font-size: 16px;
  color: #EAECEF;
  position: absolute;
  right: 7%;
  top: 30%;
}

.vote-btn {
  height: 42px;
  background-color: #1FAAA8;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 42px;
  margin-top: 22px;
  margin-bottom: 26px;
}

.switch-withdraw {
  margin: 0;
  padding: 0 16px;
  background-color: #29313D;
}

.switch-withdraw-content {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
  padding-left: 0;
  padding-right: 0;
}

.switch-withdraw-contentTwo {
  font-size: 16px;
  color: #8D96A4;
}

.input-UNMNT {
  background-color: #202730;
  --van-field-input-text-color: #EAECEF;
  border-radius: 8px;
  margin-top: 13px;
  --van-field-placeholder-text-color: #555E6B;
  position: static;
}

.withdraw-btn {
  height: 42px;
  background-color: #1FAAA8;
  border-radius: 8px;
  font-size: 17px;
  color: #EEFBFB;
  text-align: center;
  line-height: 42px;
  margin-top: 22px;
  margin-bottom: 26px;
}

.mining-title {
  font-size: 16px;
  color: #ADB6C4;
  margin-top: 18px;
}

.mining-content {
  margin: 12px 0 0;
  background-color: #29313D;
  padding: 0 16px;
}

.mining-contentItem {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  padding-left: 0;
  padding-right: 0;
}

.submit-btn {
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

.withdraw-content {
  margin: 12px 0 0;
  background-color: #29313D;
  padding: 0 16px;
}

.withdraw-contentItem {
  --van-cell-background: #29313D;
  font-size: 16px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  padding-left: 0;
  padding-right: 0;
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

.switch-title {
  font-size: 14px;
  color: #ADB6C4;
  margin-top: 18px;
}

.conversion-quantity {
  font-size: 12px;
  color: #8D96A4;
  margin-top: 6px;
}

.input_transfer_number {
  height: 40px;
  --van-field-input-text-color: #EAECEF;
  --van-field-placeholder-text-color: #555E6B;
  font-size: 12px;
  border-radius: 8px;
  background-color: #202730;
  margin-top: 12px;
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

.input-mnt {
  --van-field-input-text-color: #EAECEF;
  --van-field-placeholder-text-color: #555E6B;
  border-radius: 8px;
  height: 50px;
  background-color: #202730;
  margin-top: 13px;
}
</style>
