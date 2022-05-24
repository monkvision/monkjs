import { useError, useInterval } from '@monkvision/toolkit';
import useAuth from 'hooks/useAuth';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { View, useWindowDimensions, FlatList } from 'react-native';
import { Container } from '@monkvision/ui';
import monk from '@monkvision/corejs';
import { useMediaQuery } from 'react-responsive';
import { ActivityIndicator, Button, Card, List, Surface, useTheme } from 'react-native-paper';
import Inspection from 'components/Inspection';
import { TASKS_BY_MOD } from 'screens/InspectionCreate/useCreateInspection';
import Artwork from 'screens/Landing/Artwork';
import useGetInspection from 'screens/Landing/useGetInspection';

import * as names from 'screens/names';
import styles from './styles';

const LIST_ITEMS = [{
  value: 'vinNumber',
  title: 'VIN recognition',
  description: 'Vehicle info obtained from OCR',
  icon: 'car-info',
}, {
  value: 'car360',
  title: 'Damage detection',
  description: 'Vehicle tour (exterior and interior)',
  icon: 'axis-z-rotate-counterclockwise',
}, {
  value: 'wheels',
  title: 'Wheels analysis',
  description: 'Details about rims condition',
  icon: 'circle-double',
}];

const STATUSES = {
  NOT_STARTED: 'Waiting to be started',
  TODO: 'In progress...',
  IN_PROGRESS: 'In progress...',
  DONE: 'Has finished!',
  ERROR: 'Failed!',
};

const ICON_BY_STATUS = {
  NOT_STARTED: 'chevron-right',
  DONE: 'check-bold',
  ERROR: 'alert-octagon',
};

export default function Landing() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { height } = useWindowDimensions();
  const errorHandler = useError();

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const route = useRoute();
  const { inspectionId } = route.params || {};

  const getInspection = useGetInspection(inspectionId);
  const inspection = useMemo(
    () => getInspection?.denormalizedEntities[0],
    [getInspection],
  );

  const handleReset = useCallback(() => {
    navigation.navigate(names.LANDING);
  }, [navigation]);

  const handleListItemPress = useCallback((value) => {
    // const shouldSignIn = utils.getOS() === 'ios' && !isAuthenticated;
    const shouldSignIn = !isAuthenticated;
    const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_CREATE;
    navigation.navigate(to, { selectedMod: value, inspectionId });
  }, [inspectionId, navigation, isAuthenticated]);

  const renderListItem = useCallback(({ item, index }) => {
    const { title, icon, value, description } = item;
    const taskName = TASKS_BY_MOD[value];
    const task = Object.values(inspection?.tasks || {}).find((t) => t?.name === taskName);
    const disabled = [
      monk.types.ProgressStatus.TODO,
      monk.types.ProgressStatus.IN_PROGRESS,
      monk.types.ProgressStatus.DONE,
      monk.types.ProgressStatus.ERROR,
    ].includes(task?.status);

    const left = () => <List.Icon icon={icon} />;
    const right = () => ([
      monk.types.ProgressStatus.TODO,
      monk.types.ProgressStatus.IN_PROGRESS,
    ].includes(task?.status)
      ? <ActivityIndicator color="white" size={16} style={styles.listLoading} />
      : <List.Icon icon={ICON_BY_STATUS[task?.status] || 'chevron-right'} />);

    const handlePress = () => handleListItemPress(value);
    const status = task?.status ? STATUSES[task.status] : description;

    return (
      <Surface style={(index % 2 === 0) ? styles.evenListItem : styles.oddListItem}>
        <List.Item
          title={title}
          description={status}
          left={left}
          right={right}
          onPress={handlePress}
          disabled={disabled}
        />
      </Surface>
    );
  }, [handleListItemPress, inspection]);

  const start = useCallback(() => {
    if (inspectionId && getInspection.state.loading !== true) {
      getInspection.start().catch((err) => errorHandler(err));
    }
  }, [inspectionId, getInspection]);

  const intervalId = useInterval(start, 1000);

  useFocusEffect(useCallback(() => {
    start();
    return () => clearInterval(intervalId);
  }, [navigation, start, intervalId]));

  return (
    <View style={{ minHeight: height, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.gradient, colors.background]}
        style={[styles.background, { height }]}
      />
      <Container style={[styles.root, isPortrait ? styles.portrait : {}]}>
        <View style={[styles.left, isPortrait ? styles.leftPortrait : {}]}>
          {isEmpty(getInspection.denormalizedEntities) ? <Artwork /> : (
            getInspection.denormalizedEntities.map((i) => (
              <Inspection {...i} key={`landing-inspection-${i.id}`} />
            )))}
        </View>
        <Card style={[styles.right, isPortrait ? styles.rightPortrait : {}]}>
          <List.Section>
            <List.Subheader>Click to run a new inspection</List.Subheader>
            <FlatList
              data={LIST_ITEMS}
              renderItem={renderListItem}
              keyExtractor={(item) => item.value}
            />
          </List.Section>
          {!isEmpty(inspection) ? (
            <Card.Actions style={styles.actions}>
              <Button color={colors.text} onPress={handleReset}>Reset inspection</Button>
            </Card.Actions>
          ) : null}
        </Card>
      </Container>
    </View>
  );
}
