import {
  Server,
  Networks,
} from 'stellar-sdk';

import {constants} from './constants';
import {StellarSuiteError} from './error';

export namespace Horizon {
  const env = process.env.NODE_ENV;

  let horizonObject: Server;

  export const connect = (): Server => {
    if (horizonObject) return horizonObject;
    if (env === constants.dev || env === constants.test) {
      horizonObject = new Server(constants.horizon.testnet);
    } else if (env === constants.prd) {
      horizonObject = new Server(constants.horizon.mainnet);
    } else {
      throw new StellarSuiteError(
        `No match enviroment: only ${constants.dev}, ${constants.prd}`
      );
    }
    return horizonObject;
  }

  export const network = (): Networks => {
    if (env === constants.dev || env === constants.test) {
      return Networks.TESTNET;
    } else if (env === constants.prd) {
      return Networks.PUBLIC;
    } else {
      throw new StellarSuiteError(
        `No match enviroment: only ${constants.dev}, ${constants.prd}`
      );
    }
  }
}
