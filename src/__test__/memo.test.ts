import {Memo} from '../memo';

import {
  Memo as _Memo,
} from 'stellar-sdk';

describe('Stellar.Horizon', () => {
  test('set text data', () => {
    const res = Memo.text('A'.repeat(28));
    expect(res instanceof _Memo).toBeTruthy();
  });

  test('set id data', () => {
    const res = Memo.id('0'.repeat(100));
    expect(res instanceof _Memo).toBeTruthy();
  });

  test('set hash data', () => {
    const hash = 'b36f330c6db84bef6ca34057c9739b88115565cf873fdb1350e481140a4429ad';
    const res = Memo.hash(hash);
    expect(res instanceof _Memo).toBeTruthy();
  });

  test('set refund data', () => {
    const hash = 'b36f330c6db84bef6ca34057c9739b88115565cf873fdb1350e481140a4429ad';
    const res = Memo.refund(hash);
    expect(res instanceof _Memo).toBeTruthy();
  });

  test('Set large data text to swarm ', async () => {
    const data = 'C'.repeat(9999999);
    const res = await Memo.Swarm.setText(data);
    console.log(res);
    expect(res).toBeDefined();
  });

  test('Get text from swarm stored data', async () => {
    const memoHash = 'Qs5GwukTIsifv+X23AaoRqDhK9VCSnzzsqPpae0Enns=';
    const res = await Memo.Swarm.getText(memoHash);
    console.log(res);
    expect(res).toBeDefined();
  });

  test('Get JSON from swarm stored data', async () => {
    const memoHash = 'l4ZtKHy4Q5ezJThVVrVW+veNtVbjqZ6a4BtT0TpudSc=';
    const res = await Memo.Swarm.getText(memoHash);
    console.log(res);
    expect(res).toBeDefined();
  });
});

jest.setTimeout(60000);

