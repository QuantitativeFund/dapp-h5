import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
  state() {
    return {
      address: "",
      p_address: "",
      BNB: "",
      USDT: "",
      QFT: "",
      U_Approve: false,
      Q_Approve: false,
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
    set_BNB(bnb) {
      this.BNB = bnb;
    },
    set_QFT(qft) {
      this.QFT = qft;
    },
    set_USDT_approve(ret) {
      this.U_Approve = ret;
    },
    set_QFT_approve(ret) {
      this.Q_Approve = ret;
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
