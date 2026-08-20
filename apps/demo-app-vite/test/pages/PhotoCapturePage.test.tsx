import { useTranslation } from 'react-i18next';
import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useMonkAppState } from '@monkvision/common';
import { PhotoCapturePage } from '../../src/pages';

const appState = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  vehicleType: '0',
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
    addDamage: 'test-addDamage-test',
    enableCompliance: 'test-enableCompliance-test',
    enableCompliancePerSight: 'test-enableCompliancePerSight-test',
    complianceIssues: 'test-complianceIssues-test',
    complianceIssuesPerSight: 'test-complianceIssuesPerSight-test',
    useLiveCompliance: 'test-useLiveCompliance-test',
    customComplianceThresholds: 'test-customComplianceThresholds-test',
    customComplianceThresholdsPerSight: 'test-customComplianceThresholdsPerSight-test',
    additionalTasks: 'test-additionalTasks-test',
  },
};

describe('PhotoCapture page', () => {
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
      addDamage: appState.config.addDamage,
      enableCompliance: appState.config.enableCompliance,
      enableCompliancePerSight: appState.config.enableCompliancePerSight,
      complianceIssues: appState.config.complianceIssues,
      complianceIssuesPerSight: appState.config.complianceIssuesPerSight,
      useLiveCompliance: appState.config.useLiveCompliance,
      customComplianceThresholds: appState.config.customComplianceThresholds,
      customComplianceThresholdsPerSight: appState.config.customComplianceThresholdsPerSight,
      additionalTasks: appState.config.additionalTasks,
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
});
