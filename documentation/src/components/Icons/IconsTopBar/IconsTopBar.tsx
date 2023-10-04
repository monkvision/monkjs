import { SearchBar } from '@site/src/components';
import React from 'react';
import styles from './IconsTopBar.module.css';

export interface IconsTopBarProps {
  onLookupInput: (value: string) => void;
}

export function IconsTopBar({ onLookupInput }: IconsTopBarProps) {
  return (
    <div className={styles['top-bar']}>
      <div className={styles['filters']}>
        <SearchBar onInput={onLookupInput} />
      </div>
    </div>
  );
}
