import {Transaction} from '../transaction';
import {Account} from '../account';
import {Memo} from '../memo';
import {Payment} from '../payment';
import {Token} from '../token';

let target = {pubkey: '', secret: ''}
let sender = {pubkey: '', secret: ''}
let feeSource = {pubkey: '', secret: ''}

const paymentDummy = async () => {
  const memo = {
    type: 'SKE48',
    title: '中野愛理',
    cagegories: ['ske48', 'live', '卒業セレモニー']
  };
  const token = Token.create('FEEBUMP', sender.pubkey);
  await Token.trustline(target.secret, token)({
    feeSourceSecret: sender.secret,
  });
  await Payment.send(
    target.pubkey,
    sender.secret,
    '111',
    token,
  )({
    feeSourceSecret: feeSource.secret,
    memo: await Memo.Swarm.setText(JSON.stringify(memo))
  });
  console.log('OK payment fee bump');
}

describe('Stellar.Horizon', () => {
  beforeAll(async () => {
    target = await Account.createTestnet();
    console.log('created target.', target);
    sender = await Account.createTestnet();
    console.log('created sender.', sender);
    feeSource = await Account.createTestnet();
    console.log('created feeSource.', feeSource);
    paymentDummy();
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
        target.pubkey, async (res: any) => {
          console.log(res);
          expect(res.operations).toBeDefined();
          expect(res.memo).toBeDefined();
          res.memo.type === 'hash' &&
            expect(await Memo.Swarm.getText(res.memo.value));
          done();
        });
    }, 10000);
  }, );
});

jest.setTimeout(120000);

