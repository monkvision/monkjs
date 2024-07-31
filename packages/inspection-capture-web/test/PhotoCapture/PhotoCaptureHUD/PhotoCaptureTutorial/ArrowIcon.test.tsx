import { render } from '@testing-library/react';
import { ArrowIcon } from '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDTutorial';
import { DynamicSVG } from '@monkvision/common-ui-web';
import { TutorialSteps } from '../../../../src/PhotoCapture/hooks';

describe('ArrowIcon component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if tutorialStep is not TutorialSteps.SIGHT_TUTORIAL or TutorialSteps.GUIDELINES', () => {
    const { unmount, rerender } = render(<ArrowIcon tutorialStep={null} />);

    expect(DynamicSVG).not.toHaveBeenCalled();

    rerender(<ArrowIcon tutorialStep={TutorialSteps.WELCOME} />);
    expect(DynamicSVG).not.toHaveBeenCalled();

    rerender(<ArrowIcon tutorialStep={TutorialSteps.SIGHT} />);
    expect(DynamicSVG).not.toHaveBeenCalled();

    unmount();
  });

  it('should return a DynamicSVG if tutorialStep is TutorialSteps.SIGHT_TUTORIAL or TutorialSteps.GUIDELINES', () => {
    const { unmount, rerender } = render(<ArrowIcon tutorialStep={TutorialSteps.GUIDELINE} />);

    expect(DynamicSVG).toHaveBeenCalled();

    rerender(<ArrowIcon tutorialStep={TutorialSteps.SIGHT_TUTORIAL} />);
    expect(DynamicSVG).toHaveBeenCalledTimes(2);

    unmount();
  });
});
