import Stellar,{
  Account,
  Token,
  Payment,
  Multisig,
  Memo,
} from '../index';

describe('stellar suite', () => {
  test('call modules', () => {
    expect(Stellar.Account).toBeDefined();
    expect(Stellar.Payment).toBeDefined();
    expect(Stellar.Memo).toBeDefined();
    expect(Stellar.Token).toBeDefined();
    expect(Stellar.Multisig).toBeDefined();
    expect(Account).toBeDefined();
    expect(Payment).toBeDefined();
    expect(Memo).toBeDefined();
    expect(Token).toBeDefined();
    expect(Multisig).toBeDefined();
  });
});

