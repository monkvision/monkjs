import { useRef, useState } from 'react';
import { LiveConfig } from '@monkvision/types';
import { Button } from '@monkvision/common-ui-web';
import styles from './LiveConfigPage.module.css';
import { LiveConfigCreate } from '../../components';

export function LiveConfigPage() {
  const [config, setConfig] = useState<LiveConfig | null>(null);
  const exportAnchorRef = useRef<HTMLAnchorElement | null>(null);

  if (!config) {
    return <LiveConfigCreate onCreateConfig={setConfig} />;
  }

  const handleExportConfig = () => {
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(config, null, 2),
    )}`;
    exportAnchorRef.current?.setAttribute('href', data);
    exportAnchorRef.current?.setAttribute('download', `${config.id}.json`);
    exportAnchorRef.current?.click();
  };

  return (
    <div className={styles['container']}>
      TODO : Implement Form to create / update live configs
      <div className={styles['fab-container']}>
        <Button icon='delete' primaryColor='alert' onClick={() => setConfig(null)}>
          Discard Config
        </Button>
        <Button icon='file-download' onClick={handleExportConfig}>
          Export Config
        </Button>
      </div>
      <a ref={exportAnchorRef} className={styles['export-anchor']}></a>
    </div>
  );
}
