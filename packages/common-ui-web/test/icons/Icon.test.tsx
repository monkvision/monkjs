const ICON_ASSET_TEST_ID = 'icon-asset-mock';
let IconAssetMock = jest.fn(() => <svg data-testid={ICON_ASSET_TEST_ID} />);
const useIconAssetMock = jest.fn(() => IconAssetMock);
const getColorMock = jest.fn((color) => color);

jest.mock('../../src/icons/hooks', () => ({
  useIconAsset: useIconAssetMock,
}));

jest.mock('@monkvision/common', () => ({
  useMonkTheme: jest.fn(() => ({
    utils: {
      getColor: getColorMock,
    },
  })),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { createRef, forwardRef, Ref } from 'react';
import { Icon, IconName } from '../../src';

describe('Icon component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the asset returned by the useIconAsset hook', () => {
    const icon: IconName = 'align-right';
    const { unmount } = render(<Icon icon={icon} />);

    const iconAssetEl = screen.queryByTestId(ICON_ASSET_TEST_ID);
    expect(iconAssetEl).toBeDefined();
    expect(useIconAssetMock).toHaveBeenCalledWith(icon);
    unmount();
  });

  it('should use the given size as width and height', () => {
    const size = 876;
    const { unmount } = render(<Icon icon='align-right' size={size} />);

    expectPropsOnChildMock(IconAssetMock, { width: size, height: size });
    unmount();
  });

  it('should be of size 50 by default', () => {
    const defaultSize = 50;
    const { unmount } = render(<Icon icon='align-right' />);

    expect(IconAssetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        width: defaultSize,
        height: defaultSize,
      }),
      expect.anything(),
    );
    unmount();
  });

  it('should pass the given fill color to the icon asset', () => {
    const primaryColor = '#987654';
    const { unmount } = render(<Icon icon='align-right' primaryColor={primaryColor} />);

    expect(getColorMock).toHaveBeenCalledWith(primaryColor);
    expectPropsOnChildMock(IconAssetMock, { fill: primaryColor });
    unmount();
  });

  it('should use the black color by default', () => {
    const defaultColor = '#000000';
    const { unmount } = render(<Icon icon='align-right' />);

    expect(getColorMock).toHaveBeenCalledWith(defaultColor);
    expectPropsOnChildMock(IconAssetMock, { fill: defaultColor });
    unmount();
  });

  it('should pass the className down to the asset element', () => {
    const className = 'test-class-name';
    const { unmount } = render(<Icon icon='align-right' className={className} />);

    expectPropsOnChildMock(IconAssetMock, { className: expect.stringContaining(className) });
    unmount();
  });

  it('should pass the style down to the asset element', () => {
    const style = { zIndex: 987654321 };
    const { unmount } = render(<Icon icon='align-right' style={style} />);

    expectPropsOnChildMock(IconAssetMock, { style: expect.objectContaining(style) });
    unmount();
  });

  it('should pass other props down to the asset element', () => {
    const id = 'test-id';
    const { unmount } = render(<Icon icon='align-right' id={id} />);

    expectPropsOnChildMock(IconAssetMock, { id });
    unmount();
  });

  it('should pass the ref down to the asset element', () => {
    let resultRef: Ref<SVGSVGElement> | null = null;
    IconAssetMock = forwardRef<SVGSVGElement>((props, ref) => {
      resultRef = ref;
      return <svg />;
    }) as unknown as jest.Mock;

    const ref = createRef<SVGSVGElement>();
    const { unmount } = render(<Icon ref={ref} icon='align-right' />);

    expect(resultRef).toEqual(ref);
    unmount();
    IconAssetMock = jest.fn(() => <svg data-testid={ICON_ASSET_TEST_ID} />);
  });
});
