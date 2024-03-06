function isValidCamera(device: MediaDeviceInfo) {
  return (
    device.kind === 'videoinput' &&
    !device.label.includes('Wide') &&
    !device.label.includes('Telephoto') &&
    !device.label.includes('Triple') &&
    !device.label.includes('Dual') &&
    !device.label.includes('Ultra')
  );
}
/**
 * Retrieves the valid camera device IDs based on the specified constraints.
 */
export async function getValidCameraDeviceIds(
  constraints: MediaStreamConstraints,
): Promise<string[]> {
  const str = await navigator.mediaDevices.getUserMedia(constraints);
  const devices = await navigator.mediaDevices.enumerateDevices();
  const validCameraDeviceIds = devices
    .filter((device) => isValidCamera(device))
    .map((device) => device.deviceId);

  str.getTracks().forEach((track) => track.stop());
  return validCameraDeviceIds;
}
