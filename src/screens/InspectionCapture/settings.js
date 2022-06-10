import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { useTheme, Menu, List } from 'react-native-paper';
import PropTypes from 'prop-types';

import { Actions } from '@monkvision/camera';

import styles from './styles';

const requestScreenful = () => {
  document.fullscreenEnabled = document.fullscreenEnabled
   || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

  function requestFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }

  if (document.fullscreenEnabled) {
    requestFullscreen(document.documentElement);
  }
};

const modals = {
  default: [{ title: 'Resolution', value: 'resolution' }, { title: 'Fullscreen', value: 'fullscreen' }],
  resolution: [{ title: 'FHD', value: 'FHD' }, { title: 'QHD', value: 'QHD' }],
};

const Settings = forwardRef(({ settings }, ref) => {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const [modal, setModal] = useState({ visible: false, name: null });
  const handleClose = () => setModal({ visible: false, name: null });

  const handleSelect = (name) => {
    // select only value that are not one of the `modals` keys
    if (name === 'fullscreen') { requestScreenful(); return; }
    if (Object.keys(modals).includes(name)) { setModal({ visible: true, name }); return; }

    settings.dispatch({
      type: Actions.settings.UPDATE_SETTINGS,
      payload: { [modal.name]: name },
    });
  };

  useImperativeHandle(ref, () => ({
    open: () => handleSelect('default'),
  }));

  if (!modal.visible) { return null; }
  return (
    <>
      <View style={[styles.settings, { backgroundColor: colors.background }]}>
        <List.Subheader>Settings</List.Subheader>
        {modals[modal.name].map((item) => (
          <Menu.Item
            onPress={() => handleSelect(item.value)}
            title={item.title}
            key={item.value}
            style={[styles.settingItem, { backgroundColor: settings.state[modal.name] === item.value
              ? colors.highlightBoneColor
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
