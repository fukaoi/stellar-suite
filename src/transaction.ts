import {
  Horizon,
  Server,
  Operation,
} from 'stellar-sdk';

import {
  Keypair,
  Transaction as _Transaction,
  TransactionBuilder,
  FeeBumpTransaction,
  xdr,
} from 'stellar-base';

import {Horizon as _Horizon} from './horizon';
import {Account} from './account';
import {Memo, MemoType} from './memo';

interface Callback {
  (res: any): void
}

export interface Optional {
  memo?: MemoType,
  feeSourceSecret?: string,
  feeMultiplication?: number,
  timeout?: number
}

export namespace Transaction {
  let retryCount: number = 1;

  const createFeeBumpTransaction = async (
    feeSourceSecret: string,
    fee: string,
    innerTx: _Transaction,
  ) => {
    const feeSourceKeypair = Keypair.fromSecret(feeSourceSecret);
    const tx = TransactionBuilder.buildFeeBumpTransaction(
      feeSourceKeypair,
      fee,
      innerTx,
      _Horizon.network(),
    );
    tx.sign(feeSourceKeypair);
    return tx;
  }

  export const estimatedFee = async (multiplication = 1): Promise<string> =>
    String(await _Horizon.connect().fetchBaseFee() * multiplication);

  export const feeStats = async (): Promise<Horizon.FeeStatsResponse> =>
    await _Horizon.connect().feeStats();

  export const serverTimeout = async (sec: number): Promise<Server.Timebounds> =>
    await _Horizon.connect().fetchTimebounds(sec);

  export enum Cursor {
    FromPast = '0',
    Now = 'now',
  }

  export enum Order {
    Asc = 'asc',
    Desc = 'desc',
  }

  const parsedMemo = (memoObj: any) => {
    let str = '';
    if (memoObj.type === 'text') {
      str = memoObj.value?.toString('UTF-8');
    } else {
      str = memoObj.value;
    }
    return str;
  }

  const txHandler = (tx: any) => {
    let obj: _Transaction | FeeBumpTransaction;
    if (tx.fee_bump_transaction) {
      const objFeeBump = new FeeBumpTransaction(
        tx.envelope_xdr,
        _Horizon.network()
      );
      obj = objFeeBump.innerTransaction;
    } else {
      obj = new _Transaction(
        tx.envelope_xdr,
        _Horizon.network()
      );
    }

    return {
      source: obj.source,
      fee: obj.fee,
      hash: tx.hash,
      createdAt: tx.created_at,
      operations: obj.operations,
      memo: {
        type: obj.memo.type,
        value: parsedMemo(obj.memo)
      },
      network: obj.networkPassphrase,
      successful: tx.successful,
      feeSource: tx.fee_account
    };
  };

  export const stream = (
    targetPubkey: string,
    callback: Callback
  ) => (
    cursor?: Cursor,
    order?: Order,
    limit?: number,
    ) => {
      if (!cursor) cursor = Cursor.FromPast;
      if (!order) order = Order.Asc;
      if (!limit) limit = 50;
      _Horizon.connect().transactions().forAccount(targetPubkey)
        .cursor(cursor)
        .order(order)
        .limit(limit)
        .stream({
          onmessage: (res: any) =>
            callback(txHandler(res))
        }
        )
    }

  export const get = (
    targetPubkey: string,
    callback: Callback
  ) => {
    _Horizon.connect().transactions().forAccount(targetPubkey)
      .call()
      .then((txes: any) => {
        txes.records.map(
          (tx: any) => callback(txHandler(tx))
        );
      }
      )
  }

  export const submit = async (
    senderSecret: string,
    operation: xdr.Operation | xdr.Operation[],
    memo: MemoType = Memo.none(),
    feeSourceSecret = '',
    feeMultiplication = 1,
    timeout = 3,
  ): Promise<Horizon.SubmitTransactionResponse> => {
    try {
      const keypairs = await Account.keypairAccount(senderSecret);
      const fixedFee = await estimatedFee(feeMultiplication);

      const builderOption = {
        fee: fixedFee,
        networkPassphrase: _Horizon.network()
      }

      const time = await serverTimeout(timeout);

      let operations: TransactionBuilder;
      if (Array.isArray(operation)) {
        operations = new TransactionBuilder(keypairs.account, builderOption);
        operation.map((opt) => {
          operations.addOperation(opt)
        })
      } else {
        operations = new TransactionBuilder(keypairs.account, builderOption)
          .addOperation(operation)
      }

      feeSourceSecret !== '' &&
        operations.addOperation(Operation.bumpSequence({bumpTo: '0'}))

      let transaction = operations
        .addMemo(memo)
        .setTimeout(time.maxTime)
        .build()

      transaction.sign(keypairs.keypair)

      if (feeSourceSecret !== '') {
        const bump = await createFeeBumpTransaction(
          feeSourceSecret,
          fixedFee,
          transaction
        );
        return await _Horizon.connect().submitTransaction(bump)
      } else {
        return await _Horizon.connect().submitTransaction(transaction)
      }
    } catch (e) {
      if (e.response) {
        switch (e.response.status) {
          case 504:
            console.count(`[504 Error] Retry. ${retryCount}`);
            retryCount = retryCount++;
            submit(
              senderSecret,
              operation,
              memo,
              feeSourceSecret,
              retryCount
            );
            break;
          default:
            throw new Error(JSON.stringify(e.response));
        }
      }
      throw e;
    }
  }
}
