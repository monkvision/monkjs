import dotenv from 'dotenv';
import assert from 'assert';
import Root from 'Root';

dotenv.config();

describe('Class Root', () => {
  it('has instance', () => {
    const instance = new Root(process.env.MONK_DOMAIN);
    assert.strictEqual(typeof instance, 'object');
    assert.ok(instance instanceof Root);
  });
  it('rejects unauthorized remote request', async () => {
    await assert.rejects(async () => {
      const root = new Root(process.env.MONK_DOMAIN, 'invalidToken');
      await root.serverInstance.get('/inspections');
    }, {
      name: 'Error',
      message: 'Request failed with status code 401',
    });
  });
});
