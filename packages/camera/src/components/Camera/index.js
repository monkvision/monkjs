import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import createElement from 'react-native-web/dist/exports/createElement';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { utils, useTimeout, useSentry } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';

import Actions from '../../actions';
import Constants from '../../const';

import styles from './styles';
import useCamera from './hooks/useCamera';

const isMobile = ['iOS', 'Android'].includes(utils.getOS());
const facingMode = isMobile ? { exact: 'environment' } : 'environment';
const Video = React.forwardRef((props, ref) => createElement('video', { ...props, ref }));

const getLandscapeScreenDimensions = () => {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  return { height: Math.min(width, height), width: Math.max(width, height) };
};

function Camera({
  children,
  containerStyle,
  onCameraReady,
  settings,
  enableQHDWhenSupported,
  onWarningMessage,
  resolutionOptions,
  compressionOptions,
  Sentry,
}, ref) {
  const [resolution, setResolution] = useMemo(() => {
    const cameraResolution = Constants.resolution[settings.state.resolution];
    const updateResolution = (r) => settings.dispatch({
      type: Actions.settings.UPDATE_SETTINGS,
      payload: { resolution: r },
    });

    return [cameraResolution, updateResolution];
  }, [settings]);

  const {
    videoRef,
    takePicture,
    resumePreview,
    pausePreview,
    stopStream,
    stream,
  } = useCamera(resolution, {
    onCameraReady,
    video: { facingMode, width: resolution.width, height: resolution.height },
  }, settings.state.compression, Sentry, onWarningMessage, compressionOptions);

  const { Span } = useSentry(Sentry);

  useImperativeHandle(ref, () => ({ takePicture, resumePreview, pausePreview, stream }));
  const delay = useMemo(
    () => (enableQHDWhenSupported && stream && videoRef.current
      ? resolutionOptions?.QHDDelay ?? 500 : null),
    [stream],
  );

  useEffect(() => {
    if (Sentry) {
      const transaction = new Span('camera-user-time', SentryConstants.operation.USER_TIME);

      return () => transaction.finish();
    }

    return () => undefined;
  }, []);

  // stopping the stream when the component unmount
  useEffect(() => stopStream, [stopStream]);

  useTimeout(() => {
    const supportsQHD = utils.inaccuratelyCheckQHDSupport(takePicture);
    if (supportsQHD) { setResolution('QHD'); } else { setResolution('FHD'); }
  }, delay);

  return (
    <View
      pointerEvents="box-none"
      accessibilityLabel="Camera container"
      style={[styles.container, containerStyle]}
    >
      <Video
        autoPlay
        playsInline
        ref={videoRef}
        width={getLandscapeScreenDimensions().width}
        height={getLandscapeScreenDimensions().height}
        controls={false}
      />
      {children}
    </View>
  );
}

export default forwardRef(Camera);

Camera.propTypes = {
  compressionOptions: PropTypes.shape({
    quality: PropTypes.number,
  }),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enableQHDWhenSupported: PropTypes.bool,
  onCameraReady: PropTypes.func.isRequired,
  onWarningMessage: PropTypes.func,
  resolutionOptions: PropTypes.shape({
    QHDDelay: PropTypes.number,
  }),
  Sentry: PropTypes.any,
  settings: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({
      compression: PropTypes.bool,
      resolution: PropTypes.string,
    }),
  }),
};

Camera.defaultProps = {
  compressionOptions: undefined,
  containerStyle: null,
  enableQHDWhenSupported: true,
  onWarningMessage: () => {},
  resolutionOptions: undefined,
  Sentry: null,
  settings: { state: { resolution: 'FHD' }, dispatch: () => {} },
};
