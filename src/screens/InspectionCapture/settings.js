import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme, Menu } from 'react-native-paper';
import PropTypes from 'prop-types';

import { Actions } from '@monkvision/camera';

import styles from './styles';

const modals = {
  default: [{ title: 'Resolution', value: 'resolution' }, { title: 'Ratio', value: 'ratio' }],
  resolution: [{ title: 'FHD', value: 'FHD' }, { title: 'QHD', value: 'QHD' }],
  ratio: [{ title: '4:3', value: '4:3' }, { title: '16:9', value: '16:9' }],
};

const Settings = forwardRef(({ settings }, ref) => {
  const { colors } = useTheme();
  const [modal, setModal] = useState({ visible: false, name: null });
  const handleClose = () => setModal({ visible: false, name: null });

  const handleSelect = (name) => {
    // select only value that are not one of the `modals` keys
    if (Object.keys(modals).includes(name)) { setModal({ visible: true, name }); return; }

    settings.dispatch({
      type: Actions.settings.UPDATE_SETTINGS,
      payload: { [modal.name]: name },
    });
  };

  useImperativeHandle(ref, () => ({
    select: handleSelect,
    open: () => handleSelect('default'),
  }));

  if (!modal.visible) { return null; }
  return (
    <>
      <View style={[styles.settings, { backgroundColor: colors.background }]}>
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
        style={[styles.pressOutside, { backgroundColor: colors.background }]}
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
