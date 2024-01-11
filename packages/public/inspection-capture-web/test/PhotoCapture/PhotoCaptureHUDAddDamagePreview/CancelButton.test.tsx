jest.mock('@monkvision/common-ui-web');

import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { CancelButton } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CancelButton';

describe('CancelButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call Button component', () => {
    const buttonMock = Button as unknown as jest.Mock;
    const onCancel = jest.fn();
    const { unmount } = render(<CancelButton onCancel={onCancel} />);

    expect(buttonMock).toHaveBeenCalled();
    expect(buttonMock.mock.calls[0][0].children).toEqual('photo.hud.addDamage.cancelBtn');

    unmount();
  });

  it('should translate cancel button', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<CancelButton onCancel={onCancel} />);

    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalled();

    unmount();
  });
});
