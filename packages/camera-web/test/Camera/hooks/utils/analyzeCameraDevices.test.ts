import { analyzeCameraDevices } from '../../../../src/Camera/hooks/utils';
import { mockGetUserMedia } from '../../../mocks';

describe('analyzeCameraDevices util function', () => {
  it('should return the list of all videoinput devices', async () => {
    const gumMock = mockGetUserMedia();
    const devices = [
      { kind: 'videoinput', label: 'Front Camera', deviceId: 'frontDeviceId' },
      { kind: 'videoinput', label: 'Rear Camera', deviceId: 'rearDeviceId' },
      { kind: 'audioinput', label: 'Mic One', deviceId: 'micOneDeviceId' },
      { kind: 'audioinput', label: 'Mic Two', deviceId: 'micTwoDeviceId' },
    ];
    gumMock?.enumerateDevicesSpy.mockResolvedValue(devices);
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 123, height: 456 },
    };
    const deviceDetails = await analyzeCameraDevices(constraints);

    expect(deviceDetails).toEqual(
      expect.objectContaining({
        availableDevices: [devices[0], devices[1]],
      }),
    );
  });

  ['Wide', 'Telephoto', 'Triple', 'Dual', 'Ultra'].forEach((blacklistedKeyword) => {
    it(`should filter out the "${blacklistedKeyword}" cameras from valid devices`, async () => {
      const gumMock = mockGetUserMedia();
      const devices = [
        { kind: 'videoinput', label: 'Valid Camera 1', deviceId: '1' },
        { kind: 'videoinput', label: 'Valid Camera 2', deviceId: '2' },
        { kind: 'videoinput', label: `Test ${blacklistedKeyword} Camera`, deviceId: 'test' },
        { kind: 'videoinput', label: 'Valid Camera 3', deviceId: '3' },
      ];
      gumMock?.enumerateDevicesSpy.mockResolvedValue(devices);
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: { width: 123, height: 456 },
      };
      const deviceDetails = await analyzeCameraDevices(constraints);

      expect(deviceDetails).toEqual(
        expect.objectContaining({
          validDeviceIds: ['1', '2', '3'],
        }),
      );
    });
  });
});
