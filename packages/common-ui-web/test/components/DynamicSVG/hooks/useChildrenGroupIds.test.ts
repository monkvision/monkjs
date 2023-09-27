import { renderHook } from '@testing-library/react';
import { useChildrenGroupIds } from '../../../../src/components/DynamicSVG/hooks';

describe('useChildrenGroupIds hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the parent group IDs if the element is not a group', () => {
    const element = {
      getAttribute: jest.fn(() => 'test-id'),
      tagName: 'path',
    } as unknown as Element;
    const groupIds = ['test-id-1', 'test-id-2'];

    const { result, unmount } = renderHook(useChildrenGroupIds, {
      initialProps: { element, groupIds },
    });

    expect(result.current).toEqual(groupIds);
    unmount();
  });

  it('should return the parent group IDs if the element has no ID', () => {
    const element = {
      getAttribute: jest.fn(() => null),
      tagName: 'g',
    } as unknown as Element;
    const groupIds = ['test-id-1', 'test-id-2'];

    const { result, unmount } = renderHook(useChildrenGroupIds, {
      initialProps: { element, groupIds },
    });

    expect(element.getAttribute).toHaveBeenCalledWith('id');
    expect(result.current).toEqual(groupIds);
    unmount();
  });

  it('should add the element ID to the result if the element is a group with an ID', () => {
    const id = 'test-element-id';
    const element = {
      getAttribute: jest.fn(() => id),
      tagName: 'g',
    } as unknown as Element;
    const groupIds = ['test-id-1', 'test-id-2'];

    const { result, unmount } = renderHook(useChildrenGroupIds, {
      initialProps: { element, groupIds },
    });

    expect(element.getAttribute).toHaveBeenCalledWith('id');
    expect(result.current).toEqual([...groupIds, id]);
    unmount();
  });
});
