/*
 * this code is integration test of production mode
 * before exec, need to create prd-accounts.json file
 *
 * `
 *  // usage
 *  NODE_ENV=production node examples/feeBump.js
 * `
 */

const {
  Account,
  Token,
  Memo,
  Payment,
  Transaction,
} = require('../dist/');

const {
  issuer,
  receiver,
  feeSource
} = require('./prd-accounts.json');

const createAccount = async () => {
  return await Account.create(
    feeSource.secret,
    '1.5'
  )({
    feeSourceSecret: feeSource.secret
  });
}

(async () => {
  try {
    // create account
    if (!issuer || !receiver) {
      issuer = await createAccount();
      console.log('created issuer.', issuer);
      receiver = await createAccount();
      console.log('created receiver.', receiver);
    }

    // create token and trustline
    const token = Token.create('TEST', issuer.pubkey);

    // once ok!
    await Token.trustline(
      receiver.secret, 
      token
    )({
      feeSourceSecret: feeSource.secret
    });


    // add memo
    const data = `
　        菅義偉首相は28日午後の衆院本会議の代表質問で、日本学術会議の会員任命拒否問題
          を巡り、推薦に基づいて首相が任命すると定めた日本学術会議法の規定には違反しな
          いとの認識を示した。「必ずしも推薦通りに任命しなければならないわけではない、
          という点は政府の一貫した考え方だ」と述べた。任命拒否の理由に関し「民間出身者
          や若手が少なく、出身や大学にも偏りが見られることも踏まえて判断した」と説明し
          た。菅内閣発足後の本格論戦がスタートした。
　        自身が掲げた2050年までの脱炭素社会実現に向けて「再生可能エネルギーのみならず
          、原子力を含めたあらゆる選択肢を追求する」と語った。(${Date.now()})`;

    const memo = await Memo.Swarm.setText(data);

    // send TEST token. issuer => receiver
    const res = await Payment.send(
      receiver.pubkey,
      issuer.secret,
      '100',
      token
    )({
      memo: memo,
      feeSourceSecret: feeSource.secret
    });
    console.log(res);

    // get transaction datas from a account
    Transaction.get(receiver.pubkey, (txs) => {
      txs.records.forEach(async (tx) => {
        // get memo text 
        tx.memo_type === 'hash' &&
          console.log(await Memo.Swarm.getText(tx.memo));
      });
    });
  } catch (e) {
    console.error(e.response.data);
  }
})();


