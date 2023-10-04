const DYNAMIC_SVG_TEST_ID = 'dynamic-svg';
const DynamicSVGMock = jest.fn(() => <div data-test-id={DYNAMIC_SVG_TEST_ID} />);
jest.mock('../../src/components/DynamicSVG', () => ({
  DynamicSVG: DynamicSVGMock,
}));

const iconNameMock = 'search';
const MonkIconAssetsMapMock = { [iconNameMock]: 'test-value' };
jest.mock('../../src/icons/assets', () => ({
  MonkIconAssetsMap: MonkIconAssetsMapMock,
}));

const getColorMock = jest.fn((color) => color);
jest.mock('@monkvision/common', () => ({
  useMonkTheme: jest.fn(() => ({
    utils: {
      getColor: getColorMock,
    },
  })),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { Icon } from '../../src';

describe('Icon component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a DynamicSVG component', () => {
    const { unmount } = render(<Icon icon={iconNameMock} />);

    const iconAssetEl = screen.queryByTestId(DYNAMIC_SVG_TEST_ID);
    expect(iconAssetEl).toBeDefined();
    unmount();
  });

  it('should pass the icon asset to the DynamicSVG component', () => {
    const { unmount } = render(<Icon icon={iconNameMock} />);

    expectPropsOnChildMock(DynamicSVGMock, { svg: MonkIconAssetsMapMock[iconNameMock] });
    unmount();
  });

  it('should throw if the asset is not found', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Icon icon='360' />)).toThrowError();
    jest.spyOn(console, 'error').mockRestore();
  });

  it('should use the given size as width and height', () => {
    const size = 876;
    const { unmount } = render(<Icon icon={iconNameMock} size={size} />);

    expectPropsOnChildMock(DynamicSVGMock, { width: size, height: size });
    unmount();
  });

  it('should be of size 50 by default', () => {
    const defaultSize = 50;
    const { unmount } = render(<Icon icon={iconNameMock} />);

    expectPropsOnChildMock(DynamicSVGMock, { width: defaultSize, height: defaultSize });
    unmount();
  });

  it('should pass the given fill color to the DynamicSVG component', () => {
    const primaryColor = '#987654';
    const { unmount } = render(<Icon icon={iconNameMock} primaryColor={primaryColor} />);

    expect(getColorMock).toHaveBeenCalledWith(primaryColor);
    expectPropsOnChildMock(DynamicSVGMock, { fill: primaryColor });
    unmount();
  });

  it('should use the black color by default', () => {
    const defaultColor = '#000000';
    const { unmount } = render(<Icon icon={iconNameMock} />);

    expect(getColorMock).toHaveBeenCalledWith(defaultColor);
    expectPropsOnChildMock(DynamicSVGMock, { fill: defaultColor });
    unmount();
  });

  it('should pass the className down to the asset element', () => {
    const className = 'test-class-name';
    const { unmount } = render(<Icon icon={iconNameMock} className={className} />);

    expectPropsOnChildMock(DynamicSVGMock, { className: expect.stringContaining(className) });
    unmount();
  });

  it('should pass the style down to the asset element', () => {
    const style = { zIndex: 987654321 };
    const { unmount } = render(<Icon icon={iconNameMock} style={style} />);

    expectPropsOnChildMock(DynamicSVGMock, { style: expect.objectContaining(style) });
    unmount();
  });

  it('should pass other props down to the asset element', () => {
    const id = 'test-id';
    const { unmount } = render(<Icon icon={iconNameMock} id={id} />);

    expectPropsOnChildMock(DynamicSVGMock, { id });
    unmount();
  });
});
