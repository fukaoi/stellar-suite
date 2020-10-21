import {
  Asset,
  Operation,
} from 'stellar-sdk';

import {Transaction} from './transaction';

export namespace Token {
  export const create = (name: string, issuerPubkey: string): Asset =>
    new Asset(name, issuerPubkey);

  export const trustline = async (
    receiverSecret: string,
    token: Asset,
    tokenIssueLimit = '10000'
  ) => {
    const operation = Operation.changeTrust(
      {
        asset: token,
        limit: tokenIssueLimit
      })
    return await Transaction.submit(receiverSecret, operation);
  }
}
