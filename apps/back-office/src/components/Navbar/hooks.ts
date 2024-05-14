import { matchPath, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { useMonkTheme } from '@monkvision/common';
import { Page } from '../../pages';
import styles from './Navbar.module.css';

export interface NavbarTab {
  page: Page;
  label: string;
}

export function useNavbarTabStyle() {
  const location = useLocation();
  const { palette } = useMonkTheme();

  const isTabSelected = (tab: NavbarTab) => !!matchPath(location.pathname, tab.page);

  const getTabClassname = (tab: NavbarTab) =>
    classnames(styles['tab'], {
      [styles['selected']]: isTabSelected(tab),
    });

  const getTabStyle = (tab: NavbarTab) => ({
    color: isTabSelected(tab) ? palette.primary.base : palette.text.primary,
    borderBottomColor: palette.primary.base,
  });

  const containerStyle = { backgroundColor: palette.background.light };

  return { containerStyle, getTabClassname, getTabStyle };
}
