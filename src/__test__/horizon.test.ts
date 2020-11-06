import {Horizon} from '../horizon';

describe('Stellar.Horizon', () => {
  test('connect server', async () => {
    const res = Horizon.connect();
    expect(res.serverURL).toBeDefined();
  });

  test('select network', async () => {
    const res = Horizon.network();
    expect(res).toBeDefined();
  });

  test('set development if no match env value', async () => {
    process.env.NODE_ENV = 'nomatch';
    console.log(process.env.NODE_ENV);
    const res = Horizon.network();
    console.log(process.env.NODE_ENV);
    expect(res).toBeDefined();
  });
});
