import { useNavigate } from 'react-router-dom';
import { Login } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { useMonkApplicationState } from '@monkvision/common';
import { Page } from '../pages';
import { REQUIRED_PERMISSIONS } from '../../config';

export function LoginPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { inspectionId } = useMonkApplicationState();

  return (
    <Login
      lang={i18n.language}
      onLoginSuccessful={() => navigate(inspectionId ? Page.PHOTO_CAPTURE : Page.CREATE_INSPECTION)}
      requiredPermissions={REQUIRED_PERMISSIONS}
    />
  );
}
