import { renderHook } from '@testing-library/react';
import { IconName } from '../../src';

const MonkIconAssetsMapMock: { [key in IconName]?: string } = {
  '360': 'test-360',
  'account-circle': 'test-account-circle',
  'acv': 'test-acv',
  'add-comment': 'test-add-comment',
  'add-image': 'test-add-image',
};

jest.mock('../../src/icons/assets', () => ({
  MonkIconAssetsMap: MonkIconAssetsMapMock,
}));

import { useIconAsset } from '../../src/icons/hooks';

describe('useIconAsset hook', () => {
  it('should return the proper icon asset from the assets map', () => {
    Object.keys(MonkIconAssetsMapMock).forEach((icon) => {
      const { unmount, result } = renderHook(useIconAsset, { initialProps: icon as IconName });

      expect(result.current).toEqual(MonkIconAssetsMapMock[icon as IconName]);
      unmount();
    });
  });

  it('should throw an error if the asset is not found', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(useIconAsset, { initialProps: 'zzz' as IconName })).toThrowError();
  });

  it('should memoize the icon asset', () => {
    const { unmount, result, rerender } = renderHook(useIconAsset, { initialProps: '360' });

    const previousValue = MonkIconAssetsMapMock['360'];
    expect(result.current).toEqual(previousValue);

    const newValue = 'new-value';
    MonkIconAssetsMapMock['360'] = newValue;
    rerender('360');
    expect(result.current).toEqual(previousValue);

    rerender('acv');
    expect(result.current).toEqual(MonkIconAssetsMapMock['acv']);

    rerender('360');
    expect(result.current).toEqual(newValue);
    unmount();
  });
});
