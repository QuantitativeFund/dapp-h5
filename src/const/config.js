import abi_erc20 from './erc20.json';
import abi_popularized from './popularized.json';
import abi_mining from './mining.json';
import abi_activity from './activity.json';

const config = {
    erc20: abi_erc20,
    popularized: abi_popularized,
    mining: abi_mining,
    activity: abi_activity,
    
    qft_addr: '0x79a82fC67600bdB9aa8944c446e00dafeFF63032',
    usdt_addr: '0x599688E0f2752b95b71E9aee33765a39A8743172',
    popularized_addr: '0x5eBa1fAd5af6b9ac040b37554eF419065e6774d3',
    mining_addr: '0x8934C6382372Eb445FAcAf242Af0f3a7923875F6',
    activity_addr: '0x9B58346907f5945493D265A4332Bc3A9d96308F2',

    //chainId: "0xcc",
    chainId: "0xb63f",

    api: 'https://site.metabasenet.site/api/',
    version: '1.0.0',
}

export { config }
