import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useMonkAppState, useSearchParams } from '@monkvision/common';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page, PhotoCapturePage } from '../../src/pages';

const appState = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  vehicleType: 'cuv',
  steeringWheel: 'left',
  getCurrentSights: jest.fn(() => [{ id: 'test' }]),
  config: {
    apiDomain: 'test-api-domain',
    format: 'test-format-test',
    quality: 'test-quality-test',
    tasksBySight: 'test-tasksBySight-test',
    startTasksOnComplete: 'test-startTasksOnComplete-test',
    showCloseButton: 'test-showCloseButton-test',
    enforceOrientation: 'test-enforceOrientation-test',
    maxUploadDurationWarning: 'test-maxUploadDurationWarning-test',
    allowSkipRetake: 'test-allowSkipRetake-test',
    enableAddDamage: 'test-enableAddDamage-test',
    enableCompliance: 'test-enableCompliance-test',
    enableCompliancePerSight: 'test-enableCompliancePerSight-test',
    complianceIssues: 'test-complianceIssues-test',
    complianceIssuesPerSight: 'test-complianceIssuesPerSight-test',
    useLiveCompliance: 'test-useLiveCompliance-test',
    customComplianceThresholds: 'test-customComplianceThresholds-test',
    customComplianceThresholdsPerSight: 'test-customComplianceThresholdsPerSight-test',
  },
};

describe('PhotoCapture page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass the proper props to the PhotoCapture component', () => {
    const language = 'test';
    (useTranslation as jest.Mock).mockImplementation(() => ({ i18n: { language } }));
    (useMonkAppState as jest.Mock).mockImplementation(() => appState);
    const { unmount } = render(<PhotoCapturePage />);

    expectPropsOnChildMock(PhotoCapture, {
      apiConfig: { authToken: appState.authToken, apiDomain: appState.config.apiDomain },
      inspectionId: appState.inspectionId,
      lang: language,
      sights: expect.any(Array),
      onComplete: expect.any(Function),
      format: appState.config.format,
      quality: appState.config.quality,
      tasksBySight: appState.config.tasksBySight,
      startTasksOnComplete: appState.config.startTasksOnComplete,
      showCloseButton: appState.config.showCloseButton,
      enforceOrientation: appState.config.enforceOrientation,
      maxUploadDurationWarning: appState.config.maxUploadDurationWarning,
      allowSkipRetake: appState.config.allowSkipRetake,
      enableAddDamage: appState.config.enableAddDamage,
      enableCompliance: appState.config.enableCompliance,
      enableCompliancePerSight: appState.config.enableCompliancePerSight,
      complianceIssues: appState.config.complianceIssues,
      complianceIssuesPerSight: appState.config.complianceIssuesPerSight,
      useLiveCompliance: appState.config.useLiveCompliance,
      customComplianceThresholds: appState.config.customComplianceThresholds,
      customComplianceThresholdsPerSight: appState.config.customComplianceThresholdsPerSight,
    });

    unmount();
  });

  it('should use the proper sights for all vehicle types', () => {
    (useMonkAppState as jest.Mock).mockImplementation(() => appState);
    const { unmount } = render(<PhotoCapturePage />);

    expect(appState.getCurrentSights).toHaveBeenCalled();
    expectPropsOnChildMock(PhotoCapture, {
      sights: appState.getCurrentSights(),
    });

    unmount();
  });

  it('should redirect to the inspection complete page after the inspection', () => {
    (useMonkAppState as jest.Mock).mockImplementation(() => appState);
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
