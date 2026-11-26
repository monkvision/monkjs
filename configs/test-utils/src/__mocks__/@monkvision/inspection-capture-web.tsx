const { OcrMode } = jest.requireActual('@monkvision/inspection-capture-web');

export = {
  /* Actual exports */
  OcrMode,
  /* Mocks */
  PhotoCaptureHUDButtons: jest.fn(() => <></>),
  PhotoCaptureHUDAddDamagePreview: jest.fn(() => <></>),
  PhotoCaptureHUDSightPreview: jest.fn(() => <></>),
  SightsCounter: jest.fn(() => <></>),
  AddDamageButton: jest.fn(() => <></>),
  SightsSlider: jest.fn(() => <></>),
  PhotoCaptureHUD: jest.fn(() => <></>),
  PhotoCapture: jest.fn(() => <></>),
};
