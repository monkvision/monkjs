import { useNavigate } from 'react-router-dom';
import { Login } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { useMonkAppState } from '@monkvision/common';
import { Page } from '../pages';

export function LoginPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { inspectionId } = useMonkAppState();

  return (
    <Login
      lang={i18n.language}
      onLoginSuccessful={() => navigate(inspectionId ? Page.PHOTO_CAPTURE : Page.CREATE_INSPECTION)}
    />
  );
}
