import React from 'react';
import { labels } from '@monkvision/sights';
import clsx from 'clsx';
import styles from './LabelTable.module.css';

const rows = Object.values(labels).map((label) => (
  <div key={label.key} className={clsx(styles['row'], styles['label-row'])}>
    <div className={clsx(styles['col'], styles['label-col'])}>{label.key}</div>
    <div className={clsx(styles['col'], styles['label-col'])}>{label.en}</div>
    <div className={clsx(styles['col'], styles['label-col'])}>{label.fr}</div>
    <div className={clsx(styles['col'], styles['label-col'])}>{label.de}</div>
  </div>
));

export function LabelTable() {
  return (
    <div className={styles['table-container']}>
      <div className={clsx(styles['row'], styles['header-row'])}>
        <div className={clsx(styles['col'], styles['header-col'])}>Key</div>
        <div className={clsx(styles['col'], styles['header-col'])}>English</div>
        <div className={clsx(styles['col'], styles['header-col'])}>French</div>
        <div className={clsx(styles['col'], styles['header-col'])}>German</div>
        <div className={clsx(styles['col'], styles['header-col'])}>Dutch</div>
      </div>
      {rows}
    </div>
  );
}
