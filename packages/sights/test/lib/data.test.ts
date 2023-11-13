import { labels, sights, vehicles } from '../../src/lib';

describe('Sights data', () => {
  it('should contained a defined label dictionary', () => {
    expect(labels).toBeDefined();
  });

  it('should contained a defined vehicle dictionary', () => {
    expect(vehicles).toBeDefined();
  });

  it('should contained a defined sight dictionary', () => {
    expect(sights).toBeDefined();
  });
});
