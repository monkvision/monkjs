import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import monk, { useMonitoring } from '@monkvision/corejs';
import { useInterval } from '@monkvision/toolkit';
import { Container } from '@monkvision/ui';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'components/Modal';
import ExpoConstants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from 'hooks/useAuth';
import useSnackbar from 'hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Card, List, Surface, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import Artwork from 'screens/Landing/Artwork';
import LanguageSwitch from 'screens/Landing/LanguageSwitch';
import useGetInspection from 'screens/Landing/useGetInspection';

import * as names from 'screens/names';
import { version } from '@package/json';
import { authSlice } from 'store';
import { useClient, Clients, Workflows } from '../../contexts';
import styles from './styles';
import useGetPdfReport from './useGetPdfReport';
import useUpdateOneTask from './useUpdateOneTask';
import useVinModal from './useVinModal';
import useZlibCompression from './useZlibCompression';
import VehicleType from './VehicleType';
import useUpdateInspectionVehicle from './useUpdateInspectionVehicle';
import { ClientParamMap, VehicleTypeMap } from '../paramsMap';

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
  const { decompress } = useZlibCompression();

  const [vehicleType, setVehicleType] = useState('');
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const route = useRoute();
  const vinOptionsRef = useRef();
  const dispatch = useDispatch();

  const { workflow, setClient, info } = useClient();
  const [isLastTour, setIsLastTour] = useState(workflow !== Workflows.DEFAULT);

  useEffect(() => {
    const clientParam = new URLSearchParams(window.location.search)?.get('c');
    const client = clientParam ? (ClientParamMap[clientParam] ?? Clients.DEFAULT) : Clients.DEFAULT;
    setClient(client);
  }, [setClient]);

  const { clientId, inspectionId, token, vehicleTypeParam } = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const compressedToken = urlParams.get('t');
    const clientParam = urlParams.get('c');
    const vehicleParam = urlParams.get('v');

    return {
      inspectionId: urlParams.get('i'),
      vehicleTypeParam: (clientParam === 'pd8') ? vehicleParam : vehicleParam ?? 1,
      clientId: clientParam ? ClientParamMap[clientParam] : undefined,
      token: compressedToken ? decompress(compressedToken) : undefined,
    };
  }, []);

  const invalidParams = useMemo(
    () => (!clientId || !inspectionId || !token),
    [clientId, inspectionId, token],
  );

  useEffect(() => {
    if (workflow === Workflows.CAPTURE && !route.params?.captureComplete) {
      navigation.navigate(
        names.INSPECTION_CREATE,
        {
          selectedMod: 'car360',
          inspectionId,
          vehicle: { vehicleType: VehicleTypeMap[vehicleTypeParam] ?? 'cuv' },
          isLastTour: true,
        },
      );
    } else if (workflow === Workflows.CAPTURE_VEHICLE_SELECTION && !route.params?.captureComplete) {
      if (vehicleTypeParam && VehicleTypeMap[vehicleTypeParam]) {
        navigation.navigate(
          names.INSPECTION_CREATE,
          {
            selectedMod: 'car360',
            inspectionId,
            vehicle: { vehicleType: VehicleTypeMap[vehicleTypeParam] },
            isLastTour: true,
          },
        );
      } else {
        navigation.navigate(names.CAPTURE_VEHICLE_SELECTION, { inspectionId });
      }
    }
  }, [workflow, route, navigation, inspectionId, vehicleTypeParam]);

  useEffect(() => {
    if (token) {
      monk.config.accessToken = token;

      dispatch(authSlice.actions.update({
        accessToken: token,
        tokenType: 'Bearer',
        scope: 'openid profile email',
        isLoading: false,
        isSignedOut: false,
      }));
    }
  }, [token]);

  const shouldFetch = useMemo(() => (
    [Workflows.CAPTURE, Workflows.CAPTURE_VEHICLE_SELECTION].includes(workflow)
      ? route.params?.captureComplete : true
  ), [workflow, route]);

  const getInspection = useGetInspection(inspectionId);

  const invalidToken = useMemo(
    () => (getInspection?.state?.error?.response?.status === 401),
    [getInspection],
  );

  const inspection = useMemo(
    () => getInspection?.denormalizedEntities[0],
    [getInspection],
  );
  const selectors = useVinModal({
    isAuthenticated,
    inspectionId,
    vehicle: { vehicleType },
    isLastTour,
  });

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
    if (allTasksAreCompleted && !reportUrl && !info.vm) {
      preparePdf();
    }
  }, [allTasksAreCompleted, reportUrl, info]);

  useEffect(() => {
    if (inspection?.vehicle?.vin
      && inspection?.tasks?.find((item) => item.name === monk.types.TaskName.IMAGES_OCR)) {
      startUpdateOneTask();
    }
  }, [inspection?.vehicle?.vin, inspection?.tasks]);

  const handleListItemPress = useCallback((value) => {
    const isVin = value === 'vinNumber';
    const vinOption = ExpoConstants.manifest.extra.options.find((option) => option.value === 'vinNumber');
    if (isVin && vinOption?.mode.includes('manually')) { vinOptionsRef.current?.open(); return; }

    navigation.navigate(
      names.INSPECTION_CREATE,
      { selectedMod: value, inspectionId, vehicle: { vehicleType }, isLastTour },
    );
    setIsLastTour(true);
  }, [inspectionId, navigation, isAuthenticated, vehicleType, isLastTour]);

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
    if (inspectionId && getInspection.state.loading !== true
      && !invalidToken && !allTasksAreCompleted
      && shouldFetch
      && (route.params?.captureComplete || (route.params?.mode === 'manually' && route.params?.vin))) {
      getInspection.start().catch((err) => {
        errorHandler(err);
      });
    }
  }, [
    inspectionId,
    allTasksAreCompleted,
    route.params?.captureComplete,
    getInspection,
    shouldFetch,
  ]);

  const intervalId = useInterval(start, 1000);

  useFocusEffect(useCallback(() => {
    start();
    return () => clearInterval(intervalId);
  }, [start, intervalId]));

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

  useEffect(() => {
    if (!vehicleType || vehicleType === inspection?.vehicle?.vehicleType
      || !inspectionId || !inspection?.vehicle?.vin) { return; }
    (async () => {
      const response = await updateInspectionVehicle.start();
      if (response !== null) {
        navigation.navigate(names.LANDING, route.params);
      }
    })();
  }, [vehicleType, inspection?.vehicle?.vehicleType, inspectionId, inspection?.vehicle?.vin]);

  const isPdfDisabled = useMemo(
    () => !allTasksAreCompleted || !reportUrl || info.vm,
    [allTasksAreCompleted, reportUrl, info],
  );

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

  const invalidParamsContent = useMemo(() => (
    <View style={[styles.invalidParamsContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.invalidParamsMessage]}>
        {t(invalidParams ? 'landing.invalidParams' : 'landing.invalidToken')}
      </Text>
    </View>
  ), [invalidParams]);

  return invalidParams || invalidToken ? invalidParamsContent : (
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
        <View style={[styles.left, isPortrait ? styles.leftPortrait : {}]}>
          <Artwork />
        </View>
        <Card style={[styles.card, styles.right, isPortrait ? styles.rightPortrait : {}]}>
          <List.Section style={styles.textAlignRight}>
            <List.Subheader>
              {t('landing.appVersion')}
              {': '}
              {version}
            </List.Subheader>
          </List.Section>
          <List.Section>
            <List.Subheader>{t('landing.selectVehicle')}</List.Subheader>
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
          {info.vm ? null : (
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
          )}
          <Card.Actions style={styles.actions}>
            <LanguageSwitch />
          </Card.Actions>
        </Card>
      </Container>
      <Notice />
    </View>
  );
}
