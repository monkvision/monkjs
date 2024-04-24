import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { SightSliderButton } from '../../../../../src';
import { ImageStatus } from '@monkvision/types';

describe('SightSliderButton component', () => {
  it('should display a Button with the proper label', () => {
    const label = 'hello-test-test';
    const { unmount } = render(<SightSliderButton label={label} />);

    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });

  it('should use the background-base color by default', () => {
    const { unmount } = render(<SightSliderButton />);

    expectPropsOnChildMock(Button, { primaryColor: 'background-base' });

    unmount();
  });

  it('should use the primary color if the sight is selected', () => {
    const { unmount } = render(<SightSliderButton isSelected />);

    expectPropsOnChildMock(Button, { primaryColor: 'primary' });

    unmount();
  });

  [
    {
      status: ImageStatus.UPLOADING,
      icon: 'processing',
      primaryColor: 'background-base',
      disabled: true,
    },
    {
      status: ImageStatus.COMPLIANCE_RUNNING,
      icon: 'processing',
      primaryColor: 'background-base',
      disabled: true,
    },
    { status: ImageStatus.SUCCESS, icon: 'check-circle', primaryColor: 'primary', disabled: true },
    { status: ImageStatus.UPLOAD_FAILED, icon: 'error', primaryColor: 'alert', disabled: false },
    { status: ImageStatus.NOT_COMPLIANT, icon: 'error', primaryColor: 'alert', disabled: false },
    { status: null, icon: undefined, primaryColor: 'background-base', disabled: false },
  ].forEach(({ status, icon, primaryColor, disabled }) => {
    it(`should properly handle the ${status} status`, () => {
      const { unmount } = render(<SightSliderButton status={status} />);

      expectPropsOnChildMock(Button, { icon, primaryColor, disabled });

      unmount();
    });
  });
});
