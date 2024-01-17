import { expectPropsOnChildMock } from '@monkvision/test-utils';

jest.mock('@monkvision/common-ui-web');

import { render, screen } from '@testing-library/react';
import { PartPictureButton } from '../../src/DamageManipulator/PartPictureButton';
import { Button } from '@monkvision/common-ui-web';

describe('PartPictureButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a button and no-part by default', () => {
    const buttonMock = Button as unknown as jest.Mock;

    const { unmount } = render(<PartPictureButton />);

    expect(buttonMock).toHaveBeenCalled();
    const partNameExpected = screen.getByTestId('part-name').innerHTML;
    expect(partNameExpected).toEqual('no-part');

    unmount();
  });

  it('should render part name when provided', () => {
    const partName = 'hood';

    const { unmount } = render(<PartPictureButton partName={'hood'} />);

    const partNameExpected = screen.getByTestId('part-name').innerHTML;
    expect(partNameExpected).toEqual(partName);

    unmount();
  });

  it('should get passed onClick callback', () => {
    const onClick = jest.fn();
    const buttonMock = Button as unknown as jest.Mock;

    const { unmount } = render(<PartPictureButton onClick={onClick} />);

    expectPropsOnChildMock(buttonMock, { onClick: expect.any(Function) });
    const onClickProps = buttonMock.mock.calls[0][0].onClick;
    onClickProps();
    expect(onClick).toHaveBeenCalled();

    unmount();
  });
});
