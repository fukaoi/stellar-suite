import {StellarSuiteError} from '../error';
import {Swarm} from '../swarm';

const dummy = 'test';

describe('Stellar.Swarm', () => {
  test('connect swarm network', () => {
    expect(Swarm.connect()).toBeDefined();
  });

  test('set data', async () => {
    Swarm.connect();
    const res = await Swarm.set(dummy);
    expect(res).toHaveLength(64);
  });

  test('set empty data', async () => {
    Swarm.connect();
    await expect(Swarm.set('')).rejects.toThrow(StellarSuiteError);
  });

  test('get data', async () => {
    Swarm.connect();
    const hashId = await Swarm.set(dummy);
    const res = await Swarm.get(hashId);
    expect(res).toEqual(dummy);
  });

  test('set invalid hashId', async () => {
    Swarm.connect();
    const invalid = '8c339e15bd89e7f8c7d6c754b8016a202bba12a8cdb4aabe39c6c9e30507a8f3';
    const swarmGetPromise = Swarm.get(invalid);
    await expect(swarmGetPromise).rejects.toThrow(/^Error 404.$/);
  });

  test('set empty value', async () => {
    Swarm.connect();
    const swarmGetPromise = Swarm.get('');
    await expect(swarmGetPromise).rejects.toThrow(/^Error 404.$/);
  });

});

jest.setTimeout(60000);

