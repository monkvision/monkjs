import { renderHook } from '@testing-library/react';
import { sights } from '@monkvision/sights';
import { createEmptyMonkState, useMonkState } from '@monkvision/common';
import { ComplianceIssue, Image, ImageStatus, Inspection } from '@monkvision/types';
import { useComplianceAnalytics, ComplianceAnalyticsParams } from '../../../src/PhotoCapture/hooks';
import { useAnalytics } from '@monkvision/analytics';

function createParams(): ComplianceAnalyticsParams {
  return {
    inspectionId: 'test-inspection-id',
    sights: [
      sights['test-sight-1'],
      sights['test-sight-2'],
      sights['test-sight-3'],
      sights['test-sight-4'],
    ],
  };
}

describe('useComplianceAnalytics hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not send event for the first inspection fetch', () => {
    const initialProps = createParams();
    const state = createEmptyMonkState();
    state.inspections.push({
      id: initialProps.inspectionId,
      images: ['image-1', 'image-2', 'image-3'],
    } as unknown as Inspection);
    state.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'sight1',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        sightId: 'sight2',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'image-3',
        inspectionId: initialProps.inspectionId,
        sightId: 'sight2',
        status: ImageStatus.NOT_COMPLIANT,
        complianceIssues: [ComplianceIssue.NO_VEHICLE],
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { unmount } = renderHook(useComplianceAnalytics, { initialProps });
    const { trackEvent } = (useAnalytics as jest.Mock).mock.results[0].value;
    expect(trackEvent).not.toBeCalled();

    unmount();
  });
});
