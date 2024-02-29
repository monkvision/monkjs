jest.mock('../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));

import '@testing-library/jest-dom';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { BackdropDialog, Button } from '../../src';

const BACKDROP_TEST_ID = 'backdrop';

describe('BackdropDialog component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not be shown by default', () => {
    const { unmount } = render(<BackdropDialog />);
    expect(screen.queryByTestId(BACKDROP_TEST_ID)).toBeNull();
    unmount();
  });

  it('should show a backdrop on top of the screen when shown', () => {
    const { unmount } = render(<BackdropDialog show={true} />);
    const backdrop = screen.getByTestId(BACKDROP_TEST_ID);
    expect(backdrop).toHaveStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    });
    unmount();
  });

  it('should take the backdropOpacity prop into account', () => {
    const backdropOpacity = 0.2;
    const { unmount } = render(<BackdropDialog show={true} backdropOpacity={backdropOpacity} />);
    const backdrop = screen.getByTestId(BACKDROP_TEST_ID);
    expect(backdrop).toHaveStyle({
      backgroundColor: `rgba(0,0,0,${backdropOpacity})`,
    });
    unmount();
  });

  it('should have a backdropOpacity of 0.7 by default', () => {
    const { unmount } = render(<BackdropDialog show={true} />);
    const backdrop = screen.getByTestId(BACKDROP_TEST_ID);
    expect(backdrop).toHaveStyle({
      backgroundColor: 'rgba(0,0,0,0.7)',
    });
    unmount();
  });

  it('should display the given message on the screen', () => {
    const message = 'Hello world!';
    const { unmount } = render(<BackdropDialog show={true} message={message} />);
    expect(screen.queryByText(message)).not.toBeNull();
    unmount();
  });

  it('should display a cancel button with the given label', () => {
    const label = 'Hola amigo';
    const { unmount } = render(<BackdropDialog show={true} cancelLabel={label} />);
    expect(Button).toHaveBeenCalled();
    expectPropsOnChildMock(Button, { children: label });
    unmount();
  });

  it('should display a confirm button with the given label', () => {
    const label = 'Buenos dias';
    const { unmount } = render(<BackdropDialog show={true} confirmLabel={label} />);
    expect(Button).toHaveBeenCalled();
    expectPropsOnChildMock(Button, { children: label });
    unmount();
  });

  it('should pass the onConfirm callback to the confirm button', () => {
    const label = 'ok';
    const handleConfirm = jest.fn();
    const { unmount } = render(
      <BackdropDialog show={true} confirmLabel={label} onConfirm={handleConfirm} />,
    );
    expect(Button).toHaveBeenCalled();
    const props = (Button as unknown as jest.Mock).mock.calls.find(
      (args) => args[0]?.children === label,
    )?.[0];
    expect(props?.onClick).toBeDefined();
    props.onClick();
    expect(handleConfirm).toHaveBeenCalled();
    unmount();
  });

  it('should pass the onCancel callback to the cancel button', () => {
    const label = 'ok';
    const handleCancel = jest.fn();
    const { unmount } = render(
      <BackdropDialog show={true} cancelLabel={label} onCancel={handleCancel} />,
    );
    expect(Button).toHaveBeenCalled();
    const props = (Button as unknown as jest.Mock).mock.calls.find(
      (args) => args[0]?.children === label,
    )?.[0];
    expect(props?.onClick).toBeDefined();
    props.onClick();
    expect(handleCancel).toHaveBeenCalled();
    unmount();
  });

  it('should take the confirmIcon prop into account', () => {
    const label = 'ok';
    const icon = 'check';
    const { unmount } = render(
      <BackdropDialog show={true} confirmLabel={label} confirmIcon={icon} />,
    );
    expectPropsOnChildMock(Button, {
      children: label,
      icon,
    });
    unmount();
  });

  it('should have no confirmIcon by default', () => {
    const label = 'ok';
    const { unmount } = render(<BackdropDialog show={true} confirmLabel={label} />);
    expectPropsOnChildMock(Button, {
      children: label,
      icon: undefined,
    });
    unmount();
  });

  it('should take the cancelIcon prop into account', () => {
    const label = 'ok';
    const icon = 'check';
    const { unmount } = render(
      <BackdropDialog show={true} cancelLabel={label} cancelIcon={icon} />,
    );
    expectPropsOnChildMock(Button, {
      children: label,
      icon,
    });
    unmount();
  });

  it('should have no cancelIcon by default', () => {
    const label = 'ok';
    const { unmount } = render(<BackdropDialog show={true} cancelLabel={label} />);
    expectPropsOnChildMock(Button, {
      children: label,
      icon: undefined,
    });
    unmount();
  });

  it('should display the given dialog if provided', () => {
    const testId = 'hello-test-world';
    const customDialog = <div data-testid={testId}>Hello</div>;
    const { unmount } = render(<BackdropDialog show={true} dialog={customDialog} />);
    expect(screen.queryByTestId(testId)).not.toBeNull();
    unmount();
  });
});
