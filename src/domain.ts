import { request } from 'graphql-request';
import { ethers } from 'ethers';
import {
  GET_REGISTRATIONS,
  GET_DOMAINS,
  GET_DOMAINS_BY_LABELHASH,
} from './subgraph';
import { Metadata } from './metadata';
import { getAvatarImage } from './avatar';
import { Version } from './base';
import { SERVER_URL } from './config';

const IMAGE_KEY = 'domains.ens.nft.image';

const ETH_NAMEHASH = '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae';
const BCH_NAMEHASH = '0x4062ae9e99543fadaf6946b98c6f12538a99834a89521ef85301d7d91e281c8d';
const DOGE_NAMEHASH = '0x294e2d893ce499d687a17323b05880c4cf91b7fcf595374ecf3f9eb52aff9398';

const networkRootLabelHash: any = {
  "smartbch": BCH_NAMEHASH,
  "smartbch-amber": BCH_NAMEHASH,
  "dogechain": DOGE_NAMEHASH,
  "dogechain-testnet": DOGE_NAMEHASH
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
  const labelHash = networkRootLabelHash[networkName] || ETH_NAMEHASH;
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
    networkId: provider._network.chainId
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

  async function requestAttributes() {
    if (true || parent.id === BCH_NAMEHASH) {
      const { registrations } = await request(SUBGRAPH_URL, GET_REGISTRATIONS, {
        labelhash,
      });
      const registration = registrations[0];
      if (registration) {
        metadata.addAttribute({
          trait_type: 'Registration Date',
          display_type: 'date',
          value: registration.registrationDate * 1000,
        });
        metadata.addAttribute({
          trait_type: 'Expiration Date',
          display_type: 'date',
          value: registration.expiryDate * 1000,
        });
      }
    }
  }
  await Promise.all([requestMedia(), requestAttributes()]);
  return metadata;
}
