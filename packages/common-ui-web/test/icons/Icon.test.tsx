jest.mock('../../src/components/DynamicSVG', () => ({
  DynamicSVG: jest.fn(() => <></>),
}));

const iconNameMock = 'search';
jest.mock('../../src/icons/assets', () => ({
  MonkIconAssetsMap: { [iconNameMock]: 'test-value' },
}));

import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { MonkIconAssetsMap } from '../../src/icons/assets';
import { DynamicSVG, Icon } from '../../src';

function createElement(attributes: Record<string, any>): Element {
  return {
    getAttribute: (name: string) => attributes[name],
  } as unknown as Element;
}

describe('Icon component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a DynamicSVG component', () => {
    const { unmount } = render(<Icon icon={iconNameMock} />);

    expect(DynamicSVG).toHaveBeenCalled();
    unmount();
  });

  it('should pass the icon asset to the DynamicSVG component', () => {
    const { unmount } = render(<Icon icon={iconNameMock} />);

    expectPropsOnChildMock(DynamicSVG, { svg: MonkIconAssetsMap[iconNameMock] });
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

    expectPropsOnChildMock(DynamicSVG, { width: size, height: size });
    unmount();
  });

  it('should be of size 50 by default', () => {
    const defaultSize = 50;
    const { unmount } = render(<Icon icon={iconNameMock} />);

    expectPropsOnChildMock(DynamicSVG, { width: defaultSize, height: defaultSize });
    unmount();
  });

  it('should properly replace color attributes with the primary color in the DynamicSVG component', () => {
    const primaryColor = '#987654';

    const { unmount } = render(<Icon icon={iconNameMock} primaryColor={primaryColor} />);

    expectPropsOnChildMock(DynamicSVG, { getAttributes: expect.any(Function) });
    const { getAttributes } = (DynamicSVG as unknown as jest.Mock).mock.calls[0][0];

    const testCases = [
      { inputAttr: {}, outputAttr: {} },
      { inputAttr: { fill: '#999999' }, outputAttr: { fill: primaryColor } },
      { inputAttr: { stroke: '#123456' }, outputAttr: { stroke: primaryColor } },
      {
        inputAttr: { fill: '#192834', stroke: '#123456', path: 'test' },
        outputAttr: { fill: primaryColor, stroke: primaryColor },
      },
      { inputAttr: { stroke: 'none' }, outputAttr: {} },
      { inputAttr: { fill: 'transparent' }, outputAttr: {} },
    ];
    testCases.forEach(({ inputAttr, outputAttr }) => {
      const element = createElement(inputAttr);
      expect(getAttributes(element)).toEqual(outputAttr);
    });

    unmount();
  });

  it('should use the black color by default', () => {
    const { unmount } = render(<Icon icon={iconNameMock} />);

    expectPropsOnChildMock(DynamicSVG, { getAttributes: expect.any(Function) });
    const { getAttributes } = (DynamicSVG as unknown as jest.Mock).mock.calls[0][0];
    expect(getAttributes(createElement({ fill: '#121212' }))).toEqual({ fill: '#000000' });

    unmount();
  });

  it('should pass the className down to the asset element', () => {
    const className = 'test-class-name';
    const { unmount } = render(<Icon icon={iconNameMock} className={className} />);

    expectPropsOnChildMock(DynamicSVG, { className: expect.stringContaining(className) });
    unmount();
  });

  it('should pass the style down to the asset element', () => {
    const style = { zIndex: 987654321 };
    const { unmount } = render(<Icon icon={iconNameMock} style={style} />);

    expectPropsOnChildMock(DynamicSVG, { style: expect.objectContaining(style) });
    unmount();
  });

  it('should pass other props down to the asset element', () => {
    const id = 'test-id';
    const { unmount } = render(<Icon icon={iconNameMock} id={id} />);

    expectPropsOnChildMock(DynamicSVG, { id });
    unmount();
  });
});
