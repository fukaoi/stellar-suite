import {
  Horizon,
  Operation,
} from 'stellar-sdk';

import {Transaction, Optional} from './transaction';

interface Signer {
  pubkey: string,
  weight: number
}

export namespace Multisig {
  const createSigners = (signers: Signer[]) => {
    return signers.map((signer) => {
      return Operation.setOptions({
        signer: {
          ed25519PublicKey: signer.pubkey,
          weight: signer.weight,
        }
      });
    })
  }

  export const set = (
    targetSecret: string,
    signers: Signer[],
    targetThreshold: {
      masterWeight: number,
      lowThreshold: number,
      medThreshold: number,
      highThreshold: number,
    },
  ) => async (
    optional: Optional = {}
  ): Promise<Horizon.SubmitTransactionResponse> => {
      const operations = createSigners(signers);
      operations.push(Operation.setOptions(targetThreshold));
      return await Transaction.submit(
        targetSecret,
        operations,
        optional.memo,
        optional.feeSourceSecret,
        optional.feeMultiplication,
        optional.timeout,
      );
    }
}
