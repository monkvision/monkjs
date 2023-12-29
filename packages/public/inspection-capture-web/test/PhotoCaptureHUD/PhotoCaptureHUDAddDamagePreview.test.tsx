jest.mock('@monkvision/common-ui-web');
jest.mock('react-i18next');

import { render } from '@testing-library/react';
import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { PhotoCaptureHUDAddDamagePreview } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDAddDamagePreview';

describe('PhotoCaptureHUDAddDamagePreview component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a Button', () => {
    const onAddDamage = jest.fn();
    const { unmount } = render(<PhotoCaptureHUDAddDamagePreview onAddDamage={onAddDamage} />);

    expect(Button).toHaveBeenCalled();

    unmount();
  });

  it('should translate button text', () => {
    const onAddDamage = jest.fn();
    const useTranslationMock = useTranslation as jest.Mock;
    const { unmount } = render(<PhotoCaptureHUDAddDamagePreview onAddDamage={onAddDamage} />);
    const { t } = useTranslationMock.mock.results[0].value;

    expect(t).toHaveBeenCalled();

    unmount();
  });
});
