import { useError, useInterval } from '@monkvision/toolkit';
import ExpoConstants from 'expo-constants';
import useAuth from 'hooks/useAuth';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo, useEffect } from 'react';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { View, useWindowDimensions, FlatList } from 'react-native';
import { Container } from '@monkvision/ui';
import monk from '@monkvision/corejs';
import { useMediaQuery } from 'react-responsive';
import { ActivityIndicator, Button, Card, List, Surface, useTheme } from 'react-native-paper';
import Inspection from 'components/Inspection';
import Artwork from 'screens/Landing/Artwork';
import useGetInspection from 'screens/Landing/useGetInspection';

import * as names from 'screens/names';
import styles from './styles';
import Sentry from '../../config/sentry';
import { setTag } from '../../config/sentryPlatform';

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
  const { errorHandler, Constants } = useError(Sentry);

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const route = useRoute();
  const { inspectionId } = route.params || {};

  const getInspection = useGetInspection(inspectionId);
  const inspection = useMemo(
    () => getInspection?.denormalizedEntities[0],
    [getInspection],
  );

  const handleReset = useCallback(() => {
    Sentry.Browser.setTag('inspection_id', undefined); // unset the tag `inspection_id`
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
    const taskName = ExpoConstants.manifest.extra.options.find((o) => o.value === value)?.taskName;
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
      getInspection.start().catch((err) => errorHandler(err, Constants.type.APP));
    }
  }, [inspectionId, getInspection]);

  const intervalId = useInterval(start, 1000);

  useFocusEffect(useCallback(() => {
    start();
    return () => clearInterval(intervalId);
  }, [navigation, start, intervalId]));

  useEffect(() => {
    setTag('device_model', Device.modelName);
  }, []);

  return (
    <View style={{ minHeight: height, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.gradient, colors.background]}
        style={[styles.background, { height }]}
      />
      <Container style={[styles.root, isPortrait ? styles.portrait : {}]}>
        {isEmpty(getInspection.denormalizedEntities) && (
          <View style={[styles.left, isPortrait ? styles.leftPortrait : {}]}>
            <Artwork />
          </View>
        )}
        <Card style={[styles.card, styles.right, isPortrait ? styles.rightPortrait : {}]}>
          {!isEmpty(getInspection.denormalizedEntities) && (
            getInspection.denormalizedEntities.map((i) => (
              <Inspection {...i} key={`landing-inspection-${i.id}`} />
            )))}
          <List.Section>
            <List.Subheader>Click to run a new inspection</List.Subheader>
            <FlatList
              data={ExpoConstants.manifest.extra.options}
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
