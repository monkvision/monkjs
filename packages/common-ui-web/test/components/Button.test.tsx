const BUTTON_TEST_ID = 'monk-btn';
const SPINNER_TEST_ID = 'spinner-mock';
const ICON_TEST_ID = 'icon-mock';
const SpinnerMock = jest.fn(() => <div data-testid={SPINNER_TEST_ID} />);
const IconMock = jest.fn(() => <div data-testid={ICON_TEST_ID} />);

jest.mock('../../src/components/Spinner', () => ({
  Spinner: SpinnerMock,
}));

jest.mock('../../src/icons', () => ({
  Icon: IconMock,
}));

const theme = {
  utils: {
    getColor: jest.fn((color) => color),
  },
  palette: {
    outline: { base: '' },
  },
};

jest.mock('@monkvision/common', () => ({
  useMonkTheme: jest.fn(() => theme),
}));

import {
  expectComponentToPassDownClassNameToHTMLElement,
  expectComponentToPassDownOtherPropsToHTMLElement,
  expectComponentToPassDownRefToHTMLElement,
  expectComponentToPassDownStyleToHTMLElement,
  expectPropsOnChildMock,
} from '@monkvision/test-utils';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { Button, ButtonSize, ButtonVariant, IconName } from '../../src';

describe('Button component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a "normal" size by default', () => {
    const { unmount } = render(<Button />);

    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl.className).toContain('normal');
    unmount();
  });

  it('should take the size parameter into account', () => {
    const size: ButtonSize = 'small';
    const { unmount } = render(<Button size={size} />);

    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl.className).toContain(size);
    unmount();
  });

  it('should have be of "fill" variant by default', () => {
    const { unmount } = render(<Button />);

    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl.className).toContain('fill');
    unmount();
  });

  it('should take the variant parameter into account', () => {
    const variants: ButtonVariant[] = ['outline', 'fill', 'text', 'text-link'];
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant} />);

      const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
      expect(buttonEl.className).toContain(variant);
      unmount();
    });
  });

  it('should use the primaryColor as background for fill buttons', () => {
    const color = 'rgb(18, 52, 86)';
    const { unmount } = render(<Button variant='fill' primaryColor={color} />);

    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl.style.backgroundColor).toEqual(color);
    unmount();
  });

  it('should use the primaryColor as foreground for non-fill buttons', () => {
    const color = 'rgb(18, 52, 86)';
    const variants: ButtonVariant[] = ['outline', 'text', 'text-link'];
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant} primaryColor={color} />);

      const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
      expect(buttonEl.style.color).toEqual(color);
      expect(buttonEl.style.borderColor).toEqual(variant === 'outline' ? color : 'transparent');
      unmount();
    });
  });

  it('should use the secondaryColor as foreground for fill buttons', () => {
    const color = 'rgb(101, 67, 33)';
    const { unmount } = render(<Button variant='fill' secondaryColor={color} />);

    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl.style.color).toEqual(color);
    unmount();
  });

  it('should use the secondaryColor as background for outline buttons', () => {
    const color = 'rgb(101, 67, 33)';
    const { unmount } = render(<Button variant='outline' secondaryColor={color} />);

    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl.style.backgroundColor).toEqual(color);
    unmount();
  });

  it('should create an icon component with the given icon when given an "icon" prop', () => {
    const icon: IconName = 'add-photo';
    const { unmount } = render(<Button icon={icon} />);

    const iconEl = screen.queryByTestId(ICON_TEST_ID);
    expect(iconEl).toBeDefined();
    expectPropsOnChildMock(IconMock, { icon });
    unmount();
  });

  it('should use the proper foreground color for the icon component', () => {
    const color = 'rgb(87, 12, 12)';
    const { unmount, rerender } = render(
      <Button icon='add-photo' variant='fill' secondaryColor={color} />,
    );

    expectPropsOnChildMock(IconMock, { primaryColor: color });
    const variants: ButtonVariant[] = ['outline', 'text', 'text-link'];
    variants.forEach((variant) => {
      jest.clearAllMocks();
      rerender(<Button icon='add-photo' variant={variant} primaryColor={color} />);
      expectPropsOnChildMock(IconMock, { primaryColor: color });
    });
    unmount();
  });

  it('should display the given children', () => {
    const testId = 'test-div';
    const { unmount } = render(
      <Button>
        <div data-testid={testId} />
      </Button>,
    );

    const testDivEl = screen.getByTestId(BUTTON_TEST_ID).children[0];
    expect(testDivEl).toBeDefined();
    expect(testDivEl.getAttribute('data-testid')).toEqual(testId);
    unmount();
  });

  it('should not display a spinner when not loading', () => {
    const { unmount } = render(<Button />);

    const spinnerEl = screen.queryByTestId(SPINNER_TEST_ID);
    expect(spinnerEl).toBeNull();
    unmount();
  });

  it('should display a spinner instead of the children when loading', () => {
    const testId = 'test-div';
    const { unmount } = render(
      <Button loading>
        <div data-testid={testId} />
      </Button>,
    );

    const testDivEl = screen.queryByTestId(testId);
    expect(testDivEl).toBeNull();
    const spinnerEl = screen.getByTestId(BUTTON_TEST_ID).children[0];
    expect(spinnerEl).toBeDefined();
    expect(spinnerEl.getAttribute('data-testid')).toEqual(SPINNER_TEST_ID);
    unmount();
  });

  it('should use the proper foreground color for the spinner component', () => {
    const color = 'rgb(12, 54, 98)';
    const { unmount, rerender } = render(<Button loading variant='fill' secondaryColor={color} />);

    expectPropsOnChildMock(SpinnerMock, { primaryColor: color });

    const variants: ButtonVariant[] = ['outline', 'text', 'text-link'];
    variants.forEach((variant) => {
      jest.clearAllMocks();
      rerender(<Button loading variant={variant} primaryColor={color} />);
      expectPropsOnChildMock(SpinnerMock, { primaryColor: color });
    });
    unmount();
  });

  it('should call event.preventDefault on mousedown events', () => {
    const { unmount } = render(<Button />);

    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    const event = createEvent.mouseDown(buttonEl);
    fireEvent(buttonEl, event);
    expect(event.defaultPrevented).toBe(true);
    unmount();
  });

  it('should call the onMouseDown callback on mousedown events if it is provided', () => {
    const onMouseDown = jest.fn();
    const { unmount } = render(<Button onMouseDown={onMouseDown} />);

    const clientX = 987;
    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    const event = createEvent.mouseDown(buttonEl, { clientX });
    fireEvent(buttonEl, event);
    expect(onMouseDown).toHaveBeenCalledWith(expect.objectContaining({ clientX }));
    unmount();
  });

  it('should disable the button when it is loading', () => {
    const { unmount, rerender } = render(<Button />);

    let buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect((buttonEl as HTMLButtonElement).disabled).toBe(false);

    rerender(<Button loading />);

    buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect((buttonEl as HTMLButtonElement).disabled).toBe(true);
    unmount();
  });

  it('should add a hidden content to preserve the width when given the preserveWidthOnLoading prop', () => {
    const testId = 'test-div';
    const { unmount } = render(
      <Button loading preserveWidthOnLoading>
        <div data-testid={testId} />
      </Button>,
    );

    const testDivEl = screen.queryByTestId(testId);
    expect(testDivEl).toBeDefined();
    expect(testDivEl?.parentElement?.className).toEqual('loading-hidden-content');
    const spinnerEl = screen.queryByTestId('monk-spinner-mock');
    expect(spinnerEl).toBeDefined();
    unmount();
  });

  it('should pass the disabled prop down to the button element', () => {
    expectComponentToPassDownOtherPropsToHTMLElement(Button, BUTTON_TEST_ID, { disabled: true });
  });

  it('should pass the className down to the button element', () => {
    expectComponentToPassDownClassNameToHTMLElement(Button, BUTTON_TEST_ID);
  });

  it('should pass the style down to the button element', () => {
    expectComponentToPassDownStyleToHTMLElement(Button, BUTTON_TEST_ID);
  });

  it('should pass other props down to the button element', () => {
    expectComponentToPassDownOtherPropsToHTMLElement(Button, BUTTON_TEST_ID);
  });

  it('should pass the ref down to the button element', () => {
    expectComponentToPassDownRefToHTMLElement(Button, BUTTON_TEST_ID);
  });
});
