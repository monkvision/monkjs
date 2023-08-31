import {
  expectComponentToPassDownClassNameToHTMLElement,
  expectComponentToPassDownOtherPropsToHTMLElement,
  expectComponentToPassDownRefToHTMLElement,
  expectComponentToPassDownStyleToHTMLElement,
} from '@monkvision/test-utils';
import { MonkTheme } from '@monkvision/types';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../../src';

const theme = {
  utils: {
    getColor: jest.fn(),
  },
} as unknown as MonkTheme;

jest.mock('@monkvision/common', () => ({
  useMonkTheme: jest.fn(() => theme),
}));

const SPINNER_TEST_ID = 'monk-spinner';

describe('Spinner component', () => {
  it('should have a default size of 50px', () => {
    const { unmount } = render(<Spinner />);

    const spinnerDiv = screen.getByTestId(SPINNER_TEST_ID);
    expect(spinnerDiv.style.width).toEqual('50px');
    expect(spinnerDiv.style.height).toEqual('50px');
    unmount();
  });

  it('should take the size prop into account', () => {
    const size = 89;
    const { unmount } = render(<Spinner size={89} />);

    const spinnerDiv = screen.getByTestId(SPINNER_TEST_ID);
    expect(spinnerDiv.style.width).toEqual(`${size}px`);
    expect(spinnerDiv.style.height).toEqual(`${size}px`);
    unmount();
  });

  it('should have a text-white color as default', () => {
    const value = '#123456';
    (theme.utils.getColor as jest.Mock).mockImplementation((color) =>
      color === 'text-white' ? value : null,
    );
    const { unmount } = render(<Spinner />);

    expect(screen.getByTestId('monk-spinner-colored-layer').style.borderColor).toEqual(value);
    unmount();
  });

  it('should take the primaryColor prop into account', () => {
    const colorProp = 'yep';
    const value = '#334455';
    (theme.utils.getColor as jest.Mock).mockImplementation((color) =>
      color === colorProp ? value : null,
    );
    const { unmount } = render(<Spinner primaryColor={colorProp} />);

    expect(screen.getByTestId('monk-spinner-colored-layer').style.borderColor).toEqual(value);
    unmount();
  });

  it('should pass the className down to the div element', () => {
    expectComponentToPassDownClassNameToHTMLElement(Spinner, SPINNER_TEST_ID);
  });

  it('should pass the style down to the div element', () => {
    expectComponentToPassDownStyleToHTMLElement(Spinner, SPINNER_TEST_ID);
  });

  it('should pass other props down to the div element', () => {
    expectComponentToPassDownOtherPropsToHTMLElement(Spinner, SPINNER_TEST_ID);
  });

  it('should pass the ref down to the div element', () => {
    expectComponentToPassDownRefToHTMLElement(Spinner, SPINNER_TEST_ID);
  });
});
