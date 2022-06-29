import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Platform, Pressable, useWindowDimensions, View } from 'react-native';
import { useTheme, Menu, List } from 'react-native-paper';
import PropTypes from 'prop-types';

import { Actions } from '@monkvision/camera';

import styles from './styles';
import useFullscreen from './useFullscreen';

const settingsOptions = {
  RESOLUTION: 'resolution',
  COMPRESSION: 'compression',
  FULLSCREEN: 'fullscreen',
  DEFAULT: 'default',
  FHD: 'FHD',
  QHD: 'QHD',
};

const Settings = forwardRef(({ settings }, ref) => {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const [modal, setModal] = useState({ visible: false, name: null });
  const handleClose = () => setModal({ visible: false, name: null });

  const { isFullscreen, requestFullscreen } = useFullscreen();

  const modals = useMemo(() => ({
    [settingsOptions.DEFAULT]: [
      { title: 'Resolution', value: settingsOptions.RESOLUTION },
      { title: 'Image compression', value: settingsOptions.COMPRESSION },
      { hidden: Platform.OS !== 'web', title: isFullscreen ? 'Exit fullscreen' : 'Fullscreen', value: settingsOptions.FULLSCREEN, selected: isFullscreen },
    ],
    [settingsOptions.RESOLUTION]: [{ title: settingsOptions.FHD, value: settingsOptions.FHD },
      { title: settingsOptions.QHD, value: settingsOptions.QHD }],
    [settingsOptions.COMPRESSION]: [{ title: 'On', value: true }, { title: 'Off', value: false }],
  }), [isFullscreen]);

  const handleSelect = useCallback((name) => {
    // select only value that are not one of the `modals` keys

    // fulscreen
    if (name === settingsOptions.FULLSCREEN) {
      requestFullscreen();
      return;
    }

    // compressions
    if (modal.name === settingsOptions.COMPRESSION && typeof name === 'boolean') {
      settings.dispatch({
        type: Actions.settings.UPDATE_SETTINGS,
        payload: { [modal.name]: name },
      });
      return;
    }

    // sub settings
    if (Object.keys(modals).includes(name)) {
      setModal({ visible: true, name });
      return;
    }

    // default
    settings.dispatch({
      type: Actions.settings.UPDATE_SETTINGS,
      payload: { [modal.name]: name },
    });
  }, [modals, requestFullscreen, modal.name]);

  useImperativeHandle(ref, () => ({
    open: () => handleSelect(settingsOptions.FULLSCREEN.DEFAULT),
  }));

  if (!modal.visible) { return null; }
  return (
    <>
      <View style={[styles.settings, { backgroundColor: colors.background }]}>
        <List.Subheader>Settings</List.Subheader>
        {modals[modal.name].map((item) => !item.hidden && (
          <Menu.Item
            onPress={() => handleSelect(item.value)}
            title={item.title}
            key={item.value}
            style={[styles.settingItem, { backgroundColor: settings.state[modal.name] === item.value
               || item.selected
              ? colors.surface
              : colors.background,
            }]}
          />
        ))}
      </View>
      <Pressable
        style={[styles.pressOutside, { width, height, backgroundColor: colors.background }]}
        onPress={handleClose}
      />
    </>
  );
});
Settings.propTypes = {
  settings: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({
      ratio: PropTypes.string,
      resolution: PropTypes.string,
      type: PropTypes.string,
      zoom: PropTypes.number,
    }),
  }),
};
Settings.defaultProps = {
  settings: {
    dispatch: () => {},
    state: {},
  },
};

export default Settings;
