import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { MonkDefaultPalette, useMonkTheme } from '@monkvision/common';
import { monkLogoSVG } from '../../../src/assets/logos.asset';
import { VideoCapturePageLayout } from '../../../src/VideoCapture/VideoCapturePageLayout';

const mockBackgroundColor = MonkDefaultPalette.background.base;

describe('VideoCapturePageLayout component', () => {
  beforeEach(() => {
    (useMonkTheme as jest.Mock).mockReturnValue({
      palette: {
        background: {
          base: mockBackgroundColor,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the Monk Logo', () => {
    const { unmount } = render(<VideoCapturePageLayout />);

    expectPropsOnChildMock(DynamicSVG, { svg: monkLogoSVG });

    unmount();
  });

  it('should not display a backdrop by default', () => {
    const { container, unmount } = render(<VideoCapturePageLayout />);

    expect(container.children.length).toEqual(1);
    expect(container.children.item(0)).not.toHaveStyle({ backgroundColor: mockBackgroundColor });

    unmount();
  });

  it('should display a backdrop behind it if asked to', () => {
    const { container, unmount } = render(<VideoCapturePageLayout showBackdrop />);

    expect(container.children.length).toEqual(1);
    expect(container.children.item(0)).toHaveStyle({ backgroundColor: mockBackgroundColor });

    unmount();
  });

  it('should display the title on the screen', () => {
    const { unmount } = render(<VideoCapturePageLayout />);

    expect(screen.queryByText('video.introduction.title')).not.toBeNull();

    unmount();
  });

  it('should not display the title if the showTitle prop is set to false', () => {
    const { unmount } = render(<VideoCapturePageLayout showTitle={false} />);

    expect(screen.queryByText('video.introduction.title')).toBeNull();

    unmount();
  });

  it('should display the children on the screen', () => {
    const testId = 'test-id';
    const { unmount } = render(
      <VideoCapturePageLayout>
        <div data-testid={testId}></div>
      </VideoCapturePageLayout>,
    );

    expect(screen.queryByTestId(testId)).not.toBeNull();

    unmount();
  });

  it('should display a confirm button on the screen and pass it down the props', () => {
    const onClick = jest.fn();
    const confirmButtonProps = { onClick, inverse: false, sample: {} };
    const { unmount } = render(<VideoCapturePageLayout confirmButtonProps={confirmButtonProps} />);

    expect(Button).toHaveBeenCalledWith(expect.objectContaining(confirmButtonProps), undefined);

    unmount();
  });
});
