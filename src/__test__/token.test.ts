import {Token} from '../token';
import {Account} from '../account';

let issuer = {pubkey: '', secret: ''}
let receiver = {pubkey: '', secret: ''}
const dummyToken = 'TEST';

describe('Stellar.Token', () => {
  beforeAll(async () => {
    issuer = await Account.createTestnet();
    console.log('created issuer.', issuer);
    receiver = await Account.createTestnet();
    console.log('created receiver.', receiver);
  })

  test('createted token(asset)', async () => {
    const res = Token.create(dummyToken, issuer.pubkey);
    expect(res).toEqual({
      code: expect.anything(),
      issuer: expect.anything()
    });
  });

  test('create trustline', async () => {
    const token = Token.create(dummyToken, issuer.pubkey);
    const res = await Token.trustline(receiver.secret, token)();
    expect(res.hash).toBeDefined();
  })
});

jest.setTimeout(60000);
