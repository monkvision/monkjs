import { renderHook } from '@testing-library/react-hooks';
import { useCustomAttributes } from '../../../../src/components/DynamicSVG/hooks';

describe('useCustomAttributes hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove the pointer events of svg tags', () => {
    const element = { tagName: 'svg' } as unknown as Element;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds: [] },
    });

    expect(result.current).toEqual({ pointerEvents: 'box-none' });
    unmount();
  });

  it('should remove the pointer events of g tags', () => {
    const element = { tagName: 'g' } as unknown as Element;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds: [] },
    });

    expect(result.current).toEqual({ pointerEvents: 'box-none' });
    unmount();
  });

  it('should return null if no customization function is passed', () => {
    const element = { tagName: 'path' } as unknown as Element;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds: [] },
    });

    expect(result.current).toBeNull();
    unmount();
  });

  it('should return the result of the customization function', () => {
    const element = { tagName: 'path' } as unknown as Element;
    const groupIds = ['test-id-1', 'test-id-2'];
    const customAttr = { style: { color: 'test-color' } };
    const getAttributes = jest.fn(() => customAttr);

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds, getAttributes },
    });

    expect(getAttributes).toHaveBeenCalledWith(element, groupIds);
    expect(result.current).toEqual(customAttr);
    unmount();
  });
});
