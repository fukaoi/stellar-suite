import {
  Asset,
  Horizon,
  Operation,
} from 'stellar-sdk';

import {Transaction} from './transaction';
import {StorageType} from './storage';

export namespace Payment {
  export const send = (
    destPubkey: string,
    senderSecret: string,
    amount: string,
    token = Asset.native(),
  ) => async (
    memo?: StorageType,
    feeSourceSecret?: string,
    feeMultiplication?: number,
    timeout?: number
  ): Promise<Horizon.SubmitTransactionResponse> => {
      const operation = Operation.payment({
        destination: destPubkey,
        asset: token,
        amount: amount,
      });
      return await Transaction.submit(
        senderSecret,
        operation,
        memo,
        feeSourceSecret,
        feeMultiplication,
        timeout,
      );
    }
}