import { request } from 'graphql-request';
import { ethers } from 'ethers';
import {
  GET_DOMAINS,
  GET_DOMAINS_BY_LABELHASH,
} from './subgraph';
import { Metadata } from './metadata';
import { getAvatarImage } from './avatar';
import { Version } from './base';
import { SERVER_URL } from './config';

const IMAGE_KEY = 'domains.ens.nft.image';

const DC_NAMEHASH = '0x458f3086a527467f29a17c336f3a63f5e1207a370e449006f79291e42b342da7';

const contractAddressToLabelHashMap: any = {
  // dogechain
  "0xe83c2021550b17169bd2d608c51ba6a2bea0f350": DC_NAMEHASH,   // .dc

  // dogechain testnet
  "0x1070aaf6115ff3f8d6307f39c7a7a3fac622879c": DC_NAMEHASH,   // .dc
}

export async function getDomain(
  provider: any,
  networkName: string,
  SUBGRAPH_URL: string,
  contractAddress: string,
  tokenId: string,
  version: Version,
  loadImages: boolean = true
): Promise<Metadata> {
  let hexId: string, intId;
  if (!tokenId.match(/^0x/)) {
    intId = tokenId;
    hexId = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(ethers.BigNumber.from(tokenId)),
      32
    );
  } else {
    intId = ethers.BigNumber.from(tokenId).toString();
    hexId = tokenId;
  }
  const labelHash = contractAddressToLabelHashMap[contractAddress.toLowerCase()] || DC_NAMEHASH;
  const queryDocument: any =
    version !== Version.v2 ? GET_DOMAINS_BY_LABELHASH(labelHash) : GET_DOMAINS;
  const result = await request(SUBGRAPH_URL, queryDocument, { tokenId: hexId });
  const domain = version !== Version.v2 ? result.domains[0] : result.domain;
  const { name, labelhash, createdAt, parent, resolver } = domain;

  const hasImageKey =
    resolver && resolver.texts && resolver.texts.includes(IMAGE_KEY);
  const metadata = new Metadata({
    name,
    created_date: createdAt,
    tokenId: hexId,
    version,
    networkId: provider._network.chainId,
    contractAddress,
  });

  async function requestAvatar() {
    try {
      const [buffer, mimeType] = await getAvatarImage(provider, name);
      const base64 = buffer.toString('base64');
      return [base64, mimeType];
    } catch {
      /* do nothing */
    }
  }

  async function requestNFTImage() {
    if (hasImageKey) {
      const r = await provider.getResolver(name);
      const image = await r.getText(IMAGE_KEY);
      return image;
    }
  }

  async function requestMedia() {
    if (loadImages) {
      const [avatar, imageNFT] = await Promise.all([
        requestAvatar(),
        requestNFTImage(),
      ]);
      if (imageNFT) {
        metadata.setImage(imageNFT);
      } else {
        if (avatar) {
          const [base64, mimeType] = avatar;
          metadata.setBackground(base64, mimeType);
        }
        metadata.generateImage();
      }
    } else {
      metadata.setBackground(
        `${SERVER_URL}/${networkName}/avatar/${name}`
      );
      metadata.setImage(
        `${SERVER_URL}/${networkName}/${contractAddress}/${hexId}/image.svg`
      );
    }
  }

  await Promise.all([requestMedia()]);

  delete (metadata as any).contractAddress;
  delete (metadata as any).networkId;
  return metadata;
}
