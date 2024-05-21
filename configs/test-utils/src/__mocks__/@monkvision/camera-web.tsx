const { CameraFacingMode, CameraResolution, UserMediaErrorType } =
  jest.requireActual('@monkvision/camera-web');

export = {
  /* Actual exports */
  CameraFacingMode,
  CameraResolution,
  UserMediaErrorType,

  /* Mocks */
  Camera: jest.fn(() => <></>),
  SimpleCameraHUD: jest.fn(() => <></>),
  i18nCamera: {},
  getCameraErrorLabel: jest.fn(() => ({ en: '', fr: '', de: '' })),
};
