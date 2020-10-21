import {Multisig} from '../multisig';
import {Account} from '../account';

let target = {pubkey: '', secret: ''}
let target2 = {pubkey: '', secret: ''}
let siger = {pubkey: '', secret: ''}
let siger2 = {pubkey: '', secret: ''}

describe('Stellar.Multisig', () => {
  beforeEach(async () => {
    target = await Account.createTestnet();
    console.log('created target.', target);
    target2 = await Account.createTestnet();
    console.log('created target2.', target2);
    siger = await Account.createTestnet();
    console.log('created siger.', siger);
    siger2 = await Account.createTestnet();
    console.log('created siger2.', siger2);
  })

  test('set', async () => {
    const res = await Multisig.set(
      target.secret,
      [
        {
          pubkey: siger.pubkey,
          weight: 1
        }],
      {
        masterWeight: 1,
        lowThreshold: 1,
        medThreshold: 1,
        highThreshold: 0
      }
    )();
    console.log(res.hash);
    expect(res.hash).toBeDefined();
  });

  test('set multiple signer', async () => {
    const res = await Multisig.set(
      target2.secret,
      [
        {
          pubkey: siger.pubkey,
          weight: 1
        },
        {
          pubkey: siger2.pubkey,
          weight: 1
        },
      ],
      {
        masterWeight: 1,
        lowThreshold: 1,
        medThreshold: 2,
        highThreshold: 3
      }
    )();
    console.log(res.hash);
    expect(res.hash).toBeDefined();
  });
});

jest.setTimeout(60000);
