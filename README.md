# stellar-suite

## How to install 
 
```shell
npm install stellar-suite 

or

npm install https://github.com/ayanasu/stellar-suite

```

## The difference development(test) test and production enviroment

### development

* Node.js setting
  ```js
  NODE_ENV=development app.js
  ```

* Build command for Built in HTML JS
  ```shell
  npm run build
  ```
* js file for Built in HTML JS
  ```shell
  dist/browser/stellar-suite-dev.js
  ```

* Stellar Network is **Testnet**
* Etereum Swarm is **Mainnet** (Because swarm is only mainnet)


### production

* Node.js setting

  ```js
  NODE_ENV=production app.js
  ```

* Build command for Built in HTML JS
  ```shell
  npm run build.prd
  ```
* js file for Built in HTML JS
  ```shell
  dist/browser/stellar-suite.js
  ```

* Stellar Network is **Mainnet**
* Etereum Swarm is **Mainnet** (Because swarm is only mainnet)

### 


## Usage

See `src/__test__/*.test.ts` for more information.

#### Node.js, ES6, Built in HTML

* Node.js

```js
const {
  Account,
  Token,
  Payment,
  Multisig,
  Storage,
} = require('stellar-suite');

```

* ES6

```js
import Stellar,{
  Account,
  Token,
  Payment,
  Multisig,
  Storage,
} from 'stellar-suite';
```

* Built in HTML(notice: development is stellar-suite-dev.js)

```html
<html>

<head>
  <script type="text/javascript" src="../../dist/browser/stellar-suite.js">
  </script>
</head>

<body>
  <script>
    (async () => {
      // Get transaction by stream data
      const pubkey = 'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG';
      const fn = StellarSuite.Transaction.stream(pubkey, console.log)();
    })();
  </script>
</body>

</html>
```

## Modules description

### Account

* Create account(notice: development is createTestnet function)

#### development

```js
const {Account} = require('stellar-suite');

(async() => {
  const res = await Account.createTestnet();
  console.log(res);
})();


/* response
{
  pubkey: 'GDCVRRVJVSM7GRKTENFQUGNZA6KPRHP7Q6KXA2P7CCACKA5XMYU4PW2F',
  secret: 'SCBIJIGN2RLFTZQ52PRA3GRG2GHJVDTWTWIRNA7FG5BMGJSCZ546L2KQ'
}
*/
```

#### production

```js
const {Account} = require('stellar-suite');

const creatorSec = 'SD4WH2AE5EBE72K4BIX5GLFVASV45HKRIA5MXVDJ7MNPMMXCGIJZX5SN';

(async() => {
 const res = await Account.create(creatorSec)();
  console.log(res);
})();


/* response
{
  pubkey: 'GDCVRRVJVSM7GRKTENFQUGNZA6KPRHP7Q6KXA2P7CCACKA5XMYU4PW2F',
  secret: 'SCBIJIGN2RLFTZQ52PRA3GRG2GHJVDTWTWIRNA7FG5BMGJSCZ546L2KQ'
}
*/
```
* Get balance(xlm, token) from target address. response is two types.

```js

const {Account} = require('stellar-suite');

const pubkey = 'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG';

(async() => {
  const res = await Account.getBalance(pubkey);
  console.log(res);
})();


/* response
{
  raw: '9999.9980200', 
  float: '9999.99802' 
}
*/
```

### Token

* create stellar token(official name `asset`)

```js
const {Token} = require('stellar-suite');

const issuerPubkey = 'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG';
const tokenName = 'TESTTOKEN';

(async() => {
  const res = Token.create(tokenName, issuerPubkey);
  console.log(res);
})();


/* response
Asset {
  code: 'TESTTOKEN',
  issuer: 'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG'
}
*/
```

* trustline need to receive token by receiver

```js
const {Token} = require('stellar-suite');

const issuerPubkey = 'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG';
const receiverSecret = 'SAMTOLCOEJYAD5JUKP2XUVMGJ3QZ77E26T64PMGXDXLAYX5AQN7CFGTR';
const tokenName = 'TESTTOKEN';

(async() => {
  const token = Token.create(tokenName, issuerPubkey);
  const res = await Token.trustline(receiverSecret, token);
  console.log(res.hash);
})();

/* response

c176fc1c71dd93c95fd49aef841410ed6eec3dc8937ea13202eb2241a919871c

*/
```

### Payment

* send 1 XLM to receiver address

```js
const {Payment} = require('stellar-suite');

const senderSecret = 'SCP5L3JUL4YP62BCUAXY3YXOIRLP3VYRXETANE53QSHKB6D2AMTY52K2';
const receiverPubkey = 'GBFXT3XP46G4PNMYM67IN5TC76ZVGBZVV2YTRP23D2IMBXAL2HAWGRO6';

(async () => {
  const amount = '1';
  const res = await Payment.send(
    receiverPubkey,
    senderSecret,
    amount,
  )();
  console.log(res.hash);
})();


/* response

b3da4cfb11cc918637f2fb4fc05ffda97b6b3cb13e1d44ca5531926d84d77e7e

*/
```

* send 1 token(asset) to receiver address

```js

const {
  Token,
  Payment
} = require('stellar-suite');

const issuer = {
  pubkey: 'GBKRTWUPAIABKFIK3FWZYOR2TXM5SHD4NUV225AAOFCV2HTWVEBUDUAC',
  secret: 'SCP5L3JUL4YP62BCUAXY3YXOIRLP3VYRXETANE53QSHKB6D2AMTY52K2'
};

const receiver = {
  pubkey: 'GA62CTAT6MCN5BPULVHCF5R44HO4V6M2JPXLGL55DRXNWS2TWVICOOC4',
  secret: 'SCQSPQESX2TFHOWJV4AF4FBFZVOC4X5JFR6VOJZ2L4K6YSW3XRVLTUAU'
};

(async () => {
  const token = Token.create('TEST', issuer.pubkey);
  await Token.trustline(receiver.secret, token);
  const amount = '1';
  const res = await Payment.send(
    receiver.pubkey,
    issuer.secret,
    amount,
    token,
  )();
  console.log(res.hash);
})();


/* response

c37ee2b833350e4535085061934f797f3c5497a6156618c6f29ea68789fa7f1f

*/
```

### Multisig

* Set multiple signers in a target address

```js

const {
  Multisig
} = require('stellar-suite');


const signer = {
  pubkey: 'GBKRTWUPAIABKFIK3FWZYOR2TXM5SHD4NUV225AAOFCV2HTWVEBUDUAC',
  secret: 'SCP5L3JUL4YP62BCUAXY3YXOIRLP3VYRXETANE53QSHKB6D2AMTY52K2'
};

const signer2 = {
  pubkey: 'GB4UYUVCYSAD73QHSPOK3HP3TFIJFE4VWCBMRFQSQDFXGAA4ZXPQYH4F',
  secret: 'SA67M7KTRTPMGWPHX34W3PA5LWTYJXNGFZUYPJS7MV5WZR5V5EAGURST'
};

const target = {
  pubkey: 'GA62CTAT6MCN5BPULVHCF5R44HO4V6M2JPXLGL55DRXNWS2TWVICOOC4',
  secret: 'SCQSPQESX2TFHOWJV4AF4FBFZVOC4X5JFR6VOJZ2L4K6YSW3XRVLTUAU'
};

(async () => {
  const res = await Multisig.set(
    target.secret,
    [
      {
        pubkey: signer.pubkey,
        weight: 1
      },
      {
        pubkey: signer2.pubkey,
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
})();


/* resposne

cacb5986cfdab2b2d7beb3b279da7bdfc0ac43c174356868b49d8f92c211d45c

*/
```

