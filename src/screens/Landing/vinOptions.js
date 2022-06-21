import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { useTheme, Menu, List } from 'react-native-paper';
import * as names from 'screens/names';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import styles from './styles';

const options = [{ title: 'Use AI detection', value: 'automatic' }, { title: 'Type it manually', value: 'manually' }];

const VinOptions = forwardRef(({ inspectionId, isAuthenticated }, ref) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const [modal, setModal] = useState(false);

  const close = () => setModal(false);
  const open = () => setModal(true);

  const handleSelect = useCallback((name) => {
    const shouldSignIn = !isAuthenticated;

    // select only value that are not one of the `modals` keys
    if (name === 'manually') {
      // prompt
      const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_PROMPT;
      navigation.navigate(to, { selectedMod: 'vinNumber', to: names.INSPECTION_PROMPT, inspectionId });
      return;
    }

    const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_CREATE;
    navigation.navigate(to, { selectedMod: 'vinNumber', inspectionId });

    // open camera
  }, [isAuthenticated, inspectionId, navigation]);

  useImperativeHandle(ref, () => ({ open, close }));

  if (!modal) { return null; }
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, width: '100%', height: '100%' }}>
      <View style={{ position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
      >
        <View style={[styles.optionsModal, { backgroundColor: colors.background }]}>
          <List.Subheader>Vin</List.Subheader>
          {options.map((item) => !item.hidden && (
          <Menu.Item
            onPress={() => { handleSelect(item.value); close(); }}
            title={item.title}
            key={item.value}
            style={styles.option}
          />
          ))}
        </View>
        <Pressable
          style={[styles.pressOutside, { width, height, backgroundColor: colors.surface }]}
          onPress={close}
        />
      </View>
    </View>
  );
});

VinOptions.propTypes = {
  inspectionId: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
};
VinOptions.defaultProps = {
  inspectionId: undefined,
};

export default VinOptions;
