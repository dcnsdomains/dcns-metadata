# dcns-metadata

## API


### Request
- __network:__ Name of the chain to query for. (dogechain | dogechain-testnet)
- __contactAddress:__ accepts contractAddress of the NFT which represented by the tokenId

```
/{networkName}/{contractAddress}/{tokenId}
```

Request (example)
https://metadata.dc.domains/dogechain-testnet/0xbEE8EfC14b2fe020c1Eb7F5EE810Dffa27d638eD/15689827285224103067243218785250161404348533702991579618798445906349509186723/

### Response (example)

```json
{
  "name": "tomokisun.dc",
  "description": "tomokisun.dc, an DcNS name.",
  "name_length": 9,
  "url": "https://app.dc.domains/name/tomokisun.dc",
  "image_url": "https://metadata.dc.domains/dogechain-testnet/0xbEE8EfC14b2fe020c1Eb7F5EE810Dffa27d638eD/15689827285224103067243218785250161404348533702991579618798445906349509186723/image.svg"
}

```

More info and list of all endpoints: https://metadata.dc.domains/docs


## How to setup

```
git clone https://github.com/dcnsdomains/dcns-metadata.git
cd dcns-metadata
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
