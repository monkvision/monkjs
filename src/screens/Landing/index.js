import monk, { useMonitoring } from '@monkvision/corejs';
import { useInterval } from '@monkvision/toolkit';
import { Container } from '@monkvision/ui';
import { version } from '@package/json';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'components/Modal';
import ExpoConstants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from 'hooks/useAuth';
import useSnackbar from 'hooks/useSnackbar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Text, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Card, List, Surface, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import Artwork from 'screens/Landing/Artwork';
import LanguageSwitch from 'screens/Landing/LanguageSwitch';
import useGetInspection from 'screens/Landing/useGetInspection';

import * as names from 'screens/names';
import { authSlice } from 'store';
import { Clients, useClient, Workflows } from '../../contexts';
import { ClientParamMap, VehicleTypeMap, VehicleTypes } from '../paramsMap';
import styles from './styles';
import useGetPdfReport from './useGetPdfReport';
import useInspectionTasksStatus from './useTasksCompleted';
import useUpdateInspectionVehicle from './useUpdateInspectionVehicle';
import useVinModal from './useVinModal';
import useZlibCompression from './useZlibCompression';
import VehicleType from './VehicleType';

const ICON_BY_STATUS = {
  NOT_STARTED: 'chevron-right',
  DONE: 'check-bold',
  ERROR: 'alert-octagon',
};

export const allowedLanguage = ['en', 'fr', 'de'];

export const debugParams = {
  client: Clients.ALPHA,
  inspectionId: '492241e6-5563-0a4d-4948-e39952452127',
  token: '',
  vehicleType: VehicleTypes.SUV,
  numberOfSightsToUse: 5,
  vmOnly: true,
  lang: 'en',
};

export const USE_DEBUG_PARAMS = false;

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
  const isLastTour = route.params?.isLastTour ?? workflow !== Workflows.DEFAULT;

  useEffect(() => {
    let language = 'en';
    if (USE_DEBUG_PARAMS && debugParams.lang) {
      language = debugParams.lang;
    } else if (info.preferredLanguage) {
      language = info.preferredLanguage;
    }

    i18n.changeLanguage(language).catch((err) => {
      errorHandler(err);
    });
  }, [info]);

  const { clientId, inspectionId, token, vehicleTypeParam, language } = useMemo(() => {
    if (USE_DEBUG_PARAMS) {
      return {
        clientId: debugParams.client,
        inspectionId: debugParams.inspectionId,
        token: debugParams.token,
        vehicleTypeParam: Object.entries(VehicleTypeMap)
          .find(([, value]) => value === debugParams.vehicleType)[0],
      };
    }

    const urlParams = new URLSearchParams(window.location.search);
    const compressedToken = urlParams.get('t');
    const clientParam = urlParams.get('c');
    const vehicleParam = urlParams.get('v');

    return {
      inspectionId: urlParams.get('i'),
      vehicleTypeParam: (clientParam === 'pd8') ? vehicleParam : vehicleParam ?? 1,
      clientId: clientParam ? ClientParamMap[clientParam] : undefined,
      token: compressedToken ? decompress(compressedToken) : undefined,
      language: urlParams.get('lang'),
    };
  }, []);

  useEffect(() => {
    if (allowedLanguage.includes(language)) {
      i18n.changeLanguage(language).catch((err) => {
        errorHandler(err);
      });
    }
  }, [language]);

  useEffect(() => {
    setClient(clientId);
  }, [clientId]);

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
          isLastTour,
        },
      );
    } else if (workflow === Workflows.INSPECTION_REPORT && !route.params?.captureComplete) {
      navigation.navigate(
        names.INSPECTION_REPORT,
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
            isLastTour,
          },
        );
      } else {
        navigation.navigate(names.CAPTURE_VEHICLE_SELECTION, { inspectionId });
      }
    }
  }, [workflow, route, navigation, inspectionId, vehicleTypeParam, isLastTour]);

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

  useEffect(() => {
    if (USE_DEBUG_PARAMS && debugParams.vmOnly) {
      navigation.navigate(
        names.INSPECTION_REPORT,
        { inspectionId, vehicleType: VehicleTypeMap[vehicleTypeParam] },
      );
    }
  }, []);

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

  const {
    isDone,
    isError,
    tasksInError,
  } = useInspectionTasksStatus(inspection);

  useEffect(() => {
    if (tasksInError.length > 0) {
      Alert.alert(
        t('landing.inspectionInError.title'),
        `${t('landing.inspectionInError.message')} \n${t('landing.inspectionInError.id')} : ${inspectionId} \n${t('landing.inspectionInError.tasks')} : ${tasksInError.join(', ')}`,
        [{
          text: t('capture.quit.ok'),
          onPress: () => {},
        }],
        { cancelable: true },
      );
    }
  }, [tasksInError, i18n.language, inspectionId]);

  const {
    preparePdf,
    handleDownload,
    reportUrl,
    loading: pdfLoading,
  } = useGetPdfReport(inspectionId);

  useEffect(() => {
    if (isDone && !isError && !reportUrl && !info.vm) {
      preparePdf();
    }
  }, [isDone, isError, reportUrl, info]);

  const handleListItemPress = useCallback((value) => {
    const isVin = value === 'vinNumber';
    const vinOption = ExpoConstants.manifest.extra.options.find((option) => option.value === 'vinNumber');
    if (isVin && vinOption?.mode.includes('manually')) { vinOptionsRef.current?.open(); return; }

    navigation.navigate(
      names.INSPECTION_CREATE,
      { selectedMod: value, inspectionId, vehicle: { vehicleType }, isLastTour },
    );
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
      && !invalidToken && !isDone
      && shouldFetch
      && (route.params?.captureComplete || (route.params?.mode === 'manually' && route.params?.vin))) {
      getInspection.start().catch((err) => {
        errorHandler(err);
      });
    }
  }, [
    inspectionId,
    isDone,
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
    if (inspectionId && !isDone) {
      setShowTranslatedMessage('landing.workflowReminder');
    } else { setShowTranslatedMessage(null); }
  }, [isDone, inspectionId]);

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
    () => !isDone || isError || !reportUrl || info.vm,
    [isDone, isError, reportUrl, info],
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
  ), [invalidParams, i18n.language]);

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
