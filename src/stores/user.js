import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
  state() {
    return {
      wallets: [],
      index: null,
      mnemonic: "",
      address: "",
      address_trx: "",
      privateKey: "",
      privateKey_trx: "",
      password: "",
      p_address: "",
      USDT: "",
      MNT: "",
      USDT_approve: false,
      walletName: "",
      promptInfo: "",
      dapp: "Out",
      last_vote: "",
      language: navigator.language == 'zh-CN'?'zh':navigator.language,
    };
  },
  actions: {
    set_mnemonic(mnemonic) {
      this.mnemonic = mnemonic;
      if (this.index != null) {
        this.wallets[this.index].mnemonic = mnemonic;
      }
    },
    set_address(address) {
      this.address = address;
      if (this.index != null) {
        this.wallets[this.index].address = address;
      }
    },
    set_address_trx(address) {
      this.address_trx = address;
      if (this.index != null) {
        this.wallets[this.index].address_trx = address;
      }
    },
    set_privateKey(privateKey) {
      this.privateKey = privateKey;
      if (this.index != null) {
        this.wallets[this.index].privateKey = privateKey;
      }
    },
    set_privateKey_trx(privateKey) {
      this.privateKey_trx = privateKey;
      if (this.index != null) {
        this.wallets[this.index].privateKey_trx = privateKey;
      }
    },

    set_password(password) {
      this.password = password;
      if (this.index != null) {
        this.wallets[this.index].password = password;
      }
    },
    set_paddress(address) {
      this.p_address = address;
      if (this.index != null) {
        this.wallets[this.index].p_address = address;
      }
    },
    set_USDT_approve(approve) {
      this.USDT_approve = approve;
      if (this.index != null) {
        this.wallets[this.index].USDT_approve = approve;
      }
    },
    set_USDT(usdt) {
      this.USDT = usdt;
      if (this.index != null) {
        this.wallets[this.index].USDT = usdt;
      }
    },
    set_MNT(mnt) {
      this.MNT = mnt;
      if (this.index != null) {
        this.wallets[this.index].MNT = mnt;
      }
    },
    set_walletName(walletName) {
      this.walletName = walletName;
      if (this.index != null) {
        this.wallets[this.index].walletName = walletName;
      }
    },
    set_promptInfo(promptInfo) {
      this.promptInfo = promptInfo;
      if (this.index != null) {
        this.wallets[this.index].promptInfo = promptInfo;
      }
    },
    set_dapp(v) {
      this.dapp = v;
    },
    set_last_vote(v) {
      this.last_vote = v;
      if (this.index != null) {
        this.wallets[this.index].last_vote = v;
      }
    },
    set_language(v) {
      this.language = v;
      if (this.index != null) {
        this.wallets[this.index].language = v;
      }
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
