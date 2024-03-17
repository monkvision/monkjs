import { useTranslation } from 'react-i18next';

jest.mock('../../src/config', () => ({
  getSights: jest.fn(() => [{ id: 'test' }]),
}));

import { getSights } from '../../src/config';
import { PhotoCapturePage } from '../../src/pages';
import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useMonkAppParams } from '@monkvision/common';
import { VehicleType } from '@monkvision/types';

const appParams = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  vehicleType: '0',
};

describe('PhotoCapture page', () => {
  it('should pass the proper props to the PhotoCapture component', () => {
    const language = 'test';
    (useTranslation as jest.Mock).mockImplementation(() => ({ i18n: { language } }));
    (useMonkAppParams as jest.Mock).mockImplementation(() => appParams);
    const { unmount } = render(<PhotoCapturePage />);

    expectPropsOnChildMock(PhotoCapture, {
      apiConfig: { authToken: appParams.authToken, apiDomain: 'REACT_APP_API_DOMAIN' },
      inspectionId: appParams.inspectionId,
      lang: language,
      sights: expect.any(Array),
      onComplete: expect.any(Function),
    });

    unmount();
  });

  it('should use the proper sights for all vehicle types', () => {
    (useMonkAppParams as jest.Mock).mockImplementation(() => appParams);
    const { unmount } = render(<PhotoCapturePage />);

    expect(getSights).toHaveBeenCalledWith(appParams.vehicleType);
    expectPropsOnChildMock(PhotoCapture, {
      sights: getSights(VehicleType.SUV),
    });

    unmount();
  });
});
