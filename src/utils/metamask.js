import { ethers } from "ethers";
import { config } from '@/const/config';

export async function connectMetaMask() {
    if (window.ethereum) {
        try {
            (await (window.ethereum)).request({
                method: 'wallet_switchEthereumChain',
                params: [{
                    chainId: config.chainId,
                }]
            })
            return true;
        } catch (e) {
            if ((e).code === 4902) {
                try {
                    console.log('wallet_addEthereumChain');
                    (await (window.ethereum)).request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: config.chainId,
                                chainName: 'opBNB',
                                nativeCurrency: {
                                    name: 'BNB',
                                    symbol: 'BNB',
                                    decimals: 18
                                },
                            }
                        ]
                    })
                    return true;
                } catch (ee) {
                    return false;
                }
            } else if ((e).code === 4001) {
                return false;
            }
        }
    }

    window.ethereum.on('connect', function (error, account) {
        if (error) {
            return ""
        } else {
            console.log('MetaMask connection, address:', account);
        }
    });
}

// export function getAccount() {
//     window.ethereum.request({ method: 'eth_requestAccounts' }).then((res) => {
//         console.log(res[0]);
//         return res[0];
//     }).catch((ex) => {
//         console.log('44', ex)
//         if (ex.code === -32002) {
//             console.log('No operation performed')
//         }
//         if (ex.code == 4001) {
//             console.log('connection denied')
//         }
//     })
// }
// 

export async function getAccount() {
    return await window.ethereum.request({ method: 'eth_requestAccounts' });
}

let Singer;
let Provider;
export default (async () => {
    delay(3000);
    Provider = new ethers.BrowserProvider(window.ethereum);
    Singer = await Provider.getSigner();
})();

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(console.log('❤️'));
        }, delayInms);
    });
}
export { Singer, Provider };