import abi_erc20 from './erc20.json'
import abi_popularized from './popularized.json'
import abi_mining from './mining.json'
import abi_buy from './buy.json'
import abi_helper from './helper.json'
import abi_router02 from './router02.json'
import abi_bridge from './bridgeOut.json'

const config = {
    erc20: abi_erc20,
    popularized: abi_popularized,
    mining: abi_mining,
    buy: abi_buy,
    helper: abi_helper,
    router02: abi_router02,
    bridgeOut: abi_bridge,
    bridgeOut_addr: '0xb601BEDf3566B0B0117Cdf3683A1b8E859be0f35',

    usdt_addr: '0x599688E0f2752b95b71E9aee33765a39A8743172',

    router02_addr: '0xdfD106145cC3491E727244deF09CecC46F31BE31',
    weth_addr: '0x8F8738D94CA825602af06530a422b8D7a323568A',
    pair_addr: '0x85c647DCe86319f250729cF000656fb9EF0d24dA',

    //
    popularized_addr: '0x285C0B34aCa3fB302F75d5930dDe3fAeBeCeBD6B',

    mining_addr: '0x55C8c570aCE68f5CF46bFF6d1557864752AD9eF9',
    buy_addr: '0x4a66cEde3823b091640a081E404c5EE43bAaa331',

    helper_addr: '0x0c69f8f7AC4Fa694E55Ac4D910d65eFCD7973E22',

    rpc: 'https://rpc.metabasenet.site',

    chainId: '0xb63f',
    bridge: '0xd2Ed8e9c913C47A5288bcE1a896Dd952dc7605Ea',

    api: 'https://rpc.metabasenet.site/api/',
    ws: 'wss://rpc.metabasenet.site/ws/',
    rpc_bnb: 'https://bsc-dataseed4.ninicoin.io',
    rpc_trx: 'https://api.trongrid.io',
    bsc_bridge: '0x505550989920aaed645e6ac33aa47b0641526e44',
    bsc_usdt_addr: '0x55d398326f99059fF775485246999027B3197955',
    version: '2.1.2',

    xh_addr: '0x416C5514a04bE332b931a4B84e2c851AcdbbAB13',
    lucky_addr: '0x227ACe0211CBb67a5AF34E0CFcD79aBAA2022D1A',
    flowers_addr: '0xa067120E6229239d0616CcC266210E254303474e',
    dragon_addr: '0x2B6cF753f245636B50Dc0A5ce4EbF57EFaa60054',
}

export { config }
