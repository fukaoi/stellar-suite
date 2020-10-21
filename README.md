# stellar-suite

## Install 
 
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


/*
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
const tokenName = 'TESTTOKEN';

(async() => {
  const res = Token.create(tokenName, issuerPubkey);
  console.log(res);
})();


/*
Asset {
  code: 'TESTTOKEN',
  issuer: 'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG'
}
*/
```

