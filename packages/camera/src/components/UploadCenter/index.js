import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';
import Actions from '../../actions';
import { useStartUploadAsync } from '../Capture/hooks';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    zIndex: 0,
    paddingVertical: spacing(2),
  },
  container: {
    paddingHorizontal: spacing(2),
  },
  title: {
    marginBottom: spacing(0.3),
    fontWeight: '500',
    fontSize: 20,
  },
  subtitle: {
    marginBottom: spacing(2),
    marginTop: spacing(0.6),
    color: 'gray',
    fontWeight: '500',
    fontSize: 12,
  },
  button: {
    width: '100%',
    borderRadius: 4,
    padding: spacing(1.4),
    marginVertical: spacing(0.6),
  },
});

const getItemById = (id, array) => array.find((item) => item.id === id);
const getIndexById = (id, array) => array.findIndex((item) => item.id === id);

const compliant = { is_compliant: true, reasons: [] };
const UNKNOWN_SIGHT_REASON = 'UNKNOWN_SIGHT--unknown sight';
const MAX_FAILED_COMPLIANCE_RETRIES = 1;
export default function UploadCenter({
  compliance,
  navigationOptions,
  sights,
  submitButtonProps,
  uploads,
  onRetakeAll,
  checkComplianceAsync,
  isSubmitting,
  inspectionId,
  task,
}) {
  const [submitted, submit] = useState(false);
  const startUploadAsync = useStartUploadAsync({ inspectionId, sights, uploads, task });
  const { height } = useWindowDimensions();

  const sortByIndex = useCallback((a, b) => {
    const indexA = getIndexById(a.id, sights.state.tour);
    const indexB = getIndexById(b.id, sights.state.tour);

    return indexB - indexA;
  }, [sights.state.tour]);

  const pendingCompliance = useMemo(() => Object.values(compliance.state)
    .some(({ result, requestCount }) => {
      if (!result) { return true; }
      const currentCompliance = result.data.compliances;
      const hasNotReadyCompliances = Object.values(currentCompliance).some(
        (c) => c.is_compliant === null,
      );

      return hasNotReadyCompliances && requestCount < MAX_FAILED_COMPLIANCE_RETRIES;
    }), [compliance.state]);

  const fulfilledCompliance = useMemo(() => Object.values(compliance.state)
    .filter(({ status }) => status === 'fulfilled')
    .map(({ result, requestCount, ...item }) => {
      const carCov = result.data.compliances.coverage_360;
      const iqa = result.data.compliances.image_quality_assessment;

      // `handleChangeReasons` returns the full result object with the given compliances
      const handleChangeReasons = (compliances) => ({
        ...item,
        requestCount,
        result: { ...result,
          data: {
            ...result.data, compliances: { ...result.data.compliances, ...compliances } } } });

      if (requestCount >= MAX_FAILED_COMPLIANCE_RETRIES && (carCov?.status === 'TODO' || iqa?.status === 'TODO')) {
        return handleChangeReasons({
          coverage_360: carCov?.status === 'TODO' ? { ...carCov, ...compliant } : carCov,
          image_quality_assessment: iqa?.status === 'TODO' ? { ...iqa, ...compliant } : iqa,
        });
      }

      // if no carcov reasons, we change nothing
      if (!carCov?.reasons) { return { ...item, requestCount, result }; }

      // remove the UNKNOWN_SIGHT from the carCov reasons array
      const newCarCovReasons = carCov.reasons?.filter((reason) => reason !== UNKNOWN_SIGHT_REASON);
      return handleChangeReasons({
        coverage_360: { reasons: newCarCovReasons, is_compliant: !newCarCovReasons.length },
      });
    }), [compliance]);

  const unfulfilledUploadIds = useMemo(() => Object.values(uploads.state)
    .filter(({ status }) => ['pending', 'idle'].includes(status))
    .sort(sortByIndex)
    .map(({ id }) => id), [sortByIndex, uploads.state]);

  // TODO: test the `hasNotReadyCompliances && requestCount < MAX_FAILED_COMPLIANCE_RETRIES`
  const unfulfilledComplianceIds = useMemo(() => Object.values(compliance.state)
    .filter(({ status, requestCount, result }) => {
      const currentCompliance = result?.data?.compliances;
      const hasNotReadyCompliances = result && Object.values(currentCompliance).some(
        (c) => c.is_compliant === null,
      );

      if ((['pending', 'idle'].includes(status) && requestCount <= navigationOptions.retakeMaxTry)
      || (hasNotReadyCompliances && requestCount < MAX_FAILED_COMPLIANCE_RETRIES)) { return true; }

      return false;
    })
    .sort(sortByIndex)
    .map(({ id }) => id), [compliance.state, navigationOptions.retakeMaxTry, sortByIndex]);

  const uploadIdsWithError = useMemo(() => Object.values(uploads.state)
    .filter(({ status, error }) => (status === 'rejected' || error !== null))
    .sort(sortByIndex)
    .map(({ id }) => id), [sortByIndex, uploads.state]);

  const complianceIdsWithError = useMemo(() => Object.values(fulfilledCompliance)
    .filter((item) => {
      if (item.requestCount > navigationOptions.retakeMaxTry || item.status !== 'fulfilled') { return false; }

      const { image_quality_assessment: iqa, coverage_360: carCov } = item.result.data.compliances;
      const badQuality = iqa && !iqa.is_compliant;
      const badCoverage = carCov && !carCov.is_compliant;

      return badQuality || badCoverage;
    })
    .sort(sortByIndex)
    .map(({ id }) => id), [fulfilledCompliance, navigationOptions.retakeMaxTry, sortByIndex]);

  const unionIds = useMemo(() => [...new Set([
    ...unfulfilledUploadIds,
    ...unfulfilledComplianceIds,
    ...uploadIdsWithError,
    ...complianceIdsWithError,
  ])], [
    complianceIdsWithError,
    unfulfilledComplianceIds,
    unfulfilledUploadIds,
    uploadIdsWithError,
  ]);

  // retake all rejected/non-compliant pictures at once
  const handldeRetakeAll = useCallback(() => onRetakeAll(unionIds), [onRetakeAll, unionIds]);

  // retake one picture
  const handleRetake = useCallback((id) => {
    // reset upload and compliance info
    compliance.dispatch({
      type: Actions.compliance.UPDATE_COMPLIANCE,
      payload: { id, status: 'idle', error: null, result: null, imageId: null },
    });
    uploads.dispatch({
      type: Actions.uploads.UPDATE_UPLOAD,
      payload: { id, status: 'idle', picture: null },
    });

    // remove the picture from the sight and focus on the current sight
    sights.dispatch({ type: Actions.sights.REMOVE_PICTURE, payload: { id } });
    sights.dispatch({ type: Actions.sights.SET_CURRENT_SIGHT, payload: { id } });
  }, [compliance, sights, uploads]);

  // reupload each picture on its own
  const handleReupload = useCallback(async (id, picture) => {
    const current = { id, metadata: { id, label: getItemById(id, sights.state.tour).label } };

    /**
      * Note(Ilyass): We removed the recursive fucntion solution, because it takes up too much time,
      * instead we re-run the compliance one more time after 1sec of getting the first response
      * */
    const verifyComplianceStatus = (pictureId, compliances) => {
      const hasTodo = Object.values(compliances).some((c) => c.status === 'TODO' || c.is_compliant === null);

      if (hasTodo) {
        setTimeout(async () => {
          await checkComplianceAsync(pictureId, current.metadata.id);
        }, 500);
      }
    };

    const upload = await startUploadAsync(picture, current);
    if (upload.data?.id) {
      const result = await checkComplianceAsync(upload.data.id, current.metadata.id);
      verifyComplianceStatus(upload.data.id, result.data.compliances);
    }
  }, [checkComplianceAsync, sights, startUploadAsync]);

  useEffect(() => {
    if (
      !pendingCompliance
      && submitted === false
      && unionIds
      && unionIds.length === 0
      && typeof submitButtonProps.onPress === 'function'
    ) {
      submitButtonProps.onPress({ compliance, sights, uploads });
      submit(true);
    }
  }, [compliance, pendingCompliance, sights, submitButtonProps, submitted, unionIds, uploads]);

  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.container}
    >
      <View style={{ minHeight: height - height * 0.2 }}>
        <Text style={styles.title}>
          🏎️ Upload statuses and compliance results
        </Text>
        <Text style={styles.subtitle}>
          Improve image compliance will result to a better AI inspection.
          Thank you for your understanding.
        </Text>
        {unionIds.map((id) => (
          <UploadCard
            key={`uploadCard-${id}`}
            onRetake={handleRetake}
            onReupload={handleReupload}
            id={id}
            label={getItemById(id, sights.state.tour).label}
            picture={sights.state.takenPictures[id]}
            upload={uploads.state[id]}
            compliance={compliance.state[id]}
          />
        ))}
      </View>

      {typeof submitButtonProps.onPress === 'function' ? (
        <Button style={styles.button} {...submitButtonProps} disabled={isSubmitting} />
      ) : null}

      {unfulfilledUploadIds.length === 0 ? (
        <TouchableOpacity onPress={handldeRetakeAll} style={styles.button}>
          <Text style={{ textAlign: 'center', color: '#274B9F' }}>
            {`RETAKE ALL (${unionIds.length})`}
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

UploadCenter.propTypes = {
  checkComplianceAsync: PropTypes.func,
  compliance: PropTypes.objectOf(PropTypes.any).isRequired,
  inspectionId: PropTypes.string,
  isSubmitting: PropTypes.bool,
  navigationOptions: PropTypes.shape({
    allowNavigate: PropTypes.bool,
    allowRetake: PropTypes.bool,
    allowSkip: PropTypes.bool,
    retakeMaxTry: PropTypes.number,
    retakeMinTry: PropTypes.number,
  }),
  onRetakeAll: PropTypes.func,
  onUploadsFinish: PropTypes.func,
  sights: PropTypes.objectOf(PropTypes.any).isRequired,
  submitButtonProps: PropTypes.shape({ onPress: PropTypes.func.isRequired }),
  task: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  uploads: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploadCenter.defaultProps = {
  checkComplianceAsync: () => {},
  onRetakeAll: () => {},
  inspectionId: null,
  isSubmitting: false,
  onUploadsFinish: () => {},
  navigationOptions: {
    retakeMaxTry: 1,
  },
  task: 'damage_detection',
  submitButtonProps: { title: 'Skip Retaking', onPress: null },
};
