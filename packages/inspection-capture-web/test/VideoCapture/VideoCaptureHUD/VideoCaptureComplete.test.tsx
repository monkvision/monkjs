jest.mock('@monkvision/common-ui-web', () => ({
  ...jest.requireActual('@monkvision/common-ui-web'),
  Button: jest.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import {
  VideoCaptureComplete,
  VideoCaptureCompleteProps,
} from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureComplete/VideoCaptureComplete';

function createProps(): VideoCaptureCompleteProps {
  return {
    onComplete: jest.fn(),
  };
}

describe('VideoCaptureComplete component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the title using the video.complete.title translation key', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureComplete {...props} />);

    expect(screen.getByText('video.complete.title')).toBeDefined();

    unmount();
  });

  it('should display the text using the video.complete.text translation key', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureComplete {...props} />);

    expect(screen.getByText('video.complete.text')).toBeDefined();

    unmount();
  });

  it('should display a Button with the video.complete.button translation', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureComplete {...props} />);

    expect(Button).toHaveBeenCalled();
    expect(screen.getByText('video.complete.button')).toBeDefined();

    unmount();
  });

  it('should call onComplete when the button is clicked', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureComplete {...props} />);

    fireEvent.click(screen.getByText('video.complete.button'));
    expect(props.onComplete).toHaveBeenCalled();

    unmount();
  });

  it('should render without crashing when onComplete is not provided', () => {
    const { unmount } = render(<VideoCaptureComplete />);

    expect(screen.getByText('video.complete.title')).toBeDefined();
    expect(screen.getByText('video.complete.text')).toBeDefined();
    expect(screen.getByText('video.complete.button')).toBeDefined();

    unmount();
  });

  it('should pass onComplete to the Button onClick', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureComplete {...props} />);

    expectPropsOnChildMock(Button, { onClick: props.onComplete });

    unmount();
  });
});
