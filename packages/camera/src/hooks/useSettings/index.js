import { useCallback, useEffect, useReducer  useState } from 'react';
import { Platform } from 'react-native';

import { Camera } from 'expo-camera';
import getOS from '../../utils/getOS';

import Actions from '../../actions';

const initialSettingsState = {
  resolution: 'FHD',
  ratio: '4:3',
  zoom: 0,
  type: Camera.Constants.Type.back,
};

function init({ initialState }) {
  if (initialState) { return initialState; }
  return initialSettingsState;
}

function reducer(state, action) {
  if (action.type === Actions.settings.RESET_SETTINGS) {
    return init(action);
  }

  switch (action.type) {
    case Actions.settings.UPDATE_SETTINGS:
      return ({
        ...state,
        ...action.payload,
      });

    default:
      throw new Error();
  }
}

/**
 * @param ids
 * @return {{
   * dispatch: (function({}): void),
   * name: string,
   * state: { resolution: string, ratio: string, zoom: string, type: string }
 * }}
 */
export default function useSettings({ initialState = initialSettingsState, camera }) {
  const [state, dispatch] = useReducer(reducer, { initialState }, init);

  const getSettings = useCallback(async (prevSettings) => {
    if (!camera || Platform.OS === 'web') { return prevSettings; }

    const newSettings = { ...prevSettings };
    const permissions = await Camera.getCameraPermissionsAsync();

    if (camera?.current && permissions.granted && Platform.OS !== 'web') {
      if (Platform.OS === 'android') {
        const ratios = await camera.current.getSupportedRatiosAsync();

        if (ratios?.length > 0) {
          newSettings.ratio = ratios.reduce((prev, current) => {
            const ideal = 4 / 3;
            const getNumber = (ratio) => (ratio.split(':').reduce((a, b) => (a / b)));

            return Math.abs(getNumber(prev) - ideal) < Math.abs(getNumber(current) - ideal)
              ? prev : current;
          });
        }
      }

      if (getOS() !== 'ios') {
        const pictureSizes = await camera.current.getAvailablePictureSizesAsync(newSettings.ratio);

        newSettings.pictureSize = pictureSizes.reduce((prev, current) => {
          const [prevWidth] = prev.split('x');
          const [currentWidth] = current.split('x');

          return parseInt(prevWidth, 10) > parseInt(currentWidth, 10) ? prev : current;
        });
      }
    }

    return newSettings;
  }, [camera, initialState]);

  useEffect(() => {
    (async () => {
      const payload = await getSettings(initialState);
      dispatch({ type: Actions.settings.UPDATE_SETTINGS, payload });
    })();
  }, [getSettings]);

  return { state, dispatch, name: 'settings' };
}
