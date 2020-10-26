import {
  Horizon,
  Operation,
} from 'stellar-sdk';

import StellarBase, {
  Keypair
} from 'stellar-base';

import {Horizon as _Horizon} from './horizon';
import {Transaction, Optional} from './transaction';

export namespace Account {
  const parseBalance = (balances: Horizon.BalanceLine[], token: string) => {
    const picked = balances.find((b: Horizon.BalanceLine) => {
      if (token == 'native') {
        return ((b as Horizon.BalanceLineNative).asset_type == token);
      } else {
        return ((b as Horizon.BalanceLineAsset).asset_code == token);
      }
    })
    return (picked as Horizon.BalanceLine).balance;
  }

  export const createKeyPair = (): {pubkey: string, secret: string} => {
    const keypair = Keypair.random();
    return {pubkey: keypair.publicKey(), secret: keypair.secret()};
  }

  export const getBalance = async (pubkey: string, token = 'native'): Promise<{raw: string, float: string}> => {
    const account = await _Horizon.connect().loadAccount(pubkey);
    const rawBalance = parseBalance(account.balances, token);
    const floatBalance = Number.parseFloat(rawBalance).toString();
    return {raw: rawBalance, float: floatBalance};
  }

  export const createTestnet = async (): Promise<{pubkey: string, secret: string}> => {
    const keypair = createKeyPair();
    await _Horizon.connect().friendbot(keypair.pubkey).call()
    return keypair;
  }

  export const keypairAccount = async (secret: string):
    Promise<{keypair: Keypair, account: StellarBase.Account}> => {
    const keypair = Keypair.fromSecret(secret);
    const c = _Horizon.connect();
    const account = await c.loadAccount(keypair.publicKey());
    return {
      keypair: Keypair.fromSecret(secret),
      account: account,
    }
  }

  export const create = (
    creatorSecret: string,
    startingBalance = '1.0',
  ) => async (
    optional: Optional = {}
  ): Promise<{pubkey: string, secret: string}> => {
      const keypair = createKeyPair();
      const operation = Operation.createAccount({
        destination: keypair.pubkey,
        startingBalance: startingBalance,
      })
      await Transaction.submit(
        creatorSecret,
        operation,
        optional.memo,
        optional.feeSourceSecret,
        optional.feeMultiplication,
        optional.timeout
      );
      return keypair;
    }
}
