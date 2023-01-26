import { ethers } from 'ethers';
import { BaseError } from './base';

export interface UnsupportedNetwork {}
export class UnsupportedNetwork extends BaseError {}

const NETWORK_ID: any = {
  2000: 'dogechain',
};

export function getNetworkById(networkId: number): any {
  const network: string = NETWORK_ID[networkId];
  return getNetwork(network);
}

export default function getNetwork(network: string): any {
  // currently subgraphs used under this function are outdated,
  // we will have namewrapper support and more attributes when latest subgraph goes to production
  const SUBGRAPH_URL = 'https://graph-node.dogechain.dog/subgraphs/name/dcnsdomains/dcns'
  const INFURA_URL = 'https://dogechain.ankr.com'
  const NETWORKISH = {
    name: "dogechain",
    chainId: 2000,
    ensAddress: "0x8582C4B94D3815CAcF0ebFeAc0Ac30c340Fb8056"
  }
  const provider = new ethers.providers.StaticJsonRpcProvider(INFURA_URL, NETWORKISH);
  return { INFURA_URL, SUBGRAPH_URL, provider };
}
