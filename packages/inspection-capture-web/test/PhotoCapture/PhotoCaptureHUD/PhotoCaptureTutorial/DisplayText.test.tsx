import { render, screen } from '@testing-library/react';
import { DisplayText } from '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDTutorial';

const TITLE_TEST_ID = 'title';
const TEXT_TEST_ID = 'text';

describe('DisplayText component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a title', () => {
    const { unmount } = render(<DisplayText tutorialStep={null} />);

    expect(screen.getByTestId(TITLE_TEST_ID).textContent).toBe(`photo.hud.tutorial.title`);

    unmount();
  });

  it('should display a text', () => {
    const tutorialStepProp = null;
    const { unmount } = render(<DisplayText tutorialStep={tutorialStepProp} />);

    expect(screen.getByTestId(`${TEXT_TEST_ID}0`).textContent).toBe(
      `photo.hud.tutorial.${tutorialStepProp}`,
    );

    unmount();
  });
});
