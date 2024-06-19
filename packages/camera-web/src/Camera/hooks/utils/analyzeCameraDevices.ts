function isVideoRecordingDevice(device: MediaDeviceInfo): boolean {
  return device.kind === 'videoinput';
}

function isValidCamera(device: MediaDeviceInfo): boolean {
  return (
    !device.label.includes('Wide') &&
    !device.label.includes('Telephoto') &&
    !device.label.includes('Triple') &&
    !device.label.includes('Dual') &&
    !device.label.includes('Ultra')
  );
}

/**
 * Result of the analyzeCameraDevices utility function.
 */
export interface CameraDevicesDetails {
  /**
   * The list of all available videoinput camera devices on the user's phone.
   */
  availableDevices: MediaDeviceInfo[];
  /**
   * The list of valid camera device IDs that can be used to take pictures.
   */
  validDeviceIds: string[];
}

/**
 * Analyzes the available camera devices on the current user's phone.
 */
export async function analyzeCameraDevices(
  constraints: MediaStreamConstraints,
): Promise<CameraDevicesDetails> {
  const str = await navigator.mediaDevices.getUserMedia(constraints);
  const allDevices = await navigator.mediaDevices.enumerateDevices();
  const availableDevices = allDevices.filter((deviceInfo) => isVideoRecordingDevice(deviceInfo));
  const validDeviceIds = availableDevices
    .filter((deviceInfo) => isValidCamera(deviceInfo))
    .map((deviceInfo) => deviceInfo.deviceId);

  str.getTracks().forEach((track) => track.stop());
  return { availableDevices, validDeviceIds };
}
