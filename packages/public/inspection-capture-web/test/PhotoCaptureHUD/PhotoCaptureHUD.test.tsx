import { expectPropsOnChildMock } from '@monkvision/test-utils';

jest.mock('react-i18next');
jest.mock('@monkvision/common');
jest.mock('@monkvision/common-ui-web');
jest.mock('../../src/PhotoCaptureHUD/i18n', () => ({
  i18nCamera: {},
}));
jest.mock('../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview', () => ({
  PhotoCaptureHUDSightPreview: jest.fn(() => <></>),
}));
jest.mock('../../src/PhotoCaptureHUD/PhotoCaptureHUDAddDamagePreview', () => ({
  PhotoCaptureHUDAddDamagePreview: jest.fn(() => <></>),
}));
jest.mock('../../src/PhotoCaptureHUD/PhotoCaptureHUDButtons', () => ({
  PhotoCaptureHUDButtons: jest.fn(() => <></>),
}));
jest.mock('../../src/hooks', () => ({
  ...jest.requireActual('../../src/hooks'),
  useHUDMode: jest.fn(() => ({ mode: 'default', handleAddDamage: jest.fn() })),
  useSightState: jest.fn(() => ({ handleSightSelected: jest.fn(), handleSightTaken: jest.fn() })),
}));

import { render } from '@testing-library/react';
import { Sight } from '@monkvision/types';
import { i18nWrap } from '@monkvision/common';
import { i18nAddDamage } from '../../src/PhotoCaptureHUD/i18n';
import { PhotoCaptureHUD } from '../../src/PhotoCaptureHUD';
import { PhotoCaptureHUDSightPreview } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview';
import { PhotoCaptureHUDButtons } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDButtons';
import { useHUDMode, useSightState } from '../../src/hooks';
import { PhotoCaptureHUDAddDamagePreview } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDAddDamagePreview';

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];

describe('PhotoCaptureHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should wrap the component with the i18nWrap method', () => {
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    expect(i18nWrap).toHaveBeenCalledWith(expect.any(Function), i18nAddDamage);
    unmount();
  });

  it('should render PhotoCaptureHUDSightPreview and PhotoCaptureHUDButtons by default', () => {
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    expect(PhotoCaptureHUDSightPreview).toHaveBeenCalled();
    expect(PhotoCaptureHUDButtons).toHaveBeenCalled();
    unmount();
  });

  it('should render PhotoCaptureHUDAddDamagePreview in add_damage mode', () => {
    (useHUDMode as jest.Mock).mockImplementationOnce(() => ({
      mode: 'add-damage',
      handleAddDamage: jest.fn(),
    }));
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    expect(PhotoCaptureHUDAddDamagePreview).toHaveBeenCalled();
    expect(PhotoCaptureHUDButtons).toHaveBeenCalled();
    unmount();
  });

  it('should get passed handleAddDamage as callback to PhotoCaptureHUDAddDamagePreview', () => {
    (useHUDMode as jest.Mock).mockImplementationOnce(() => ({
      mode: 'add-damage',
      handleAddDamage: jest.fn(),
    }));
    const PhotoCaptureHUDAddDamagePreviewMock = PhotoCaptureHUDAddDamagePreview as jest.Mock;
    const useHUDModeMock = useHUDMode as jest.Mock;
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    const { handleAddDamage } = useHUDModeMock.mock.results[0].value;

    expectPropsOnChildMock(PhotoCaptureHUDAddDamagePreviewMock, {
      onAddDamage: handleAddDamage,
    });
    unmount();
  });

  it('should get passed handleAddDamage and handleSightSelected as callback to PhotoCaptureHUDSightPreview', () => {
    const PhotoCaptureHUDSightPreviewMock = PhotoCaptureHUDSightPreview as jest.Mock;
    const useHUDModeMock = useHUDMode as jest.Mock;
    const useSightStateMock = useSightState as jest.Mock;
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    const { handleAddDamage } = useHUDModeMock.mock.results[0].value;
    const { handleSightSelected } = useSightStateMock.mock.results[0].value;

    expectPropsOnChildMock(PhotoCaptureHUDSightPreviewMock, {
      onAddDamage: handleAddDamage,
      onSightSelected: handleSightSelected,
    });
    unmount();
  });

  it('should render PhotoCaptureHUDButtons component', () => {
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    expect(PhotoCaptureHUDButtons).toHaveBeenCalledTimes(1);
    unmount();
  });
});
