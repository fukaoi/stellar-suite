import {Payment} from '../payment';
import {Token} from '../token';
import {Memo} from '../memo';
import {Account} from '../account';

let issuer = {pubkey: '', secret: ''}
let receiver = {pubkey: '', secret: ''}
let sender = {pubkey: '', secret: ''}
let feeSource = {pubkey: '', secret: ''}
const dummyToken = 'TEST';

describe('Stellar.Payment', () => {
  beforeAll(async () => {
    issuer = await Account.createTestnet();
    console.log('created issuer.', issuer);
    receiver = await Account.createTestnet();
    console.log('created receiver.', receiver);
    sender = await Account.createTestnet();
    console.log('created sender.', sender);
    feeSource = await Account.createTestnet();
    console.log('created feeSource.', feeSource);
  })

  test('token(asset) send', async () => {
    const token = Token.create(dummyToken, issuer.pubkey);
    await Token.trustline(receiver.secret, token)();
    const amount = '1';
    const res = await Payment.send(
      receiver.pubkey,
      issuer.secret,
      amount,
      token,
    )();
    expect(res.hash).toBeDefined();
  })

  test('XLM send', async () => {
    const amount = '1';
    const res = await Payment.send(
      receiver.pubkey,
      sender.secret,
      amount,
    )();
    expect(res.hash).toBeDefined();
  })

  test('XLM send and text memo is stored swarm storage', async () => {
    const amount = '1';
    const res = await Payment.send(
      receiver.pubkey,
      sender.secret,
      amount,
    )(
      {
        memo: Memo.text('test')
      }
    );
    console.log(res.hash);
    expect(res.hash).toBeDefined();
  })

  test('XLM send and JSON memo is stored swarm storage', async () => {
    const dummy = {
      type: 'SKE48',
      title: '中野愛理',
      cagegories: ['ske48', 'live', '卒業セレモニー']
    };

    const amount = '1';
    const res = await Payment.send(
      receiver.pubkey,
      sender.secret,
      amount,
    )(
      {
        memo: await Memo.Swarm.setText(JSON.stringify(dummy))
      }
    );
    console.log(res.hash);
    expect(res.hash).toBeDefined();
  })

  test('XLM send with Fee bump', async () => {
    const amount = '1';
    const res = await Payment.send(
      receiver.pubkey,
      sender.secret,
      amount,
    )(
      {
        feeSourceSecret: feeSource.secret
      }
    );
    console.log(res.hash);
    expect(res.hash).toBeDefined();
  })
});

jest.setTimeout(60000);
