import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { monkLogoSVG } from '../../../src/assets/logos.asset';
import { VideoCaptureIntroLayout } from '../../../src/VideoCapture/VideoCaptureIntroLayout';

describe('VideoCaptureIntroLayout component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the Monk Logo', () => {
    const { unmount } = render(<VideoCaptureIntroLayout />);

    expectPropsOnChildMock(DynamicSVG, { svg: monkLogoSVG });

    unmount();
  });

  it('should not display a backdrop by default', () => {
    const { container, unmount } = render(<VideoCaptureIntroLayout />);

    expect(container.children.length).toEqual(1);
    expect(container.children.item(0)).not.toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });

    unmount();
  });

  it('should display a backdrop behind it if asked to', () => {
    const { container, unmount } = render(<VideoCaptureIntroLayout showBackdrop />);

    expect(container.children.length).toEqual(1);
    expect(container.children.item(0)).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });

    unmount();
  });

  it('should display the title on the screen', () => {
    const { unmount } = render(<VideoCaptureIntroLayout />);

    expect(screen.queryByText('video.introduction.title')).not.toBeNull();

    unmount();
  });

  it('should display the children on the screen', () => {
    const testId = 'test-id';
    const { unmount } = render(
      <VideoCaptureIntroLayout>
        <div data-testid={testId}></div>
      </VideoCaptureIntroLayout>,
    );

    expect(screen.queryByTestId(testId)).not.toBeNull();

    unmount();
  });

  it('should display a confirm button on the screen and pass it down the props', () => {
    const confirmButtonProps = { children: 'hello', onClick: () => {} };
    const { unmount } = render(<VideoCaptureIntroLayout confirmButtonProps={confirmButtonProps} />);

    expectPropsOnChildMock(Button, confirmButtonProps);

    unmount();
  });
});
