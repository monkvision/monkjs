import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import MonkIcon from 'components/Icons/MonkIcon';
import InspectionList from 'screens/Inspection/InspectionList';
import InspectionButton from 'screens/Landing/InspectionButton';

import styles from './styles';

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Home',
        headerTitle: () => (
          <MonkIcon
            width={135}
            height={34}
            color={colors.primary}
            style={styles.logo}
            alt="Monk logo"
          />
        ),
      });
    }
  }, [colors.primary, navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <InspectionList />
      <InspectionButton />
    </SafeAreaView>
  );
};
