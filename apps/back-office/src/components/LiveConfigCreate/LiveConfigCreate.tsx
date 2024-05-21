import { LiveConfig } from '@monkvision/types';
import { Button } from '@monkvision/common-ui-web';
import { ChangeEvent, useRef, useState } from 'react';
import styles from './LiveConfigCreate.module.css';
import { createConfig, isConfigValid, parseConfig } from './utils';

export interface LiveConfigCreateProps {
  onCreateConfig?: (config: LiveConfig) => void;
}

enum ImportError {
  PARSING = 'Invalid JSON config file. Make sure to import a JSON file.',
  VALIDATING = 'Invalid configuration file. Make sure to follow the official live config schema.',
}

export function LiveConfigCreate({ onCreateConfig }: LiveConfigCreateProps) {
  const [error, setError] = useState<ImportError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateConfig = () => {
    onCreateConfig?.(createConfig());
  };

  const handleImportConfig = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      parseConfig(e.target.files[0], (config) => {
        if (config === null) {
          setError(ImportError.PARSING);
        } else if (!isConfigValid(config)) {
          setError(ImportError.VALIDATING);
        } else {
          setError(null);
          onCreateConfig?.(config);
        }
      });
    }
  };

  return (
    <div className={styles['container']}>
      {error && <div className={styles['error-message']}>{error}</div>}
      <div className={styles['buttons-container']}>
        <Button icon='add' onClick={handleCreateConfig}>
          Create Config
        </Button>
        OR
        <Button icon='cloud-upload' onClick={handleImportConfig}>
          Import Config
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='application/JSON, application/json'
        onChange={handleUploadFileChange}
      />
    </div>
  );
}
