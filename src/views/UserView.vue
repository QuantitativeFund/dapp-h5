<template>
  <div class="box">
    <div class="box-one">
      <div class="box-one-itemOne">
        <div class="box-one-itemOne-one"><img src="../images/i-wallet.png" width="25" height="auto" alt=""></div>
        <div class="box-one-itemOne-two">
          <div class="box-one-itemOne-twoTop">{{ user.walletName }}</div>
          <div class="box-one-itemOne-twoBottom">{{ addrFormat(user.address) }}
            <address-copy :address="user.address" style="position: absolute; right: -25px; top: -6px;"></address-copy>
          </div>
        </div>
      </div>
      <div class="box-one-itemTwo">

        <div class="box-one-itemTwo-one" @click="importWallet"><img src="../images/i-daoru.png" width="25" height="auto"
            alt=""></div>
        <div class="box-one-itemTwo-two" @click="createWallet"><img src="../images/i-add.png" width="23" height="auto"
            alt=""></div>
        <div @click="toggleTheme">
          <div v-if="isDarkTheme" class="box-one-itemTwo-0"><img src="../images/moons.png" width="25" height="auto"
              alt=""></div>
          <div v-else class="box-one-itemTwo-0"><img src="../images/moon.png" width="25" height="auto" alt=""></div>
        </div>
        <div class="box-one-itemTwo-three" @click="showBottom = true"><img src="../images/i-qihuan.png" width="23"
            height="auto" alt=""></div>
        <van-popup v-model:show="showBottom" round position="bottom" class="walletSwitch-pop">
          <div class="wallet-switch-title">{{ t('User.wallet_switching') }}</div>
          <van-divider style="--van-divider-border-color: #29313D" />
          <div class="walletSwitch-content" v-for="obj, key in user.wallets" :key="key">
            <div class="walletSwitch-contentLeft">
              <div class="walletSwitch-contentLeft-one" @click="selectWallet(key)"><img src="../images/i-wallet.png"
                  alt="" width="25" height="auto"></div>
              <div class="walletSwitch-contentLeft-two">
                <div class="walletSwitch-contentLeft-twoTop">{{ obj.walletName }}</div>
                <div class="walletSwitch-contentLeft-twoBottom">{{ addrFormat(obj.address) }} <address-copy
                    :address="obj.address" style="position: absolute; right: -25px; top: -6px;"></address-copy></div>
              </div>
            </div>
            <div class="walletSwitch-contentRight">
              <van-button color="#202730" :disabled="noClick" class="walletSwitch-contentRight-one"
                @click="deleteWallet(key)"><img src="../images/i-del.png" alt="" width="25" height="auto"></van-button>
              <div class="walletSwitch-contentRight-two"><img v-show="user.address == obj.address"
                  src="../images/i-nowChoose.png" alt=""></div>
            </div>
          </div>
          <div class="close-btn" @click="showBottom = false">{{ t('Common.Cancel') }}</div>
        </van-popup>
      </div>
    </div>
    <van-pull-refresh v-model="loading0" @refresh="load0" style="min-height: 80vh;">
      <div class="box-two">
        <div class="box-twoLeft">
          <div class="box-twoLeft-top">
            <h3>{{ BigNumber(user.MNT).toFixed(6) }}</h3>
            <div style="display:flex;justify-content: center;">
              <img src="../images/logo.png" width="25" height="auto" alt="">
              <p style="margin-left:5px">MNT</p>
            </div>
          </div>
          <div class="box-twoLeft-bottom">
            <div class="box-twoLeft-bottom-one" @click="mnt_transferPage">
              <img src="../images/i-trans.png" alt="" style="width: 25px; height: 25px;">
            </div>
            <div class="box-twoLeft-bottom-two" @click="mntSteamPage"><img src="../images/i-trans-record.png" alt=""
                style="width: 25px; height: 25px;">
            </div>
          </div>
        </div>
        <div class="box-twoLeft">
          <div class="box-twoLeft-top">
            <h3>{{ BigNumber(user.USDT).toFixed(4) }}</h3>
            <div style="display:flex;justify-content: center;">
              <img src="../images/USDT.png" width="25" height="auto" alt="">
              <p style="margin-left:5px">USDT</p>
            </div>
          </div>
          <div class="box-twoLeft-bottom">
            <div class="box-twoLeft-bottom-one" @click="usdt_transferPage">
              <img src="../images/i-trans.png" alt="" style="width: 25px; height: 25px;">
            </div>
            <div class="box-twoLeft-bottom-two" @click="usdtSteamPage">
              <img src="../images/i-trans-record.png" alt="" style="width: 25px; height: 25px;">
            </div>
          </div>
        </div>
      </div>
      <div class="box-three">
        <div class="box-threeLeft" @click="topupPage">
          <div class="box-threeLeft-img"><img src="../images/i-chongzhi.png" style="width: 25px; height: 25px;" alt="">
          </div>
          <p class="box-threeLeft-content">{{ t('HomeIn.recharge') }}</p>
        </div>
        <div class="box-threeRight" @click="withdrawPage">
          <div class="box-threeLeft-img"><img src="../images/i-tixian.png" alt=""></div>
          <p class="box-threeLeft-content">{{ t('HomeIn.withdrawal') }}</p>
        </div>
      </div>
      <van-cell-group inset class="earnings-record" :border="false">
        <van-cell :title="t('User.income_detail')" is-link class="earnings-recordContent" :border="false"
          @click="incomePage">
          <template #icon>
            <!-- <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAgJJREFUOE/llU1yElEQx7t7MGbneAK5gXgC8QZkaUUqZEmycDC6Nq4VGRchS6cKs5YbiCcQbwA3GJfC2O3/TZipAYYUaFz5NjPVr9+vv99j+keLV7m9i6uasn1zciM7eHnSHJbZftcfNJj4M/ZiYe9Rp/10UtRbA7+9HNTF+EuqZPbm7LR5XgbuXgzOifm124MjT161m6NScK/30ae9vWoi6hfBIpXIbP5g6RDfmaomrSK4ohLTbDbpdI5jp5t63O1/CvDpwcWvwpWWWhI5uZgEStrIADkckQjJUFlDMo5lNm/p3QpSxo+h0zk7eRZmYGfl3sJSC8Fd50s938RC/FVX0jFh5YDkV+odXKgaUeoMVgzw/QwM+e0tgHkX8HeYflhifk2+DfgHQhl6xmHn9HD8/vIqNLPngE/RMZErbEJJNS/2wupN4Cl0Qvk5j2h/30cBjwBseOwdOJBrrbTfBUaMGtD1i5FsBhsfq+hEiI9wEMW8XvB+zMxDZwQ5rG2qyk0eu2ovebEKgYEPL9qHQWECc5Vtcpwru+lKGwv5Tou4mMqlSd0ix2tROi+csNsfjNJB+CMwDqnQSJTq2dTdCji7VIph/qdg9GkgbGM1rqGtXBfgGtS6+yqJu7lqEERsGhV1sorv1G6bhqFMnoMLd8Au50t1s8HJnybXAX9NBSB7on4DPl9bJu3NBhQAAAAASUVORK5CYII=" /> -->
            <img src="../images/i-shouyi.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <van-icon size="12" style="margin-right: 3px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUKFNjZEADlsExAf/+/5/PyMCw4cS6pYno8kBxVGAZFF3wn4GhHyq6AF0ThgaHgASBH0y/DwA16GPThKEBpAifJqwa8GnCqQGbJqDiQoIavjP/3s/4n8EA4p//iXidhKL4P8PCE+uXJuD0NDbFIDuwBisuxVg1WATFNADdWg9xMsQZyFGLYYNFSIwDw7//Gxj//19wfP2yAvSUAACSvlinXbdujwAAAABJRU5ErkJggg==" />
          </template>
        </van-cell>
        <van-cell :title="t('User.buy_detail')" is-link left-icon="custom-icon" class="earnings-recordContent"
          :border="false" @click="purchasePage">
          <template #icon>
            <!-- <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAjBJREFUOE+1lcFu2kAQhmcWohzjPkHpEzR9gqZvQI4VQTJH4FBcp+fSc5OaHALHRiJRj6VPkOQJSt7AvIFzLJCdzjheszE2uJG6EgJ2Z78d//PPGuE/Dcxyg/OrfY30W+YJ6PC405zknX0yHNcR8CevRQorb7z2+9COWwN/HY0PFOF1HET0xe82+3ng0/NxHxA/yxon8u5Tu3mTCw5GP2qgtbNU2rHBSlUviBYvn2zCnZnWS9cGV7WKYD4PPa8VSWyc8enwssdfAad4q7DqalpeyLwi1dOg6waQwvlJFKiJRj0AwkjNF67erbJk+JZjPL9zNDBgMpt4wuWHe9RLVxxSNOBftYwcIWrsgXqIs+MUagyIk+ERMfhFFnzHevWQwOHC9DnodQZY6i+DMQOmid9pHspuq+qlYHZQDjhZFg25aHGBygxkWQD2TOgGMPzyu0f1MkyJ4eKL1iXAACGf+ioPHATfnYfdnesKYcvrNqZ2Q23PmCPkcUygNIOaL8UdIFAkPPO7jdgFK6uu0iiWgmPsbjoZXgokdogNfQSPbxL/puSNYDZ+y2QlO76NrgakYWrPJRmnPVBKCkQ8+9huSLULR5ElN2fMHcTd5a66a51PIDbDNfdsAwtpluCeXEI8d8+f0OiePXIbeKb+LPbltuLKTy3IPc/XZD7WnejDP4Lpltv7IKfyqcefCRZvJTcWyY1nD5IrUqTILW4qRdHJmxxRtGbclHaXvJKeA8ruMa+ov4jCLCbJm+xfAAAAAElFTkSuQmCC" /> -->
            <img src="../images/i-buy.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <van-icon size="12" style="margin-right: 3px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUKFNjZEADlsExAf/+/5/PyMCw4cS6pYno8kBxVGAZFF3wn4GhHyq6AF0ThgaHgASBH0y/DwA16GPThKEBpAifJqwa8GnCqQGbJqDiQoIavjP/3s/4n8EA4p//iXidhKL4P8PCE+uXJuD0NDbFIDuwBisuxVg1WATFNADdWg9xMsQZyFGLYYNFSIwDw7//Gxj//19wfP2yAvSUAACSvlinXbdujwAAAABJRU5ErkJggg==" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset class="earnings-record" :border="false">
        <van-cell :title="t('User.wallet_name')" :value="user.walletName" class="earnings-recordContent"
          :border="false">
          <template #icon>
            <img src="../images/i-qianbao.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
        </van-cell>
        <van-cell :title="t('User.wallet_address')" :value="addrFormat(user.address)" class="earnings-recordContent"
          :border="false">
          <template #icon>
            <img src="../images/i-address.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <address-copy :address="user.address"></address-copy>
          </template>
        </van-cell>
        <van-cell :title="t('User.key')" value="******" class="earnings-recordContent" :border="false">
          <template #icon>
            <img src="../images/i-siyao.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <van-icon size="24"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAWlJREFUSEvdVUFuglAQ/RNJvAZL7aa9QdsTFG+gURJ3bW/QI9CdCZpyBDlB9QasqrvSG9BlI2H6/g9QBaEIZVEnIfzMn5k382Ymn0TLQi3HF2cO0J9MlqDwroRGazOfP5bRXEoRAFZwvsbnwtDbD8RC3Kg7omV3txt5jhMcA8oB9Mdjg4kupTExDxFAx9+JiHwiCrjTcbezmS/vYWvh/h5HjzVtkOj3gfIAP1kXVR4A6PbNtlVFPdMcIoEXHA/0iXMdAOWLKkdb23bk+cI0r5hZ0umhJ5K6VGoDxBHSJsf9En8NgFL4ebNYPNQDYB7AWY7qgfSmU53C8D1WrmXWtQCS6SkYv6fGAEVjlNHXrwD8tksRMrUwjrkeiCjSsQtqRCENKqjG0bobhsaXpr3C/POkMZXLBJr8gibLgFlR1ZyyaFUo+sC2KrqwzV52rJtuctqDIjaPAfz2BmRjuaDFqAxQra/Vrf7/m/wN1OzMGR7/8uMAAAAASUVORK5CYII="
              style="margin-left: 5px; align-items: center; display: flex" @click="copyp(1)" />
          </template>
        </van-cell>
        <van-cell :title="t('User.mnemonic')" value="******" class="earnings-recordContent" :border="false">
          <template #icon>
            <img src="../images/i-zhujici.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <van-icon size="24"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAWlJREFUSEvdVUFuglAQ/RNJvAZL7aa9QdsTFG+gURJ3bW/QI9CdCZpyBDlB9QasqrvSG9BlI2H6/g9QBaEIZVEnIfzMn5k382Ymn0TLQi3HF2cO0J9MlqDwroRGazOfP5bRXEoRAFZwvsbnwtDbD8RC3Kg7omV3txt5jhMcA8oB9Mdjg4kupTExDxFAx9+JiHwiCrjTcbezmS/vYWvh/h5HjzVtkOj3gfIAP1kXVR4A6PbNtlVFPdMcIoEXHA/0iXMdAOWLKkdb23bk+cI0r5hZ0umhJ5K6VGoDxBHSJsf9En8NgFL4ebNYPNQDYB7AWY7qgfSmU53C8D1WrmXWtQCS6SkYv6fGAEVjlNHXrwD8tksRMrUwjrkeiCjSsQtqRCENKqjG0bobhsaXpr3C/POkMZXLBJr8gibLgFlR1ZyyaFUo+sC2KrqwzV52rJtuctqDIjaPAfz2BmRjuaDFqAxQra/Vrf7/m/wN1OzMGR7/8uMAAAAASUVORK5CYII="
              style="margin-left: 5px; align-items: center; display: flex" @click="copyp(2)" />
          </template>
        </van-cell>
        <van-cell :title="t('User.prompt')" :value="passwordType === 'password' ? '******' : user.promptInfo"
          class="earnings-recordContent" :border="false">
          <template #icon>
            <img src="../images/i-tishi.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <span>
              <van-icon name="closed-eye" v-if="passwordType === 'password'" size="24" color="#1FAAA8"
                @click="passwordType = ''" />
              <van-icon name="eye" v-else size="24" color="#1FAAA8" @click="passwordType = 'password'" />
            </span>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset class="footer" :border="false">
        <div style="position: relative;">
          <van-cell :title="t('App.language')" is-link class="footerContent" :border="false"
            @click="showBottomOne = true">
            <!-- <template #icon>
              <van-icon size="24" style="margin-right: 11px;"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAn9JREFUOE+1VUFyElEQ7R5lcCc5gXiCkBM4nCC4NlSRpWRhEF2La6XABbhMqkjWkhMQTyCcIHgCh50MSvu6Z4b8mQopNZVfBcz/83nd/73X/Zm2jF7vpCTFwr6Q1IS4zEQV3SpEUyaZM/GYl6uLVuswvAkC+7NDAdeP/Fckcow3pW2Bk/WQmPvez+hTPkAGWEF/FwuTNLsMqMh7mzO/ywfTUzxYrqou+AbYMi0WrpIsF8i4D5QKMe2DgK/tZj1QwO5wdIn1Z+DkAutTJ1DoLVdPU3ADzmW68IQDiqI5Av2IeZXnb5r1sT5/HI5q4PeLPgNoh3y/vGZBMHrsZm7A3cGok0Q20NbRi6kDsGg3DzJcd4dnKhiA4oC9wXkF4N+MIlDWPqp32KXAFGe2zFgkwFyPP0fQ0xzfDczVKZfCrNkCT3ASc45Rwt3BeQMoJ5k/3nUifAjgs3EsEH1H3Pk1JoTDcfGZYT3nVVZqdvFZmICbwWU8PlFhGXzpi11XIN2HdTBBBO6qb1/W7bjp+PB5FECLic7B/8ZZqS5G6TaA/wF2A94r8F2oyFjRsejMFQ+NBdZKBnhS8UrKlwcLuRyvsZ5aC78b8bBXxSvH4t2X3ZIC0Uxja4lYgcCCgfUEtaHIqZsxCqZhtkIPQXaxY5hr+DYLokC0eDIlTbDRXq6kQ1hqxwX+q5LWPyRZa2SNGAK8+o9NSD2tRTNDtoF2uHzbTCmxBk5r2dOq1J7wunlQtdOlbVNpYG8CmjrJaYyCTNtMj5nLPEMrAsUA10Du+02m6eLNV5P/8BhAejWpoLcNuxC86Ff/1qvJRbDsfR9KSw10lBP+dQuco37nsRdF422X6R9xWJiyRK+CJgAAAABJRU5ErkJggg==" />
            </template> -->
            <template #icon>
              <img src="../images/i-yuyan.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
            </template>
            <template #right-icon>
              <van-icon size="12" style="margin-right: 3px;"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUKFNjZEADlsExAf/+/5/PyMCw4cS6pYno8kBxVGAZFF3wn4GhHyq6AF0ThgaHgASBH0y/DwA16GPThKEBpAifJqwa8GnCqQGbJqDiQoIavjP/3s/4n8EA4p//iXidhKL4P8PCE+uXJuD0NDbFIDuwBisuxVg1WATFNADdWg9xMsQZyFGLYYNFSIwDw7//Gxj//19wfP2yAvSUAACSvlinXbdujwAAAABJRU5ErkJggg==" />
            </template>
          </van-cell>
          <div style="position: absolute; width: 22px; height:22px; top:15%; right: 15%;">
            <img src="../images/flag-cn.png" alt="" style="width: 22px; height:22px;" v-show="language == 'zh'">
            <img src="../images/flag-eng.png" alt="" style="width: 22px; height:22px;" v-show="language == 'en'">
            <img src="../images/flag-kr.png" alt="" style="width: 22px; height:22px;" v-show="language == 'ko'">
            <img src="../images/flag-mls.png" alt="" style="width: 22px; height:22px;" v-show="language == 'ms'">
            <img src="../images/flag-thi.png" alt="" style="width: 22px; height:22px;" v-show="language == 'th'">
            <img src="../images/flag-vn.png" alt="" style="width: 22px; height:22px;" v-show="language == 'vi'">
          </div>
        </div>
        <van-popup v-model:show="showBottomOne" round position="bottom" class="popupOne">
          <div class="popupOne-title">{{ t('Common.select') }}{{ t('App.language') }}</div>
          <van-divider style="--van-divider-border-color: #29313D;" />
          <div class="language-icon" style="margin-top: 40px;">
            <div style="position: relative;">
              <img src="../images/flag-eng.png" alt="" @click="languageChoose(0)">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'en'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/flag-cn.png" alt="" @click="languageChoose(1)">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'zh'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/flag-vn.png" alt="" @click="languageChoose(2)">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'vi'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/flag-kr.png" alt="" @click="languageChoose(3)">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'ko'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/flag-thi.png" alt="" @click="languageChoose(4)">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'th'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/flag-mls.png" alt="" @click="languageChoose(5)">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'ms'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="close-btn" @click="showBottomOne = false">{{ t('Common.Cancel') }}</div>
        </van-popup>
        <!-- <van-cell :title="t('App.app_explain')" is-link class="footerContent" :border="false"
          @click="showBottomTwo = true">
          <template #icon>
            <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAdpJREFUOE+1lDFSwlAQhncZATvwBOIJxBOIJ4Ae4kBJKCQEa7FWTCiAUhxgLMETiCcQb8ANlE5ReO6GJBOYJBiVV2Xy3vt2999/H8KWFvpxNe02vtgNayAgRecSfFYAjEGITrUkNfzuroBv2n1dCJEJfXwm+dIiGn62gOsQRGxUitmyF9wG15u9ISCkKaO7qpzL11s9vqT5ZRUSeKSUsmO3MwZYa/aTCxScHdUqLtWSVKu3uiMAPN7QAkWVc7oneCW7IGDzrDe42a0B4kXgjDeBr1vdDAIOAoMBDCmW7omchd5nDUUpvDFnqTFvRMMT+oz9pnl1q2JHBbYrrtrdFHV5yO0jux1wZNKeO37oqqHDbr5gI/P2fWIh5hlyyPi8KI2MSiI7ZaorZTpkSnHHVJVelaWhV2AeIt/J22A18KnoxQazlwXOYwyryKdPm6DOfVcpuPy5mA8ogjHGILCglrIdU/O0/X8tEpdLkj2wZK5ga5QNi5gN+ck4O+Io1OwO9yI0+9JtuxGEgi8Xzz7MZhOy3msQKQi8ZwGte+gEk9nRlOAxCJgkOWFJnHcYzIOxzz//FWy8bCDorRBxVZZS/5axW8nmg5+nPcN+PmtKDe+4Pfh/GhC/iFsDfwO2aRtS763zhwAAAABJRU5ErkJggg==" />
          </template>
          <template #right-icon>
            <van-icon size="12" style="margin-right: 3px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUKFNjZEADlsExAf/+/5/PyMCw4cS6pYno8kBxVGAZFF3wn4GhHyq6AF0ThgaHgASBH0y/DwA16GPThKEBpAifJqwa8GnCqQGbJqDiQoIavjP/3s/4n8EA4p//iXidhKL4P8PCE+uXJuD0NDbFIDuwBisuxVg1WATFNADdWg9xMsQZyFGLYYNFSIwDw7//Gxj//19wfP2yAvSUAACSvlinXbdujwAAAABJRU5ErkJggg==" />
          </template>
        </van-cell>
        <van-popup v-model:show="showBottomTwo" round position="bottom" class="popupOne">
          <div class="popupOne-title">{{ t('App.invite_friends')}}</div>
          <van-divider style="--van-divider-border-color: #29313D;" />
          <van-tabs background="#202730" title-inactive-color="#ADB6C4" title-active-color="#EAECEF"
            style="--van-tabs-bottom-bar-color: #1FAAA8;">
            <van-tab :title="t('App.QR_code')" style="text-align: center;">
              <img :src="qrImage" alt="" class="qr-code" style="margin-top: 83px;">
              <div class="save-share">
                <a :href="qrImage" download="qrcode.png" style="color: #323233;">
                  <div>
                    <img src="../images/i-baocun.png" alt="">
                    <p style="font-size: 14px; color: #ADB6C4; padding: 0; margin: 0">{{ t('App.save') }}</p>
                  </div>
                </a>
                <div style="margin-left: 50%">
                  <img src="../images/i-fenxiang.png" alt="">
                  <p style="font-size: 14px; color: #ADB6C4; padding: 0; margin: 0;">{{ t('App.share') }}</p>
                </div>
              </div>
            </van-tab>
            <van-tab :title="t('App.Link')">
              <div style="display: flex; justify-content: center; margin-top: 83px;">
                <div class="link-text">
                  {{ t('App.share_content')}}http://www.abc.com/dl/mnt.2.0.1.apk
                </div>
              </div>
              <div class="save-share">
                <div style="text-align: center;"
                  @click="copy(t('App.share_content') + 'http://www.abc.com/dl/mnt.2.0.1.apk')">
                  <img src="../images/i-fuzhi2.png" alt="">
                  <p style="font-size: 14px; color: #ADB6C4; padding: 0; margin: 0;">{{ t('App.copy_table')}}</p>
                </div>
              </div>
            </van-tab>
          </van-tabs>
          <div class="close-btn" @click="showBottomTwo = false">{{ t('Mining.close')}}</div>
        </van-popup> -->

        <van-cell title="Github" is-link class="footerContent" :border="false">
          <!-- <template #icon>
            <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAmJJREFUOE+dVUty00AQnZYJYYc5Ac4JsE+AfYI4SypOYS9jL0AY1og1uGQWdpa2y06xjHOChBPgnABzApQdJpGG12ONNNGnojBVKpWmW6/fvP4MiZzlnnyrSOm/lEI2haAq3Cqh61oIuSJBS6LSd/v4Fb7Ti5JbrjspB08evxFSvoWtnBc43PcE0dD68/erbXc80/cOsDs6rfokJ9hkhoWXFGJVotKByT4CZtCA5EUBlnkBPYtKNQ2ugPn4/u7OhWaKAA1LKl0dPE/zkMB0xjb895rfivnmpsGyKODBaO5Aq48aoN9tbQMigUFw25YkVniUhiRFGU/Vsh5NmZ3Kye7O7yi4lJ/6vSOH1M/S/2FKoIGLijwYL0A2Wp61udmjwei0DRoTw3AN4PuqIXIPia3uSCapA+DFEiLtx0ehTr93OC3KVkk5XnBpujGGOCdscrQXehOZ3csr+rxgIeuf2s5JZGBTH/FQfTVYEicFDOGfJbvoPllSlcHVk5RCQPgHa5wugCv6Ml5MdYGHzNZgXSvKOmTL5VoxNJ4BeN7EpDozj5vV+1lycNJ86Z8lZwsm4sG288aLNV7PjVZWpQPjJYKcI6FDE5jLC7Z92OoZAX/Bv6KAP5/M65gNPIAE3jVMOP5R9T+WnQWM/bhuDXQm9+H46DKablprZvmu22rwtLu1gjI7JVmZRBISzt53W+3wtLEpTqRcUmBNheV7tPGvkonMAuZJp0FTwErv7aTjFlXjUh/NZJYAvsZtM+SJZvqkriY2htl2YGxC87rdO+S2j1Z4KXBil7g5nKwRkAmc1PR/vv8B+pwow3jp5kYAAAAASUVORK5CYII=" />
          </template> -->
          <template #icon>
            <img src="../images/github.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <a href="https://github.com/metabasenet" target="_balck">
              <van-icon size="24"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAASFJREFUSEvdlE0OgjAQhTskxqV4Ae0N1BtwBN2grDyKHsVdARdwBL2B3KDeAHckRmurkFT+MigmKhsWPN43fTMdIB9+4MP+5A8BQ989yNhGJdHFcBET7jicet70ahQ1xpVEfD4P9X8LEUmAqOhLBJ2uxWezWGq41AyLOrE/2o6FAhztBao/gy3bgIDlw7RlgGYepYC4tRPo5io6cU7u2bcCyJs/+sJ2rQA08xMQw+K2raaODHw3BCLMt05QZa4AlDGq3mqMX5qiOvO6dVN5D/QxxZjTIDBJkpiNT0A9thYAK1nlU+b5qtPL15OF9RtFlFY/1RtaFkm2AfIXFBVRXcbZt+8DYKou02AiqlrXGGYkAePaJmNcmmhQK7mJYV77+4AbuSTAGWYBcOwAAAAASUVORK5CYII=" />
            </a>
          </template>
        </van-cell>
        <van-cell title="Twitter" is-link class="footerContent" :border="false">
          <!-- <template #icon>
            <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAjpJREFUOE+1VUFy2kAQnBVy4Zv5gZUXBF4Q8YLYxxRQsY/AIZZJznHOMZFzAI4mBVSO8Q9MXhDygugJcDO2YNOz2qUkIWFfUJWqdrS7PTM9PSNBe3rEnnBJAV/3x0Ms3m87kXedVuN0l/PEXSnOO+3akM8rYN+/La2LB1MsX+NdEMkZthysj/F6nVb9Jgs8CSq/dNqNK3NuQ4Xfm5TXQjK4tKSokmXN13IFB3QEu+K1a7zePN3e5IyEvOUPkujHx1b9LL6f4Pi6PzoRJH7h4KywfKquirbLNi4E1vKp4nnnc74cB4X5FxmV0xltFe/bYHIjpfyAOBS/xsbB6WWrXtWZ3QOoxKBw6BqHuRGbjW5/zGkz34rfjS1oiLxPNOjCEoWy13wXZPGfKTd/8NOJ80uPjwGKywBHGmQB3t00789GzAe+DkYuLnPKit/w0C5rm7dzlWLAdzZItze6IiE+G36NbfjPouBFwEoB/dEUmn5DMtJp2s4D3xmxbpx/ulgEnVfth3Bm+Gb7U7MBx9tPLjCDrooH9zgQ1+gcfL+K8a3sF8tNUdAb36Hh36pYMAOI1k4W34b/dMyZEefNAMOvEOL7ZbN2sYvvLWA0wwW8+yrQ1AzQnHPzHEuSp4VlOM3jOwGcnAHyN1raTaeoW/oPvs/ReZWQQkfrO8F3ero9OwMiCW6yCgAQIDMucCnOdzSPo5FpQBeotJNV6Xj0uT8HrfcIGLOBU+K1TXaQN1jiwMw3yy5Lw6ztvf3z/gN4mTsmHgsLhgAAAABJRU5ErkJggg==" />
          </template> -->
          <template #icon>
            <img src="../images/tuite.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <a href="https://twitter.com/Metabasenet" target="_balck">
              <van-icon size="24"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAASFJREFUSEvdlE0OgjAQhTskxqV4Ae0N1BtwBN2grDyKHsVdARdwBL2B3KDeAHckRmurkFT+MigmKhsWPN43fTMdIB9+4MP+5A8BQ989yNhGJdHFcBET7jicet70ahQ1xpVEfD4P9X8LEUmAqOhLBJ2uxWezWGq41AyLOrE/2o6FAhztBao/gy3bgIDlw7RlgGYepYC4tRPo5io6cU7u2bcCyJs/+sJ2rQA08xMQw+K2raaODHw3BCLMt05QZa4AlDGq3mqMX5qiOvO6dVN5D/QxxZjTIDBJkpiNT0A9thYAK1nlU+b5qtPL15OF9RtFlFY/1RtaFkm2AfIXFBVRXcbZt+8DYKou02AiqlrXGGYkAePaJmNcmmhQK7mJYV77+4AbuSTAGWYBcOwAAAAASUVORK5CYII=" />
            </a>
          </template>
        </van-cell>
        <van-cell title="Telegram" is-link class="footerContent" :border="false">
          <!-- <template #icon>
            <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAhtJREFUOE+lVUtSIkEQzWz57YYj4AmcG4gnkK1BEDEuCRZKGLMW1zMM7UJYwgQYbuEE4g3gBOIJBndDo+S8KruJortamqE2SlfWy1cvX2YxxaxWq5uXbPpUSEpCXGCirypUiCZMMmPiIS+Wo3r9fG6DQPzmUoCrXOaCRC6xk49L7H+fE7Pr/PVuwwk2gBXoezb9GLDbArreVrc4WCxPTPA1sGaaTT8nYBmXb+4slocBuAb+X6bhDCZzDdy86zeg1XXSq38aJ3JzVas0eD8J5ImIlVu+GMm0JNy8u/9GLN0d2L4g1sXhntLTelvhcwAPhsR0ug0Y+v0Wlt73amVsxlrPC4242R5MEHgUA/wKP7uOk+rVq2czFfOz3S8dcGoS/G62+0jEx+Z53UQAxt/IeiHhxlWt3At2PmqR6pI4I/N7zHmKAkMf86AC/tHpFx1hgDIqbiTrPBRW8q68H1kRKeC/Ma3Y5aX3RLlcfiVvLVz1BMDFeq2sZFsvP+GjBXearHi+N8MAkEHNEyQOLV28BHbTHQWJwox/de5dEbmIAsNufoOoipsmt5uEUdBq+SbYtDkCe6/wuBqzu7V0wJ48b4ah9SfK1m9pteGzHuPfOD/bbxD9OgXbourI8NhMJok9jZZgY2wGcXswXzMNsOxPUyZ1iTGqrLStoB8t7725nz5N5g01+0ymhOezhCFVMPSf4kWFZDx0PG8Y95j+A9g1GLI1midVAAAAAElFTkSuQmCC" />
          </template> -->
          <template #icon>
            <img src="../images/i-dianbao.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <a href="https://t.me/www_metabasenet_club" target="_blank">
              <van-icon size="24"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAASFJREFUSEvdlE0OgjAQhTskxqV4Ae0N1BtwBN2grDyKHsVdARdwBL2B3KDeAHckRmurkFT+MigmKhsWPN43fTMdIB9+4MP+5A8BQ989yNhGJdHFcBET7jicet70ahQ1xpVEfD4P9X8LEUmAqOhLBJ2uxWezWGq41AyLOrE/2o6FAhztBao/gy3bgIDlw7RlgGYepYC4tRPo5io6cU7u2bcCyJs/+sJ2rQA08xMQw+K2raaODHw3BCLMt05QZa4AlDGq3mqMX5qiOvO6dVN5D/QxxZjTIDBJkpiNT0A9thYAK1nlU+b5qtPL15OF9RtFlFY/1RtaFkm2AfIXFBVRXcbZt+8DYKou02AiqlrXGGYkAePaJmNcmmhQK7mJYV77+4AbuSTAGWYBcOwAAAAASUVORK5CYII=" />
            </a>
          </template>
        </van-cell>
        <van-cell title="Facebook" is-link class="footerContent" :border="false">
          <!-- <template #icon>
            <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAeZJREFUOE+VlUtSwkAQhrtDIe7kBuoJ5AaGE8DWQkpYAgtNpVyLa6XABbiEKmAPJyCcQHICPQLsRMq0PUOCIS+GqWJBpufrf/o1CDGr3e5nKZMuEFCRAC8QICdMCWCBQF8IOMH1ZmoY1WUUgu33lwA6pyf3QPTAO9k4x+73JSB2tO+ft6CDPbCA/mbSM0/dAehuW9witd7k/fAdWCrNpD8VVMb5W2rrzaUHl2B1pTTnIFuOBhYSZPmX41A8eZ78yiW41R02/QaRkgirZqM0CO61eiPm+RbRs9koN1EtBDQ362U9ymEIDCBDgq3uuAJI/cREuSo8G3FDRLx2yy/skG/H4NEEEApJYAcp/1grWzIf3XGO/38kC4Ep8lUWbHSlCn55H+oa4SzJXjZRRIxCZ/yKVcACEA8OxDVKYZITAf7iQ+ehgwrghDK145OnAH7tjQbcCHdhUSJ58eXGEwzEbbga0TAaJZFkWRWE1HZLTUy88KAS5eY2iACcxWX6yOStuEHEmD3c0keBvZbedVNCPR8Bts36rXwQ/sfmtqMmURWiCLY1TBWN2s02L/64uvG2gp2oALY5rnrkoPc7cOtTPE0yoQngFT9hHTEmg4kPvXmegau+woNd1wCb/nJzgHh+g8UqB3GP6R/Z7SqySGGsRQAAAABJRU5ErkJggg==" />
          </template> -->
          <template #icon>
            <img src="../images/icon_facebook.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <a href="https://www.facebook.com/profile.php?id=61557178406261" target="_balck">
              <van-icon size="24"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAASFJREFUSEvdlE0OgjAQhTskxqV4Ae0N1BtwBN2grDyKHsVdARdwBL2B3KDeAHckRmurkFT+MigmKhsWPN43fTMdIB9+4MP+5A8BQ989yNhGJdHFcBET7jicet70ahQ1xpVEfD4P9X8LEUmAqOhLBJ2uxWezWGq41AyLOrE/2o6FAhztBao/gy3bgIDlw7RlgGYepYC4tRPo5io6cU7u2bcCyJs/+sJ2rQA08xMQw+K2raaODHw3BCLMt05QZa4AlDGq3mqMX5qiOvO6dVN5D/QxxZjTIDBJkpiNT0A9thYAK1nlU+b5qtPL15OF9RtFlFY/1RtaFkm2AfIXFBVRXcbZt+8DYKou02AiqlrXGGYkAePaJmNcmmhQK7mJYV77+4AbuSTAGWYBcOwAAAAASUVORK5CYII=" />
            </a>
          </template>
        </van-cell>
        <van-cell :title="`${t('User.version')} ${config.version}`" v-show="version.version > config.version"
          class="footerContent" :border="false">
          <template #icon>
            <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAlVJREFUOE+1VU16EkEQrRoF3BlvgCcQb0BOIK6TfJKlYSF8xLW4VgQXJMvEL7B2coLkCHACuYHDTsBQvurpJtPNTPxcOBvo6qrXr1/9NFPBNxhc7Eml9EpIGkJcZaKaugrRlEnmTBzzcn3d6RwneRDw9z8F3DwpvyORNnb2ig629oSYh9Gv1dfwAA9YQe8qpRvHDsELMIyxnm5YpgoWCddgq8HWwPKpu8Wj5Xo/C74FNkwrpR9bliIfo9XvYdFVjX/5cRuMPzj20XL93Pkb4IDpAuwa798e3f5FBrP96fyqjlvEyl71d8wNcH901XMnA3Q/D3QwmpjkdVoHRpLsZ8FvjA037baOeuxJYI1hYH80aRLLRRrIx93WweWuz5ZcopJwJmgBQzXU1AN1aDngluDcJBT7AB7HxIR6pW+nJ4fNLJNc0AfAP5+NL6HtGxT7NffPxqrZC5Wve3I4dHEB6Mz66Pb9/4A5sLT2B6aJsMAvUZi0zIEzSFRHKf50fizcNMyIEpB55shkk1gMjIQJSx3l01bdQwJfzidDEZlnbxkC50qxk/WCm3k5sVKoXA8mLwjKlSzr4yfvvkZN/RW1cFEuHLDfDyg3v/7Srgll0LUDRvu+zOu+TPeafvh/La1sLOtbW6sJSu/1Pw6h74jV2T1DlZiZEo7NOWxmxmIo9fIGuKdp+iA46byRsDPo0QiOuWLghaBYNjKN7KDfYNBzxDW0rQ5698KYJsod9B6TdIBre6bsi78FGA/zHoSdN88/oAxW0gDrqtVft2dgC8k4jlaruKg8/wCtcp+yvmQTwQAAAABJRU5ErkJggg==" />
          </template>
          <template #right-icon>
            <van-icon size="12" style="margin-right: 3px; margin-top: 10px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUKFNjZEADlsExAf/+/5/PyMCw4cS6pYno8kBxVGAZFF3wn4GhHyq6AF0ThgaHgASBH0y/DwA16GPThKEBpAifJqwa8GnCqQGbJqDiQoIavjP/3s/4n8EA4p//iXidhKL4P8PCE+uXJuD0NDbFIDuwBisuxVg1WATFNADdWg9xMsQZyFGLYYNFSIwDw7//Gxj//19wfP2yAvSUAACSvlinXbdujwAAAABJRU5ErkJggg==" />
          </template>
          <template #value>
            <a :href="version.url" target="_blank" style="color: inherit; text-decoration: none;">
              <div style="display: flex; justify-content: flex-end;align-items: center; margin-right: 10px; ">
                <div style="margin-top: 5px;margin-right: 7px;"><van-badge dot> </van-badge></div>
                <!-- <span class="custom-title">V&nbsp;</span> -->
                <van-tag>V{{ version.version }}</van-tag>
              </div>
            </a>
          </template>
        </van-cell>
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
import { ref } from "vue";
import {
  showSuccessToast,
  showFailToast,
  showLoadingToast /*showConfirmDialog*/,
  Locale
} from "vant";
import { useRouter } from "vue-router";
import { ethers, parseEther, isAddress } from "ethers";
import axios from "axios";
import BigNumber from "bignumber.js";
import { userStore } from "@/stores/user.js";
import {
  InitUser,
  addrFormat,
  timeFormat,
  LoadUserMNT,
  LoadUserUSDT,
} from "@/utils/helper.js";
import { config } from "@/const/config";
import AddressCopy from "@/components/AddressCopy.vue";
import { useI18n } from "vue-i18n";
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import viVN from 'vant/es/locale/lang/vi-VN';
import koKR from 'vant/es/locale/lang/ko-KR';
import thTH from 'vant/es/locale/lang/th-TH';
import QRCode from 'qrcode';
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();
const { t, locale } = useI18n();
const user = userStore();
const router = useRouter();
const showBottom = ref(false);
const language = ref(user.language);
const index = ref(user.index)
const qrImage = ref('')
const qrCodeValue = ref(user.address)
const isDarkTheme = ref();
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  const root = document.documentElement;
  if (isDarkTheme.value) {
    // 切换到深色主题
    root.style.setProperty('--color-background', '#181818');
    root.style.setProperty('--color-text', '#ffffff');
    root.style.setProperty('--box-background', '#262727');
    // ... 为其他变量设置深色主题的值
  } else {
    // 切换到浅色主题
    root.style.setProperty('--color-background', '#edf4ff');
    root.style.setProperty('--color-text', '#2A4057');
    root.style.setProperty('--box-background', '#ffffff');
    // root.style.setProperty('--box-border2A4057');
    // ... 为其他变量设置浅色主题的值
  }
};
const getCode = async () => {
  //Create a new canvas element to accommodate the QR code
  const qrCodeCanvas = document.createElement('canvas');
  qrCodeCanvas.width = 300;
  qrCodeCanvas.height = 300;

  // Generate QR code to new canvas element
  await QRCode.toCanvas(qrCodeCanvas, qrCodeValue.value);

  // Add a logo in the middle of the QR code
  const ctx = qrCodeCanvas.getContext('2d');
  const logo = new Image();
  logo.src = require('@/assets/logo.png');
  logo.onload = function () {
    const logoSize = qrCodeCanvas.width * 0.22; // Adjust the logo size as needed
    const logoX = (qrCodeCanvas.width - logoSize) / 2;
    const logoY = (qrCodeCanvas.height - logoSize) / 2;

    // Draw QR code
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

    qrImage.value = qrCodeCanvas.toDataURL();
  };
};
getCode();
function languageChoose(v) {
  if (v == 0) {
    language.value = 'en';
  } else if (v == 1) {
    language.value = 'zh';
  } else if (v == 2) {
    language.value = 'vi';
  } else if (v == 3) {
    language.value = 'ko';
  } else if (v == 4) {
    language.value = 'th';
  } else if (v == 5) {
    language.value = 'ms';
  } else {
    language.value = 'en'
  }
  locale.value = language.value;
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
  user.set_language(language.value);
}

const showBottomOne = ref(false);
const showBottomTwo = ref(false);



const version = ref({ version: config.version, url: "" });

axios.get(`${config.api}wallet/version`).then((ret) => {
  version.value = ret.data;
});



const verifyPassword = ref(false);
const password = ref("");
const passwordType = ref("password");

const loading0 = ref(false);
const childs0 = ref([]);

async function load0() {
  await InitUser();
  const ret = await axios.get(`${config.api}friends/childs/${user.address}/0`);
  childs0.value = ret.data;
  loading0.value = false;
}


let op = () => { };

function copyp(v) {
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      let p = "";
      if (v == 1) {
        p = user.privateKey;
        showSuccessToast(t('Common.copy_success'));
      } else if (v == 2) {
        p = user.mnemonic;
        //showSuccessToast("复制助记词成功");
        showSuccessToast(t('Common.copy_success'));
      } else {
        //showFailToast("操作失败");
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = p;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      verifyPassword.value = false;
    } else {
      //showFailToast("密码错误");
      showFailToast(t('Common.password_error'));
    }
    password.value = "";
  };
}

function createWallet() {
  router.push("/create");
}

function importWallet() {
  router.push("/import");
}


let cancel = () => {
}

function selectWallet(key) {
  user.index = key;
  user.mnemonic = user.wallets[key].mnemonic;
  user.address = user.wallets[key].address;
  user.privateKey = user.wallets[key].privateKey;
  user.password = user.wallets[key].password;
  user.p_address = user.wallets[key].p_address;
  user.USDT = user.wallets[key].USDT;
  user.MNT = user.wallets[key].MNT;
  user.USDT_approve = user.wallets[key].USDT_approve;
  user.walletName = user.wallets[key].walletName;
  user.promptInfo = user.wallets[key].promptInfo;
  user.last_vote = user.wallets[key].last_vote;
  router.push('/user')
}
let noClick = ref(false);
function deleteWallet(key) {
  if (user.wallets.length == 1) {
    noClick.value = true
    return
  }
  verifyPassword.value = true;
  op = async () => {
    if (password.value == user.password) {
      password.value = ''
      showLoadingToast({
        message: t("Common.submitting"),
        forbidClick: true,
        duration: 100,
      });
      if (user.index > key) {
        user.index = user.index - 1;
        index.value = user.index;
      }
      user.wallets.splice(key, 1);
      verifyPassword.value = false;
    } else {
      password.value = '';
      showFailToast(t("Common.password_error"));
    }
  }
  cancel = () => {
    password.value = ''
  }
}
function mnt_transferPage() {
  router.push('mnt')
}
function usdt_transferPage() {
  router.push('usdt')
}
function mntSteamPage() {
  router.push('mnt_info')
}
function usdtSteamPage() {
  router.push('usdt_info')
}

function topupPage() {
  //showLoadingToast("Opening");
  router.push('topup')
}
function withdrawPage() {
  router.push('withdraw')
}
function incomePage() {
  router.push('income')
}
function purchasePage() {
  router.push('purchase')
}
const copy = async (v) => {
  try {
    await toClipboard(v)
    showSuccessToast(t('Common.copy_success'));

  } catch (e) {
    console.error(e);
  }
}
</script>
<style scoped>
.box {
  background-color: var(--color-background);
  padding: 0 24px;
  min-height: 100vh;
}

.box-one {
  height: 97px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.box-one-itemOne {
  display: flex;
  justify-content: flex-start;
}

.box-one-itemOne-one {
  margin-right: 6px;
}

.box-one-itemOne-twoTop {
  font-size: 16px;
  /* color: #EAECEF; */
  color: #3cc;
  margin-bottom: 10px;
}

.box-one-itemOne-twoBottom {
  font-size: 16px;
  /* color: #ADB6C4; */
  color: #9c9c9d;
  position: relative;
}

.box-one-itemTwo {
  display: flex;
  justify-content: flex-start;
}

.box-one-itemTwo-0 {
  margin-left: 15px;
}

.box-one-itemTwo-two {
  margin-left: 15px;
}

.box-one-itemTwo-three {
  margin-left: 15px;
}

.walletSwitch-pop {
  --van-popup-background: var(--color-background);
  padding: 16px 25px;
}

.wallet-switch-title {
  font-size: 18px;
  color: var(--color-text);
  text-align: center;
}

.walletSwitch-content {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.walletSwitch-contentLeft {
  display: flex;
  justify-content: flex-start;
}

.walletSwitch-contentLeft-one {
  margin-right: 10px;
}

.walletSwitch-contentLeft-twoTop {
  font-size: 16px;
  color: #3cc;
  margin-bottom: 10px;
}

.walletSwitch-contentLeft-twoBottom {
  font-size: 12px;
  color: var(--color-text);
  position: relative;
}

.walletSwitch-contentRight {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.walletSwitch-contentRight-two {
  width: 22px;
  height: 22px;
  /* background-color: #202730; */
  margin-left: 40px;
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

.box-two {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
}

.box-twoLeft {
  width: 9.8125rem;
  height: 6.125rem;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.box-twoRight {
  width: 9.8125rem;
  height: 6.125rem;
  background-color: #29313D;
  border-radius: 12px;
  text-align: center;
}

.box-twoLeft-top {
  width: 9.8125rem;
  height: 3.25rem;
  border-radius: 12px 12px 0 0;
  text-align: center;
  padding-top: 8px;
}

.box-twoLeft-top h3 {
  font-size: 20px;
  color: var(--color-text);
  margin: 0;
}

.box-twoLeft-top p {
  font-size: 16px;
  color: #a8a9af;
  margin: 5px 0 0;
}

.box-twoLeft-bottom {
  width: 9.8125rem;
  height: 2.375rem;
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: space-between;
}

.box-twoLeft-bottom-one {
  width: 4.9063rem;
  height: 2.0625rem;
  border-radius: 0 0 0 12px;
  border-top: #e7e3eb 1px solid;
  border-right: #e7e3eb 1px solid;
  box-sizing: border-box;
  text-align: center;
  /* line-height: 38px; */
  padding-top: 5px;
}

.box-twoLeft-bottom-two {

  width: 4.9063rem;
  height: 33px;
  border-radius: 0 0 12px 0;
  border-top: #e7e3eb 1px solid;
  border-left: #e7e3eb 1px solid;
  box-sizing: border-box;
  text-align: center;
  /* line-height: 38px; */
  padding-top: 5px;
}

.box-three {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
}

.box-threeLeft {
  width: 157px;
  height: 64px;
  background-color: var(--box-background);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
}

.box-threeRight {
  width: 157px;
  height: 64px;
  /* background-color: #29313D; */
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
}

.box-threeLeft-img {
  margin: auto;
  margin-top: 5px;
}

.box-threeLeft-content {
  margin: 3px 0 0;
  font-size: 16px;
  color: #8D96A4;
}

.earnings-record {
  margin: 14px 0 0;
  --van-cell-group-inset-radius: 12px;
  --van-cell-group-background: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.earnings-recordContent {
  /* --van-cell-background: #29313D; */
  background-color: var(--box-background);
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
  --van-cell-active-color: #29313D;
  --van-cell-font-size: 16px;
}

.custom-icon {
  font-size: 24px;
  margin-right: 11px;
}

.footer {
  margin: 20px 0 0;
  --van-cell-group-background: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.footerContent {
  --van-cell-background: var(--box-background);
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: #EAECEF;
  --van-cell-font-size: 16px;
  --van-cell-active-color: #202730;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.popupOne {
  padding: 15px 25px 0;
  background-color: #202730;
  --van-popup-round-radius: 22px;
}

.popupOne-title {
  font-size: 18px;
  color: #EAECEF;
  text-align: center;
}

.language-icon {
  margin-top: 28px;
  display: flex;
  justify-content: center;
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

.qr-code {
  width: 197px;
  height: 197px;
}

.save-share {
  margin-top: 79px;
  display: flex;
  justify-content: center;
}

.link-text {
  font-size: 17px;
  color: #EAECEF;
  width: 281px;
  height: 92px;
  background-color: #29313D;
  border-radius: 8px;
  padding: 52px 23px;
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

.walletSwitch-contentRight-one {
  width: 22px;
  height: 22px
}
</style>
