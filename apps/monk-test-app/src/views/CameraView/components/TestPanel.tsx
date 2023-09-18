import { Button } from '@monkvision/common-ui-web';
import React, { useEffect, useState } from 'react';
import { useTestPanelStyle } from '../hooks';
import './styles.css';
import { TestPanelLastPic, TestPanelLastPicProps } from './TestPanelLastPic';
import { TestPanelSettings, TestPanelSettingsProps } from './TestPanelSettings';

export interface TestPanelProps extends TestPanelSettingsProps, TestPanelLastPicProps {}

export function TestPanel({ state, onChange, lastPicture }: TestPanelProps) {
  const { panel } = useTestPanelStyle();
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  useEffect(() => {
    setShowTestPanel(true);
  }, [lastPicture]);

  return (
    <div className='panel-container'>
      {showTestPanel ? (
        <div className='panel' style={panel}>
          <div className='row space-between'>
            <Button
              className='header-item'
              variant='text-link'
              icon={showSettings ? 'arrow-back' : 'settings'}
              primaryColor='primary-xlight'
              onClick={() => setShowSettings(!showSettings)}
            />
            <div className='header-item'>{showSettings ? 'Settings' : 'Last Picture Taken'}</div>
            <Button
              className='header-item'
              variant='text-link'
              icon='close'
              primaryColor='primary-xlight'
              onClick={() => setShowTestPanel(false)}
            />
          </div>
          {showSettings ? (
            <TestPanelSettings state={state} onChange={onChange} />
          ) : (
            <TestPanelLastPic lastPicture={lastPicture} />
          )}
        </div>
      ) : (
        <Button
          variant='outline'
          primaryColor='primary-xlight'
          secondaryColor='surface-s1'
          icon='robot'
          onClick={() => setShowTestPanel(true)}
        />
      )}
    </div>
  );
}
