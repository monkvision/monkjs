import { getValidCameraDeviceIds } from '../../../../src/Camera/hooks/utils';
import { mockGetUserMedia } from '../../../mocks';

describe('getValidCameraDeviceIds util function', () => {
  it('should return valid camera device IDs based on constraints', async () => {
    const gumMock = mockGetUserMedia();
    const devices = [
      { kind: 'videoinput', label: 'Front Camera', deviceId: 'frontDeviceId' },
      { kind: 'videoinput', label: 'Rear Camera', deviceId: 'rearDeviceId' },
      { kind: 'videoinput', label: 'Wide Angle Camera', deviceId: 'wideDeviceId' },
      { kind: 'videoinput', label: 'Telephoto Angle Camera', deviceId: 'telephotoDeviceId' },
    ];
    gumMock?.enumerateDevicesSpy.mockResolvedValue(devices);
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 123, height: 456 },
    };
    const validDeviceIds = await getValidCameraDeviceIds(constraints);

    expect(validDeviceIds).toEqual([devices[0].deviceId, devices[1].deviceId]); // Adjust this expectation based on your logic
    expect(gumMock.getUserMediaSpy).toHaveBeenCalledWith(constraints);
    expect(gumMock.enumerateDevicesSpy).toHaveBeenCalled();
  });
});
