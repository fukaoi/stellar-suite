const {Account} = require('../../../dist/account');

const init = async(count) => {
  const receivers =
    Array.from(
      Array(count)).map(_ => Account.createKeyPair()
      )
  return {issuer: await Account.friendBot(), receivers: receivers};
}
