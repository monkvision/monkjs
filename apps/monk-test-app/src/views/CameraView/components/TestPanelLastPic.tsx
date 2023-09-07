import { MonkPicture } from '@monkvision/camera-web';
import { Button } from '@monkvision/common-ui-web';
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format } from '../utils';
import './styles.css';
import { TestPanelRow } from './TestPanelRow';
import { TestPanelState } from './TestPanelSettings';

export interface LastPictureDetails {
  picture: MonkPicture;
  state: TestPanelState;
}

export interface TestPanelLastPicProps {
  lastPicture: LastPictureDetails | null;
}

function createFileName(lastPicture: LastPictureDetails): string {
  const date = new Date();
  const timestamp = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  const quality = `${lastPicture.state.resolution}_${lastPicture.state.quality}`;
  const extension = lastPicture.picture.mimetype.split('/')[1];
  return `pic_${quality}_${timestamp}.${extension}`;
}

export function TestPanelLastPic({ lastPicture }: TestPanelLastPicProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const requestedResolution = useMemo(() => lastPicture?.state.resolution ?? null, [lastPicture]);
  const outputResolution = useMemo(
    () => (lastPicture ? `${lastPicture.picture.width}x${lastPicture.picture.height}` : null),
    [lastPicture],
  );
  const compression = useMemo(
    () =>
      lastPicture
        ? `${format(lastPicture.state.compressionFormat)} (${lastPicture.state.quality})`
        : null,
    [lastPicture],
  );

  useEffect(() => {
    if (lastPicture) {
      axios
        .get(lastPicture.picture.uri, { responseType: 'blob' })
        .then((res) => {
          if (anchorRef.current) {
            const link = URL.createObjectURL(res.data);
            setDownloadLink(link);
            anchorRef.current.href = link;
            anchorRef.current.download = createFileName(lastPicture);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [lastPicture]);

  return (
    <>
      <TestPanelRow type='value' label='Requested Resolution' value={requestedResolution} />
      <TestPanelRow type='value' label='Output Resolution' value={outputResolution} />
      <TestPanelRow type='value' label='Compression' value={compression} />
      <div className='row center'>
        <a className='hidden-download' ref={anchorRef} />
        <Button
          variant='fill'
          size='small'
          icon='file-download'
          primaryColor='primary-xlight'
          secondaryColor='surface-s1'
          disabled={!downloadLink}
          onClick={() => anchorRef.current?.click()}
        >
          Download Image
        </Button>
      </div>
    </>
  );
}
