jest.mock('../../src/icons', () => ({
  Icon: jest.fn(() => <></>),
}));

import '@testing-library/jest-dom';
import { changeAlpha } from '@monkvision/common';
import { fireEvent, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Checkbox, Icon } from '../../src';

const CHECKBOX_TEST_ID = 'checkbox-btn';

describe('Checkbox component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display managed checkbox', () => {
    const checked = true;
    const onChange = jest.fn();
    const { unmount, rerender } = render(<Checkbox checked={checked} onChange={onChange} />);

    let checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(!checked);

    rerender(<Checkbox checked={!checked} onChange={onChange} />);
    checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
    onChange.mockClear();
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(checked);

    unmount();
  });

  it('should be unchecked by default', () => {
    const onChange = jest.fn();
    const { unmount } = render(<Checkbox onChange={onChange} />);

    const checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);

    unmount();
  });

  it('should disable the checkbox when disabled is set to true', () => {
    const onChange = jest.fn();
    const { unmount } = render(<Checkbox disabled={true} onChange={onChange} />);

    const checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();

    unmount();
  });

  it('should display the labelon the screen', () => {
    const label = 'test-label';
    const { unmount } = render(<Checkbox label={label} />);

    expect(screen.queryByText(label)).not.toBeNull();

    unmount();
  });

  it('should have the proper style when unchecked', () => {
    const tertiaryColor = '#012345';
    const alphaChanged = '#123456';
    (changeAlpha as jest.Mock).mockImplementation(() => alphaChanged);
    const { unmount } = render(<Checkbox tertiaryColor={tertiaryColor} checked={false} />);

    expect(changeAlpha).toHaveBeenCalledWith(tertiaryColor, 0.5);
    const checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
    expect(checkbox).toHaveStyle({
      backgroundColor: alphaChanged,
      borderColor: tertiaryColor,
    });
    expect(Icon).not.toHaveBeenCalled();

    unmount();
  });

  it('should have the proper colors when checked', () => {
    const primaryColor = '#654321';
    const secondaryColor = '#009988';
    const { unmount } = render(
      <Checkbox primaryColor={primaryColor} secondaryColor={secondaryColor} checked={true} />,
    );

    const checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
    expect(checkbox).toHaveStyle({
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    });
    expectPropsOnChildMock(Icon, { icon: 'check', primaryColor: secondaryColor });

    unmount();
  });
});
