import { InteractiveStatus } from '@monkvision/types';

export const BUTTON_TEST_ID = 'monk-btn';
export const SPINNER_TEST_ID = 'spinner-mock';
export const ICON_TEST_ID = 'icon-mock';
export const SpinnerMock = jest.fn(() => <div data-testid={SPINNER_TEST_ID} />);
export const IconMock = jest.fn(() => <div data-testid={ICON_TEST_ID} />);

jest.mock('../../../src/components/Spinner', () => ({
  Spinner: SpinnerMock,
}));

jest.mock('../../../src/icons', () => ({
  Icon: IconMock,
}));

export const theme = {
  utils: {
    getColor: jest.fn((color) => (color.startsWith('#') ? color : '#ffffff')),
  },
};

export const getInteractiveVariationMock = jest.fn((color) => ({
  [InteractiveStatus.DEFAULT]: color,
  [InteractiveStatus.HOVERED]: color,
  [InteractiveStatus.ACTIVE]: color,
  [InteractiveStatus.DISABLED]: color,
}));

export const useInteractiveStatusMock = jest.fn(
  (params: { disabled: boolean; componentHandlers: any }) => ({
    status: params.disabled ? InteractiveStatus.DISABLED : InteractiveStatus.DEFAULT,
    eventHandlers: params.componentHandlers,
  }),
);

jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  useInteractiveStatus: useInteractiveStatusMock,
  getInteractiveVariation: getInteractiveVariationMock,
  useMonkTheme: jest.fn(() => theme),
}));
