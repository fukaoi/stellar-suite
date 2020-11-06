/*
 * This example is only testnet of Stellar network;
 * if want you to use mainnet of Stellar, 
 * will converte Account.createTestnet() => Account.crate() 
 *
 * Usage
 * `
 *  node examples/feeBump.js or 
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

(async () => {
  try {
    // create account
    const issuer = await Account.createTestnet();
    console.log('created issuer.', issuer);
    const receiver = await Account.createTestnet();
    console.log('created receiver.', receiver);
    const feeSource = await Account.createTestnet();
    console.log('created feeSource.', feeSource);

    // create token and trustline
    const token = Token.create('TEST', issuer.pubkey);

    // once call
    await Token.trustline(
      receiver.secret,
      token
    )({
      feeSourceSecret: feeSource.secret
    });


    // add memo
    const data = `
        For many visitors to North Korea, the sense of travelling back in time is nowhere more acute than when they first step into their hotel. The unique 1970s architecture and design of Pyongyang hotels have now been documented in a new book that presents a rare glimpse of North Korean culture, writes Julie Yoonnyung Lee of BBC Korean.

Tourist trips to North Korea are usually carefully choreographed by officials.

The country's tourism industry is controlled by the state, and travellers are monitored by government minders. They are only allowed access to "approved" sites, which means they all follow the same itinerary.

But last spring, author James Scullin and photographer Nicole Reed from Australia spent five nights in the capital Pyongyang, visiting 11 international hotels. They have now published a book called Hotels of Pyongyang.

Mr Scullin, who is a tour guide, has been to Pyongyang a total of eight times and told the BBC that hotels tend to be more neutral spaces, where visitors are not regulated in the same way.

Their architecture and interior design offer up interesting insights into a country which is largely closed off from the world, but still entertains tourists. 
        (${Date.now()})`;

    const memo = await Memo.Swarm.setText(data);

    // send TEST token. issuer => receiver
    await Payment.send(
      receiver.pubkey,
      issuer.secret,
      '100',
      token
    )({
      memo: memo,
      feeSourceSecret: feeSource.secret
    });

    // get transaction datas from a account
    Transaction.get(receiver.pubkey, async (tx) => {
      // get memo text 
      tx.memo.type === 'hash' &&
        console.log(await Memo.Swarm.getText(tx.memo.value));
    });
  } catch (e) {
    console.error(e);
  }
})();


