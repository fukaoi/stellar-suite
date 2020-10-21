import {
  Memo, MemoType,
} from 'stellar-sdk';

import {Swarm as _Swarm} from './swarm';


export namespace Storage {
  export const none = (): Memo<MemoType.None> => Memo.none();

  export const text = (text: string): Memo<MemoType.Text> =>
    Memo.text(text);

  export const id = (num: string): Memo<MemoType.ID> =>
    Memo.id(num);

  export const hash = (str: string): Memo<MemoType.Hash> =>
    Memo.hash(str);

  export namespace Swarm {
    export const setText = async (text: string): Promise<Memo> => {
      _Swarm.connect();
      const hashId = await _Swarm.set(text);
      return hash(hashId);
    }

    export const getText = async (encodedMemoHash: string): Promise<string> => {
      const decode = Buffer.from(encodedMemoHash, 'base64').toString('hex');
      _Swarm.connect();
      return await _Swarm.get(decode);
    }
  }
}

export type StorageType =
  Memo<
    MemoType.ID |
    MemoType.Hash |
    MemoType.None |
    MemoType.Text |
    MemoType.Return
  >;
