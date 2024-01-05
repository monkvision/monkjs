import { mockButtonDependencies } from './mocks';

mockButtonDependencies();

import '@testing-library/jest-dom';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock, getNumberFromCSSProperty } from '@monkvision/test-utils';
import { useInteractiveStatus } from '@monkvision/common';
import { Button, Spinner, Icon, IconProps } from '../../../src';
import { InteractiveStatus } from '@monkvision/types';

const BUTTON_TEST_ID = 'monk-btn';

describe('Button component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should take the size prop into account', () => {
    const { unmount, rerender } = render(<Button size='normal' />);
    let buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    const normalFontSize = getNumberFromCSSProperty(buttonEl.style.fontSize);
    rerender(<Button size='small' />);
    buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    const smallFontSize = getNumberFromCSSProperty(buttonEl.style.fontSize);
    expect(normalFontSize).toBeGreaterThan(smallFontSize);
    unmount();
  });

  it('should have the normal size by default', () => {
    const { unmount, rerender } = render(<Button />);
    let buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    const defaultFontSize = getNumberFromCSSProperty(buttonEl.style.fontSize);
    rerender(<Button size='small' />);
    buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    const smallFontSize = getNumberFromCSSProperty(buttonEl.style.fontSize);
    expect(defaultFontSize).toBeGreaterThan(smallFontSize);
    unmount();
  });

  it('should have a cursor pointer', () => {
    const { unmount } = render(<Button />);
    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl).toHaveStyle({ cursor: 'pointer' });
    unmount();
  });

  it('should pass down the disabled prop', () => {
    const { unmount, rerender } = render(<Button />);
    let buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl).not.toHaveAttribute('disabled');
    rerender(<Button disabled />);
    buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl).toHaveAttribute('disabled');
    unmount();
  });

  it('should update its style when disabled', () => {
    (useInteractiveStatus as jest.Mock).mockImplementationOnce(({ disabled }) => ({
      status: disabled ? InteractiveStatus.DISABLED : InteractiveStatus.DEFAULT,
      eventHandlers: {},
    }));
    const { unmount } = render(<Button disabled />);
    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl).toHaveStyle({
      opacity: 0.37,
      cursor: 'default',
    });
    unmount();
  });

  it('should be a filled button by default', () => {
    const primaryColor = '#123456';
    const { unmount } = render(<Button primaryColor={primaryColor} />);
    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    expect(buttonEl).toHaveStyle({ backgroundColor: primaryColor });
    unmount();
  });

  it('should pass the proper disabled prop to the useInteractiveStatus hook', () => {
    const { unmount, rerender } = render(<Button />);
    const useInteractiveStatusMock = useInteractiveStatus as jest.Mock;
    expect(useInteractiveStatusMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
      }),
    );
    useInteractiveStatusMock.mockClear();
    rerender(<Button disabled />);
    expect(useInteractiveStatusMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
    );
    useInteractiveStatusMock.mockClear();
    rerender(<Button loading />);
    expect(useInteractiveStatusMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
    );
    unmount();
  });

  it('should pass the component handlers to the useInteractiveStatus hook and then to the button', () => {
    const onMouseUp = jest.fn();
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const onMouseDown = jest.fn();
    const { unmount } = render(
      <Button
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
      />,
    );
    expect(useInteractiveStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        componentHandlers: {
          onMouseUp,
          onMouseEnter,
          onMouseLeave,
          onMouseDown: expect.any(Function),
        },
      }),
    );
    const buttonEl = screen.getByTestId(BUTTON_TEST_ID);
    fireEvent.mouseEnter(buttonEl);
    fireEvent.mouseDown(buttonEl);
    fireEvent.mouseUp(buttonEl);
    fireEvent.mouseLeave(buttonEl);
    expect(onMouseUp).toHaveBeenCalled();
    expect(onMouseEnter).toHaveBeenCalled();
    expect(onMouseLeave).toHaveBeenCalled();
    expect(onMouseDown).toHaveBeenCalled();
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

  it('should display its children', () => {
    const testId = 'test-id-span';
    const { unmount } = render(
      <Button>
        <span data-testid={testId}>Test</span>
      </Button>,
    );
    expect(screen.queryByTestId(testId)).toBeDefined();
    unmount();
  });

  describe('Button spinner', () => {
    it('should be displayed when the button is loading', () => {
      const { unmount } = render(<Button loading />);
      expect(Spinner).toHaveBeenCalled();
      unmount();
    });

    it('should get the proper props', () => {
      const foregroundColor = '#762321';
      const { unmount } = render(<Button loading secondaryColor={foregroundColor} />);
      expectPropsOnChildMock(Spinner, {
        primaryColor: foregroundColor,
        size: expect.any(Number),
      });
      unmount();
    });

    it('should replace the button content', () => {
      const testId = 'test-not-id';
      const { unmount } = render(
        <Button loading>
          <span data-testid={testId} />
        </Button>,
      );
      expect(screen.queryByTestId(testId)).toBeNull();
      unmount();
    });
  });

  describe('Button icon', () => {
    it('should be displayed when the icon prop is provided', () => {
      const icon = 'acv';
      const { unmount } = render(<Button icon={icon} />);
      expect(Icon).toHaveBeenCalled();
      expectPropsOnChildMock(Icon, { icon });
      unmount();
    });

    it('should have no margin right when no children are passed to the button', () => {
      const icon = 'acv';
      const { unmount } = render(<Button icon={icon} />);
      expectPropsOnChildMock(Icon, {
        style: expect.objectContaining({
          marginRight: 0,
        }),
      });
      unmount();
    });

    it('should have a margin right when children are passed to the button', () => {
      const icon = 'acv';
      const { unmount } = render(<Button icon={icon}>Test</Button>);
      expect(
        ((Icon as jest.Mock).mock.calls[0] as IconProps[])[0].style?.marginRight,
      ).toBeGreaterThan(0);
      unmount();
    });

    it('should have the same color as the foreground of the button', () => {
      const secondaryColor = '#ff1155';
      const { unmount } = render(
        <Button icon='acv' secondaryColor={secondaryColor}>
          Test
        </Button>,
      );
      expectPropsOnChildMock(Icon, { primaryColor: secondaryColor });
      unmount();
    });
  });
});
