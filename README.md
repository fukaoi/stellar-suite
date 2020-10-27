# stellar-suite

## How to install 
 
```shell
npm install stellar-suite 
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

* Account.create() usage

```js

Account.create('must params')('optional params')

```

|**optional param**    |**description** |
|----------|--------------------------|
|memo(Memo)|MemoType Object|
|feeSource| for delegate account  when want use `feeBump` function|
|feeMultiplication| default=100. 100 * feeMultiplication|
|timeout|set transaction timeout|


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

* All set params that must param and optional param

```js

const {
  Account,
  Memo
} = require('stellar-suite');

const createtor = {
  pubkey: 'GBFCIBLNLSSIM4L662UTIVSMF2CDGM3U7VRMM7D6ECZAKQRSPDRIYKZW',
  secret: 'SDSIMAPJJC3K4EODTIZGQEKLKSIR2YE2R73V77X6LWVDRLJ5W73EFKW2'
};

const feeSource ={
  pubkey: 'GAOLT2JOFLPGVMHI56F6D6UIFJROTZ3O47APWBR3JNOYKXFCZ5TL2QDG',
  secret: 'SCNFMAJ236JZSPFFTKTZCEDWXCKWB62A36PWSYKG7DZCQJJZ3OBOOYD6'
};

(async () => {
  const mustParams = {
    secret: createtor.secret,
    startingBalance: '100',
  }

  const optinalParams = {
    memo: Memo.text('Optional Params'),
    feeSource: feeSource.secret,
    feeMultiplication: 2,
    timeout: 30,
  }

  const res = await Account.create(
    mustParams.secret,
    mustParams.startingBalance,
  )(
    optinalParams,
  );
  console.log(res);
})();

/* response

{
  pubkey: 'GB4RN5TOY25BLJTFRU72WG6W65MGEDA6L3VYO5VCRD2B7ZZK76Y7BHQB',
  secret: 'SDMN5XZ55XO4ODOS37HKCKTMYA57OXT3YF777TATNCP5RCQ4JYOSCKW5'
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

const res = Token.create(tokenName, issuerPubkey);
console.log(res);


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

* Payment.send() usage

```js

Payment.send('must params')('optional params')

```

|**optional param**    |**description** |
|----------|--------------------------|
|memo(Memo)|MemoType Object|
|feeSource| for delegate account  when want use `feeBump` function|
|feeMultiplication| default=100. 100 * feeMultiplication|
|timeout|set transaction timeout|


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

* Multisig.set() usage

```js

Multisig.set('must params')('optional params')

```

|**optional param**    |**description** |
|----------|--------------------------|
|memo(Memo)|MemoType Object|
|feeSource| for delegate account  when want use `feeBump` function|
|feeMultiplication| default=100. 100 * feeMultiplication|
|timeout|set transaction timeout|


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

### Memo

* In stellar specific, can use MemoText MemoId, MemoHash, MemoReturn.

```js

const {
  Memo
} = require('stellar-suite');

const res = Memo.text('0'.repeat(28));
console.log(res);

/* resposne

Memo { _type: 'text', _value: '0000000000000000000000000000' }

*/
```

* In stellar specific, MemoText is 28kbyte limit. this library internal use Ethereum Swarm, So stored over 28kbyte string.


```js

const {
  Memo
} = require('stellar-suite');

const data = 'In a more restrained appearance, President Trump depicted Joseph R. Biden Jr. as an ineffectual Washington insider. Mr. Biden accused the president of heartlessness for separating migrant families and inflaming racial tensions. by New York Times(23/10/20)';
const res = await Memo.Swarm.setText(data);
console.log(res);

/* response
 
Memo {
  _type: 'hash',
  _value: <Buffer 43 1d eb 15 22 07 0a 1c dd 0e e4 8d 7f c2 15 3b 49 c5 4f 0a 36 31 c8 7
e 1f d6 72 6b de b6 d3 0a>
}

*/
```

* To Get stored data from swarm,  Use encoded memo data in transaction and set in Memo.Swarm.setText('encoded data')



```js

const {
  Memo
} = require('stellar-suite');

(async () => {
  const memoHash = 'Qs5GwukTIsifv+X23AaoRqDhK9VCSnzzsqPpae0Enns=';
  const res = await Memo.Swarm.getText(memoHash);
  console.log(res);
})();

/* response

Btesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
testtesttesttesttesttesttesttesttesttesttesttesttesttesttest

*/

```


