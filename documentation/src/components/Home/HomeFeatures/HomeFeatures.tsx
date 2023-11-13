import React from 'react';
import { featureList } from './featureList';
import { Feature } from './Feature';
import styles from './HomeFeatures.module.css';

export function HomeFeatures() {
  return (
    <section className={styles['features']}>
      <div className='container'>
        <div className='row'>
          {featureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
