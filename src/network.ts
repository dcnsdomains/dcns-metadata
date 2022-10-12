import { ethers } from 'ethers';
import { BaseError } from './base';

export interface UnsupportedNetwork {}
export class UnsupportedNetwork extends BaseError {}

const NETWORK = {
  DOGECHAIN: 'dogechain',
};

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
  let SUBGRAPH_URL: string;
  let INFURA_URL: string;
  let NETWORKISH: any = undefined;
  switch (network) {
    case NETWORK.DOGECHAIN:
      SUBGRAPH_URL = 'https://graph.bch.domains/subgraphs/name/graphprotocol/ens-dogechain';
      INFURA_URL = `https://rpc.yodeswap.dog`;
      NETWORKISH = {
        name: "dogechain",
        chainId: 2000,
        ensAddress: "0x834C46666c1dE7367B252682B9ABAb458DD333bf"
      }
      break;
    default:
      throw new UnsupportedNetwork(`Unknown network '${network}'`);
  }


  const provider = new ethers.providers.StaticJsonRpcProvider(INFURA_URL, NETWORKISH);
  return { INFURA_URL, SUBGRAPH_URL, provider };
}
