import {
  Asset,
  Horizon,
  Operation,
} from 'stellar-sdk';

import {Transaction, Optional} from './transaction';

export namespace Payment {
  export const send = (
    destPubkey: string,
    senderSecret: string,
    amount: string,
    token = Asset.native(),
  ) => async (
    optional: Optional = {}
  ): Promise<Horizon.SubmitTransactionResponse> => {
      const operation = Operation.payment({
        destination: destPubkey,
        asset: token,
        amount: amount,
      });
      return await Transaction.submit(
        senderSecret,
        operation,
        optional.memo,
        optional.feeSourceSecret,
        optional.feeMultiplication,
        optional.timeout,
      );
    }
}
