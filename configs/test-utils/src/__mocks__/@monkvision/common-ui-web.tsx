const { iconNames } = jest.requireActual('@monkvision/common-ui-web');

export = {
  /* Actual exports */
  iconNames,

  /* Mocks */
  BackdropDialog: jest.fn(() => <></>),
  Button: jest.fn(() => <></>),
  DynamicSVG: jest.fn(() => <></>),
  Icon: jest.fn(() => <></>),
  ImageDetailedView: jest.fn(() => <></>),
  InspectionGallery: jest.fn(() => <></>),
  Login: jest.fn(() => <></>),
  SightOverlay: jest.fn(() => <></>),
  Slider: jest.fn(() => <></>),
  Spinner: jest.fn(() => <></>),
  SVGElement: jest.fn(() => <></>),
  SwitchButton: jest.fn(() => <></>),
  TakePictureButton: jest.fn(() => <></>),
  VehiclePartSelection: jest.fn(() => <></>),
};
