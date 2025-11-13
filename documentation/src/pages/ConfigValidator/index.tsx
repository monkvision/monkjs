import { useState } from 'react';
import Layout from '@theme/Layout';
import { ConfigImport, ConfigValidateResults } from '@site/src/components';
import styles from './styles.module.css';

export default function ConfigValidator() {
  const [config, setConfig] = useState('');

  return (
    <Layout title='Config Validator' description='Validate your Monk webapp JSON configuration.'>
      <div className={styles['container']}>
        <ConfigImport onImportConfig={setConfig} />
        <ConfigValidateResults config={config} />
        <textarea
          className={styles['config-text-area']}
          placeholder='Or directly copy and paste your config here'
          value={config}
          onChange={(e) => setConfig(e.target.value)}
        />
      </div>
    </Layout>
  );
}
