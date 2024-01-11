jest.mock('@monkvision/common-ui-web');
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/DamageCounter', () => ({
  DamageCounter: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CancelButton', () => ({
  CancelButton: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { CrosshairPreview } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CrosshairPreview';
import { CancelButton } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CancelButton';
import { DamageCounter } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/DamageCounter';

describe('CrosshairPreview component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render 4 components: DynamicSVG, DamageCounter, CancelButton, Button', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<CrosshairPreview onCancel={onCancel} />);
    expect(DynamicSVG).toHaveBeenCalled();
    expect(DamageCounter).toHaveBeenCalled();
    expect(CancelButton).toHaveBeenCalled();
    expect(Button).toHaveBeenCalled();

    unmount();
  });
});
