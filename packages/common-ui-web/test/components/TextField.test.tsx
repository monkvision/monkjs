jest.mock('../../src/icons', () => ({
  Icon: jest.fn(() => <></>),
}));
jest.mock('../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));

import '@testing-library/jest-dom';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button, Icon, TextField } from '../../src';

const INPUT_TEST_ID = 'input';
const ROOT_TEST_ID = 'root';

describe('TextField component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a managed input on the screen', () => {
    const value = 'test-value';
    const onChange = jest.fn();
    const { unmount } = render(<TextField value={value} onChange={onChange} />);

    const input = screen.getByTestId<HTMLInputElement>(INPUT_TEST_ID);
    expect(input.value).toEqual(value);
    const newValue = 'new-value-test';
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: newValue } });
    expect(onChange).toHaveBeenCalledWith(newValue);

    unmount();
  });

  it('should pass the onBlur event onto the input component', () => {
    const onBlur = jest.fn();
    const { unmount } = render(<TextField onBlur={onBlur} />);

    const input = screen.getByTestId<HTMLInputElement>(INPUT_TEST_ID);
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();

    unmount();
  });

  it('should display the label of the button', () => {
    const label = 'test-label';
    const { unmount } = render(<TextField label={label} />);

    expect(screen.queryByText(label)).not.toBeNull();

    unmount();
  });

  it('should pass the proper placeholder to the input when focused', () => {
    const placeholder = 'test-placeholder';
    const { unmount } = render(<TextField placeholder={placeholder} />);

    const input = screen.getByTestId<HTMLInputElement>(INPUT_TEST_ID);
    fireEvent.focus(input);
    expect(input.placeholder).toEqual(placeholder);

    unmount();
  });

  it('should not have any placeholder if the input is not focused', () => {
    const { unmount } = render(<TextField placeholder={'placeholder'} />);

    const input = screen.getByTestId<HTMLInputElement>(INPUT_TEST_ID);
    expect(input.placeholder).toEqual('');

    unmount();
  });

  it('should display the unit symbol when the input is focused', () => {
    const unit = '$';
    const { unmount } = render(<TextField unit={unit} />);

    const input = screen.getByTestId<HTMLInputElement>(INPUT_TEST_ID);
    fireEvent.focus(input);
    expect(screen.queryByText(unit)).not.toBeNull();

    unmount();
  });

  it('should not display the unit symbol if the input is not focused', () => {
    const unit = '$';
    const { unmount } = render(<TextField unit={unit} />);

    expect(screen.queryByText(unit)).toBeNull();

    unmount();
  });

  it('should display the asked Icon', () => {
    const icon = 'image';
    const { unmount } = render(<TextField icon={icon} />);

    expectPropsOnChildMock(Icon, { icon });

    unmount();
  });

  it('should not display any Icon if the icon prop is not provided', () => {
    const { unmount } = render(<TextField />);

    expect(Icon).not.toHaveBeenCalled();

    unmount();
  });

  it('should display the assistive text', () => {
    const assistiveText = 'Hello World!!!';
    const { unmount } = render(<TextField assistiveText={assistiveText} />);

    expect(screen.queryByText(assistiveText)).not.toBeNull();

    unmount();
  });

  it('should show a clear input button', () => {
    const onChange = jest.fn();
    const { unmount } = render(<TextField value='test' onChange={onChange} />);

    expectPropsOnChildMock(Button, { icon: 'close', onClick: expect.any(Function) });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      (args) => args[0].icon === 'close',
    )[0];
    expect(onChange).not.toHaveBeenCalled();
    onClick();
    expect(onChange).toHaveBeenCalledWith('');

    unmount();
  });

  it('should not show a clear input button if showClearButton is false', () => {
    const { unmount } = render(<TextField showClearButton={false} />);

    expect(Button).not.toHaveBeenCalled();

    unmount();
  });

  it('should show a clear input button by default', () => {
    const { unmount } = render(<TextField />);

    expectPropsOnChildMock(Button, { icon: 'close' });

    unmount();
  });

  it('should properly disable the input', () => {
    const { unmount } = render(<TextField disabled />);

    const input = screen.getByTestId<HTMLInputElement>(INPUT_TEST_ID);
    expect(input.disabled).toBe(true);
    expectPropsOnChildMock(Button, { icon: 'close', disabled: true });

    unmount();
  });

  it('should pass the ID to the input', () => {
    const id = 'test-id';
    const { unmount } = render(<TextField id={id} />);

    const input = screen.getByTestId<HTMLInputElement>(INPUT_TEST_ID);
    expect(input.id).toEqual(id);

    unmount();
  });

  it('should pass the styles to the root container', () => {
    const marginTop = 66;
    const { unmount } = render(<TextField style={{ marginTop }} />);

    const input = screen.getByTestId(ROOT_TEST_ID);
    expect(input).toHaveStyle({ marginTop });

    unmount();
  });
});
