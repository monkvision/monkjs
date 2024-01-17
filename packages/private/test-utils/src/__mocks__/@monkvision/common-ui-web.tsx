const { iconNames } = jest.requireActual('@monkvision/common-ui-web');

export = {
  /* Actual exports */
  iconNames,

  /* Mocks */
  Icon: jest.fn(() => <></>),
  Button: jest.fn(() => <></>),
  DynamicSVG: jest.fn(() => <></>),
  SVGElement: jest.fn(() => <></>),
  SightOverlay: jest.fn(() => <></>),
  Spinner: jest.fn(() => <></>),
  TakePictureButton: jest.fn(() => <></>),
  SwitchButton: jest.fn(() => <></>),
};
