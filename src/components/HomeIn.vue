<template>
  <div class="box">
    <van-popup class="header" v-model:show="showLeft" position="left" :style="{ width: '80%', height: '100%' }">
      <van-cell-group inset class="footer" :border="false">
        <div style="position: relative;">
          <van-cell :title="t('App.theme')" is-link class="footerContent" :border="false" @click="showBottomTwo = true">
            <!-- <template #icon>
              <van-icon size="24" style="margin-right: 11px;"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAn9JREFUOE+1VUFyElEQ7R5lcCc5gXiCkBM4nCC4NlSRpWRhEF2La6XABbhMqkjWkhMQTyCcIHgCh50MSvu6Z4b8mQopNZVfBcz/83nd/73X/Zm2jF7vpCTFwr6Q1IS4zEQV3SpEUyaZM/GYl6uLVuswvAkC+7NDAdeP/Fckcow3pW2Bk/WQmPvez+hTPkAGWEF/FwuTNLsMqMh7mzO/ywfTUzxYrqou+AbYMi0WrpIsF8i4D5QKMe2DgK/tZj1QwO5wdIn1Z+DkAutTJ1DoLVdPU3ADzmW68IQDiqI5Av2IeZXnb5r1sT5/HI5q4PeLPgNoh3y/vGZBMHrsZm7A3cGok0Q20NbRi6kDsGg3DzJcd4dnKhiA4oC9wXkF4N+MIlDWPqp32KXAFGe2zFgkwFyPP0fQ0xzfDczVKZfCrNkCT3ASc45Rwt3BeQMoJ5k/3nUifAjgs3EsEH1H3Pk1JoTDcfGZYT3nVVZqdvFZmICbwWU8PlFhGXzpi11XIN2HdTBBBO6qb1/W7bjp+PB5FECLic7B/8ZZqS5G6TaA/wF2A94r8F2oyFjRsejMFQ+NBdZKBnhS8UrKlwcLuRyvsZ5aC78b8bBXxSvH4t2X3ZIC0Uxja4lYgcCCgfUEtaHIqZsxCqZhtkIPQXaxY5hr+DYLokC0eDIlTbDRXq6kQ1hqxwX+q5LWPyRZa2SNGAK8+o9NSD2tRTNDtoF2uHzbTCmxBk5r2dOq1J7wunlQtdOlbVNpYG8CmjrJaYyCTNtMj5nLPEMrAsUA10Du+02m6eLNV5P/8BhAejWpoLcNuxC86Ff/1qvJRbDsfR9KSw10lBP+dQuco37nsRdF422X6R9xWJiyRK+CJgAAAABJRU5ErkJggg==" />
            </template> -->
            <template #icon>
              <img src="../images/moon.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
            </template>
            <template #right-icon>
              <van-icon size="12" style="margin-right: 3px;"
                name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUKFNjZEADlsExAf/+/5/PyMCw4cS6pYno8kBxVGAZFF3wn4GhHyq6AF0ThgaHgASBH0y/DwA16GPThKEBpAifJqwa8GnCqQGbJqDiQoIavjP/3s/4n8EA4p//iXidhKL4P8PCE+uXJuD0NDbFIDuwBisuxVg1WATFNADdWg9xMsQZyFGLYYNFSIwDw7//Gxj//19wfP2yAvSUAACSvlinXbdujwAAAABJRU5ErkJggg==" />
            </template>
          </van-cell>
          <div style="position: absolute; width: 22px; height:22px; top:15%; right: 15%;">
            <img src="../images/zhuti.png" alt="" style="width: 22px; height:22px;">
          </div>
        </div>
        <van-popup v-model:show="showBottomTwo" round position="bottom" class="popupOne">
          <div class="popupOne-title">{{ t('Common.select') }}{{ t('App.theme') }}</div>
          <van-divider style="--van-divider-border-color: #29313D;" />
          <div class="language-icon" style="margin-top: 40px;">
            <div style="position: relative;">
              <img src="../images/moons.png" style="width: 35px; height: 35px;" alt="" @click="toggleTheme">
              <img src="../images/i-nowChoose.png" alt="" v-show="isDarkTheme == 0"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/moon.png" style="width: 35px; height: 35px;" alt="" @click="toggleTheme2">
              <img src="../images/i-nowChoose.png" alt="" v-show="isDarkTheme == 1"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="close-btn" @click="showBottomTwo = false">{{ t('Common.Cancel') }}</div>
        </van-popup>
        <!-- 语言 -->
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
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'vi'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'ko'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'th'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="language-icon">
            <div style="position: relative;">
              <img src="../images/i-nowChoose.png" alt="" v-show="language == 'ms'"
                style="position: absolute; left: 95%; top: 43%;">
            </div>
          </div>
          <div class="close-btn" @click="showBottomOne = false">{{ t('Common.Cancel') }}</div>
        </van-popup>

        <van-cell title="Github" is-link class="footerContent" :border="false">
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

        <van-cell :title="`${t('User.version')} ${config.version}`" class="footerContent" :border="false">
          <template #icon>
            <van-icon size="24" style="margin-right: 11px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAlVJREFUOE+1VU16EkEQrRoF3BlvgCcQb0BOIK6TfJKlYSF8xLW4VgQXJMvEL7B2coLkCHACuYHDTsBQvurpJtPNTPxcOBvo6qrXr1/9NFPBNxhc7Eml9EpIGkJcZaKaugrRlEnmTBzzcn3d6RwneRDw9z8F3DwpvyORNnb2ig629oSYh9Gv1dfwAA9YQe8qpRvHDsELMIyxnm5YpgoWCddgq8HWwPKpu8Wj5Xo/C74FNkwrpR9bliIfo9XvYdFVjX/5cRuMPzj20XL93Pkb4IDpAuwa798e3f5FBrP96fyqjlvEyl71d8wNcH901XMnA3Q/D3QwmpjkdVoHRpLsZ8FvjA037baOeuxJYI1hYH80aRLLRRrIx93WweWuz5ZcopJwJmgBQzXU1AN1aDngluDcJBT7AB7HxIR6pW+nJ4fNLJNc0AfAP5+NL6HtGxT7NffPxqrZC5Wve3I4dHEB6Mz66Pb9/4A5sLT2B6aJsMAvUZi0zIEzSFRHKf50fizcNMyIEpB55shkk1gMjIQJSx3l01bdQwJfzidDEZlnbxkC50qxk/WCm3k5sVKoXA8mLwjKlSzr4yfvvkZN/RW1cFEuHLDfDyg3v/7Srgll0LUDRvu+zOu+TPeafvh/La1sLOtbW6sJSu/1Pw6h74jV2T1DlZiZEo7NOWxmxmIo9fIGuKdp+iA46byRsDPo0QiOuWLghaBYNjKN7KDfYNBzxDW0rQ5698KYJsod9B6TdIBre6bsi78FGA/zHoSdN88/oAxW0gDrqtVft2dgC8k4jlaruKg8/wCtcp+yvmQTwQAAAABJRU5ErkJggg==" />
          </template>
          <template #right-icon>
            <van-icon size="12" style="margin-right: 3px; margin-top: 10px;"
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUKFNjZEADlsExAf/+/5/PyMCw4cS6pYno8kBxVGAZFF3wn4GhHyq6AF0ThgaHgASBH0y/DwA16GPThKEBpAifJqwa8GnCqQGbJqDiQoIavjP/3s/4n8EA4p//iXidhKL4P8PCE+uXJuD0NDbFIDuwBisuxVg1WATFNADdWg9xMsQZyFGLYYNFSIwDw7//Gxj//19wfP2yAvSUAACSvlinXbdujwAAAABJRU5ErkJggg==" />
          </template>
          <template #value>
            <div style="display: flex; justify-content: flex-end;align-items: center; margin-right: 10px; ">
              <div style="margin-top: 5px;margin-right: 7px;"><van-badge dot> </van-badge></div>
              <!-- <span class="custom-title">V&nbsp;</span> -->
              <van-tag>V{{ config.version }}</van-tag>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </van-popup>
    <van-button style="width: 100%;" type="success" @click="togglePopup">主题样式</van-button>
    <div class="title">{{ t('HomeIn.miner') }}</div>
    <van-pull-refresh v-model="loading1" @refresh="load1" style="min-height: 80vh;">
      <!-- <van-empty v-show="childs0.length == 0" :description="t('HomeIn.signature_information')" /> -->
      <template v-for="obj, key in childs0" :key="key">
        <div class="your-minner">{{ t('Common.Invitee_application') }}</div>
        <van-cell-group inset class="miner-information" :border="false">
          <van-cell :title="t('HomeIn.miner_address')" :value="addrFormat(obj.c_addr)" class="miner-informationTwo"
            :border="false">
            <template #right-icon>
              <AddressCopy :address="obj.c_addr"></AddressCopy>
            </template>
          </van-cell>
          <van-cell :title="t('Common.time')" :value="timeFormat(obj.sign_utc)" class="miner-informationTwo"
            :border="false" />
          <van-button class="binding-btn" round @click="bind(obj.sign, obj.c_addr, obj.id)">{{
            t('HomeIn.binding') }}</van-button>
        </van-cell-group>
        <br />
      </template>
      <div class="your-minner">{{ t('HomeIn.miner_information_o') }}</div>
      <van-cell-group inset class="miner-information" :border="false">
        <van-cell :title="t('HomeIn.invite_address')" :value="addrFormat(user.p_address)" class="miner-informationOne"
          :border="false">
          <template #icon>
            <img src="../images/i-address.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <AddressCopy :address="user.p_address"></AddressCopy>
          </template>
        </van-cell>
        <van-cell :title="t('HomeIn.miner_count')" :value="childs1.length" class="miner-informationTwo" :border="false">
          <template #icon>
            <img src="../images/gongren.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
        </van-cell>
        <van-cell :title="t('HomeIn.account_address')" :value="addrFormat(user.address)" class="miner-informationThree"
          :border="false">
          <template #icon>
            <img src="../images/user.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
          <template #right-icon>
            <AddressCopy :address="user.address"></AddressCopy>
          </template>
        </van-cell>
        <van-cell title="USDT" :value="BigNumber(user.USDT).toFixed(4)" class="miner-informationFour" :border="false">
          <template #icon>
            <img src="../images/USDT.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
        </van-cell>
        <van-cell title="QFT" :value="BigNumber(user.QFT).toFixed(6)" class="miner-informationFive" :border="false">
          <template #icon>
            <img src="../images/logo.png" style="width: 25px; height: 25px;margin-right: 11px;" alt="">
          </template>
        </van-cell>
      </van-cell-group>
      <div class="minner-team">{{ t('HomeIn.miner_team') }} </div>
      <template v-for="obj, key in childs1" :key="key">
        <van-cell-group inset class="invitation-information" :border="false">
          <van-cell :title="getTitle(obj)" class="invitation-informationOne" :border="false"></van-cell>
          <van-cell :title="t('Common.address')" :value="addrFormat(obj)" class="invitation-informationTwo"
            :border="false">
            <template #right-icon>
              <AddressCopy :address="obj"></AddressCopy>
            </template>
          </van-cell>
        </van-cell-group>
      </template>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { showSuccessToast, showFailToast, showLoadingToast, Popup, Locale } from 'vant';
import { ethers } from 'ethers';
import { config } from '@/const/config';
import { InitUser, addrFormat, timeFormat } from '@/utils/helper.js';
import { userStore } from '@/stores/user.js';
import BigNumber from 'bignumber.js';
import AddressCopy from '@/components/AddressCopy.vue';
import { useI18n } from "vue-i18n";
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import { onMounted } from 'vue';
import { Provider, Singer } from "@/utils/metamask.js";
const { t, locale } = useI18n();

const user = userStore();

const verifyPassword = ref(false);
const password = ref('');
const showLeft = ref(false);
const loading0 = ref(false);
const childs0 = ref([]);

const loading1 = ref(false);
const childs1 = ref([]);
const showBottomTwo = ref(false);
const showBottomOne = ref(false);
const language = ref(user.language);
function languageChoose(v) {
  if (v == 0) {
    language.value = 'en';
  } else if (v == 1) {
    language.value = 'zh';
  } else {
    language.value = 'en'
  }
  locale.value = language.value;
  if (language.value == 'en') {
    Locale.use('en-US', enUS);
  } else {
    Locale.use('zh-CN', zhCN);
  }
  user.set_language(language.value);
}
const togglePopup = () => {
  showLeft.value = !showLeft.value;
}
const isDarkTheme = ref(false);

const toggleTheme = () => {
  isDarkTheme.value = false;
  const root = document.documentElement;
  root.style.setProperty('--color-background', '#edf4ff');
  root.style.setProperty('--color-text', '#2A4057');
  root.style.setProperty('--box-background', '#ffffff');
  localStorage.setItem('theme', 'light');
};
const toggleTheme2 = () => {
  isDarkTheme.value = true;
  const root = document.documentElement;
  // 切换到深色主题
  root.style.setProperty('--color-background', '#181818');
  root.style.setProperty('--color-text', '#ffffff');
  root.style.setProperty('--box-background', '#262727');
  localStorage.setItem('theme', 'dark');
}
function getTitle(key) {
  if (key == 0) {
    return t('HomeIn.inviter_information'); //'邀请者信息';
  } else if (key == 1) {
    return t('HomeIn.self_information');// '自身信息';
  } else {
    // 被邀请者信息
    return `${t('HomeIn.invitee_information')}-${key - 1}`;
  }
}

async function load0() {
  const ret = await axios.get(`${config.api}friends/childs/${user.address}/0`);
  childs0.value = ret.data;
  loading0.value = false;
}

async function load1() {
  try {
    const popularized = new ethers.Contract(config.popularized_addr, config.popularized, Provider);
    popularized.spreads(user.address).then((ret) => {
      childs1.value = ret.child;
      loading1.value = false;
    })
  } catch (error) {
    console.log(error)
  }
}

async function bind(sign, c_addr, id) {
  if (childs1.value.length >= 36) {
    //showFailToast('被邀请者不能多余36个');
    showFailToast(t('HomeIn.bind_prompt'));
    return;
  }

  showLoadingToast({
    message: t("Common.submitting"),
    forbidClick: true,
    duration: 0,
  })
  const v = '0x' + sign.substring(130);
  const r = sign.substring(0, 66);
  const s = '0x' + sign.substring(66, 130);

  const w = Singer;
  const popularized = new ethers.Contract(config.popularized_addr, config.popularized, w);
  const tx = await popularized.popularize1(c_addr, v, r, s);
  tx.wait().then(async () => {
    await axios.put(`${config.api}friends/${id}`);
    await load0();
    await load1();
    showSuccessToast(t('HomeIn.bind_success'));
  });
  showSuccessToast(t('Common.submitOK'));
}

load0();
load1();
onMounted(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    toggleTheme2();
  } else {
    toggleTheme();
  }
});
</script>

<style scoped>
.box {
  background-color: var(--color-background);
  min-height: 100vh;
  padding: 0 21px;
}

.title {
  font-size: 18px;
  color: var(--color-text);
  height: 60px;
  line-height: 60px;
}

.your-minner {
  font-size: 15px;
  color: var(--color-text);
  margin-top: 22px;
}

.miner-information {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.miner-informationOne {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
}

.miner-informationTwo {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
}

.miner-informationThree {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
}

.miner-informationFour {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
}

.miner-informationFive {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
  --van-cell-border-color: #29313D;
}

.minner-team {
  font-size: 15px;
  color: var(--color-text);
  margin-top: 18px;
}

.invitation-information {
  margin: 12px 0 0 0;
  --van-cell-group-inset-radius: 12px;
  background-color: var(--box-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.invitation-informationOne {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
  --van-cell-border-color: #29313D;
}

.invitation-informationTwo {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
  --van-cell-border-color: #29313D;
}

.invitation-informationThree {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
  --van-cell-border-color: #29313D;
}

.invitation-informationFour {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
  --van-cell-border-color: #29313D;
}

.invitation-informationFive {
  --van-cell-background: var(--box-background);
  font-size: 15px;
  --van-cell-text-color: var(--color-text);
  --van-cell-value-color: var(--color-text);
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

.header {
  background: var(--color-background);
}

/* 语言 */
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