import { useInspectionGalleryEmptyLabel } from '../../../../src/components/InspectionGallery/hooks';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';

describe('useInspectionGalleryEmptyLabel hook', () => {
  it('should return the proper label', () => {
    const { result, rerender, unmount } = renderHook(useInspectionGalleryEmptyLabel, {
      initialProps: { captureMode: false, isFilterActive: false },
    });

    expect(useTranslation).toHaveBeenCalledWith();
    let { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('list.empty.nonCapture');
    expect(result.current).toEqual('list.empty.nonCapture');

    (useTranslation as jest.Mock).mockClear();
    rerender({ captureMode: true, isFilterActive: false });
    expect(useTranslation).toHaveBeenCalledWith();
    t = (useTranslation as jest.Mock).mock.results[0].value.t;
    expect(t).toHaveBeenCalledWith('list.empty.capture');
    expect(result.current).toEqual('list.empty.capture');

    (useTranslation as jest.Mock).mockClear();
    rerender({ captureMode: false, isFilterActive: true });
    expect(useTranslation).toHaveBeenCalledWith();
    t = (useTranslation as jest.Mock).mock.results[0].value.t;
    expect(t).toHaveBeenCalledWith('list.empty.filter');
    expect(result.current).toEqual('list.empty.filter');

    (useTranslation as jest.Mock).mockClear();
    rerender({ captureMode: true, isFilterActive: true });
    expect(useTranslation).toHaveBeenCalledWith();
    t = (useTranslation as jest.Mock).mock.results[0].value.t;
    expect(t).toHaveBeenCalledWith('list.empty.filter');
    expect(result.current).toEqual('list.empty.filter');

    unmount();
  });
});
