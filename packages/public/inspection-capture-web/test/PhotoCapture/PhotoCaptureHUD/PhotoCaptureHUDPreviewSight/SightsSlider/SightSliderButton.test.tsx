import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { SightSliderButton } from '../../../../../src';

describe('SightSliderButton component', () => {
  it('should display a Button with the proper label', () => {
    const label = 'hello-test-test';
    const { unmount } = render(<SightSliderButton label={label} />);

    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });

  it('should use the secondary-xdark color by default', () => {
    const { unmount } = render(<SightSliderButton />);

    expectPropsOnChildMock(Button, { primaryColor: 'secondary-xdark' });

    unmount();
  });

  it('should use the primary-base color if the sight is selected', () => {
    const { unmount } = render(<SightSliderButton isSelected />);

    expectPropsOnChildMock(Button, { primaryColor: 'primary-base' });

    unmount();
  });

  it('should use the primary-base color if the sight is taken', () => {
    const { unmount } = render(<SightSliderButton isTaken />);

    expectPropsOnChildMock(Button, { primaryColor: 'primary-base' });

    unmount();
  });

  it('should not have any icon if the sight is not taken', () => {
    const { unmount } = render(<SightSliderButton />);

    expectPropsOnChildMock(Button, { icon: undefined });

    unmount();
  });

  it('should have a check icon if the sight is taken', () => {
    const { unmount } = render(<SightSliderButton isTaken />);

    expectPropsOnChildMock(Button, { icon: 'check' });

    unmount();
  });
});
