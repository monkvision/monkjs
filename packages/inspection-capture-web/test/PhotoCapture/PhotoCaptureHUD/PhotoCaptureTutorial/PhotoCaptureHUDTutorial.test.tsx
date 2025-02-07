jest.mock(
  '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight/SightGuideline',
  () => ({
    SightGuideline: jest.fn(() => <></>),
  }),
);

import { render, screen } from '@testing-library/react';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import {
  PhotoCaptureHUDTutorial,
  PhotoCaptureHUDTutorialProps,
  SightGuideline,
} from '../../../../src';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { TutorialSteps } from '../../../../src/PhotoCapture/hooks';
import { AddDamage } from '@monkvision/types';

const BACKDROP_TEST_ID = 'backdrop';
const TITLE_TEST_ID = 'title';
const translationPrefix = 'photo.hud.tutorial';

function createProps(): PhotoCaptureHUDTutorialProps {
  return {
    currentTutorialStep: TutorialSteps.WELCOME,
    onNextTutorialStep: jest.fn(),
    onCloseTutorial: jest.fn(),
    allowSkipTutorial: false,
    sightGuidelines: [],
    sightId: 'test-sight-id',
    addDamage: AddDamage.PART_SELECT,
  };
}

describe('PhotoCaptureHUDTutorial component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not be shown if currentTutorialStep is null', () => {
    const props = createProps();
    render(<PhotoCaptureHUDTutorial {...props} currentTutorialStep={null} />);

    expect(screen.queryByTestId(BACKDROP_TEST_ID)).toBeNull();
  });

  it('should be shown if currentTutorialStep is set', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDTutorial {...props} />);

    expect(screen.queryByTestId(BACKDROP_TEST_ID)).not.toBeNull();

    expect(Button).toHaveBeenCalledTimes(2);
    const nextButton = (Button as unknown as jest.Mock).mock.calls[1][0];
    expect(typeof nextButton.onClick).toBe('function');

    expect(SightGuideline).toHaveBeenCalled();
    expectPropsOnChildMock(SightGuideline, {
      sightId: props.sightId,
      sightGuidelines: props.sightGuidelines,
      disabled: props.currentTutorialStep !== TutorialSteps.GUIDELINE,
      addDamage: AddDamage.PART_SELECT,
    });

    expect(DynamicSVG).not.toHaveBeenCalled();

    expect(screen.getByTestId(TITLE_TEST_ID).textContent).toBe(`${translationPrefix}.title`);

    unmount();
  });

  describe('Sight guideline', () => {
    it('should only render SightGuideline when currentTutorialStep is equal to TutorialSteps.GUIDELINE', () => {
      const props = createProps();
      const { unmount, rerender } = render(<PhotoCaptureHUDTutorial {...props} />);

      expectPropsOnChildMock(SightGuideline, { disabled: true });

      rerender(
        <PhotoCaptureHUDTutorial {...props} currentTutorialStep={TutorialSteps.GUIDELINE} />,
      );
      expectPropsOnChildMock(SightGuideline, { disabled: false });

      rerender(
        <PhotoCaptureHUDTutorial {...props} currentTutorialStep={TutorialSteps.SIGHT_TUTORIAL} />,
      );
      expectPropsOnChildMock(SightGuideline, { disabled: true });

      rerender(<PhotoCaptureHUDTutorial {...props} currentTutorialStep={TutorialSteps.SIGHT} />);
      expectPropsOnChildMock(SightGuideline, { disabled: true });

      unmount();
    });
  });

  describe('Close button', () => {
    it('should disable close button when allowSkipTutorial is false', () => {
      const props = createProps();
      const { unmount } = render(<PhotoCaptureHUDTutorial {...props} allowSkipTutorial={false} />);

      const closeButtonProps = (Button as unknown as jest.Mock).mock.calls[0][0];
      expect(closeButtonProps.disabled).toEqual(true);

      unmount();
    });

    it('should call onCloseTutorial callback when close button is clicked', () => {
      const props = createProps();
      const { unmount } = render(<PhotoCaptureHUDTutorial {...props} />);

      const buttonProps = (Button as unknown as jest.Mock).mock.calls[0][0];
      buttonProps.onClick();
      expect(props.onCloseTutorial).toHaveBeenCalled();

      unmount();
    });
  });

  describe('Arrow Icon', () => {
    it('should only render Arrow SVG when currentTutorialStep is equal to TutorialSteps.GUIDELINE or TutorialSteps.SIGHT_TUTORIAL', () => {
      const props = createProps();
      const { unmount, rerender } = render(
        <PhotoCaptureHUDTutorial {...props} currentTutorialStep={TutorialSteps.WELCOME} />,
      );

      expect(DynamicSVG).not.toHaveBeenCalled();

      rerender(<PhotoCaptureHUDTutorial {...props} currentTutorialStep={TutorialSteps.SIGHT} />);
      expect(DynamicSVG).not.toHaveBeenCalled();

      rerender(
        <PhotoCaptureHUDTutorial {...props} currentTutorialStep={TutorialSteps.GUIDELINE} />,
      );
      expect(DynamicSVG).toHaveBeenCalledTimes(1);

      rerender(
        <PhotoCaptureHUDTutorial {...props} currentTutorialStep={TutorialSteps.SIGHT_TUTORIAL} />,
      );
      expect(DynamicSVG).toHaveBeenCalledTimes(2);

      unmount();
    });
  });

  describe('Next button', () => {
    it('should call onNextTutorialStep callback when next button is clicked', () => {
      const props = createProps();
      const { unmount } = render(<PhotoCaptureHUDTutorial {...props} />);

      const nextButtonProps = (Button as unknown as jest.Mock).mock.calls[1][0];
      nextButtonProps.onClick();
      expect(props.onNextTutorialStep).toHaveBeenCalled();

      unmount();
    });
  });
});
