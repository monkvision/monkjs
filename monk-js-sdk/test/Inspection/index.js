import assert from 'assert';
import dotenv from 'dotenv';

import { createRoot } from 'Root';

dotenv.config();

const root = createRoot();

describe('getInspectionAsync()', () => {
  it('does not reject', async () => {
    await assert.doesNotReject(async () => {
      await root.getInspectionAsync();
    });
  });
});
