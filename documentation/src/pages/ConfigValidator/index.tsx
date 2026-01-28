import { useState } from 'react';
import Layout from '@theme/Layout';
import { ConfigImport, ConfigValidateResults } from '@site/src/components';
import { Button } from '@monkvision/common-ui-web';
import { CaptureWorkflow } from '@monkvision/types';
import styles from './styles.module.css';

export default function ConfigValidator() {
  const [config, setConfig] = useState('');
  const [captureType, setCaptureType] = useState(CaptureWorkflow.PHOTO);

  return (
    <Layout title='Config Validator' description='Validate your Monk webapp JSON configuration.'>
      <div className={styles['container']}>
        <ConfigImport onImportConfig={setConfig} />
        <ConfigValidateResults config={config} captureType={captureType} />
        <div className={styles['capture-type-switch']}>
          <Button
            primaryColor={captureType === CaptureWorkflow.PHOTO ? 'primary' : 'secondary'}
            onClick={() => setCaptureType(CaptureWorkflow.PHOTO)}
          >
            Photo
          </Button>
          <Button
            primaryColor={captureType === CaptureWorkflow.VIDEO ? 'primary' : 'secondary'}
            onClick={() => setCaptureType(CaptureWorkflow.VIDEO)}
          >
            Video
          </Button>
        </div>
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
