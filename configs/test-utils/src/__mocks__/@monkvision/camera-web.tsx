const { CameraFacingMode, UserMediaErrorType } = jest.requireActual('@monkvision/camera-web');

export = {
  /* Actual exports */
  CameraFacingMode,
  UserMediaErrorType,

  /* Mocks */
  Camera: jest.fn(() => <></>),
  SimpleCameraHUD: jest.fn(() => <></>),
  i18nCamera: {},
  getCameraErrorLabel: jest.fn(() => ({ en: '', fr: '', de: '' })),
  useCameraPermission: jest.fn(() => ({
    requestCameraPermission: jest.fn(() => Promise.resolve()),
  })),
};
