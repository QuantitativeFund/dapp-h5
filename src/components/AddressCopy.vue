<template>
    <van-icon :name="icon" @click="copy(address)" style="margin-left: 5px; align-items:center; display:flex"
        size="24" />
</template>

<script setup>
import { ref } from 'vue';
import { showSuccessToast } from 'vant';
import { useI18n } from "vue-i18n";
const icon = ref('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAWlJREFUSEvdVUFuglAQ/RNJvAZL7aa9QdsTFG+gURJ3bW/QI9CdCZpyBDlB9QasqrvSG9BlI2H6/g9QBaEIZVEnIfzMn5k382Ymn0TLQi3HF2cO0J9MlqDwroRGazOfP5bRXEoRAFZwvsbnwtDbD8RC3Kg7omV3txt5jhMcA8oB9Mdjg4kupTExDxFAx9+JiHwiCrjTcbezmS/vYWvh/h5HjzVtkOj3gfIAP1kXVR4A6PbNtlVFPdMcIoEXHA/0iXMdAOWLKkdb23bk+cI0r5hZ0umhJ5K6VGoDxBHSJsf9En8NgFL4ebNYPNQDYB7AWY7qgfSmU53C8D1WrmXWtQCS6SkYv6fGAEVjlNHXrwD8tksRMrUwjrkeiCjSsQtqRCENKqjG0bobhsaXpr3C/POkMZXLBJr8gibLgFlR1ZyyaFUo+sC2KrqwzV52rJtuctqDIjaPAfz2BmRjuaDFqAxQra/Vrf7/m/wN1OzMGR7/8uMAAAAASUVORK5CYII=');
const { t } = useI18n();

function copy(addr) {
    const textarea = document.createElement('textarea');
    textarea.value = addr;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    // icon.value = 'passed';
    // setTimeout(() => {
    //     icon.value = 'label-o';
    // }, 2000)
    showSuccessToast(t('Common.copy_success'));
}

defineProps({
    address: {
        type: String,
        required: true
    }
})
</script>