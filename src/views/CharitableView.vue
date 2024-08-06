<template>
  <van-pull-refresh v-model="loading" @refresh="load" style="min-height: 80vh;">
   <van-tabs sticky animated swipeable v-model:active="active">
     <van-tab title="捐献">
       <van-cell-group inset>
       </van-cell-group>
     </van-tab>
     <van-tab title="捐献明细">
       <van-cell-group inset>
       </van-cell-group>
     </van-tab>
   </van-tabs>
  </van-pull-refresh>
</template>
<script setup>
import { ref } from 'vue';

const active = ref(0);
const loading = ref(false);

async function load() {
 loading.value = false;
}
</script>