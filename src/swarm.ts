import {TextDecoder} from "util";
import {constants} from './constants';
import {StellarSuiteError} from "./error";
const Bzz = require('web3-bzz'); //No suitable es6 

interface Bzz {
  upload(text: string): Promise<string>,
  download(hashId: string): Promise<Uint8Array>,
}

export namespace Swarm {
  const env = process.env.NODE_ENV;

  let bzz: Bzz;

  export const connect = (): Bzz => {
    if (env === constants.dev || env === constants.test) {
      bzz = new Bzz(constants.swarm.testnet);
    } else if (env === constants.prd) {
      bzz = new Bzz(constants.swarm.mainnet);
    } else {
      throw new Error(`No match enviroment: only ${constants.dev}, ${constants.prd}`);
    }
    return bzz;
  }

  export const get = async (hashId: string): Promise<string> => {
    const binary = await bzz.download(hashId);
    let Decoder = typeof window === 'undefined' ? TextDecoder : window.TextDecoder;
    if (env === constants.test) Decoder = TextDecoder;
    return new Decoder('utf-8').decode(binary);
  }

  export const set = async (text: string): Promise<string> => {
    if (!text || text.length === 0) {
      throw new StellarSuiteError('Set empty data');
    }
    return await bzz.upload(text);
  }
}
