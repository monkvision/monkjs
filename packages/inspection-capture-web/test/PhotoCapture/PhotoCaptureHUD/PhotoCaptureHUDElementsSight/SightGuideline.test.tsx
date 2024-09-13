import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { SightGuideline } from '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight/SightGuideline';
import { getLanguage } from '@monkvision/common';
import { AddDamage } from '@monkvision/types';

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
    addDamage: AddDamage.TWO_SHOT,
    enableSightGuidelines: true,
  };
}

describe('SightGuideline component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be display when enableSightGuideline is false', () => {
    const props = createProps();
    (getLanguage as jest.Mock).mockImplementationOnce(() => 'en');
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ i18n: { language: 'en' } }));
    const { unmount } = render(
      <SightGuideline
        sightId={props.sightId}
        sightGuidelines={props.guidelines}
        enableSightGuidelines={false}
      />,
    );
    expect(Button).not.toHaveBeenCalled();

    unmount();
  });

  it('should display a Button with the proper label', () => {
    const props = createProps();
    (getLanguage as jest.Mock).mockImplementationOnce(() => 'en');
    const { unmount } = render(
      <SightGuideline
        sightId={props.sightId}
        sightGuidelines={props.guidelines}
        enableSightGuidelines={props.enableSightGuidelines}
      />,
    );

    expectPropsOnChildMock(Button, { children: props.guidelines[0].en });

    unmount();
  });
});
