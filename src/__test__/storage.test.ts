import {Storage} from '../storage';

import {
  Memo,
} from 'stellar-sdk';

describe('Stellar.Horizon', () => {
  test('set text data', () => {
    const res = Storage.text('0'.repeat(28));
    expect(res instanceof Memo).toBeTruthy();
  });

  test('set id data', () => {
    const res = Storage.id('9'.repeat(100));
    expect(res instanceof Memo).toBeTruthy();
  });

  test('set hash data', () => {
    const hash = 'b36f330c6db84bef6ca34057c9739b88115565cf873fdb1350e481140a4429ad';
    const res = Storage.hash(hash);
    expect(res instanceof Memo).toBeTruthy();
  });

  test('Get text from swarm stored data', async () => {
    const memoHash = 'Qs5GwukTIsifv+X23AaoRqDhK9VCSnzzsqPpae0Enns=';
    const res = await Storage.Swarm.getText(memoHash);
    console.log(res);
    expect(res).toBeDefined();
  });

  test('Get JSON from swarm stored data', async () => {
    const memoHash = 'l4ZtKHy4Q5ezJThVVrVW+veNtVbjqZ6a4BtT0TpudSc=';
    const res = await Storage.Swarm.getText(memoHash);
    console.log(res);
    expect(res).toBeDefined();
  });

});

