import { VehicleType } from '@monkvision/types';

jest.mock('../../../src/components/VehicleTypeAsset/assets', () => ({
  VehicleTypeAssetsMap: Object.values(VehicleType).reduce(
    (prev, curr) => ({ ...prev, [curr]: curr }),
    {},
  ),
}));

import { render } from '@testing-library/react';
import { VehicleTypeAsset } from '../../../src';
import { VehicleTypeAssetsMap } from '../../../src/components/VehicleTypeAsset/assets';

describe('VehicleTypeAsset component', () => {
  it('should display the asset available in the VehicleTypeAssetMap object', () => {
    Object.values(VehicleType).forEach((vehicleType) => {
      const { container, unmount } = render(<VehicleTypeAsset vehicleType={vehicleType} />);

      const img = container.getElementsByTagName('img').item(0);
      expect(img).not.toBeNull();
      expect(img?.getAttribute('src')).toEqual(VehicleTypeAssetsMap[vehicleType]);
      expect(img?.getAttribute('alt')).toEqual(vehicleType);

      unmount();
    });
  });
});
