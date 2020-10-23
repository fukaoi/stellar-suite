import {
  Memo as _Memo, 
  MemoType as _MemoType
} from 'stellar-sdk';

import {Swarm as _Swarm} from './swarm';


export namespace Memo {
  export const none = (): _Memo<_MemoType.None> => Memo.none();

  export const text = (text: string): _Memo<_MemoType.Text> =>
    _Memo.text(text);

  export const id = (num: string): _Memo<_MemoType.ID> =>
    _Memo.id(num);

  export const hash = (str: string): _Memo<_MemoType.Hash> =>
    _Memo.hash(str);

  export namespace Swarm {
    export const setText = async (text: string): Promise<_Memo> => {
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

export type MemoType =
  _Memo<
    _MemoType.ID |
    _MemoType.Hash |
    _MemoType.None |
    _MemoType.Text |
    _MemoType.Return
  >;
