import { Sight, TaskName, VehicleType } from '@monkvision/types';

jest.mock('../../src/config', () => ({
  getSights: jest.fn(() => [
    { id: 'test-1', tasks: [TaskName.DAMAGE_DETECTION] },
    { id: 'test-2', tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS] },
  ]),
}));

import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useMonkAppParams, useSearchParams } from '@monkvision/common';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page, PhotoCapturePage } from '../../src/pages';
import { getSights } from '../../src/config';

const appParams = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  vehicleType: 'cuv',
  steeringWheel: 'left',
};

describe('PhotoCapture page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

    expect(getSights).toHaveBeenCalledWith(appParams.vehicleType, appParams.steeringWheel);
    expectPropsOnChildMock(PhotoCapture, {
      sights: getSights(VehicleType.SUV, null),
    });

    unmount();
  });

  it('should use live compliance', () => {
    const { unmount } = render(<PhotoCapturePage />);

    expectPropsOnChildMock(PhotoCapture, {
      useLiveCompliance: true,
    });

    unmount();
  });

  it('should allow retakes', () => {
    const { unmount } = render(<PhotoCapturePage />);

    expectPropsOnChildMock(PhotoCapture, {
      allowSkipRetake: true,
    });

    unmount();
  });

  it('should add human in the loop for every sight', () => {
    const { unmount } = render(<PhotoCapturePage />);

    expectPropsOnChildMock(PhotoCapture, {
      sights: expect.any(Array),
      tasksBySight: expect.any(Object),
    });
    const { sights, tasksBySight } = (PhotoCapture as unknown as jest.Mock).mock.calls[0][0];
    sights.forEach((sight: Sight) => {
      expect(tasksBySight[sight.id]).toEqual([...sight.tasks, TaskName.HUMAN_IN_THE_LOOP]);
    });

    unmount();
  });

  it('should redirect to the inspection complete page after the inspection', () => {
    (useMonkAppParams as jest.Mock).mockImplementation(() => appParams);
    const { unmount } = render(<PhotoCapturePage />);

    expect(useNavigate).toHaveBeenCalled();
    const navigate = (useNavigate as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(PhotoCapture, {
      onComplete: expect.any(Function),
    });
    const { onComplete } = (PhotoCapture as unknown as jest.Mock).mock.calls[0][0];
    expect(navigate).not.toHaveBeenCalled();
    onComplete();
    expect(navigate).toHaveBeenCalledWith(Page.INSPECTION_COMPLETE);

    unmount();
  });

  it('should redirect to the redirectLink if `r` is specified in URL param after the inspection', () => {
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
    const redirectLink = 'redirectLinkTest';
    (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
      get: jest.fn(() => redirectLink),
    }));
    const { unmount } = render(<PhotoCapturePage />);
    const navigate = (useNavigate as jest.Mock).mock.results[0].value;
    const { onComplete } = (PhotoCapture as unknown as jest.Mock).mock.calls[0][0];
    onComplete();
    expect(navigate).not.toHaveBeenCalled();
    expect(window.location.href).toEqual(redirectLink);

    unmount();
  });
});
