import {
  Asset,
  Horizon,
  Operation,
} from 'stellar-sdk';

import {Account} from './account';
import {Transaction, Optional} from './transaction';

export namespace Token {
  export const create = (name: string, issuerPubkey: string): Asset =>
    new Asset(name, issuerPubkey);

  export const isTrustline = (targetPubkey: string, tokenName: string): boolean => {
    const balance = Account.getBalance(targetPubkey);
    return true;
  }

  export const trustline = (
    receiverSecret: string,
    token: Asset,
    tokenIssueLimit = '10000'
  ) => async (
    optional: Optional = {}
  ): Promise<Horizon.SubmitTransactionResponse> => {
      const operation = Operation.changeTrust(
        {
          asset: token,
          limit: tokenIssueLimit
        })
      return await Transaction.submit(
        receiverSecret,
        operation,
        optional.memo,
        optional.feeSourceSecret,
        optional.feeMultiplication,
        optional.timeout,
      );
    }
}
