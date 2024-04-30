import { useComplianceNotification } from '../../../../src';
import { renderHook } from '@testing-library/react-hooks';
import { useMonkState } from '@monkvision/common';
import { ImageStatus } from '@monkvision/types';

const inspectionId = 'test-inspection-id';

describe('useComplianceNotification hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  [ImageStatus.NOT_COMPLIANT, ImageStatus.UPLOAD_FAILED].forEach((status) => {
    it(`should return true if there are some pictures with the ${status} status`, () => {
      (useMonkState as jest.Mock).mockImplementationOnce(() => ({
        state: {
          images: [
            { id: '0', inspectionId: 'test', status: ImageStatus.SUCCESS },
            { id: '1', inspectionId, status: ImageStatus.SUCCESS },
            { id: '2', inspectionId, status: ImageStatus.SUCCESS },
            {
              id: '3',
              inspectionId,
              status: ImageStatus.SUCCESS,
              additionalData: {
                sight_id: 'sight-1',
                created_at: Date.parse('1998-01-01T01:01:01.001Z'),
              },
            },
            {
              id: '4',
              inspectionId,
              status,
              additionalData: {
                sight_id: 'sight-1',
                created_at: Date.parse('2024-01-01T01:01:01.001Z'),
              },
            },
          ],
        },
      }));
      const { result, unmount } = renderHook(useComplianceNotification, {
        initialProps: inspectionId,
      });

      expect(result.current).toBe(true);

      unmount();
    });
  });

  it('should return false if there are no pictures to retake', () => {
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({
      state: {
        images: [
          { id: '0', inspectionId: 'test', status: ImageStatus.UPLOAD_FAILED },
          { id: '1', inspectionId, status: ImageStatus.SUCCESS },
          { id: '2', inspectionId, status: ImageStatus.UPLOADING },
          { id: '3', inspectionId, status: ImageStatus.COMPLIANCE_RUNNING },
          {
            id: '4',
            inspectionId,
            status: ImageStatus.UPLOAD_FAILED,
            additionalData: {
              sight_id: 'sight-1',
              created_at: Date.parse('1998-01-01T01:01:01.001Z'),
            },
          },
          {
            id: '5',
            inspectionId,
            status: ImageStatus.UPLOADING,
            additionalData: {
              sight_id: 'sight-1',
              created_at: Date.parse('2024-01-01T01:01:01.001Z'),
            },
          },
          {
            id: '6',
            inspectionId,
            status: ImageStatus.NOT_COMPLIANT,
            additionalData: {
              sight_id: 'sight-1',
              created_at: Date.parse('2000-01-01T01:01:01.001Z'),
            },
          },
        ],
      },
    }));
    const { result, unmount } = renderHook(useComplianceNotification, {
      initialProps: inspectionId,
    });

    expect(result.current).toBe(false);

    unmount();
  });
});
