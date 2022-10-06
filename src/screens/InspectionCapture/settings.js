import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, useWindowDimensions, View } from 'react-native';
import { useTheme, Menu, List } from 'react-native-paper';
import PropTypes from 'prop-types';

import { Actions } from '@monkvision/camera';
import { utils } from '@monkvision/toolkit';

import { useMediaQuery } from 'react-responsive';
import styles from './styles';
import useFullscreen from './useFullscreen';

const settingsOptions = {
  RESOLUTION: 'resolution',
  COMPRESSION: 'compression',
  FULLSCREEN: 'fullscreen',
  DEFAULT: 'default',
  FHD: 'FHD',
  QHD: 'QHD',
  UHD: 'UHD',
};

const Settings = forwardRef(({ settings }, ref) => {
  const portraitMediaQuery = useMediaQuery({ query: '(orientation: portrait)' });

  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [modal, setModal] = useState({ visible: false, name: null });
  const handleClose = () => setModal({ visible: false, name: null });

  const { isFullscreen, requestFullscreen } = useFullscreen();

  const modals = useMemo(() => ({
    [settingsOptions.DEFAULT]: [
      { title: t('capture.settings.resolution'), value: settingsOptions.RESOLUTION },
      { title: t('capture.settings.compression'), value: settingsOptions.COMPRESSION },
      {
        hidden: Platform.OS !== 'web',
        title: isFullscreen ? t('capture.settings.exitFullscreen') : t('capture.settings.fullscreen'),
        value: settingsOptions.FULLSCREEN,
        selected: isFullscreen },
    ],
    [settingsOptions.RESOLUTION]: [
      { title: settingsOptions.FHD, value: settingsOptions.FHD },
      { title: settingsOptions.QHD, value: settingsOptions.QHD },
      // { title: settingsOptions.UHD, value: settingsOptions.UHD },
    ],
    [settingsOptions.COMPRESSION]: [
      { title: t('capture.settings.on'), value: true },
      { title: t('capture.settings.off'), value: false },
    ],
  }), [isFullscreen, i18n.language]);

  const handleSelect = useCallback((name) => {
    // select only value that are not one of the `modals` keys

    // fullscreen
    if (name === settingsOptions.FULLSCREEN) {
      utils.log(['[Click] Camera setting: ', 'Fullscreen ', 'on']);
      requestFullscreen();
      return;
    }

    // compressions
    if (modal.name === settingsOptions.COMPRESSION && typeof name === 'boolean') {
      utils.log(['[Click] Camera setting: ', 'Compression ', name ? 'on' : 'off']);
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
    utils.log(['[Click] Camera setting: ', modal.name, name]);
    settings.dispatch({
      type: Actions.settings.UPDATE_SETTINGS,
      payload: { [modal.name]: name },
    });
  }, [modals, requestFullscreen, modal.name]);

  useImperativeHandle(ref, () => ({
    open: () => handleSelect(settingsOptions.DEFAULT),
  }));

  if (!modal.visible || portraitMediaQuery) { return null; }

  return (
    <>
      <View style={[styles.settings, { backgroundColor: colors.background }]}>
        <List.Subheader>{t('capture.settings.title')}</List.Subheader>
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
