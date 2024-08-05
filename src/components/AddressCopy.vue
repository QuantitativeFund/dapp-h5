<template>
    <van-icon :name="icon" :color="icon == 'label-o' ? '' : 'green'" @click="copy(address)"
        style="margin-left: 5px; align-items:center; display:flex" />
</template>

<script setup>
import { ref } from 'vue'
import { showSuccessToast } from 'vant'
const icon = ref('label-o')

function copy(addr) {
    const textarea = document.createElement('textarea')
    textarea.value = addr
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    icon.value = 'passed'
    setTimeout(() => {
        icon.value = 'label-o'
    }, 2000)
    showSuccessToast('复制地址成功')
}

defineProps({
    address: {
        type: String,
        required: true
    }
})
</script>