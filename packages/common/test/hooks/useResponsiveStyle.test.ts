import { ResponsiveStyleProperties } from '@monkvision/types';
import { renderHook } from '@testing-library/react-hooks';
import { WindowDimensions } from '../../src';

const initialDimensions: WindowDimensions = {
  width: 1980,
  height: 1024,
  isPortrait: false,
};
const useWindowDimensionsMock: jest.Mock<WindowDimensions | null> = jest.fn(
  () => initialDimensions,
);
jest.mock('../../src/hooks/useWindowDimensions', () => ({
  useWindowDimensions: useWindowDimensionsMock,
}));

import { useResponsiveStyle } from '../../src/hooks/useResponsiveStyle';

describe('useResponsiveStyle hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the style if the dimensions are null', () => {
    useWindowDimensionsMock.mockImplementationOnce(() => null);
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = { color: 'blue' };
    expect(result.current.responsive(style)).toEqual(style);
    unmount();
  });

  it('should return null if the style is null', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    expect(result.current.responsive(null)).toBeNull();
    unmount();
  });

  it('should return the style if there is no media query', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = { color: 'blue' };
    expect(result.current.responsive(style)).toEqual(style);
    unmount();
  });

  it('should return the style if the maxWidth query is met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { maxWidth: initialDimensions.width + 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(
      expect.objectContaining({ color: style.color }),
    );
    unmount();
  });

  it('should return the null if the maxWidth query is not met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { maxWidth: initialDimensions.width - 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(null);
    unmount();
  });

  it('should return the style if the minWidth query is met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { minWidth: initialDimensions.width - 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(
      expect.objectContaining({ color: style.color }),
    );
    unmount();
  });

  it('should return the null if the minWidth query is not met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { minWidth: initialDimensions.width + 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(null);
    unmount();
  });

  it('should return the style if the maxHeight query is met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { maxHeight: initialDimensions.height + 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(
      expect.objectContaining({ color: style.color }),
    );
    unmount();
  });

  it('should return the null if the maxHeight query is not met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { maxHeight: initialDimensions.height - 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(null);
    unmount();
  });

  it('should return the style if the minHeight query is met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { minHeight: initialDimensions.height - 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(
      expect.objectContaining({ color: style.color }),
    );
    unmount();
  });

  it('should return the null if the minHeight query is not met', () => {
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { minHeight: initialDimensions.height + 1 },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(null);
    unmount();
  });

  it('should return the style if the portrait query is met', () => {
    useWindowDimensionsMock.mockImplementationOnce(() => ({
      width: 500,
      height: 1000,
      isPortrait: true,
    }));
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { portrait: true },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(
      expect.objectContaining({ color: style.color }),
    );
    unmount();
  });

  it('should return the null if the portrait query is not met', () => {
    useWindowDimensionsMock.mockImplementationOnce(() => ({
      width: 1000,
      height: 500,
      isPortrait: false,
    }));
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { portrait: true },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(null);
    unmount();
  });

  it('should return the style if the landscape query is met', () => {
    useWindowDimensionsMock.mockImplementationOnce(() => ({
      width: 1000,
      height: 500,
      isPortrait: false,
    }));
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { landscape: true },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(
      expect.objectContaining({ color: style.color }),
    );
    unmount();
  });

  it('should return the null if the landscape query is not met', () => {
    useWindowDimensionsMock.mockImplementationOnce(() => ({
      width: 500,
      height: 1000,
      isPortrait: true,
    }));
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { landscape: true },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(null);
    unmount();
  });

  it('should accept multiple queries at once', () => {
    useWindowDimensionsMock.mockImplementationOnce(() => ({
      width: 450,
      height: 300,
      isPortrait: false,
    }));
    const { result, unmount } = renderHook(useResponsiveStyle);
    const style: ResponsiveStyleProperties = {
      __media: { maxWidth: 500, portrait: true },
      color: 'blue',
    };
    expect(result.current.responsive(style)).toEqual(null);
    unmount();
  });
});
