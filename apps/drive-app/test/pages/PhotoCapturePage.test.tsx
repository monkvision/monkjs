import { Sight, TaskName, VehicleType } from '@monkvision/types';

jest.mock('../../src/config', () => ({
  getSights: jest.fn(() => [
    { id: 'test-1', tasks: [TaskName.DAMAGE_DETECTION] },
    { id: 'test-2', tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS] },
  ]),
  getTasksBySight: jest.fn(() => ({
    test: [TaskName.DAMAGE_DETECTION, TaskName.HUMAN_IN_THE_LOOP],
  })),
  enableCompliancePerSight: { hello: 'world' },
}));

import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useMonkApplicationState, useSearchParams } from '@monkvision/common';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page, PhotoCapturePage } from '../../src/pages';
import { complianceIssuesPerSight, getSights, getTasksBySight } from '../../src/config';

const appState = {
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
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appState);
    const { unmount } = render(<PhotoCapturePage />);

    expectPropsOnChildMock(PhotoCapture, {
      apiConfig: { authToken: appState.authToken, apiDomain: 'REACT_APP_API_DOMAIN' },
      inspectionId: appState.inspectionId,
      lang: language,
      sights: expect.any(Array),
      onComplete: expect.any(Function),
    });

    unmount();
  });

  it('should use the proper sights for all vehicle types', () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appState);
    const { unmount } = render(<PhotoCapturePage />);

    expect(getSights).toHaveBeenCalledWith(appState.vehicleType, appState.steeringWheel);
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

  it('should pass the proper tasksBySight value', () => {
    const { unmount } = render(<PhotoCapturePage />);

    expect(getSights).toHaveBeenCalledWith(appState.vehicleType, appState.steeringWheel);
    const sights = (getSights as jest.Mock).mock.results[0].value;
    expect(getTasksBySight).toHaveBeenCalledWith(sights);
    const tasksBySight = (getTasksBySight as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(PhotoCapture, {
      sights: expect.any(Array),
      tasksBySight,
    });

    unmount();
  });

  it('should pass the proper complianceIssuesPerSight value', () => {
    const { unmount } = render(<PhotoCapturePage />);

    expectPropsOnChildMock(PhotoCapture, {
      sights: expect.any(Array),
      complianceIssuesPerSight,
    });

    unmount();
  });

  it('should redirect to the inspection complete page after the inspection', () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appState);
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
