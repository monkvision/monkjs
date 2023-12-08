import { renderHook } from '@testing-library/react-hooks';
import { useInnerHTML } from '../../../../src/components/DynamicSVG/hooks';

describe('useInnerHTML hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the element innerHTML if it is a style tag', () => {
    const element = { tagName: 'style', innerHTML: 'test-html' } as unknown as Element;

    const { result, unmount } = renderHook(useInnerHTML, {
      initialProps: { element, groupIds: [] },
    });

    expect(result.current).toEqual(element.innerHTML);
    unmount();
  });

  it('should return null if no customization function is passed', () => {
    const element = { tagName: 'path' } as unknown as Element;

    const { result, unmount } = renderHook(useInnerHTML, {
      initialProps: { element, groupIds: [] },
    });

    expect(result.current).toBeNull();
    unmount();
  });

  it('should return the result of the customization function', () => {
    const element = { innerHTML: 'test-html' } as unknown as Element;
    const groupIds = ['test-id-1', 'test-id-2'];
    const innerText = 'inner-text-test';
    const getInnerText = jest.fn(() => innerText);

    const { result, unmount } = renderHook(useInnerHTML, {
      initialProps: { element, groupIds, getInnerText },
    });

    expect(getInnerText).toHaveBeenCalledWith(element, groupIds);
    expect(result.current).toEqual(innerText);
    unmount();
  });
});
