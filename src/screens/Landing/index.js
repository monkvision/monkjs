import monk, { useMonitoring } from '@monkvision/corejs';
import { useInterval, utils } from '@monkvision/toolkit';
import { Container } from '@monkvision/ui';
import { version } from '@package/json';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Inspection from 'components/Inspection';
import ExpoConstants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from 'hooks/useAuth';
import useSnackbar from 'hooks/useSnackbar';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Button, Card, List, Surface, useTheme } from 'react-native-paper';
import { useMediaQuery } from 'react-responsive';
import Artwork from 'screens/Landing/Artwork';
import LanguageSwitch from 'screens/Landing/LanguageSwitch';
import SignOut from 'screens/Landing/SignOut';
import useGetInspection from 'screens/Landing/useGetInspection';
import * as names from 'screens/names';
import styles from './styles';
// import useGetPdfReport from './useGetPdfReport';
import VehicleType from './VehicleType';

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
  const { errorHandler } = useMonitoring();
  const { t } = useTranslation();
  const { setShowTranslatedMessage, Notice } = useSnackbar(true);

  const [vehicleType, setVehicleType] = useState('');
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const route = useRoute();
  const { inspectionId } = route.params || {};

  const getInspection = useGetInspection(inspectionId);

  const inspection = useMemo(
    () => getInspection?.denormalizedEntities[0],
    [getInspection],
  );

  const allTasksAreCompleted = useMemo(
    () => inspection?.tasks?.length && inspection?.tasks
      .every(({ status }) => status === monk.types.ProgressStatus.DONE),
    [inspection?.tasks],
  );

  const handleReset = useCallback(() => {
    utils.log(['[Click] Resetting the inspection: ', inspectionId]);
    navigation.navigate(names.LANDING);
  }, [navigation, inspectionId]);

  const handleListItemPress = useCallback((value) => {
    const shouldSignIn = !isAuthenticated;
    const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_CREATE;
    navigation.navigate(to, {
      selectedMod: value,
      inspectionId,
      vehicle: { vehicleType },
      isLastTour: true,
    });
  }, [inspectionId, navigation, isAuthenticated, vehicleType]);

  const renderListItem = useCallback(({ item, index }) => {
    const { title, icon, value, description } = item;

    const taskName = ExpoConstants.manifest.extra.options.find((o) => o.value === value)?.taskName;
    const task = Object.values(inspection?.tasks || {})
      .find((taskObj) => taskObj?.name === taskName);

    const disabledTaskStatuses = [
      monk.types.ProgressStatus.TODO,
      monk.types.ProgressStatus.IN_PROGRESS,
      monk.types.ProgressStatus.DONE,
      monk.types.ProgressStatus.ERROR,
    ].includes(task?.status);
    const disabled = disabledTaskStatuses;

    const composeStatus = () => {
      if (task?.status) {
        return {
          status: t(`inspection.status.${task.status}`),
          icon: ICON_BY_STATUS[task.status],
        };
      }
      return { status: t(description), icon: 'chevron-right' };
    };

    const left = () => <List.Icon icon={icon} />;
    const right = () => ([
      monk.types.ProgressStatus.TODO,
      monk.types.ProgressStatus.IN_PROGRESS,
    ].includes(task?.status)
      ? <ActivityIndicator color="white" size={16} style={styles.listLoading} />
      : <List.Icon icon={composeStatus().icon} />);

    const handlePress = () => handleListItemPress(value);

    return (
      <Surface style={(index % 2 === 0) ? styles.evenListItem : styles.oddListItem}>
        <List.Item
          title={t(title)}
          description={composeStatus().status}
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
      getInspection.start().catch((err) => {
        errorHandler(err);
      });
    }
  }, [inspectionId, getInspection]);

  const intervalId = useInterval(start, 1000);

  useFocusEffect(useCallback(() => {
    start();
    return () => clearInterval(intervalId);
  }, [navigation, start, intervalId]));

  useEffect(() => {
    if (inspectionId && !allTasksAreCompleted) {
      setShowTranslatedMessage('landing.workflowReminder');
    } else { setShowTranslatedMessage(null); }
  }, [allTasksAreCompleted, inspectionId]);
  // );

  return (
    <View style={[styles.root, { minHeight: height, backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradient, colors.background]}
        style={[styles.background, { height }]}
      />
      <Container style={[styles.container, isPortrait ? styles.portrait : {}]}>
        {isEmpty(getInspection.denormalizedEntities) && (
          <View style={[styles.left, isPortrait ? styles.leftPortrait : {}]}>
            <Artwork />
          </View>
        )}
        <Card style={[styles.card, styles.right, isPortrait ? styles.rightPortrait : {}]}>
          <List.Section style={styles.textAlignRight}>
            <List.Subheader>
              {t('landing.appVersion')}
              {': '}
              {version}
            </List.Subheader>
          </List.Section>
          <List.Section>
            <List.Subheader>Select vehicle type</List.Subheader>
            <VehicleType
              selected={inspection?.vehicle?.vehicleType || vehicleType}
              onSelect={(value) => setVehicleType(value)}
              colors={colors}
              locallySelected={vehicleType}
              loading={false}
            />
            <List.Subheader>{t('landing.menuHeader')}</List.Subheader>
            <FlatList
              data={ExpoConstants.manifest.extra.options}
              renderItem={renderListItem}
              keyExtractor={(item) => item.value}
            />
          </List.Section>
          <Card.Actions style={styles.actions}>
            <LanguageSwitch />
            {isAuthenticated && (
              <SignOut onSuccess={handleReset} />
            )}
          </Card.Actions>
          <Card.Actions style={styles.actions}>
            {!isEmpty(inspection) ? (
              <Button color={colors.text} onPress={handleReset}>{t('landing.resetInspection')}</Button>
            ) : null}
          </Card.Actions>
          {!isEmpty(getInspection.denormalizedEntities) && (
            getInspection.denormalizedEntities.map((i) => (
              <Inspection {...i} key={`landing-inspection-${i.id}`} />
            )))}
        </Card>
      </Container>
      <Notice />
    </View>
  );
}
