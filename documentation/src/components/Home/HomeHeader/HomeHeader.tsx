import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './HomeHeader.module.css';

export function HomeHeader() {
  return (
    <header className={styles['header-banner']}>
      <div className={styles['title-container']}>
        <img className={styles['monkjs-logo']} src='/monkjs/img/monkjs.png' alt='MonkJs Logo' />
        <h1 className={styles['title']}>
          AI-powered vehicle damage detection for fast and reliable inspections
        </h1>
        <Link
          className={clsx('button button--primary', styles['get-started'])}
          to='/docs/introduction'
        >
          Get Started
        </Link>
      </div>
      <img
        className={styles['animated-logo']}
        src='/monkjs/img/animated-logo.svg'
        alt='Monk Animated Logo'
      />
    </header>
  );
}
