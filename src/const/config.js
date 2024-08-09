import abi_erc20 from './erc20.json';
import abi_popularized from './popularized.json';
import abi_mining from './mining.json';
import abi_activity from './activity.json';
import abi_helper from './helper.json';
import abi_charitable from './charitable.json';
import abi_router01 from './router01.json';
import abi_pair from './pair.json';

const config = {
    erc20: abi_erc20,
    popularized: abi_popularized,
    mining: abi_mining,
    helper: abi_helper,
    activity: abi_activity,
    charitable: abi_charitable,
    router01: abi_router01,
    pair: abi_pair,

    qft_addr: '0x79a82fC67600bdB9aa8944c446e00dafeFF63032',
    usdt_addr: '0x599688E0f2752b95b71E9aee33765a39A8743172',
    router01_addr: '0xdfD106145cC3491E727244deF09CecC46F31BE31',
    pair_addr: '0x64896929Ca9242Fb37b4Bd128B5e159C7f508D97',
    popularized_addr: '0x5eBa1fAd5af6b9ac040b37554eF419065e6774d3',
    mining_addr: '0x8934C6382372Eb445FAcAf242Af0f3a7923875F6',
    activity_addr: '0x9B58346907f5945493D265A4332Bc3A9d96308F2',
    helper_addr: '0xb90C8f0D2B9e92E2F593A71Fa84ba9330193CB5E',
    charitable_addr: '0x6475d4A124D9985C1E40163fb1D36A28beCCf49b',

    admin_addr: '0x20f4aafd23eda1f8620b859C9e06226F58729B49',
    //chainId: "0xcc",
    chainId: "0xb63f",

    api: 'https://qftmining.metabasenet.site/api/',
    version: '1.0.0',
}

export { config }
