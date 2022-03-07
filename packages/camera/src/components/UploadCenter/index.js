import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
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
    marginVertical: spacing(0.6),
  },
});

const getItemById = (id, array) => array.find((item) => item.id === id);
const getIndexById = (id, array) => array.findIndex((item) => item.id === id);

export default function UploadCenter({
  compliance,
  navigationOptions,
  sights,
  submitButtonProps,
  uploads,
  onRetakeAll,
  isSubmitting,
}) {
  const [submitted, submit] = useState(false);

  const sortByIndex = useCallback((a, b) => {
    const indexA = getIndexById(a.id, sights.state.tour);
    const indexB = getIndexById(b.id, sights.state.tour);

    return indexB - indexA;
  }, [sights.state.tour]);

  const fulfilledCompliance = useMemo(() => Object.values(compliance.state)
    .filter(({ status }) => status === 'fulfilled'), [compliance.state]);

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

      const { image_quality_assessment: iqa, coverage_360: carCov } = item.result.data.compliances;
      const badQuality = iqa && !iqa.is_compliant;
      const badCoverage = carCov && !carCov.is_compliant;

      return badQuality || badCoverage;
    })
    .sort(sortByIndex)
    .map(({ id }) => id), [fulfilledCompliance, sortByIndex]);

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

  // retake only the rejected/non-compliant pictures
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
  compliance: PropTypes.objectOf(PropTypes.any).isRequired,
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
  uploads: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploadCenter.defaultProps = {
  onRetakeAll: () => {},
  isSubmitting: false,
  onUploadsFinish: () => {},
  navigationOptions: {
    retakeMaxTry: 1,
  },
  submitButtonProps: { title: 'Skip Retaking', onPress: null },
};
