import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { SightGuidelineButton } from '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight/SightGuideline';

function createProps() {
  return {
    sightId: 'sightId-test-1',
    guidelines: [
      {
        en: 'en-test',
        fr: 'fr-test',
        de: 'de-test',
        nl: 'nl-test',
        sightIds: ['sightId-test-1', 'sightId-test-2'],
        information: 'info-test',
      },
    ],
    enableAddDamage: true,
    enableSightGuideline: true,
  };
}

describe('SightGuidelineButton component', () => {
  it('should be disabled and not visible when enableSightGuideline is false', () => {
    const props = createProps();
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ i18n: { language: 'en' } }));
    const { unmount } = render(
      <SightGuidelineButton
        sightId={props.sightId}
        sightGuidelines={props.guidelines}
        enableSightGuideline={false}
      />,
    );

    expectPropsOnChildMock(Button, {
      style: { visibility: 'hidden', fontSize: 14 },
      disabled: true,
    });

    unmount();
  });

  it('should display a Button with the proper label', () => {
    const props = createProps();
    const { unmount } = render(
      <SightGuidelineButton
        sightId={props.sightId}
        sightGuidelines={props.guidelines}
        enableSightGuideline={props.enableSightGuideline}
      />,
    );

    expectPropsOnChildMock(Button, { children: props.guidelines[0].en });

    unmount();
  });
});
