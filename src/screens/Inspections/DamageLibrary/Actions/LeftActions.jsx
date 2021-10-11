import React from 'react';
import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import Vehicle from '@monkvision/react-native/src/components/Vehicle';
import { classic as classicCar } from '../../../../assets/svg/vehicles';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    top: 60,
    left: 80,
    bottom: 20,
    ...Platform.select({
      native: { flex: 1 },
      default: {
        display: 'flex',
        flex: 1,
      },
    }),
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center',
    width: 92,
  },
  card: {
    width: '100%',
    height: 92,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardCover: {
    alignSelf: 'center',
  },
});
export default function DamageLibraryLeftActions(props) {
  const { handlePress, selected } = props;

  return (
    <View style={styles.root}>
      <View style={selected === 'front' ? [styles.card, styles.cardSelected] : [styles.card]}>
        <TouchableOpacity onPress={() => handlePress('front')}>
          <Vehicle pressAble={false} xml={classicCar.front} width={52} height={92} />
        </TouchableOpacity>
      </View>

      <View onPress={handlePress} style={selected === 'back' ? [styles.card, styles.cardSelected] : [styles.card]}>
        <TouchableOpacity onPress={() => handlePress('back')}>
          <Vehicle pressAble={false} xml={classicCar.back} width={52} height={92} />
        </TouchableOpacity>
      </View>

      <View onPress={handlePress} style={selected === 'top' ? [styles.card, styles.cardSelected] : [styles.card]}>
        <TouchableOpacity onPress={() => handlePress('top')}>
          <Vehicle pressAble={false} xml={classicCar.top} width={52} height={92} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

DamageLibraryLeftActions.propTypes = {
  handlePress: PropTypes.func,
  selected: PropTypes.string,
};

DamageLibraryLeftActions.defaultProps = {
  handlePress: noop,
  selected: 'front',
};
