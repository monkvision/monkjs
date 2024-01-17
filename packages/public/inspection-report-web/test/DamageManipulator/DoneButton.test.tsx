jest.mock('@monkvision/common-ui-web');

import { render } from '@testing-library/react';
import { Button } from '@monkvision/common-ui-web';
import { DoneButton } from '../../src/DamageManipulator/DoneButton';

describe('DoneButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a Button and have onConfirm passed as callback', () => {
    const onConfirm = jest.fn();
    const buttonMock = Button as unknown as jest.Mock;
    const { unmount } = render(<DoneButton onConfirm={onConfirm}>Done</DoneButton>);

    const onClickProps = buttonMock.mock.calls[0][0].onClick;
    onClickProps();
    expect(buttonMock).toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
    unmount();
  });
});
