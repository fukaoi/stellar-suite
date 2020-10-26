import {Multisig} from '../multisig';
import {Account} from '../account';
import {Memo} from '../memo';

let target = {pubkey: '', secret: ''}
let target2 = {pubkey: '', secret: ''}
let signer = {pubkey: '', secret: ''}
let siger2 = {pubkey: '', secret: ''}

describe('Stellar.Multisig', () => {
  beforeEach(async () => {
    target = await Account.createTestnet();
    console.log('created target.', target);
    target2 = await Account.createTestnet();
    console.log('created target2.', target2);
    signer = await Account.createTestnet();
    console.log('created siger.', signer);
    siger2 = await Account.createTestnet();
    console.log('created siger2.', siger2);
  })

  test('set', async () => {
    const res = await Multisig.set(
      target.secret,
      [
        {
          pubkey: signer.pubkey,
          weight: 1
        }],
      {
        masterWeight: 1,
        lowThreshold: 1,
        medThreshold: 1,
        highThreshold: 0
      }
    )(
      {
        memo: Memo.text('only a signer')
      }
    );
    console.log(res.hash);
    expect(res.hash).toBeDefined();
  });

  test('set multiple signer', async () => {
    const res = await Multisig.set(
      target2.secret,
      [
        {
          pubkey: signer.pubkey,
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
    )(
      {
        memo: Memo.text('multiple signer')
      }

    );
    console.log(res.hash);
    expect(res.hash).toBeDefined();
  });
});

jest.setTimeout(60000);

