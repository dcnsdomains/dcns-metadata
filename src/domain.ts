import { BigNumber, ethers } from 'ethers'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Metadata } from './metadata'
import { SERVER_URL } from './config'
import { NETWORK_NAME, setupRegistrar } from '@dcnsdomains/function'

export async function getDomain(
  provider: StaticJsonRpcProvider,
  networkName: NETWORK_NAME,
  contractAddress: string,
  tokenId: string,
  loadImages: boolean = true
): Promise<Metadata> {
  const registrar = setupRegistrar(networkName, provider)
  const hoge = Number.parseFloat(tokenId)
  const { name } = await registrar.getERC721Datastore(contractAddress, BigNumber.from(tokenId))

  const metadata = new Metadata({
    name: name + '.dc',
    tokenId,
    networkId: provider._network.chainId,
    contractAddress,
  });

  async function requestMedia() {
    if (loadImages) {
      metadata.generateImage();
    } else {
      metadata.setImage(
        `${SERVER_URL}/${networkName}/${contractAddress}/${tokenId}/image.svg`
      );
    }
  }

  await Promise.all([requestMedia()]);

  delete (metadata as any).contractAddress;
  delete (metadata as any).networkId;
  return metadata;
}