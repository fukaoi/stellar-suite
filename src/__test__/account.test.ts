import {Account} from '../account';
import {Token} from '../token';
import {Payment} from '../payment';
import {Memo} from '../memo';

let issuer = {pubkey: '', secret: ''}
let receiver = {pubkey: '', secret: ''}
let feeSource = {pubkey: '', secret: ''}

describe('Stellar.Account', () => {
  beforeAll(async () => {
    issuer = await Account.createTestnet();
    console.log('created issuer.', issuer);
    receiver = await Account.createTestnet();
    console.log('created receiver.', receiver);
    feeSource = await Account.createTestnet();
    console.log('created feeSource.', feeSource);
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

  test('createted account, All set params that must param and optional param', async () => {
    const createtor = await Account.createTestnet();
    const mustParams = {
      secret: createtor.secret,
      startingBalance: '100',
    }

    const optinalParams = {
      memo: Memo.text('Optional Params'),
      feeSourceSecret: feeSource.secret,
      feeMultiplication: 2,
      timeout: 30,
    }

    const res = await Account.create(
      mustParams.secret,
      mustParams.startingBalance,
    )(
      optinalParams
    );
    expect(res).toEqual({
      pubkey: expect.anything(),
      secret: expect.anything()
    });
  });

  test('createted account, set a memo param', async () => {
    const createtor = await Account.createTestnet();
    const mustParams = {
      secret: createtor.secret,
      startingBalance: '100',
    }

    const optinalParams = {
      memo: Memo.text('Optional Params'),
    }

    const res = await Account.create(
      mustParams.secret,
      mustParams.startingBalance,
    )(
      optinalParams
    );
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
    await Token.trustline(receiver.secret, token)();
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
