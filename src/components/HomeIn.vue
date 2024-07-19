<template>
  与原来的功能相同，保证界面与以前风格不同
</template>

<script setup>
/*
function bind(sign, c_addr, id) {
  if (mnt_prompt()) {
    return;
  }
  if (childs1.value.length >= 36) {
    //showFailToast('被邀请者不能多余36个');
    showFailToast(t('HomeIn.bind_prompt'));
    return;
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = '';
      showLoadingToast({
        message: t("Common.submitting"),
        forbidClick: true,
        duration: 0,
      })

      const v = '0x' + sign.substring(130);
      const r = sign.substring(0, 66);
      const s = '0x' + sign.substring(66, 130);
      const provider = new ethers.JsonRpcProvider(config.rpc);
      const w = new ethers.Wallet(user.privateKey, provider);
      const popularized = new ethers.Contract(config.popularized_addr, config.popularized, w);
      const tx = await popularized.popularize1(c_addr, v, r, s);
      const result = await tx.wait();
      console.log(result);
      const ret = await axios.put(`${config.api}friends/${id}`);
      console.log(ret.data);
      await load0();
      await load1();
      showSuccessToast(t('HomeIn.bind_success'));
      verifyPassword.value = false;
    } else {
      password.value = '';
      //showFailToast('密码错误');
      showFailToast(t("Common.password_error"));
    }
  }
}
*/
</script>

<style scoped>
.box {
  background-color: #202730;
  min-height: 100vh;
  padding: 0 21px;
}

.title {
  font-size: 18px;
  color: #EAECEF;
  height: 60px;
  line-height: 60px;
}

.your-minner {
  font-size: 15px;
  color: #ADB6C4;
  margin-top: 22px;
}

.miner-information {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.miner-informationOne {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationTwo {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationThree {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationFour {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
}

.miner-informationFive {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.minner-team {
  font-size: 15px;
  color: #ADB6C4;
  margin-top: 18px;
}

.invitation-information {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: #29313D;
}

.invitation-informationOne {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #ADB6C4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationTwo {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationThree {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationFour {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.invitation-informationFive {
  --van-cell-background: #29313D;
  font-size: 15px;
  --van-cell-text-color: #8D96A4;
  --van-cell-value-color: #EAECEF;
  --van-cell-border-color: #29313D;
}

.binding-btn {
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