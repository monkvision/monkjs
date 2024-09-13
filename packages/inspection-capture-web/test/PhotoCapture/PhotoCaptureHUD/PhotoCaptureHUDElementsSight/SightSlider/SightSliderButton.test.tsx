import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, ButtonProps } from '@monkvision/common-ui-web';
import { ImageStatus } from '@monkvision/types';
import { SightSliderButton, SightSliderButtonProps } from '../../../../../src';

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

  (
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
      {
        status: ImageStatus.SUCCESS,
        icon: 'check-circle',
        primaryColor: 'primary',
        disabled: true,
      },
      {
        status: ImageStatus.UPLOAD_FAILED,
        icon: 'wifi-off',
        primaryColor: 'alert-dark',
        disabled: false,
      },
      {
        status: ImageStatus.UPLOAD_ERROR,
        icon: 'sync-problem',
        primaryColor: 'alert-dark',
        disabled: false,
      },
      {
        status: ImageStatus.NOT_COMPLIANT,
        icon: 'error',
        primaryColor: 'alert-dark',
        disabled: false,
      },
      { status: null, icon: undefined, primaryColor: 'background-base', disabled: false },
    ] as Array<SightSliderButtonProps & ButtonProps>
  ).forEach(({ status, icon, primaryColor, disabled }) => {
    it(`should properly handle the ${status} status`, () => {
      const { unmount } = render(<SightSliderButton status={status} />);

      expectPropsOnChildMock(Button, { icon, primaryColor, disabled });

      unmount();
    });
  });

  it('should not be disabled if selected', () => {
    const { unmount } = render(<SightSliderButton status={ImageStatus.SUCCESS} isSelected />);

    expectPropsOnChildMock(Button, { disabled: false });

    unmount();
  });
});
