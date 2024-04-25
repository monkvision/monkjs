import { useWindowDimensions } from '@monkvision/common';
import { renderHook } from '@testing-library/react-hooks';
import { useItemListFillers } from '../../../../src/components/InspectionGallery/hooks';

describe('useItemListFillers hook', () => {
  it('should return the proper number of fillers', () => {
    (useWindowDimensions as jest.Mock).mockImplementation(() => ({ width: 1234 }));
    const { result, rerender, unmount } = renderHook(useItemListFillers, { initialProps: 16 });

    expect(result.current).toEqual(5);
    rerender(43);
    expect(result.current).toEqual(6);

    (useWindowDimensions as jest.Mock).mockImplementation(() => ({ width: 456 }));
    rerender(11);
    expect(result.current).toEqual(1);
    rerender(2);
    expect(result.current).toEqual(2);

    unmount();
  });

  it('should return 0 if the window dimensions are not defined', () => {
    (useWindowDimensions as jest.Mock).mockImplementation(() => null);
    const { result, unmount } = renderHook(useItemListFillers, { initialProps: 16 });

    expect(result.current).toEqual(0);

    unmount();
  });
});
