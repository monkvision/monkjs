import { useSightLabel } from '@monkvision/common';

jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/DamageCounter', () => ({
  DamageCounter: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CancelButton', () => ({
  CancelButton: jest.fn(() => <></>),
}));

import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { Sight } from '@monkvision/types';
import { CloseupPreview } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CloseupPreview';
import { CancelButton } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/CancelButton';
import { DamageCounter } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/DamageCounter';

describe('CloseupPreview component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render 2 components: DamageCounter, CancelButton', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<CloseupPreview onCancel={onCancel} />);
    expect(DamageCounter).toHaveBeenCalled();
    expect(CancelButton).toHaveBeenCalled();

    unmount();
  });

  it('should use t function from useTranslation hook', () => {
    const onCancel = jest.fn();
    const useTranslationMock = useTranslation as jest.Mock;
    const { unmount } = render(<CloseupPreview onCancel={onCancel} />);

    const { t } = useTranslationMock.mock.results[0].value;
    expect(t).toHaveBeenCalled();

    unmount();
  });

  it('should apply the streamDimensions to the aspect ratio', () => {
    const onCancel = jest.fn();
    const dimensions = { width: 1920, height: 1080 };
    const { unmount } = render(
      <CloseupPreview onCancel={onCancel} streamDimensions={dimensions} />,
    );

    const frameContainer = screen.getByTestId('frame-container');
    expect(frameContainer.style.aspectRatio).toEqual(`${dimensions.width}/${dimensions.height}`);

    unmount();
  });

  it('should not render sight label if undefined', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<CloseupPreview onCancel={onCancel} sight={undefined} />);

    const sightLabel = screen.getByTestId('sight-label');
    expect(sightLabel.innerHTML).toEqual('');

    unmount();
  });

  it('should call label function from useSightLabel hook', () => {
    const onCancel = jest.fn();
    const useSightLabelMock = useSightLabel as jest.Mock;
    const sight = { label: '' } as Sight;
    const { unmount } = render(<CloseupPreview onCancel={onCancel} sight={sight} />);

    const { label } = useSightLabelMock.mock.results[0].value;
    expect(label).toHaveBeenCalled();

    unmount();
  });
});
