import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Picker, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommonPropTypes, DamageMode, VehicleType } from '../../resources';

const styles = StyleSheet.create({
  panelContainer: {
    position: 'fixed',
    bottom: 50,
    right: 50,
    zIndex: 99999,
    borderRadius: 25,
    padding: 20,
    backgroundColor: '#0e1a36',
  },
  closeContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  closeBtn: {
    padding: 15,
    width: 'fit-content',
  },
  closeBtnText: {
    fontSize: 24,
    color: '#FFFFFF',
    width: 'fit-content',
  },
  comboContainer: {
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comboTxt: {
    color: '#FFFFFF',
    paddingRight: 20,
  },
  combo: {
    height: 50,
    width: 150,
  },
  openBtn: {
    position: 'fixed',
    bottom: 50,
    right: 50,
    zIndex: 99999,
    borderRadius: 99999,
    padding: 20,
    backgroundColor: '#0e1a36',
  },
  openBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default function MockControlPanel({
  vehicleType,
  damageMode,
  onSelectVehicleType,
  onSelectDamageMode,
}) {
  const [isOpened, setIsOpened] = useState(false);

  const handleSelectVehicleType = useCallback((vt) => {
    onSelectVehicleType(vt);
    setIsOpened(false);
  }, [onSelectVehicleType]);

  const handleSelectDamageMode = useCallback((dm) => {
    onSelectDamageMode(dm);
    setIsOpened(false);
  }, [onSelectDamageMode]);

  return isOpened ? (
    <View style={[styles.panelContainer]}>
      <View style={[styles.closeContainer]}>
        <TouchableOpacity style={[styles.closeBtn]} onPress={() => setIsOpened(false)}>
          <Text style={[styles.closeBtnText]}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.comboContainer]}>
        <Text style={[styles.comboTxt]}>Vehicle type</Text>
        <Picker
          selectedValue={vehicleType}
          style={[styles.combo]}
          onValueChange={(value) => handleSelectVehicleType(value)}
        >
          {Object.values(VehicleType).map((vt) => (
            <Picker.Item key={vt} label={vt} value={vt} />
          ))}
        </Picker>
      </View>
      <View style={[styles.comboContainer]}>
        <Text style={[styles.comboTxt]}>Damage Mode</Text>
        <Picker
          selectedValue={damageMode}
          style={[styles.combo]}
          onValueChange={(value) => handleSelectDamageMode(value)}
        >
          {Object.values(DamageMode).map((vt) => (
            <Picker.Item key={vt} label={vt} value={vt} />
          ))}
        </Picker>
      </View>
    </View>
  ) : (
    <TouchableOpacity style={[styles.openBtn]} onPress={() => setIsOpened(true)}>
      <Text style={[styles.openBtnTxt]}>Test Panel</Text>
    </TouchableOpacity>
  );
}

MockControlPanel.propTypes = {
  damageMode: CommonPropTypes.damageMode.isRequired,
  onSelectDamageMode: PropTypes.func,
  onSelectVehicleType: PropTypes.func,
  vehicleType: CommonPropTypes.vehicleType.isRequired,
};
MockControlPanel.defaultProps = {
  onSelectDamageMode: () => {},
  onSelectVehicleType: () => {},
};
