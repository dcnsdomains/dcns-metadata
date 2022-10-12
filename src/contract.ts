import { BaseError, Version } from './base';

export interface ContractMismatchError {}
export class ContractMismatchError extends BaseError {}

export interface OwnerNotFoundError {}
export class OwnerNotFoundError extends BaseError {}

export async function checkContract(
  provider: any,
  contractAddress: string,
  tokenId: string
): Promise<Version> {
  return Version.v1;
}
