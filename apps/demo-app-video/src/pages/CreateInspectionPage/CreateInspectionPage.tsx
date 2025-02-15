import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreateInspection } from '@monkvision/common-ui-web';
import { Page } from '../pages';

export function CreateInspectionPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  return (
    <CreateInspection
      onInspectionCreated={() => navigate(Page.VIDEO_CAPTURE)}
      lang={i18n.language}
    />
  );
}
