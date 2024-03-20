import { useColorMode } from '@docusaurus/theme-common';
import { IconName } from '@monkvision/common-ui-web';
import { CopyPopup, CopyPopupHandle } from '@site/src/components';
import React, { useRef } from 'react';
import { Icon } from '../../domOnly';
import styles from './IconCard.module.css';

export interface IconCardProps {
  icon: IconName;
}

export function IconCard({ icon }: IconCardProps) {
  const copyPopupRef = useRef<CopyPopupHandle>(null);
  const isDarkTheme = useColorMode().colorMode === 'dark';

  const copyName = async () => {
    await navigator.clipboard.writeText(icon);
    copyPopupRef.current?.openForMs(1000);
  };

  return (
    <button className={styles['icon-card']} onClick={copyName}>
      <Icon icon={icon} size={50} primaryColor={isDarkTheme ? '#cecece' : '#313131'} />
      <div className={styles['icon-name']}>
        <span>{icon}</span>
        <CopyPopup ref={copyPopupRef} />
      </div>
    </button>
  );
}
