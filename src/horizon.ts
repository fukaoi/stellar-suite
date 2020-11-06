import {
  Server,
  Networks,
} from 'stellar-sdk';

import {constants} from './constants';

export namespace Horizon {
  const env = process.env.NODE_ENV;

  let horizonObject: Server;

  export const connect = (): Server => {
    if (horizonObject) return horizonObject;
    const url = env === constants.prd ?
      constants.horizon.mainnet :
      constants.horizon.testnet;
    horizonObject = new Server(url);
    return horizonObject;
  }

  export const network = (): Networks =>
    env === constants.prd ?
      Networks.PUBLIC :
      Networks.TESTNET;
}
