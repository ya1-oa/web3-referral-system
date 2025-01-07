declare global {
  interface Window {
    ethereum: any;
  }
}

import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { RPC_URL } from './config';
///import { contractABI } from './abi';
export async function switchToPolygonAmoy() {
  if (!window.ethereum) throw new Error('No Web3 provider found');

  try {
    // Try to switch to Polygon Amoy
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${polygonAmoy.id.toString(16)}` }],
    });
  } catch (switchError: any) {
    // Chain hasn't been added yet
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${polygonAmoy.id.toString(16)}`,
          chainName: 'Polygon Amoy',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: [RPC_URL],
          blockExplorerUrls: ['https://www.oklink.com/amoy']
        }],
      });
    } else {
      throw switchError;
    }
  }
}

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(RPC_URL)
});

export function getWalletClient() {
  if (!window.ethereum) throw new Error('No Web3 provider found');
  
  return createWalletClient({
    chain: polygonAmoy,
    transport: custom(window.ethereum)
  });
}