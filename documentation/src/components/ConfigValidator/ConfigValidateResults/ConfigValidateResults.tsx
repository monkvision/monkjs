import React, { useMemo } from 'react';
import { PhotoLiveConfigSchema, VideoLiveConfigSchema } from '@site/src/utils';
import clsx from 'clsx';
import { CaptureWorkflow } from '@monkvision/types';
import styles from './ConfigValidateResults.module.css';

export interface ConfigValidateResultsProps {
  config: string;
  captureType: CaptureWorkflow;
}

export function ConfigValidateResults({ config, captureType }: ConfigValidateResultsProps) {
  const errors = useMemo(() => {
    let json;
    try {
      json = JSON.parse(config);
    } catch (err) {
      return [
        {
          message: 'Invalid JSON format. Verify that your string respects the JSON standards.',
          at: 'root',
        },
      ];
    }
    const result =
      captureType === CaptureWorkflow.PHOTO
        ? PhotoLiveConfigSchema.safeParse(json)
        : VideoLiveConfigSchema.safeParse(json);
    if (result.success) {
      return [];
    }
    return result.error.issues.map((zodIssue) => ({
      message: zodIssue.message,
      at: zodIssue.path.join('.'),
    }));
  }, [config, captureType]);

  const isValid = config !== '' && errors.length === 0;
  const isInvalid = config !== '' && errors.length > 0;

  return (
    <div
      className={clsx([
        styles['container'],
        { [styles['valid']]: isValid, [styles['invalid']]: isInvalid },
      ])}
    >
      {config === '' && <div>The validation results will be displayed here.</div>}
      {isValid && <div>Your webapp configuration is valid!</div>}
      {isInvalid && <div>Invalid webapp configuration :</div>}
      {isInvalid &&
        errors.map((error) => (
          <div id={error.message} className={styles['error-message']}>
            <div>{error.message}</div>
            <div className={styles['error-message-at']}>
              <span className={styles['label']}>At : </span>
              {error.at}
            </div>
          </div>
        ))}
    </div>
  );
}
