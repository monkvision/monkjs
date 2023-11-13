import { iconNames } from '../../src';
import { MonkIconAssetsMap } from '../../src/icons/assets';

describe('Icons assets', () => {
  it('should contain a valid asset for each icon name', () => {
    iconNames.forEach((name) => {
      const svgStr = MonkIconAssetsMap[name];

      expect(typeof svgStr).toEqual('string');
      expect(() => new DOMParser().parseFromString(svgStr, 'text/xml')).not.toThrow();
    });
  });
});
