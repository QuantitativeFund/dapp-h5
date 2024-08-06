import moment from "moment";
import { ethers, formatEther, keccak256, solidityPacked, toUtf8Bytes, AbiCoder } from "ethers";
import { Provider } from "@/utils/metamask.js";
import { config } from "@/const/config";
import { userStore } from "@/stores/user.js";
import BigNumber from "bignumber.js";

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
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`;
  } else {
    return "0x??????...??????";
  }
}

export function signParams(chainId, popularized_addr, p_addr, addr) {
  const msgParams = {
    domain: {
      chainId: chainId,
      name: "QFT Popularized",
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

export function percentage(A, B) {
  return BigNumber(ethers.formatEther(A)).times(100).div(BigNumber(ethers.formatEther(B))).toFixed(4);
}

export async function LoadUserUSDT() {
  const user = userStore();
  const usdt = new ethers.Contract(
    config.usdt_addr,
    config.erc20,
    Provider
  );
  const ret = formatEther(await usdt.balanceOf(user.address));
  user.set_USDT(ret);
}

export async function LoadUserQFT() {
  const user = userStore();
  const usdt = new ethers.Contract(
    config.qft_addr,
    config.erc20,
    Provider
  );
  const ret = formatEther(await usdt.balanceOf(user.address));
  user.set_USDT(ret);
}

export async function LoadUserBNB() {
  const user = userStore();
  const ret = formatEther(await Provider.getBalance(user.address));
  user.set_MNT(ret);
}

export async function InitUser() {
  const user = userStore();
  const popularized = new ethers.Contract(
    config.popularized_addr,
    config.popularized,
    Provider
  );
  let ret = await popularized.spreads(user.address);
  user.set_paddress(ret.parent);

  const USDT = new ethers.Contract(config.usdt_addr, config.erc20, Provider);
  ret = formatEther(await USDT.balanceOf(user.address));
  user.set_USDT(ret);
  ret = await USDT.allowance(user.address, config.activity_addr);
  user.set_USDT_approve(ret == ethers.MaxUint256);

  const QFT = new ethers.Contract(config.qft_addr, config.erc20, Provider);
  ret = formatEther(await QFT.balanceOf(user.address));
  user.set_QFT(ret);
  ret = await QFT.allowance(user.address, config.mining_addr);
  //console.log(ret, ethers.MaxUint256, ret == ethers.MaxUint256);
  user.set_QFT_approve(ret == ethers.MaxUint256);
  ret = formatEther(await Provider.getBalance(user.address));
  user.set_BNB(ret);
}