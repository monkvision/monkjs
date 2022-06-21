import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as names from 'screens/names';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function InspectionPrompt() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    // Alert.prompt('Vin', 'Please enter the vin number', (v) => console.log(v));

    // eslint-disable-next-line no-alert
    const vin = prompt('Vin', 'Please enter the vin number');
    if (vin) { navigation.navigate(names.LANDING, { vin }); }
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>Please fill the needed content on the prompt</Text>
    </View>
  );
}
