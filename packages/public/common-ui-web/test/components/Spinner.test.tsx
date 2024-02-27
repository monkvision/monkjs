jest.mock('../../src/components/DynamicSVG', () => ({
  DynamicSVG: jest.fn(() => <></>),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render } from '@testing-library/react';
import { DynamicSVG, Spinner } from '../../src';

describe('Spinner component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a DynamicSVG component with the given props', () => {
    const size = 89;
    const primaryColor = '#123456';
    const { unmount } = render(<Spinner size={size} primaryColor={primaryColor} />);

    expectPropsOnChildMock(DynamicSVG, {
      style: { width: size, height: size },
      width: size,
      height: size,
    });
    expect((DynamicSVG as jest.Mock).mock.calls[0][0].getAttributes().stroke).toEqual(primaryColor);
    unmount();
  });

  it('should pass props down to the DynamicSVG element', () => {
    const onClick = jest.fn();
    const id = 'test';
    const { unmount } = render(<Spinner onClick={onClick} id={id} />);

    expectPropsOnChildMock(DynamicSVG, { onClick, id });
    unmount();
  });

  it('should have a default size of 50px', () => {
    const { unmount } = render(<Spinner />);

    expectPropsOnChildMock(DynamicSVG, {
      style: { width: 50, height: 50 },
      width: 50,
      height: 50,
    });
    unmount();
  });

  it('should have a default primaryColor of text-white', () => {
    const { unmount } = render(<Spinner />);

    expect((DynamicSVG as jest.Mock).mock.calls[0][0].getAttributes().stroke.toLowerCase()).toEqual(
      '#ffffff',
    );
    unmount();
  });
});
