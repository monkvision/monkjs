jest.mock('@monkvision/common-ui-web');
jest.mock('react-i18next');
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CrosshairPreview', () => ({
  CrosshairPreview: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CloseupPreview', () => ({
  CloseupPreview: jest.fn(() => <></>),
}));

import { AddDamagePreviewMode } from '../../../src/PhotoCapture/hooks';
import { render } from '@testing-library/react';
import { PhotoCaptureHUDAddDamagePreview } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview';
import { CrosshairPreview } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CrosshairPreview';
import { CloseupPreview } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CloseupPreview';

describe('PhotoCaptureHUDAddDamagePreview component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call CrosshairPreview component when AddDamagePreviewMode is set to DEFAULT', () => {
    const onCancel = jest.fn();
    const { unmount } = render(
      <PhotoCaptureHUDAddDamagePreview
        onCancel={onCancel}
        addDamagePreviewMode={AddDamagePreviewMode.DEFAULT}
      />,
    );
    expect(CrosshairPreview).toHaveBeenCalled();

    unmount();
  });

  it('should call CloseupPreview component when AddDamagePreviewMode is set to CLOSEUP_PREVIEW', () => {
    const onCancel = jest.fn();
    const { unmount } = render(
      <PhotoCaptureHUDAddDamagePreview
        onCancel={onCancel}
        addDamagePreviewMode={AddDamagePreviewMode.CLOSEUP_PREVIEW}
      />,
    );
    expect(CloseupPreview).toHaveBeenCalled();

    unmount();
  });
});
