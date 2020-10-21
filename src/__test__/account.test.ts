import {Account} from '../account';
import {Token} from '../token';
import {Payment} from '../payment';

let issuer = {pubkey: '', secret: ''}
let receiver = {pubkey: '', secret: ''}

describe('Stellar.Account', () => {
  beforeAll(async () => {
    issuer = await Account.createTestnet();
    console.log('created issuer.', issuer);
    receiver = await Account.createTestnet();
    console.log('created receiver.', receiver);
  })


  test('createted account and activated', async () => {
    const creator = await Account.createTestnet();
    const res = await Account.create(creator.secret)();
    expect(res).toEqual({
      pubkey: expect.anything(),
      secret: expect.anything()
    });
  });

  test('createted account and activated with startingBalance', async () => {
    const createtor = await Account.createTestnet();
    const res = await Account.create(createtor.secret, '10.5')();
    expect(res).toEqual({
      pubkey: expect.anything(),
      secret: expect.anything()
    });
  });

  test('Get balance xlm', async () => {
    const creator = await Account.createTestnet();
    const account = await Account.create(creator.secret)();
    const res = await Account.getBalance(account.pubkey);
    expect(res.raw).toEqual('1.0000000');
    expect(res.float).toEqual('1');
  });

  test('Get balance dummy token', async () => {
    const dummyToken = 'SPEC';
    const token = Token.create(dummyToken, issuer.pubkey);
    await Token.trustline(receiver.secret, token);
    await Payment.send(
      receiver.pubkey,
      issuer.secret,
      '777',
      token,
    )();
    const res = await Account.getBalance(receiver.pubkey, dummyToken);
    expect(res.raw).toEqual('777.0000000');
    expect(res.float).toEqual('777');
  });
});

jest.setTimeout(60000);
