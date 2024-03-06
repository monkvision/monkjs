const { CameraFacingMode, CameraResolution, CompressionFormat, UserMediaErrorType } =
  jest.requireActual('@monkvision/camera-web');

export = {
  /* Actual exports */
  CameraFacingMode,
  CameraResolution,
  CompressionFormat,
  UserMediaErrorType,

  /* Mocks */
  Camera: jest.fn(() => <></>),
  SimpleCameraHUD: jest.fn(() => <></>),
  i18nCamera: {},
  getCameraErrorLabel: jest.fn(() => ({ en: '', fr: '', de: '' })),
};
