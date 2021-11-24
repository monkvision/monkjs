import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOneInspectionById, selectInspectionById, selectAllParts } from '@monkvision/corejs';
import { Vehicle } from '@monkvision/react-native';
import { useFakeActivity, ActivityIndicatorView } from '@monkvision/react-native-views';

import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Surface, ProgressBar, Text, Colors, Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import vehicleViews from 'assets/vehicle.json';

import camelCase from 'lodash.camelcase';

import DamageLibraryLeftActions from './Actions/LeftActions';
import { GuideButton, ValidateButton } from './Actions/Buttons';

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
    top: 16,
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
  const dispatch = useDispatch();

  const { inspectionId } = route.params;
  const inspection = useSelector((state) => selectInspectionById(state, inspectionId));
  const { loading, error } = useSelector((state) => state.inspections);

  const parts = useSelector((state) => selectAllParts(state)
    .filter((part) => inspection.parts?.includes(part.id)));

  const [currentView, setCurrentView] = useState('front');
  const [activeParts, setActiveParts] = useState({});

  // using the following ref we avoid having re-rendering loop
  const ref = useRef({ rerenders: 0 });
  useEffect(() => {
    if (parts?.length && ref.current.rerenders === 0) {
      // convert parts array to object
      const normalizedParts = parts.reduce((acc, cur) => {
        acc[camelCase(cur.part_type)] = true;
        return acc;
      }, {});

      setActiveParts(normalizedParts);
      ref.current.rerenders += 1;
    }
  }, [parts]);

  const [fakeActivity] = useFakeActivity(loading === 'pending');
  const handlePress = (id, isActive) => {
    setActiveParts((prev) => ({ ...prev, [id]: isActive }));
  };

  const handleGoBack = useCallback(() => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.BackAction onPress={handleGoBack} />
            <Appbar.Content title="Damage Library" />
          </Appbar.Header>
        ),
      });
    }
  }, [handleGoBack, navigation]);

  const handleReportValidation = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log(activeParts);
  }, [activeParts]);

  useEffect(() => {
    if (loading !== 'pending' && !inspection?.damages && !error) {
      dispatch(getOneInspectionById({ id: inspectionId }));
    }
  }, [dispatch, error, inspection?.damages, inspectionId, loading]);

  return (
    <SafeAreaView style={styles.root}>
      <Surface style={styles.surface}>
        <View style={styles.vehicle}>
          {fakeActivity ? (
            <ActivityIndicatorView light />
          ) : (
            <Vehicle
              xml={vehicleViews[currentView]}
              onPress={handlePress}
              activeParts={activeParts}
              width="100%"
              height="85%"
            />
          )}
        </View>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>70%</Text>
            <ProgressBar progress={0.5} color={Colors.blue300} style={styles.progressBar} />
          </View>
        </View>
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpText}>Click on the vehicle parts to add damage </Text>
          <MaterialCommunityIcons name="brain" color="#274B9F" size={30} />
        </View>
        <DamageLibraryLeftActions
          selected={currentView}
          handlePress={(selected) => setCurrentView(selected)}
          activeParts={activeParts}
        />
        <View style={styles.guideBtnContainer}>
          <GuideButton
            onPress={
              // eslint-disable-next-line no-console
              () => console.log('open guide')
            }
          />
        </View>
        <View style={styles.validateBtnContainer}>
          <ValidateButton
            style={styles.validateBtn}
            text="Validate report"
            onPress={handleReportValidation}
          />
        </View>
      </Surface>
    </SafeAreaView>
  );
}

DamageLibrary.propTypes = {
  navigation: PropTypes.shape({
    canGoBack: PropTypes.func,
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({ inspectionId: PropTypes.string }),
  }).isRequired,
};
