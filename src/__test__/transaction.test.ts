import {Transaction} from '../transaction';
import {Account} from '../account';
import {Memo} from '../memo';
import {Payment} from '../payment';

let target = {pubkey: '', secret: ''}
let sender = {pubkey: '', secret: ''}

const createPayment = async () => {
  const dummy = 'Transaction test';
  await Payment.send(
    target.pubkey,
    sender.secret,
    '777',
  )(
    {
      memo: Memo.text(dummy)
    }
  );
}

describe('Stellar.Horizon', () => {
  beforeAll(async () => {
    target = await Account.createTestnet();
    console.log('created target.', target);
    sender = await Account.createTestnet();
    console.log('created sender.', sender);
    createPayment();
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
    setTimeout(() => {
      console.log("Time's up -- start! test");
      Transaction.get(
        target.pubkey, (res: any) => {
          console.log(res);
          expect(res.operations).toBeDefined();
          expect(res.memo).toBeDefined();
          done();
        });
    }, 10000);
  });
});

jest.setTimeout(60000);

