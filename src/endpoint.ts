import { Express } from 'express';
import { FetchError } from 'node-fetch';
import { getDomain } from './domain';
import { UnsupportedNetwork } from '@dcnsdomains/function'
import getProvider, { NETWORK_NAME } from '@dcnsdomains/function/dist/provider';
import { ethers } from 'ethers';

export default function (app: Express) {
  app.get('/', (_req, res) => {
    res.send('Well done mate To see more go to "/docs"!');
  });

  app.get(
    '/:networkName/:contractAddress(0x[a-fA-F0-9]{40})/:tokenId',
    async function (req, res) {
      // #swagger.description = 'ENS NFT metadata'
      // #swagger.parameters['networkName'] = { description: 'Name of the chain to query for. (mainnet|rinkeby|ropsten|goerli...)' }
      // #swagger.parameters['{}'] = { name: 'contractAddress', description: 'Contract address which stores the NFT indicated by the tokenId' }
      // #swagger.parameters['tokenId'] = { description: 'Namehash(v1) /Labelhash(v2) of your ENS name.\n\nMore: https://docs.ens.domains/contract-api-reference/name-processing#hashing-names' }
      // const { contractAddress, network, tokenId } = req.params;
      const contractAddress = req.params.contractAddress as string
      const networkName = req.params.networkName as NETWORK_NAME
      const tokenId = req.params.tokenId
      try {
        const provider = getProvider(networkName)
        const result = await getDomain(
          provider,
          networkName,
          contractAddress,
          tokenId,
        ) as any;
        /* #swagger.responses[200] = { 
               description: 'Metadata object' 
        } */
        result.image = result.image_url;
        delete result.image_url;
        res.json(result);
      } catch (error: any) {
        console.log('error', error);
        let errCode = (error?.code && Number(error.code)) || 500;
        if (error instanceof FetchError) {
          if (errCode !== 404) {
            res.status(errCode).json({
              message: error.message,
            });
            return;
          }
        }
        /* #swagger.responses[404] = { 
               description: 'No results found.' 
        } */
        res.status(404).json({
          message: 'No results found.',
        });
      }
    }
  );

  app.get(
    '/:networkName/:contractAddress(0x[a-fA-F0-9]{40})/:tokenId/image(.svg)?',
    /* istanbul ignore next */
    async function (req, res) {
      // #swagger.description = 'ENS NFT image'
      // #swagger.parameters['networkName'] = { description: 'Name of the chain to query for. (mainnet|rinkeby|ropsten|goerli...)' }
      // #swagger.parameters['contractAddress'] = { description: 'Contract address which stores the NFT indicated by the tokenId' }
      // #swagger.parameters['tokenId'] = { description: 'Namehash(v1) /Labelhash(v2) of your ENS name.\n\nMore: https://docs.ens.domains/contract-api-reference/name-processing#hashing-names' }
      const contractAddress = req.params.contractAddress as string
      const networkName = req.params.networkName as NETWORK_NAME
      const tokenId = req.params.tokenId
      try {
        const provider = getProvider(networkName)
        const result = await getDomain(
          provider,
          networkName,
          contractAddress,
          tokenId,
        );
        if (result.image_url) {
          const base64 = result.image_url.replace(
            'data:image/svg+xml;base64,',
            ''
          );
          const buffer = Buffer.from(base64, 'base64');
          res.writeHead(200, {
            'Content-Type': 'image/svg+xml',
            'Content-Length': buffer.length,
          });
          res.end(buffer);
        } else {
          throw Error('Image URL is missing.');
        }
        /* #swagger.responses[200] = { 
               description: 'Image file' 
        } */
      } catch (error) {
        if (error instanceof FetchError) {
          res.status(404).json({
            message: 'No results found.',
          });
          return;
        }
        if (error instanceof UnsupportedNetwork) {
          res.status(501).json({
            message: error.message,
          });
        }
        res.status(404).json({
          message: 'No results found.',
        });
      }
    }
  );
}
