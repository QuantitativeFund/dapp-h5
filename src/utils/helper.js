import moment from "moment";
import { keccak256, solidityPacked, toUtf8Bytes, AbiCoder } from "ethers";
import { ethers, formatEther } from "ethers";
import { config } from "@/const/config";
import { userStore } from "@/stores/user.js";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDomainSeparator(chainId, name, tokenAddress) {
  return keccak256(
    AbiCoder.defaultAbiCoder().encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        keccak256(
          toUtf8Bytes(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
          )
        ),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes("1")),
        chainId,
        tokenAddress,
      ]
    )
  );
}

export async function getPopularizeDigest(
  chainId,
  token_address,
  addr_p,
  addr_c
) {
  const DOMAIN_SEPARATOR = await getDomainSeparator(
    chainId,
    "Sweet Pie",
    token_address
  );
  return keccak256(
    solidityPacked(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      [
        "0x19",
        "0x01",
        DOMAIN_SEPARATOR,
        keccak256(
          AbiCoder.defaultAbiCoder().encode(
            ["bytes32", "address", "address", "uint256"],
            [
              keccak256(
                toUtf8Bytes(
                  "popularize(address addr_p,address addr_c,uint256 index)"
                )
              ),
              addr_p,
              addr_c,
              0,
            ]
          )
        ),
      ]
    )
  );
}

export function timeFormat(obj) {
  if (obj == null) {
    return null;
  }
  return moment(obj * 1000).format("YYYY-MM-DD HH:mm:ss");
}

export function addrFormat(addr) {
  if (addr == undefined) {
    return "0x??????...??????";
  }
  if (addr.length == 42 || addr.length == 34) {
    // return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`;
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  } else {
    return "0x??????...??????";
  }
}

export function signParams(chainId, popularized_addr, p_addr, addr) {
  const msgParams = {
    domain: {
      chainId: chainId,
      name: "Sweet Pie",
      verifyingContract: popularized_addr,
      version: "1",
    },
    message: {
      addr_p: p_addr,
      addr_c: addr,
      index: 0,
    },
    primaryType: "popularize",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      popularize: [
        { name: "addr_p", type: "address" },
        { name: "addr_c", type: "address" },
        { name: "index", type: "uint256" },
      ],
    },
  };
  return msgParams;
}

export async function LoadUserUSDT() {
  const user = userStore();
  const usdt = new ethers.Contract(
    config.usdt_addr,
    config.erc20,
    new ethers.JsonRpcProvider(config.rpc)
  );
  const ret = formatEther(await usdt.balanceOf(user.address));
  user.set_USDT(ret);
}

export async function LoadUserMNT() {
  const user = userStore();
  const provide = new ethers.JsonRpcProvider(config.rpc);
  const ret = formatEther(await provide.getBalance(user.address));
  user.set_MNT(ret);
}

export async function InitUser() {
  const provide = new ethers.JsonRpcProvider(config.rpc);
  const user = userStore();
  const popularized = new ethers.Contract(
    config.popularized_addr,
    config.popularized,
    provide
  );
  let ret = await popularized.spreads(user.address);
  user.set_paddress(ret.parent);

  const USDT = new ethers.Contract(config.usdt_addr, config.erc20, provide);
  ret = formatEther(await USDT.balanceOf(user.address));
  user.set_USDT(ret);
  user.set_USDT_approve(
    (await USDT.allowance(user.address, config.buy_addr)) == ethers.MaxUint256
  );
  ret = formatEther(await provide.getBalance(user.address));
  user.set_MNT(ret);
}

export function AddrName(a) {
  if (a.toLowerCase() == config.usdt_addr.toLowerCase()) {
    return "usdt";
  } else if (a.toLowerCase() == config.router02_addr.toLowerCase()) {
    return "swap";
  } else if (a.toLowerCase() == config.mining_addr.toLowerCase()) {
    return "miner";
  } else if (a.toLowerCase() == config.buy_addr.toLowerCase()) {
    return "buy";
  } else if (a.toLowerCase() == config.bridge.toLowerCase()) {
    return "bridge";
  } else if (a.toLowerCase() == config.popularized_addr.toLowerCase()) {
    return "bind";
  } else if (a.toLowerCase() == config.weth_addr.toLowerCase()) {
    return "weth";
  } else if (a.toLowerCase() == config.pair_addr.toLowerCase()) {
    return "mnt-usdt";
  } else if (a.toLowerCase() == config.xh_addr.toLowerCase()) {
    return "xh";
  } else if (a.toLowerCase() == config.lucky_addr.toLowerCase()) {
    return "lucky";
  } else if (a.toLowerCase() == config.flowers_addr.toLowerCase()) {
    return "flowers";
  } else if (a.toLowerCase() == config.dragon_addr.toLowerCase()) {
    return "dragon";
  } else {
    return a;
  }
}
