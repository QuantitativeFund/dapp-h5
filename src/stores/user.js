import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
  state() {
    return {
      address: "",
      p_address: "",
      BNB: "",
      USDT: "",
      QFT: "",
      language: navigator.language == 'zh-CN' ? 'zh' : navigator.language,
    };
  },
  actions: {
    set_address(address) {
      this.address = address;
    },
    set_paddress(address) {
      this.p_address = address;
    },
    set_USDT(usdt) {
      this.USDT = usdt;
    },
    set_QFT(mnt) {
      this.MNT = mnt;
    },
    set_language(v) {
      this.language = v;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        //key: "local",
        storage: localStorage,
      },
    ],
  },
});
