import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import monk, { useMonitoring } from '@monkvision/corejs';
import { useInterval, utils } from '@monkvision/toolkit';
import { Container } from '@monkvision/ui';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Inspection from 'components/Inspection';
import Modal from 'components/Modal';
import ExpoConstants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from 'hooks/useAuth';
import useSnackbar from 'hooks/useSnackbar';
import isEmpty from 'lodash.isempty';
import { useTranslation } from 'react-i18next';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Button, Card, List, Surface, useTheme } from 'react-native-paper';
import { useMediaQuery } from 'react-responsive';
import Artwork from 'screens/Landing/Artwork';
import LanguageSwitch from 'screens/Landing/LanguageSwitch';
import SignOut from 'screens/Landing/SignOut';
import useGetInspection from 'screens/Landing/useGetInspection';

import * as names from 'screens/names';
import { version } from '@package/json';
import styles from './styles';
import useGetPdfReport from './useGetPdfReport';
import useUpdateOneTask from './useUpdateOneTask';
import useVinModal from './useVinModal';
import VehicleType from './VehicleType';
import useUpdateInspectionVehicle from './useUpdateInspectionVehicle';

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
  const { t, i18n } = useTranslation();
  const { setShowTranslatedMessage, Notice } = useSnackbar(true);

  const [vehicleType, setVehicleType] = useState('');
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const route = useRoute();
  const { inspectionId } = route.params || {};
  const vinOptionsRef = useRef();

  const getInspection = useGetInspection(inspectionId);

  const inspection = useMemo(
    () => getInspection?.denormalizedEntities[0],
    [getInspection],
  );
  const selectors = useVinModal({ isAuthenticated, inspectionId, vehicle: { vehicleType } });

  const updateInspectionVehicle = useUpdateInspectionVehicle(
    inspectionId,
    { vehicleType, vin: inspection?.vehicle?.vin },
  );

  const allTasksAreCompleted = useMemo(
    () => inspection?.tasks?.length && inspection?.tasks
      .every(({ status }) => status === monk.types.ProgressStatus.DONE),
    [inspection?.tasks],
  );

  // NOTE(Ilyass):We update the ocr once the vin got changed manually,
  // so that the user can generate the pdf
  const { startUpdateOneTask } = useUpdateOneTask(inspectionId, monk.types.TaskName.IMAGES_OCR);

  const {
    preparePdf,
    handleDownload,
    reportUrl,
    loading: pdfLoading,
  } = useGetPdfReport(inspectionId);

  useEffect(() => {
    if (allTasksAreCompleted && !reportUrl) {
      preparePdf();
    }
  }, [allTasksAreCompleted, reportUrl]);

  useEffect(() => {
    if (inspection?.vehicle?.vin
      && inspection?.tasks?.find((item) => item.name === monk.types.TaskName.IMAGES_OCR)) {
      startUpdateOneTask();
    }
  }, [inspection?.vehicle?.vin, inspection?.tasks]);

  const handleReset = useCallback(() => {
    utils.log(['[Click] Resetting the inspection: ', inspectionId]);
    // TODO: Add Monitoring code for setTag in MN-182
    navigation.navigate(names.LANDING);
  }, [navigation, inspectionId]);

  const handleListItemPress = useCallback((value) => {
    const isVin = value === 'vinNumber';
    const vinOption = ExpoConstants.manifest.extra.options.find((option) => option.value === 'vinNumber');
    if (isVin && vinOption?.mode.includes('manually')) { vinOptionsRef.current?.open(); return; }

    const shouldSignIn = !isAuthenticated;
    const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_CREATE;
    navigation.navigate(to, { selectedMod: value, inspectionId, vehicle: { vehicleType } });
  }, [inspectionId, navigation, isAuthenticated, vehicleType]);

  const renderListItem = useCallback(({ item, index }) => {
    const { title, icon, value, description } = item;
    const isVin = value === 'vinNumber';
    const vin = inspection?.vehicle?.vin;

    const taskName = ExpoConstants.manifest.extra.options.find((o) => o.value === value)?.taskName;
    const task = Object.values(inspection?.tasks || {})
      .find((taskObj) => taskObj?.name === taskName);

    const disabledTaskStatuses = [
      monk.types.ProgressStatus.TODO,
      monk.types.ProgressStatus.IN_PROGRESS,
      monk.types.ProgressStatus.DONE,
      monk.types.ProgressStatus.ERROR,
    ].includes(task?.status);
    const disabled = disabledTaskStatuses && !isVin;

    const composeStatus = () => {
      if (isVin && vin) {
        return {
          status: vin,
          icon: ICON_BY_STATUS[monk.types.ProgressStatus.DONE],
        };
      }
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

  const vinModalItems = useMemo(() => {
    const vinTask = Object.values(inspection?.tasks || {}).find((task) => task?.name === 'images_ocr');
    const disabled = [
      monk.types.ProgressStatus.TODO, monk.types.ProgressStatus.IN_PROGRESS,
      monk.types.ProgressStatus.DONE, monk.types.ProgressStatus.ERROR,
    ].includes(vinTask?.status);

    return [
      { title: t('vinModal.camera'), value: 'automatic', disabled, icon: 'camera' },
      { title: t('vinModal.manual'), value: 'manually', icon: 'file-edit' },
    ];
  }, [inspection, i18n.language]);

  const isPdfDisabled = useMemo(
    () => !allTasksAreCompleted || !reportUrl,
    [allTasksAreCompleted, reportUrl],
  );

  useEffect(() => {
    if (!vehicleType || vehicleType === inspection?.vehicle?.vehicleType
      || !inspectionId || !inspection?.vehicle?.vin) { return; }
    (async () => {
      const response = await updateInspectionVehicle.start();
      if (response !== null) {
        // TODO: Add Monitoring code for setTag in MN-182
        navigation.navigate(names.LANDING, route.params);
      }
    })();
  }, [vehicleType, inspection?.vehicle?.vehicleType, inspectionId, inspection?.vehicle?.vin]);

  const pdfDownloadLeft = useCallback(
    () => (pdfLoading
      ? <ActivityIndicator />
      : <List.Icon icon="file-pdf-box" color={isPdfDisabled ? '#8d8d8dde' : undefined} />),
    [pdfLoading, isPdfDisabled],
  );

  const pdfDownloadRight = useCallback(
    () => (pdfLoading || isPdfDisabled
      ? null
      : <List.Icon icon="check-bold" />),
    [pdfLoading, isPdfDisabled],
  );

  return (
    <View style={[styles.root, { minHeight: height, backgroundColor: colors.background }]}>
      <Modal
        items={vinModalItems}
        ref={vinOptionsRef}
        {...selectors.vin}
      />
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
              loading={updateInspectionVehicle.state.loading}
            />
            <List.Subheader>{t('landing.menuHeader')}</List.Subheader>
            <FlatList
              data={ExpoConstants.manifest.extra.options}
              renderItem={renderListItem}
              keyExtractor={(item) => item.value}
            />
          </List.Section>
          <List.Section>
            <List.Item
              title={t('landing.downloadPdf')}
              description={t('landing.downloadPdfDescription')}
              left={pdfDownloadLeft}
              right={pdfDownloadRight}
              onPress={handleDownload}
              disabled={isPdfDisabled}
              titleStyle={isPdfDisabled ? { color: '#8d8d8dde' } : undefined}
              descriptionStyle={isPdfDisabled ? { color: '#8686868a' } : undefined}
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
