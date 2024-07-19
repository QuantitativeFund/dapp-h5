<template>
  <!-- <ConfigProvider theme="light">
  </ConfigProvider> -->
  <div
    v-if="$route.name == 'friends' || $route.name == 'home' || $route.name == 'mining' || $route.name == 'buy' || $route.name == 'user'">
    <router-view></router-view>
    <Tabbar v-model="active" placeholder v-show="user.dapp == 'Out'" class="tabbar" active-color="#1FAAA8"
      :border="false">
      <TabbarItem name="friends" to="/friends" class="tabbarItemOne"> {{ $t('App.miner') }}
        <!-- <template #icon="props">
          <img :src="props.active ? icon_miner.active : icon_miner.inactive" />
        </template> -->
        <template #icon>
          <img src="./images/gongren.png" style="width: 25px; height: 25px;" alt="">
        </template>
      </TabbarItem>
      <TabbarItem name="mining" to="/mining" class="tabbarItemTwo">{{ $t('App.mining') }}
        <!-- <template #icon="props">
          <img :src="props.active ? icon_mining.active : icon_mining.inactive" />
        </template> -->
        <template #icon>
          <img src="./images/chanzi.png" style="width: 25px; height: 25px;" alt="">
        </template>
      </TabbarItem>
      <!-- <TabbarItem name="home" to="/home" class="tabbarItemThree">{{ $t('App.ecology') }}
        <template #icon="props">
          <img :src="props.active ? icon_ecology.active : icon_ecology.inactive" />
        </template>
      </TabbarItem> -->
      <TabbarItem name="buy" to="/buy" class="tabbarItemFour">{{ $t('App.node') }}
        <!-- <template #icon="props">
          <img :src="props.active ? icon_node.active : icon_node.inactive" />
        </template> -->
        <template #icon>
          <img src="./images/jiedian.png" style="width: 25px; height: 25px;" alt="">
        </template>
      </TabbarItem>
      <TabbarItem name="user" to="/user" :dot="update" class="tabbarItemFive">{{ $t('App.my') }}
        <!-- <template #icon="props">
          <img :src="props.active ? icon_user.active : icon_user.inactive" />
        </template> -->
        <template #icon>
          <img src="./images/user.png" style="width: 25px; height: 25px;" alt="">
        </template>
      </TabbarItem>
    </Tabbar>
  </div>
  <router-view v-else name="wallet"></router-view>
</template>

<script setup>
import { ref, watch, } from 'vue';
import { ethers } from 'ethers';
import { Tabbar, TabbarItem, ConfigProvider, Popup, Locale } from 'vant';
import { useRouter } from 'vue-router';
//import AddressCopy from '@/components/AddressCopy.vue';

import { InitUser } from '@/utils/helper.js';
import { config } from '@/const/config';
import { userStore } from '@/stores/user.js';
import axios from 'axios';
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import viVN from 'vant/es/locale/lang/vi-VN';
import koKR from 'vant/es/locale/lang/ko-KR';
import thTH from 'vant/es/locale/lang/th-TH';
import { useI18n } from "vue-i18n";

const icon_miner = {
  active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAmtJREFUOE+1lUFsEkEUht8MgjSgBWpRY2zWi700EU82Jo3Vg+etiQe9wLWmifXmzbMn2xhPXjBpgVAtqz14MK2QEIH0YE0g0WKEWA+mkXQbrZSCO84M2c0uC91tk76EsDu8/ebt//55IDiiQEfEBUvwuBjx1R2tMFKISBCE6AM+XgyBNMFI6vt37EVaisqdBe4LHr11N9I4Pfi0ORjwNoKn4PjmL3Bt1vhHDQIgIyAP8ouxqB7eFSykUj7X9423gUxh9PfIMPwZuag94y2u8w12z50Bb2kd8F6T/4YImc2lYtNqogksJJMhorSygLHnbGIJeoFrN66CY+cvDKzk+DcPjK7nX86l+Ub68lmlpNmo0rV+tm4FZjnOrW0IvM/xyhGC17lX86IJPLQQjyKCwupmdsAst6+yAb7CGu0nyIXFeb8BLMTjAnGgiv4NGHgvOACscWowfVkwKfQRXFrmkmCFXP4gxdY0KYSFxDQh8ESf7M+ugvvHTwOA3dQvnAf5SsiwrsuNUvisBh5KJmbozX0TxeYCc8uJ4pdP1OAyQpixAChUohfX6GXb/IcI7gyMs9/CkTFNYyYDKESDekrlR4dgs148+zp1b8rkCuZhgFZ/YCWfPgjYsVPnjXMrTr96vA0+7rSbXXhb388ZeqzH1WeMB6SLM+zAT34sgadc0U6dWYouXrYDDr5Zfrw69/yhPtc0Kw4qh6u29a48OXmzswDzEGrPC9a8S5bVElJELvdYdWLC3jxuD6Ndic4o5u0eQTLI6Ra7QU0adxKEZDyiABLpa7Fus4m3TQdNGiMyU719Z19LWv41WcrRI+E//RIHcoVmhaAAAAAASUVORK5CYII=',
  inactive:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAnRJREFUOE+1lU1oE0EUx99sE1AUmp6aBo0e6k0wuRVKsD0oVFASDyJFbNCr0nrz5lkvpohILzWKSaUx2QhNo2ljV/qVipAUih4qfkSkMYeSSkEs2Z2+t5I1m12bbaEPht2dnf3Nm//85y2DfQq2T1xoCu7xBx2/W6oDTOF+zsCDHzjUZDhIXGDJg7LtiZQMVxoT3BHcdbE/eMzlenCkvf3wUWcHfC+tYStBca2kcThAhQG/lUtEw/VwU7Aozjg+/yymY5lMV7fXC91ej/bNfL6gTtDpdgPd/9naUt8xzocXxehQbaABLKYynqoMcy2CcOje6GOEmoMv9/XBxuYmPJ9Mq1c1BNabe/FMUieqT58yVezyV+xspf5mYBpTXl+HMYRT5ozBy8V4xG8AJyamSaeB2mRWwDR2ZfUTTM7O4n5CZSkRadOBxfTMcS7LX+pXQGB3hxNo42pB+lKQFPUxMh5TJREU7l1IRguaFPGJ7BDu7n2dNNksrH4r6gD0cPJEJ5zz+XT94r+xYYQPa+BEajqEaxk0UCx2kEPm8/llNHiFMSGkglHbJF5OY/tr/j0EyYBOmrt66YK6FBVMMgBXNOhCYfnOHtjgdjkfDl6/ckO3efRAHuYytI69ei3tBvwLs6WMDyj2ttrx1vm40W5W4TV9c4mIdkR1YDNnWIG/WXoH7z9+0E6dUQoTL1sBPxqP3Z16OnK7fqyhVuxWjh/l8tTNa/1nGxMwFiGsF9wu0+adapYt58qKULX7AoFea/WYihG3VZNYVcjb5sH5W1a1+c2gBo0bCfFUNoh1lqpVDzaqeBvYJOwLBc6f2dGSTX9NzeT43/ttMsEjcqpb+hoAAAAASUVORK5CYII=',
};
const icon_mining = {
  active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAnNJREFUOE+1lM9PE1EQx+e9WkKLYNNWSEyE5S+wHPwRo3F78eRBDxobY+DmEf4D/Q/UgycPYgLdurW0UeNvSovaHwfpNsJBTQDDQWOUFhKq0O2O7y0uoe1uuxx4p7c73/m8eTPzhsA+LbJPXNgz+NTFqwJSR4E5lqmGlzKJsGIWnG2wIEkCOkgBalrF//bdEWdpHZDBHRoGzeD2wbIcQNAKenQaVvxvZt2t4LbBnCfI0ggCecD3pKqiL/mBWMFbgnk+gdJhQmgxG5tICCxqQHUWCe3mcLpVBe9MBszgpmAOcKyt3Tg4//m6a+V7F4ds9h1+UhJPBA2oUTAreBO4MSrX0gp0fVmE1eBp0Dqcpt1J1ZrqnX5/QI+cgJKPTQ7VgRuh7Xq84+dv2Or16TJaVX/1xV74ATCdmwqLO2AOZVVPMc2hdkBu5zfx5JSHP0IXUtsFxfS3KyHR8NXBQjzuwermEtt6bEPzynJuanLQSr8NjkbGEOG2mciTV1hrVaF05rhudmxUoPfptL4niHez8fCYmZ8OHpAllgJyrlHAofzK5ZMB+DN4dMfMi9kzt7CdWw2HLF/egBxhr7N+WUENlf9VWu9foCSYezzBAqtf/yOO8EFyzDC1g3KdL5kB1hVFlueAZSr6o9I4QTLMBXagzvI6+F+mi52aU0wlxsuWYCEqiYhkhgu6F76+Vt2d53fndLcjh3qT2Xn3XzxrBdULazj1y5E77GPU7HTjH4f6UvnnrkrtWitoHZh/CI+kW0jITTO4c7W82PPx0+jc/XvPWh1u2JpnBRvoQGGEvXmRi9irUijBxPLlUFPlWx2wp3lsJ1JD8w+gQTYm1oFhMQAAAABJRU5ErkJggg==',
  inactive:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAnVJREFUOE+1lM9rE0EUx2e2tkpLsQcPpSJEMLeC7c1LcEOJYqFgBEERaRHBY3vxrP+B7U1PRpqkWt3s2mx2JT/ItgsmAW0SiB6MaNWDQUOtEhSz2R1npm4hye5me+icZvZ932e+O2/mQXBAAx4QF+wbfObiFQ9i+oo4cYcxUPClEC1ZmXMN5uWsB+l6Udf138txcezb9jZAGN5nIL8V3D04kZxAiCkSd7qB4WvioBPcNZgAuURmDiL0kMz/NjW0IknQDu4IJucJGGYWQqac48ICj10bBtyAEA7vwptgRZKBFdwSTAD1H79uqZub199tfRoiEM/Y8bXL5wN+E2oWzA7eBe50ValWwas3b8HV6Qvg8MCA5e3UNK0VSUiHqHMISgUuMtkG7oT2uuNfajVwYnSUypqaVl9cDh8DAK3nY1F2D0yhiFHwh6O9gCReqb4H0ob66PbNGwotKELrl2YCrJlLwTyfHUH9+kc8HXENVdWtfCxy0k5PwZyYWYAA3bMSSapKqx+cmqLhn40GeLD6lM6x06UcH12wyqPgWDylAAjPdgoIlPzytM8Hxr2n9sKvcTEzhQJd42c9afvyYmIav872YQc1VSHhOb2/gIH+/LOw0pm/61hMk0Zy2gz2ghLdY1kGn7/WyvicJ+yPQkyHcHCWCNxAiVPsuHzE6GcVIbRjC+bjKRZBmCWCXKmcHB4aPDfu9Vrp6e8/kV9U0B/DZwelhTWzY4n0Iu6D85a0/x8JdDWZlIxG65oTtA1MFlw8dRf3gjtW8Nr3+odUITfP318SnTY3Y929Ajd0o9WawwGWihhYggYSgjOBrso7bbCvfuzGqan5ByZQXybAYtAiAAAAAElFTkSuQmCC',
};
const icon_ecology = {
  active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAuJJREFUOE+1ld9LU2EYx5/3bGfOdHNLm0mKR6Ei7EIv+gURdlU3glYXTYLuhK7cHxFdBSYUBEVEuZ1p6lZ2E1kqiG5GKqmUkrYo0STbtP3Ss52385w8c+o5cwU+Vxvv+37e7/N9nuc9BPYoyB5xIWvw6SvXakkySaX46vO6A/gfRHodKHAojjLE6+9qa1WEZgTjYSqKzQRI/fbMRAMLCYsZiCAAG1yVlxmR1gx5XeP4WxN8pqHxzlpxUfO6rRDWbEXyQTa4AowEih86CIK1AAxLy5DM2wfG+QUwj04BIaRhuKvNqwmuueF4Ea46XIdQrSh6NSArReU/Ll2EEnePJJmc93W29auCj9285YhzZS14YLew+Mch98s3WLhaJ4ONImvt9z4O7QBzPM+BmPxMWb1OF4mBeWxSTne1pgpiFWU77mHWBWnPFPw+fhRsPa8HfN2uWtXiVTx90inmGC5jQWw9byBypFIClso+aoVxfhF0kSiYRqdC/m6ndQeY83gsVFgL4kL+5AywoRUInj2R0Q1FAGVZGa7qMfeMr6WU9CGp8O0QRKXU1dJPvwltQDuwHnnTc1pgt4NSaMGDeHum9HEPem8dfAc/L5yTCvgdTJPTGuD29npKqGe3TpArvlEDpahoHYJVuyLdikxwhKJVCUsBhE5Vy1tRee784vPhLmdqQlOTh2AQkr1Ur9dpgdWginomkUgNx5Y+5niXi10O2rWmDfvaOjiyRanSQeaJT63DHpcjXdCmYt65WNg7WByWmh3fgvTAXi2Qpgy7BH1Vgg2twv4+Hz/CP2rcnmUKXN7hpjiW2DpKUVClxT8GegmwcrIa4qWbFxp+hcKm9xP20Qf3XqpZt6nY5Vwyffh4AFUI0nO4Lr1oeTNzEC8rCUQry0uojsnZ6IhZ6cL7s01NtzMWWVnkOjqqmVj0LmWYfCKKYTE35yGwRvkJhET8b/kTEAjY7YGsWjKbTf+zJ+tP07/C/wDSrVQmWznL4gAAAABJRU5ErkJggg==',
  inactive:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAu9JREFUOE+1lctPE1EUxs8tfSU0UTBia0IhkbIBAzVGJEoCstLESKPGgBgfCzcuYKMb/wM1QYyLLoiyoAWBdlopFHAqCIF2jDwW4gZMSk2kVqgIY9KWtmPPmCkFpqUuuJu2uff87nfO+c4tgQNa5IC4kDX47LXmWhKLcYm17LH1ePE3xLnbwEExiuMkxMZYutoFoRnBGMzF4y0ESMPuzBRyORTk50M4EoFAMMhvS+KcftpmnsfvacHVhqbnhcc1LYVqNRSqNXxgILjGg3RFRTz0m98Ph1QqWFz2gYthgBBicFu6bGnBNx48fFtdWXFZq1GnbUGnzc4rReUtzTfhyavXCcmkztPfNS4Kfvz0RWv5iZI2DNhvDU1OwufFJXh07y4PVsZleeO2zvU9YMo5VhwOhZbkMlnOBsvy6flW/FBfVQXlupI992BZ8Mx5vR6Mvb0fPFZzrWjzzJbBfqVCcRUDjL19cLqsjAdiHdOtRZ8PNjZZoBlmnbGa8vaAKWrsMCeL/cKNqbl5vlGG+vqM1RAEKBNl+53IULTG1MC7Wo6QMST1OJ1QXqITTT/1pvfMRwhFwqCUK+DTwoI42OJwtRLg2jAQb8+UPp5Bq1lpF9xpuMI3cGpuLp1iuoEjQO3nBNwXSiA0FUuHYFFXpJYiExyh3UNOKDiSD5dqavijlMsFSz6f3W0xJSc0OXkIDkejNFotHVgMKqgPR7eSw7HDx332YfP3n6uNOMJiC32NNU1VKjhoena23U2ZW1Pjkorf2Ef8pgHHsXOn9KDTanew0atDE5NwUqeDC1Vnkns40v0jo920qaNpt5gk2OqgORxLHGWhKagSx/bHWpCvp65o+8KV1VWW9rgbKWO7QyzDbcXUcGBiduZoIAHBdLWJF23mywK+ZN6K0lKNVCpV8I7Y2vq6ybLG+7euP8vU5O3mDY5WbvwJvczJkahisTirys3tkEQk/BMI0mjlv0+p13CxzpuNJbP+B8kGJtq8/w3c7/xf2X1iJvTMcyYAAAAASUVORK5CYII=',
};
const icon_node = {
  active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAd5JREFUOE+1lEFLAkEUx2cW1rASl5QghPTQPbvVKfsAkRlpUVDdA+0T5Eeob+AhdV1LpU5daosShQ5KBtUlD4FQWEoXW2WnWWvN1VldFOewh3kzv/ef/3tvIRjQgs1ch3ObqVCCl5QLQaqUPjk61KpDAZ51bfoBQPuqlym4kDo+4rXAG2BbJOJEEMVJl+jPMjCfXwPQGzjsRxCqqp1gz6ScAfyifGtykk1NijuDTRdJogO6t2J9PxULKmzVDFbzVf9a+GBu7sZ6BkvKakZDVhyiS79JIIM/09j/Evaf6RkseUyJaCaZCGUkrC0adiAEL/sGW0KnDWgzGIjo1sKe7coJZcv+PY7HGSBUfEQvKVjKr64dtMZsUdYHEMXn3e76K5qXopJyYG5l0ykicUsv6nb4RODP09/onGvDhxBYIglAEGTSseBevQJtKjjOPvLwGDXcP021DoSkcPj5xUt9C7bWe3gfUEK10XZtYCsX5nG+efP5FaDLX4oRtnIsUmu70dwzMOSeuoOlgaDfixkogoYVhfVFR99g6f8AqzUFRxg3qXFBV8WTHJvA/hCLo0rFga5guUeJVccD0bMVnVRpKF4Wj7ad2G5dwFIhjaQzEMHlvMeTkGPEAekE1xobGPgHMtLzF/Ls1QgAAAAASUVORK5CYII=',
  inactive:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAeZJREFUOE+1lD8sA1Ecx9+7SIXFYWERgx2bTirEgmgZSWisErVYmUWEXaoR/xLaO1qaaGkHlUrElaQdTBXLRaI6tg3vee/o6Z137lLxhhvud7/P7/u+v9/vIPinAyu5Duc0X+BKc6xaGHL5a//2ulUdGnDP2OQSAHjRMJmDfcnD7bgVuAoWglEnhkBgJT3ncsAnHgFQDdgfjCxBCA3VLns3aU0fuVFWX5xlk6rYDLx3GmY68CTLyvtkYEdjq2Wwka8P2WxOvIg1VQ2mypob+bt6W21eKQIhT56d8stLfuvomK8aTD3mEO6+EndTlCsEIw4MYezP4JUNrwqtBCOEEqte32y5YNmy73ETYjyqefMwvSTLMT7cv6aP+UPnHg6+x11Dg8otKo+mk+WAfXzSiTCaqkM2d1z0fXr6dexjEx6MwShLANmD1HVgZ15pgf4D4eSs61K6P0jcSh36haAKbzPpuUKx2K7Pu0lnQLFUUsfuBzgQjMRJx3vppj3nXzUrHAhFsdHYJaQUSEiSOXg/HAaPspyCCKhWLMy4HX8G0/9DoVjScNpaW4y4RK2Z4lBUJNnM5hhSScAUXJ5RdtdhrGorflNloXl3ZLW7mONmAqaNbGB9AzFwuUYGqI3KYS7Ib3CrsX8DfwAkrg0mx0GuWgAAAABJRU5ErkJggg==',
};
const icon_user = {
  active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAkFJREFUOE+1lM1OE1EUx8+dpnQA004pwS8K08YYAxtq4saYWH0B68qoC+UJfAVfQMPCB5gFdFrATg0bSfwoKtjaBa3BxLCw9SshJqaVpO3YMnO5d8iM/ZgZhgZPMqu553f+93/OuQj+UyAn3MuxOzMqAzf0sxhDISfFn9nl2oKjsfucjFoSIIj2QDBkACuz2XSibFbAEkyh1fGRfCM8cU4eP2Xksj92wLv5CVy1OmCA6qDqDmXSQrUbbgm+8OhxphE8cxW1WuD59VvLk88eFGCaLfB9KAAtggGnc6n4TUdgPpmMYYQl9ucO+HIF2OO8UA8FoUE+PSh8dPWNppxV3f5u1aaK+aT4janLwdHVNahcuQTNsYBpnwZL34EjhYFB17LL85n2Qz1gXhR57EKlE1vbwBAbdiPTls2nqk+mnjsEL4lRjNFrquQvUdp+fbMKpxMrwKg4spGOE+n/wlKxk/l21RowtvKimE0tzDhq3uSiNpuTh8E1j/PFHn9pnmnzwoJwVxli5203i/gfePl+eaBSeeLBnqLtVLRv2u7FaaidD1uyaQ+oYj0wgoJLwbO614ZiXpI49ktpvTnCTSnDQ4e5YPx3V/5oBYa3S0DhuacLkQ4rJhYTc6TKA8fEroP+d3ltE0FVQvT9MBSThtF99/ULplvqf5s3ZrodTN6U/mOAvCeBVxvHr/gAvL6WTcWjnR4viQLC6F6/mr0fP28GtsrX9bHrmAp1T54j8NgRvf6KMBbKt24/tF3pfhU7WunjgO8DNA37F8wn7n8AAAAASUVORK5CYII=',
  inactive:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAkBJREFUOE9jZKARYCTGXKuAKIN/TAz+MLX//zNcOLl+2UZ8evEa7BCQIPCD8fd6BkYGBwxD/jMcYPj/N/HEhhUPsFmA02CQoVLyEqf11dRUVOXl4HpvP3zEsO/kSYaPX74w/Gdg+MD5j1XxwIYFH9ANx2lw2+TZBzQUFe1//vrF8OjFC7A+VTmIBSCxbYcPM4As+c/wf8PJdcsCiTJ4/eY9Af8ZGdbffvSIYduhwwziwkIMOioqDDqqqnD9IMMXbNgIdjnHP1ZBdFdjdfHazbsfff76VXY+UGOQizODrIQE1ni6cvsO2OUMTIyOJ9YsOYCsCMPg9dv3K/z/+/f+0fMXwF52MjfDGfkg+YlLlhJp8ObdDv8ZGfeDXCInIQn0vgreFNk1bz4D07//hsc2LLtAlIuJSd+fgOE7Y9XqiyfWLTUgKvLWbdkDSpvyhAwHh/HRIxjhC9KHNfIWrNgYzcfDvQSfwaDwXb5t+5rXb99MYf/PfhFvqkDOac7m5gzG2lo4zQbFAcjF8GzOyHCB+e//RFhYw128fv1+gRtP7h6VEBXR4ufhIRQKcPlX794xXL59m+Hs1WsMwLR/4eTapYYoQbFu654JwGyUT7SJaArX790LzokM//4qgsoPuIuBEQbK7/zkGgzKpev37IWnaWSDgWUK+eAxsDwBRib1XQwxeNvBE+uWOaCG8ZY9C4AC8eS6+eCZM+cvXrjhBEt2KKniP+vfCUCDA0gM64f///9fEOzr2oA3S5PrYqKyNDUMBwCr7Rgm6EfcaAAAAABJRU5ErkJggg==',
};

const { locale } = useI18n();
const barShow = ref(true);
const active = ref('friends');


const user = userStore();
const router = useRouter();
user.set_dapp('Out');
const language = ref(user.language);
locale.value = language.value;
if (locale.value == 'zh') {
  Locale.use('zh-CN', zhCN);
} else if (locale.value == 'vi') {
  Locale.use('vi-VN', viVN);
} else if (locale.value == 'ko') {
  Locale.use('ko-KR', koKR)
} else if (locale.value == 'th') {
  Locale.use('th-TH', thTH);
} else if (locale.value == 'ms') {
  Locale.use('en-US', enUS);
} else {
  Locale.use('en-US', enUS);
}


watch([() => router.currentRoute.value.name], (R) => {
  active.value = R[0]
  if (active.value == 'wallet' || active.value == 'usdt_info' || active.value == 'mnt_info') {
    barShow.value = false;
  } else {
    barShow.value = true;
  }
})

if (ethers.isAddress(user.address)) {
  InitUser();
  router.push('/friends');
} else {
  router.push('/wallet');
}

const update = ref(false);

axios.get(`${config.api}wallet/version`).then(ret => {
  if (ret.data.version != config.version) {
    update.value = true;
  } else {
    update.value = false;
  }
});

</script>

<style scoped>
/* :deep(.van-tabbar--fixed){
      border: 3px solid black;
      z-index: 999;
} */
/* body {
  color: var(--van-text-color);
  background-color: var(--van-background-2);
}

.van-icon__image {
  margin-top: 4px;
}
.given-icon_img {
  margin-right: 3px;
}

.divider {
  color: var(--van-blue);
  border-color: var(--van-blue);
  padding: 0 16px;
} */

.tabbar {
  --van-tabbar-background: #f7f8fa;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemOne {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemTwo {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemThree {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemFour {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}

.tabbarItemFive {
  --van-tabbar-item-active-background: #fff;
  --van-tabbar-item-text-color: #2A4057;
}
</style>