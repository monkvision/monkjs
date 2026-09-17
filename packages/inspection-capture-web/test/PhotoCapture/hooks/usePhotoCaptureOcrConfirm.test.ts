import { renderHook, act } from '@testing-library/react';
import { MileageUnit } from '@monkvision/types';
import { useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { flushPromises } from '@monkvision/test-utils';
import { usePhotoCaptureOcrConfirm } from '../../../src/PhotoCapture/hooks/usePhotoCaptureOcrConfirm';

const mockApiConfig = { authToken: 'test-token', apiDomain: 'test.api.monk.ai' };
const mockInspectionId = 'test-inspection-id';

describe('usePhotoCaptureOcrConfirm', () => {
  let mockUpdateInspectionVehicle: jest.Mock;
  let mockHandleError: jest.Mock;

  beforeEach(() => {
    mockUpdateInspectionVehicle = jest.fn(() => Promise.resolve());
    mockHandleError = jest.fn();
    (useMonkApi as jest.Mock).mockReturnValue({
      updateInspectionVehicle: mockUpdateInspectionVehicle,
    });
    (useMonitoring as jest.Mock).mockReturnValue({
      handleError: mockHandleError,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderOcrConfirmHook() {
    return renderHook(() =>
      usePhotoCaptureOcrConfirm({ inspectionId: mockInspectionId, apiConfig: mockApiConfig }),
    );
  }

  describe('VIN mode', () => {
    it('calls updateInspectionVehicle with the confirmed vin string', async () => {
      const { result } = renderOcrConfirmHook();
      await act(async () => {
        result.current.handleOcrConfirm('ABC123456DEF78901', 'vin', undefined);
        await flushPromises();
      });
      expect(mockUpdateInspectionVehicle).toHaveBeenCalledWith({
        inspectionId: mockInspectionId,
        vehicle: { vin: 'ABC123456DEF78901' },
      });
    });
  });

  describe('odometer mode', () => {
    it('calls updateInspectionVehicle with the parsed value and detected unit', async () => {
      const { result } = renderOcrConfirmHook();
      await act(async () => {
        result.current.handleOcrConfirm('12345 km', 'odometer', undefined);
        await flushPromises();
      });
      expect(mockUpdateInspectionVehicle).toHaveBeenCalledWith({
        inspectionId: mockInspectionId,
        vehicle: { mileageValue: 12345, mileageUnit: MileageUnit.KM },
      });
    });

    it('uses defaultMileageUnit when no unit is detected in the text', async () => {
      const { result } = renderOcrConfirmHook();
      await act(async () => {
        result.current.handleOcrConfirm('99999', 'odometer', MileageUnit.MILES);
        await flushPromises();
      });
      expect(mockUpdateInspectionVehicle).toHaveBeenCalledWith({
        inspectionId: mockInspectionId,
        vehicle: { mileageValue: 99999, mileageUnit: MileageUnit.MILES },
      });
    });

    it('falls back to MileageUnit.KM when no unit is detected and no defaultMileageUnit is provided', async () => {
      const { result } = renderOcrConfirmHook();
      await act(async () => {
        result.current.handleOcrConfirm('99999', 'odometer', undefined);
        await flushPromises();
      });
      expect(mockUpdateInspectionVehicle).toHaveBeenCalledWith({
        inspectionId: mockInspectionId,
        vehicle: { mileageValue: 99999, mileageUnit: MileageUnit.KM },
      });
    });

    it('is a no-op when the odometer text cannot be parsed to a number', async () => {
      const { result } = renderOcrConfirmHook();
      await act(async () => {
        result.current.handleOcrConfirm('no digits', 'odometer', undefined);
        await flushPromises();
      });
      expect(mockUpdateInspectionVehicle).not.toHaveBeenCalled();
    });
  });

  it('is a no-op when mode is undefined', async () => {
    const { result } = renderOcrConfirmHook();
    await act(async () => {
      result.current.handleOcrConfirm('whatever', undefined, undefined);
      await flushPromises();
    });
    expect(mockUpdateInspectionVehicle).not.toHaveBeenCalled();
  });

  it('calls handleError when the API rejects', async () => {
    const apiError = new Error('network failure');
    mockUpdateInspectionVehicle.mockReturnValue(Promise.reject(apiError));
    const { result } = renderOcrConfirmHook();
    await act(async () => {
      result.current.handleOcrConfirm('ABC123', 'vin', undefined);
      await flushPromises();
    });
    expect(mockHandleError).toHaveBeenCalledWith(apiError);
  });
});
