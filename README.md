# DcNS-metadata-service

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![Travis][travis-shield]][travis-url]

## API


### Request
- __network:__ Name of the chain to query for. (smartbch | smartbch-amber | ...)
- __contactAddress:__ accepts contractAddress of the NFT which represented by the tokenId
- __NFT v1 - tokenId:__ accepts labelhash of DcNS name in both hex and int format
- __NFT v2 - tokenId:__ accepts namehash of DcNS name in both hex and int format

```
/{networkName}/{contractAddress}/{tokenId}
```

Request (example)

https://metadata.bch.domains/smartbch/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/42219085255511335250589442208301538195142221433306354426240614732612795430543/

https://metadata.bch.domains/dogechain-testnet/0x07D127d14Bbd2af65fd86537913acAd35D6c0682/0x3e603807758134653f4c858cec61078722f6544783a94e8f5b1298df89d293ae


https://metadata.bch.domains/dogechain/0x0aF878360B48b5f51F4e919f3cC1EC08B78627ad/0x3e603807758134653f4c858cec61078722f6544783a94e8f5b1298df89d293ae

https://metadata.bch.domains/dogechain/0x0aF878360B48b5f51F4e919f3cC1EC08B78627ad/0x8f77c8c6fd421d301c5f91568d08c991f5a87c5f04cc3f0a4176f9e9b14c3854

// dc domain
https://metadata.bch.domains/dogechain/0xe83c2021550b17169bd2d608c51ba6a2bea0f350/0xa1ed537a640b942ced4023e4bcce52645fcedf46b28b966a036b9fe422a83e89

### Response (example)

```json
{
  "name": "pat.eth",
  "description": "pat.bch, an DcNS name.",
  "attributes": [
    {
      "trait_type": "Created Date",
      "display_type": "date",
      "value": 1580803395000
    },
    {
      "trait_type": "Registration Date",
      "display_type": "date",
      "value": 1580803395000
    },
    {
      "trait_type": "Expiration Date",
      "display_type": "date",
      "value": 1698131707000
    }
  ],
  "name_length": 4,
  "short_name": null,
  "length": 0,
  "url": "https://app.bch.domains/name/pat.bch",
  "version": 0,
  "background_image": "https://metadata.bch.domains/smartbch/avatar/pat.bch",
  "image_url": "https://metadata.bch.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f/image"
}

```

More info and list of all endpoints: https://metadata.bch.domains/docs


## How to setup

```
git clone https://github.com/bchdomains/DcNS-metadata-service.git
cd DcNS-metadata-service
cp .env.org .env // Fill in Vars
yarn
yarn dev
```


## How to deploy

```
yarn deploy
```


## How to test

Regular unit test;
```
yarn test
```

Unit test + coverage;
```
yarn test:cov
```


## Environment Variables

| Name | Description | Default value | Options |
| ---- | ----------- | ------------- | ------- |
| INFURA_API_KEY | API Key provided by Infura. [See here](https://infura.io/docs/gettingStarted/projectSecurity) (Required) | - | - |
| HOST | Host (ip/domain) address of the running service | localhost | - | No |
| ENV | Project scope | local | local/prod |
| INAMEWRAPPER | InterfaceId of NameWrapper Contract | 0x1aa28a1e | - |
| ADDRESS_ETH_REGISTRAR | smartBCH address of ENSBaseRegistrar Contract | 0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85 | - |
| ADDRESS_NAME_WRAPPER | smartBCH address of NameWrapper Contract | 0x4D83cea620E3864F912046b73bB3a6c04Da75990 | - |


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/bchdomains/DcNS-metadata-service.svg?style=for-the-badge
[contributors-url]: https://github.com/bchdomains/DcNS-metadata-service/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bchdomains/DcNS-metadata-service.svg?style=for-the-badge
[forks-url]: https://github.com/mdtanrikulu/bchdomains/DcNS-metadata-service/members
[stars-shield]: https://img.shields.io/github/stars/bchdomains/DcNS-metadata-service.svg?style=for-the-badge
[stars-url]: https://github.com/bchdomains/DcNS-metadata-service/stargazers
[issues-shield]: https://img.shields.io/github/issues/bchdomains/DcNS-metadata-service.svg?style=for-the-badge
[issues-url]: https://github.com/bchdomains/DcNS-metadata-service/issues
[license-shield]: https://img.shields.io/github/license/bchdomains/DcNS-metadata-service.svg?style=for-the-badge
[license-url]: https://github.com/bchdomains/DcNS-metadata-service/blob/master/LICENSE
[travis-shield]: https://img.shields.io/travis/com/bchdomains/DcNS-metadata-service/master?style=for-the-badge
[travis-url]: https://travis-ci.com/github/bchdomains/DcNS-metadata-service
