import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@monkvision/common-ui-web';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ConfigImport.module.css';
import { Icon } from '../../domOnly';

export interface ConfigImportProps {
  onImportConfig?: (config: string) => void;
  onImportError?: () => void;
}

export function ConfigImport({ onImportConfig, onImportError }: ConfigImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const isDarkTheme = useColorMode().colorMode === 'dark';

  const handleImportFileClick = () => {
    inputRef.current?.click();
  };

  const handleUploadFile = (file?: File) => {
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onImportConfig?.(event.target.result);
          console.log(event.target.result);
        }
      };
      reader.onerror = (err) => {
        console.error(err);
        onImportError?.();
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    setIsDraggingOver(true);
    e.preventDefault();
  };

  const handleDragLeave = (e: DragEvent) => {
    setIsDraggingOver(false);
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    setIsDraggingOver(false);
    handleUploadFile(e.dataTransfer?.files[0]);
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  let dragIconPrimaryColor = isDarkTheme ? '#989898' : '#606060';
  if (isDraggingOver) {
    dragIconPrimaryColor = isDarkTheme ? '#3261cd' : '#274b9f';
  }

  return (
    <div className={styles['container']}>
      <div
        className={clsx([
          styles['drag-and-drop-container'],
          { [styles['drag-and-drop-container-dragging-over']]: isDraggingOver },
        ])}
      >
        <Icon icon='cloud-download' primaryColor={dragIconPrimaryColor} />
        <div className={styles['drag-and-drop-label']}>Drag and drop your config file</div>
      </div>
      <div className={styles['or-separator']}>OR</div>
      <Button onClick={handleImportFileClick}>Import a file</Button>
      <input
        ref={inputRef}
        type='file'
        accept='.json'
        onChange={(e) => handleUploadFile(e.target.files?.[0])}
        hidden
      />
      <div
        className={clsx([
          styles['drag-overlay'],
          { [styles['drag-overlay-dragging-over']]: isDraggingOver },
        ])}
      ></div>
    </div>
  );
}
