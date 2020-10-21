import {TextDecoder} from "util";
import {constants} from './constants';
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
    const binary = await bzz.download(hashId)
    return new TextDecoder('utf-8').decode(binary);
  }

  export const set = async (text: string): Promise<string> =>
    await bzz.upload(text)
}
