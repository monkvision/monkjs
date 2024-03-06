jest.mock('../../src/icons', () => ({
  Icon: jest.fn(() => <></>),
}));

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { getRGBAFromString } from '@monkvision/common';
import { getNumberFromCSSProperty } from '@monkvision/test-utils';
import { SwitchButton } from '../../src';

const SWITCH_BTN_TEST_ID = 'switch-btn';
const SWITCH_KNOB_TEST_ID = 'switch-knob';

describe('SwitchButton component', () => {
  it('should take the size prop into account', () => {
    const { unmount, rerender } = render(<SwitchButton size='normal' />);
    let buttonEl = screen.getByTestId(SWITCH_BTN_TEST_ID);
    const normalWidth = getNumberFromCSSProperty(buttonEl.style.width);
    const normalHeight = getNumberFromCSSProperty(buttonEl.style.height);
    rerender(<SwitchButton size='small' />);
    buttonEl = screen.getByTestId(SWITCH_BTN_TEST_ID);
    const smallWidth = getNumberFromCSSProperty(buttonEl.style.width);
    const smallHeight = getNumberFromCSSProperty(buttonEl.style.height);
    expect(Number(smallWidth)).toBeLessThan(Number(normalWidth));
    expect(Number(smallHeight)).toBeLessThan(Number(normalHeight));
    unmount();
  });

  it('should have a normal size by default', () => {
    const { unmount, rerender } = render(<SwitchButton />);
    let buttonEl = screen.getByTestId(SWITCH_BTN_TEST_ID);
    const defaultWidth = getNumberFromCSSProperty(buttonEl.style.width);
    const defaultHeight = getNumberFromCSSProperty(buttonEl.style.height);
    rerender(<SwitchButton size='small' />);
    buttonEl = screen.getByTestId(SWITCH_BTN_TEST_ID);
    const smallWidth = getNumberFromCSSProperty(buttonEl.style.width);
    const smallHeight = getNumberFromCSSProperty(buttonEl.style.height);
    expect(Number(smallWidth)).toBeLessThan(Number(defaultWidth));
    expect(Number(smallHeight)).toBeLessThan(Number(defaultHeight));
    unmount();
  });

  it('should switch on and off the button based on the checked prop', () => {
    const checkedPrimaryColor = '#ff0000';
    const checkedSecondaryColor = '#00ff00';
    const uncheckedPrimaryColor = '#0000ff';
    const uncheckedSecondaryColor = '#ffff00';
    const { unmount, rerender } = render(
      <SwitchButton
        checked={false}
        checkedPrimaryColor={checkedPrimaryColor}
        checkedSecondaryColor={checkedSecondaryColor}
        uncheckedPrimaryColor={uncheckedPrimaryColor}
        uncheckedSecondaryColor={uncheckedSecondaryColor}
      />,
    );
    let buttonEl = screen.getByTestId(SWITCH_KNOB_TEST_ID);
    let knobEl = screen.getByTestId(SWITCH_KNOB_TEST_ID);
    expect(buttonEl).toHaveStyle({
      backgroundColor: getRGBAFromString(uncheckedPrimaryColor),
    });
    expect(knobEl).toHaveStyle({
      backgroundColor: getRGBAFromString(uncheckedSecondaryColor),
    });
    const uncheckedKnobLeftPosition = getNumberFromCSSProperty(knobEl.style.left);

    rerender(
      <SwitchButton
        checked={true}
        checkedPrimaryColor={checkedPrimaryColor}
        checkedSecondaryColor={checkedSecondaryColor}
        uncheckedPrimaryColor={uncheckedPrimaryColor}
        uncheckedSecondaryColor={uncheckedSecondaryColor}
      />,
    );
    buttonEl = screen.getByTestId(SWITCH_KNOB_TEST_ID);
    knobEl = screen.getByTestId(SWITCH_KNOB_TEST_ID);
    expect(buttonEl).toHaveStyle({
      backgroundColor: getRGBAFromString(checkedPrimaryColor),
    });
    expect(knobEl).toHaveStyle({
      backgroundColor: getRGBAFromString(checkedSecondaryColor),
    });
    const checkedKnobLeftPosition = getNumberFromCSSProperty(knobEl.style.left);

    expect(uncheckedKnobLeftPosition).toBeLessThan(checkedKnobLeftPosition);

    unmount();
  });

  it('should call the onSwitch callback when clicked on', () => {
    const onSwitch = jest.fn();
    const checked = true;
    const { unmount } = render(<SwitchButton checked={checked} onSwitch={onSwitch} />);
    const buttonEl = screen.getByTestId(SWITCH_BTN_TEST_ID);
    fireEvent.click(buttonEl);
    expect(onSwitch).toHaveBeenCalledWith(!checked);
    unmount();
  });
});
