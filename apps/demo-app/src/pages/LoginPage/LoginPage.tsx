import { useNavigate } from 'react-router-dom';
import { Login } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { Page } from '../pages';

export function LoginPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return <Login lang={i18n.language} onLoginSuccessful={() => navigate(Page.CREATE_INSPECTION)} />;
}
