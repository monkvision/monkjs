import { useNavigate } from 'react-router-dom';
import { Button } from '@monkvision/common-ui-web';
import { useAuth } from '@monkvision/network';
import { Page } from '../../pages';
import styles from './Navbar.module.css';
import { useNavbarTabStyle } from './hooks';

export const TABS = [{ page: Page.LIVE_CONFIGS, label: 'Live Configs' }];

export function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getTabClassname, getTabStyle } = useNavbarTabStyle();

  const handleLogOut = () => {
    logout()
      .then(() => {
        navigate(Page.LOG_IN);
      })
      .catch(console.error);
  };

  return (
    <div className={styles['container']}>
      <div className={styles['left-container']}>
        <button className={styles['logo']} onClick={() => navigate('/')}>
          <img src='/monkjs.png' alt='MonkJs Logo' />
        </button>
        {TABS.map((tab) => (
          <button
            key={tab.page}
            className={getTabClassname(tab)}
            style={getTabStyle(tab)}
            onClick={() => navigate(tab.page)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles['right-container']}>
        <Button primaryColor='alert' size='small' onClick={handleLogOut}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
