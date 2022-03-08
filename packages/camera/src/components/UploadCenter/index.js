import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet, Button } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';
import Actions from '../../actions';

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
  },
});

const getItemById = (id, array) => array.find((item) => item.id === id);
const getIndexById = (id, array) => array.findIndex((item) => item.id === id);

const compliant = { is_compliant: true, reasons: [] };
const UNKNOWN_SIGHT_REASON = 'UNKNOWN_SIGHT--unknown sight';

export default function UploadCenter({
  compliance,
  navigationOptions,
  sights,
  submitButtonProps,
  uploads,
}) {
  const [submitted, submit] = useState(false);

  const sortByIndex = useCallback((a, b) => {
    const indexA = getIndexById(a.id, sights.state.tour);
    const indexB = getIndexById(b.id, sights.state.tour);

    return indexB - indexA;
  }, [sights.state.tour]);

  const fulfilledUploads = useMemo(() => Object.values(uploads.state)
    .filter(({ status }) => status === 'fulfilled'), [uploads.state]);

  const fulfilledCompliance = useMemo(() => Object.values(compliance.state)
    .filter(({ status }) => status === 'fulfilled')
    .map(({ result, ...item }) => {
      const carCov = result.data.compliances.coverage_360;
      const iqa = result.data.compliances.image_quality_assessment;

      // `handleChangeReasons` returns the full result object with the given compliances
      const handleChangeReasons = (compliances) => ({
        ...item,
        result: { ...result,
          data: { compliances: { ...result.data.compliances, ...compliances } } } });

      // if status is TODO, mark it as compliant (ignore)
      if (carCov?.status === 'TODO' || iqa?.status === 'TODO') {
        return handleChangeReasons({
          coverage_360: { ...carCov, ...compliant },
          image_quality_assessment: { ...iqa, ...compliant },
        });
      }

      // if no carcov reasons, we change nothing
      if (!carCov?.reasons) { return { result }; }

      // if the only reason is UNKOWN_SIGHT, return an empty array instead and mark it as compliant
      if (carCov.reasons.length === 1 && carCov.reasons[0] === UNKNOWN_SIGHT_REASON) {
        return handleChangeReasons(compliant);
      }

      // remove the UNKNOWN_SIGHT from the carCov reasons array
      const newCarCovReasons = carCov.reasons?.filter((reason) => reason !== UNKNOWN_SIGHT_REASON);
      return handleChangeReasons({ reasons: newCarCovReasons });
    }), [compliance]);

  const unfulfilledUploadIds = useMemo(() => Object.values(uploads.state)
    .filter(({ status }) => ['pending', 'idle'].includes(status))
    .sort(sortByIndex)
    .map(({ id }) => id), [sortByIndex, uploads.state]);

  const unfulfilledComplianceIds = useMemo(() => Object.values(compliance.state)
    .filter(({ status, requestCount }) => (
      ['pending', 'idle'].includes(status)
      && requestCount <= navigationOptions.retakeMaxTry
    ))
    .sort(sortByIndex)
    .map(({ id }) => id), [compliance.state, navigationOptions.retakeMaxTry, sortByIndex]);

  const uploadIdsWithError = useMemo(() => Object.values(uploads.state)
    .filter(({ status, error }) => (status === 'rejected' || error !== null))
    .sort(sortByIndex)
    .map(({ id }) => id), [sortByIndex, uploads.state]);

  const complianceIdsWithError = useMemo(() => Object.values(fulfilledCompliance)
    .filter((item) => {
      if (item.status !== 'fulfilled') { return false; }

      // temporary solution !!!
      const currentUpload = fulfilledUploads.find(({ id }) => id === item.id);
      if (currentUpload.uploadCount > navigationOptions.retakeMaxTry) { return false; }

      const { image_quality_assessment: iqa, coverage_360: carCov } = item.result.data.compliances;
      const badQuality = iqa && !iqa.is_compliant;
      const badCoverage = carCov && !carCov.is_compliant;

      return badQuality || badCoverage;
    })
    .sort(sortByIndex)
    .map(({ id }) => id),
  [fulfilledCompliance, fulfilledUploads, navigationOptions.retakeMaxTry, sortByIndex]);

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

  useEffect(() => {
    if (
      submitted === false
      && unionIds
      && unionIds.length === 0
      && typeof submitButtonProps.onPress === 'function'
    ) {
      submitButtonProps.onPress({ compliance, sights, uploads });
      submit(true);
    }
  }, [compliance, sights, submitButtonProps, submitted, unionIds, uploads]);

  return (
    <ScrollView style={styles.card} contentContainerStyle={styles.container}>
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
          id={id}
          label={getItemById(id, sights.state.tour).label}
          picture={sights.state.takenPictures[id]}
          upload={uploads.state[id]}
          compliance={compliance.state[id]}
        />
      ))}
      {typeof submitButtonProps.onPress === 'function' ? (
        <Button style={styles.button} {...submitButtonProps} />
      ) : null}
    </ScrollView>
  );
}

UploadCenter.propTypes = {
  compliance: PropTypes.objectOf(PropTypes.any).isRequired,
  navigationOptions: PropTypes.shape({
    allowNavigate: PropTypes.bool,
    allowRetake: PropTypes.bool,
    allowSkip: PropTypes.bool,
    retakeMaxTry: PropTypes.number,
    retakeMinTry: PropTypes.number,
  }),
  sights: PropTypes.objectOf(PropTypes.any).isRequired,
  submitButtonProps: PropTypes.shape({ onPress: PropTypes.func.isRequired }),
  uploads: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploadCenter.defaultProps = {
  navigationOptions: {
    retakeMaxTry: 1,
  },
  submitButtonProps: { title: 'Skip Retaking', onPress: null },
};
