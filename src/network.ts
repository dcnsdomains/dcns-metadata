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
  const SUBGRAPH_URL = 'https://graph.bch.domains/subgraphs/name/graphprotocol/ens-dogechain';
  const INFURA_URL = `https://rpc.yodeswap.dog`;
  const NETWORKISH = {
    name: "dogechain",
    chainId: 2000,
    ensAddress: "0x834C46666c1dE7367B252682B9ABAb458DD333bf"
  }
  const provider = new ethers.providers.StaticJsonRpcProvider(INFURA_URL, NETWORKISH);
  return { INFURA_URL, SUBGRAPH_URL, provider };
}
