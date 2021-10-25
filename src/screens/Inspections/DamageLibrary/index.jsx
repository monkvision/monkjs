import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Surface, IconButton, ProgressBar, Text, Colors } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Vehicle from '@monkvision/react-native/src/components/Vehicle';
import monkCore from 'config/monkCore';
import useMinLoadingTime from 'hooks/useMinLoadingTime';
import ActivityIndicatorScreen from 'screens/ActivityIndicator';
import { getInitialActiveParts } from '../../../utils/inspection.utils';

import { classic as classicCar } from '../../../assets/svg/vehicles';
import DamageLibraryLeftActions from './Actions/LeftActions';
import { GuideButton, ValidateButton } from './Actions/Buttons';

const { useGetInspectionByIdQuery } = monkCore.inspection;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row-reverse',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',

    height: '100%',
  },
  surface: {
    height: '100%',
    ...Platform.select({
      native: { flex: 1 },
      default: {
        display: 'flex',
        flex: 1,
      },
    }),
    backgroundColor: '#E5E5E5',
  },
  vehicle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: '8%',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 40,
    position: 'absolute',
  },
  close: {
    transform: [{ scale: 1.3 }],
    alignSelf: 'center',
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 120,
  },
  progressText: {
    alignSelf: 'center',
    fontSize: 15,
    color: '#274B9F',
  },
  progressBar: {
    height: 6,
  },
  helpTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    alignSelf: 'center',
    top: 50,
  },
  helpText: {
    fontSize: 17,
    fontWeight: '400',
    // fontFamily: 'roboto',
  },
  guideBtnContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 30,
    right: 30,
  },
  validateBtnContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 30,
    right: 30,
  },
});

export default function DamageLibrary({ navigation, route }) {
  const [currentView, setCurrentView] = useState('front');
  const [activeParts, setActiveParts] = useState({});

  const inspectionId = route.params?.inspectionId ?? '57dc368c-785a-b7ef-570f-6b8771b4bc49'; // SAMPLE INSPECTION
  const { isLoading, data } = useGetInspectionByIdQuery(inspectionId);
  const minLoading = useMinLoadingTime(isLoading);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Inspections');
    }
  };

  const handlePress = (id, isActive, localActiveParts) => {
    console.log(id, isActive, localActiveParts);
    setActiveParts((prev) => ({ ...prev, [id]: isActive }));
  };

  useEffect(() => { setActiveParts(getInitialActiveParts(data)); }, [data]);

  return (
    <SafeAreaView style={styles.root}>
      <Surface style={styles.surface}>
        <View style={styles.vehicle}>
          {minLoading ? (<ActivityIndicatorScreen />) : (
            <Vehicle
              pressAble
              xml={classicCar[currentView]}
              onPress={handlePress}
              activeParts={activeParts}
              width="100%"
              height="85%"
            />
          )}
        </View>
        <View style={styles.header}>
          <IconButton
            accessibilityLabel="Cancel"
            icon="close"
            onPress={goBack}
            style={styles.close}
            color={Colors.grey700}
          />
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>70%</Text>
            <ProgressBar progress={0.5} color={Colors.blue300} style={styles.progressBar} />
          </View>
        </View>
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpText}>Click on the vehicle parts to add damage </Text>
          <MaterialCommunityIcons name="brain" color="#274B9F" size={30} />
        </View>
        {/* eslint-disable-next-line max-len */}
        <DamageLibraryLeftActions selected={currentView} handlePress={(selected) => setCurrentView(selected)} activeParts={activeParts} />
        <View style={styles.guideBtnContainer}><GuideButton onPress={() => console.log('open guide')} /></View>
        <View style={styles.validateBtnContainer}><ValidateButton style={styles.validateBtn} text="Validate report" onPress={() => console.log('validate damages')} /></View>
      </Surface>
    </SafeAreaView>
  );
}
