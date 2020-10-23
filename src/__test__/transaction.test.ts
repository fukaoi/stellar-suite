import {Transaction} from '../transaction';
import {Account} from '../account';

let target = {pubkey: '', secret: ''}

describe('Stellar.Horizon', () => {
  beforeAll(async () => {
    target = await Account.createTestnet();
    console.log('created target.', target);
  })

  test('estimated fee', async () => {
    const res = await Transaction.estimatedFee();
    console.log(`estimated fee: ${res}`);
    expect(res).toBeDefined();
  });

  test('up multiplication', async () => {
    let res = await Transaction.estimatedFee(2);
    console.log(`estimated fee: ${res}`);
    res = await Transaction.estimatedFee(3);
    console.log(`estimated fee: ${res}`);
    expect(res).toBeDefined();
  });

  test('get fee stats', async () => {
    let res = await Transaction.feeStats();
    console.log(`fee stats: ${JSON.stringify(res)}`);
    expect(res).toBeDefined();
  });

  test('set server connection timeout', async () => {
    const res = await Transaction.serverTimeout(30);
    expect(res).toEqual({
      minTime: expect.anything(),
      maxTime: expect.anything()
    })
  });

  test('stream data', () => {
    // [noop] use browser.test.html, so this code is nothing.
  });

  test('get data', done => {
    Transaction.get(
      'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG', (res: any) => {
      console.log(res);
      done();
    });
  });
});

jest.setTimeout(60000);

