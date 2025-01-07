import '@testing-library/jest-dom';
import {
  expectComponentToPassDownClassNameToHTMLElement,
  expectComponentToPassDownOtherPropsToHTMLElement,
  expectComponentToPassDownRefToHTMLElement,
  expectComponentToPassDownStyleToHTMLElement,
} from '@monkvision/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { RecordVideoButton } from '../../src';
import { useInteractiveStatus } from '@monkvision/common';
import { InteractiveStatus } from '@monkvision/types';

const RECORD_VIDEO_BUTTON_TEST_ID = 'record-video-button';

describe('RecordVideoButton component', () => {
  it('should take the size prop into account', () => {
    const size = 556;
    const { unmount } = render(<RecordVideoButton size={size} />);

    const buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl).toHaveStyle({
      boxSizing: 'border-box',
      width: `${size}px`,
      height: `${size}px`,
    });

    unmount();
  });

  it('should have a default size of 80', () => {
    const { unmount } = render(<RecordVideoButton />);

    const buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl).toHaveStyle({
      width: '80px',
      height: '80px',
    });

    unmount();
  });

  it('should switch to red when recording the video', () => {
    const { rerender, unmount } = render(<RecordVideoButton />);

    let buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl.children.item(0)).not.toHaveStyle({ backgroundColor: '#cb0000' });
    rerender(<RecordVideoButton isRecording />);
    buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl.children.item(0)).toHaveStyle({ backgroundColor: '#cb0000' });

    unmount();
  });

  it('should display the given tooltip', () => {
    const tooltip = 'test-tooltip test';
    const { unmount } = render(<RecordVideoButton tooltip={tooltip} />);

    expect(screen.queryByText(tooltip)).not.toBeNull();

    unmount();
  });

  it('should have a cursor pointer', () => {
    const { unmount } = render(<RecordVideoButton />);
    const buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl).toHaveStyle({ cursor: 'pointer' });
    unmount();
  });

  it('should pass down the disabled prop', () => {
    const { unmount, rerender } = render(<RecordVideoButton />);
    let buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl).not.toHaveAttribute('disabled');
    rerender(<RecordVideoButton disabled />);
    buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl).toHaveAttribute('disabled');
    unmount();
  });

  it('should pass the disabled prop to the useInteractiveStatus hook', () => {
    const { unmount, rerender } = render(<RecordVideoButton />);
    const useInteractiveStatusMock = useInteractiveStatus as jest.Mock;
    expect(useInteractiveStatusMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
      }),
    );
    useInteractiveStatusMock.mockClear();
    rerender(<RecordVideoButton disabled />);
    expect(useInteractiveStatusMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
    );
    unmount();
  });

  it('should have the proper style when disabled', () => {
    const useInteractiveStatusMock = useInteractiveStatus as jest.Mock;
    const disabledStyle = { cursor: 'default', opacity: 0.75 };
    useInteractiveStatusMock.mockImplementationOnce(() => ({
      status: InteractiveStatus.DEFAULT,
      eventHandlers: {},
    }));
    const { unmount, rerender } = render(<RecordVideoButton />);
    let buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl).not.toHaveStyle(disabledStyle);

    useInteractiveStatusMock.mockImplementationOnce(() => ({
      status: InteractiveStatus.DISABLED,
      eventHandlers: {},
    }));
    rerender(<RecordVideoButton />);
    buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
    expect(buttonEl).toHaveStyle(disabledStyle);
    unmount();
  });

  it('should pass the component handlers to the useInteractiveStatus hook and then to the button', () => {
    const onMouseUp = jest.fn();
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const onMouseDown = jest.fn();
    const { unmount } = render(
      <RecordVideoButton
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
    const buttonEl = screen.getByTestId(RECORD_VIDEO_BUTTON_TEST_ID);
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

  it('should pass down the class name to the button', () => {
    expectComponentToPassDownClassNameToHTMLElement(RecordVideoButton, RECORD_VIDEO_BUTTON_TEST_ID);
  });

  it('should pass down the ref to the button', () => {
    expectComponentToPassDownRefToHTMLElement(RecordVideoButton, RECORD_VIDEO_BUTTON_TEST_ID);
  });

  it('should pass down the style to the button', () => {
    expectComponentToPassDownStyleToHTMLElement(RecordVideoButton, RECORD_VIDEO_BUTTON_TEST_ID);
  });

  it('should pass down other props to the button', () => {
    expectComponentToPassDownOtherPropsToHTMLElement(
      RecordVideoButton,
      RECORD_VIDEO_BUTTON_TEST_ID,
    );
  });
});
