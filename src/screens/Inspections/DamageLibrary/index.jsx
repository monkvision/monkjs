import React, {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Surface, IconButton, ProgressBar, Text, Colors } from 'react-native-paper';
import * as ScreenOrientation from 'expo-screen-orientation';
import Vehicle from '@monkvision/react-native/src/components/Vehicle';
import DamageLibraryLeftActionsActions from './Actions/LeftActions';
import { GuideButton, ValidateButton } from './Actions/Buttons';
import { classic as classicCar } from '../../../assets/svg/vehicles';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  surface: {
    ...Platform.select({
      native: { flex: 1 },
      default: {
        display: 'flex',
        flex: 1,
      },
    }),
    flexDirection: 'column',
    flexWrap: 'wrap',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 40,
    position: 'absolute',
  },
  close: {
    transform: [{ scale: 1.3 }],
    alignSelf: 'center',
  },
  progressContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
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

export default function DamageLibrary() {
  const navigation = useNavigation();
  const [currentView, setCurrentView] = useState('front');
  const unLockScreenAsync = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    await ScreenOrientation.unlockAsync();
  };
  const goBack = () => {
    unLockScreenAsync().then(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Inspections');
      }
    });
  };

  useEffect(() => {
    async function lockScreenOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    };
    lockScreenOrientation();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Surface style={styles.surface}>
        {/* eslint-disable-next-line max-len */}
        <View style={styles.vehicle}>
          <Vehicle pressAble xml={classicCar[currentView]} width="100%" height="70%" />
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
          <Text style={styles.helpText}>Click on the vehicle parts to add damage</Text>
        </View>
        {/* eslint-disable-next-line max-len */}
        <DamageLibraryLeftActionsActions selected={currentView} handlePress={(selected) => setCurrentView(selected)} />
        <View style={styles.guideBtnContainer}><GuideButton onPress={() => console.log('open guide')} /></View>
        <View style={styles.validateBtnContainer}><ValidateButton style={styles.validateBtn} text="Validate report" onPress={() => console.log('validate damages')} /></View>
      </Surface>
    </SafeAreaView>
  );
}
