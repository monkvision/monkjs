import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';

import useCompliance from '../../hooks/useCompliance';
import useSettings from '../../hooks/useSettings';
import useSights from '../../hooks/useSights';
import useUploads from '../../hooks/useUploads';
import useEmbeddedCompliance from '../../hooks/useEmbeddedCompliance';
import useLastTakenPicture from '../../hooks/useLastTakenPicture';
import Capture from './capture';

const initialColors = {
  accent: '#ff9800',
  background: '#fff',
  disabled: 'gray',
  text: '#000',
  error: '#fa603d',
  placeholder: 'gray',
  actions: {
    primary: { background: '#274B9F', text: '#fff' },
    secondary: { background: '#fff', text: '#000', disabled: '#fff' },
  },
};

const CaptureHOC = forwardRef(({
  compliance,
  settings,
  sights,
  uploads,
  colors,
  connectionMode,
  ...rest
}, ref) => {
  const camera = useRef();
  const combinedRefs = useRef({ camera, ref });

  const { sightIds, initialState } = rest;
  const unControlledCompliance = useCompliance({ sightIds, initialState: initialState.compliance });
  const unControlledUploads = useUploads({ sightIds, initialState: initialState.uploads });
  const unControlledSights = useSights({ sightIds, initialState: initialState.sights });
  const unControlledSettings = useSettings({ camera, initialState: initialState.settings });
  const unControlledEmbeddedCompliance = useEmbeddedCompliance({ sightIds });
  const unControlledLastTakenPicture = useLastTakenPicture();

  return (
    <Capture
      compliance={compliance || unControlledCompliance}
      embeddedCompliance={unControlledEmbeddedCompliance}
      lastTakenPicture={unControlledLastTakenPicture}
      uploads={uploads || unControlledUploads}
      sights={sights || unControlledSights}
      settings={settings || unControlledSettings}
      ref={combinedRefs}
      connectionMode={connectionMode}
      colors={{ ...initialColors, ...colors }}
      {...rest}
    />
  );
});

CaptureHOC.propTypes = {
  colors: PropTypes.shape({
    accent: PropTypes.string,
    actions: PropTypes.objectOf(PropTypes.any),
    background: PropTypes.string,
    boneColor: PropTypes.string,
    disabled: PropTypes.string,
    error: PropTypes.string,
    highlightBoneColor: PropTypes.string,
    notification: PropTypes.string,
    onSurface: PropTypes.string,
    placeholder: PropTypes.string,
    primary: PropTypes.string,
    success: PropTypes.string,
    surface: PropTypes.string,
    text: PropTypes.string,
  }),
  compliance: PropTypes.shape({
    dispatch: PropTypes.func,
    name: PropTypes.string,
    state: PropTypes.objectOf(PropTypes.shape({
      error: PropTypes.objectOf(PropTypes.any),
      id: PropTypes.string,
      imageId: PropTypes.string,
      requestCount: PropTypes.number,
      result: PropTypes.objectOf(PropTypes.any),
      status: PropTypes.string,
    })),
  }),
  connectionMode: PropTypes.oneOf(['online', 'semi-offline', 'offline']),
  initialState: PropTypes.shape({
    compliance: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
  settings: PropTypes.shape({
    ratio: PropTypes.string,
    type: PropTypes.string,
    zoom: PropTypes.number,
  }),
  sights: PropTypes.shape({
    dispatch: PropTypes.func,
    name: PropTypes.string,
    state: PropTypes.shape({
      current: PropTypes.shape({
        id: PropTypes.string,
        index: PropTypes.number,
        metadata: PropTypes.shape({
          category: PropTypes.string,
          id: PropTypes.string,
          label: PropTypes.shape({
            en: PropTypes.string,
            fr: PropTypes.string,
          }),
          overlay: PropTypes.string,
          vehicleType: PropTypes.string,
        }),
      }),
      ids: PropTypes.arrayOf(PropTypes.string),
      remainingPictures: PropTypes.number,
      tour: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string,
          id: PropTypes.string,
          label: PropTypes.shape({
            en: PropTypes.string,
            fr: PropTypes.string,
          }),
          overlay: PropTypes.string,
          vehicleType: PropTypes.string,
        }),
      ),
    }),
  }),
  uploads: PropTypes.shape({
    dispatch: PropTypes.func,
    name: PropTypes.string,
    state: PropTypes.objectOf(PropTypes.shape({
      error: PropTypes.objectOf(PropTypes.any),
      id: PropTypes.string,
      picture: PropTypes.objectOf(PropTypes.any),
      status: PropTypes.string,
      uploadCount: PropTypes.number,
    })),
  }),
};

CaptureHOC.defaultProps = {
  colors: initialColors,
  compliance: undefined,
  connectionMode: 'online',
  initialState: {
    compliance: undefined,
    settings: undefined,
    sights: undefined,
    uploads: undefined,
  },
  settings: undefined,
  sights: undefined,
  uploads: undefined,
};

/**
 * Note(Ilyass): While using forwardRef with PropTypes, the component loses its displayName
 * which is important for debugging with devtools
 *  */
CaptureHOC.displayName = 'CaptureHOC';

export default CaptureHOC;
