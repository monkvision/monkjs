import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { MonkTheme } from '@monkvision/types';
import { render } from '@testing-library/react';

const theme = {
  utils: {
    getColor: jest.fn(),
  },
} as unknown as MonkTheme;

jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  useMonkTheme: jest.fn(() => theme),
}));

const DYNAMIC_SVG_MOCK_TEST_ID = 'dynamic-svg-test';
const DynamicSVGMock = jest.fn(() => <div data-testid={DYNAMIC_SVG_MOCK_TEST_ID} />);
jest.mock('../../src/components/DynamicSVG', () => ({
  DynamicSVG: DynamicSVGMock,
}));

import { Spinner } from '../../src';

describe('Spinner component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a DynamicSVG component with the given props', () => {
    const size = 89;
    const primaryColor = '#123456';
    const { unmount } = render(<Spinner size={size} primaryColor={primaryColor} />);

    expectPropsOnChildMock(DynamicSVGMock, {
      style: { width: size, height: size },
      width: size,
      height: size,
    });
    expect(theme.utils.getColor).toHaveBeenCalledWith(primaryColor);
    unmount();
  });

  it('should pass props down to the DynamicSVG element', () => {
    const onClick = jest.fn();
    const id = 'test';
    const { unmount } = render(<Spinner onClick={onClick} id={id} />);

    expectPropsOnChildMock(DynamicSVGMock, { onClick, id });
    unmount();
  });

  it('should have a default size of 50px', () => {
    const { unmount } = render(<Spinner />);

    expectPropsOnChildMock(DynamicSVGMock, {
      style: { width: 50, height: 50 },
      width: 50,
      height: 50,
    });
    unmount();
  });

  it('should have a default primaryColor of text-white', () => {
    const { unmount } = render(<Spinner />);

    expect(theme.utils.getColor).toHaveBeenCalledWith('text-white');
    unmount();
  });
});
