import { CaptureSelection } from '@monkvision/common-ui-web';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page } from '../pages';

export function CaptureSelectionPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  return (
    <CaptureSelection
      lang={i18n.language}
      onCapture={() => navigate(Page.PHOTO_CAPTURE)}
      onAddDamage={() => navigate(Page.DAMAGE_DISCLOSURE)}
    />
  );
}
