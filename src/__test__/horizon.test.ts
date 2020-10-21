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
});
