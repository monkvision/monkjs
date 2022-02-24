import React, { useCallback, useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet, Button } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';
import Actions from '../../actions';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    zIndex: 0,
  },
  title: {
    marginLeft: spacing(3),
    marginBottom: spacing(0.3),
    marginTop: spacing(2),
    fontWeight: '500',
    fontSize: 20,
  },
  subtitle: {
    marginLeft: spacing(3),
    marginBottom: spacing(2),
    marginTop: spacing(0.6),
    color: 'gray',
    fontWeight: '500',
    fontSize: 12,
  },
  emptyStateText: {
    marginLeft: spacing(3),
    height: 80,
  },
  content: {
    marginHorizontal: spacing(2),
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    borderRadius: 4,
    padding: spacing(1.4),
    marginVertical: spacing(3),
  },
  labelStyle: {
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
  },
});

const getItemById = (id, array) => array.find((item) => item.id === id);

export default function UploadCenter({
  compliance,
  navigationOptions,
  sights,
  submitButtonProps,
  uploads,
}) {
  const fulfilledCompliance = useMemo(() => Object.values(compliance.state)
    .filter(({ status }) => status === 'fulfilled'), [compliance.state]);

  const unfulfilledUploadIds = useMemo(() => Object.values(uploads.state)
    .filter(({ status }) => ['pending', 'idle'].includes(status))
    .map(({ id }) => id), [uploads.state]);

  const unfulfilledComplianceIds = useMemo(() => Object.values(compliance.state)
    .filter(({ status, requestCount }) => (
      ['pending', 'idle'].includes(status)
      && requestCount <= navigationOptions.retakeMaxTry
    )).map(({ id }) => id), [compliance.state, navigationOptions.retakeMaxTry]);

  const uploadIdsWithError = useMemo(() => Object.values(uploads.state)
    .filter(({ status, error }) => (status === 'rejected' || error !== null))
    .map(({ id }) => id), [uploads.state]);

  const complianceIdsWithError = useMemo(() => Object.values(fulfilledCompliance)
    .filter((item) => {
      if (item.status !== 'fulfilled') { return false; }

      const { image_quality_assessment: iqa, coverage_360: carCov } = item.result.data.compliances;
      const badQuality = iqa && !iqa.is_compliant;
      const badCoverage = carCov && !carCov.is_compliant;

      return badQuality || badCoverage;
    }).map(({ id }) => id), [fulfilledCompliance]);

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

  return (
    <ScrollView style={styles.card}>
      <View>
        <Text style={styles.title}>
          🏎️ Upload statuses and compliance results
        </Text>
        <Text style={[styles.subtitle, { marginBottom: 0 }]}>
          Improve image compliance will result to a better AI inspection.
          Thank you for your comprehension.
        </Text>
      </View>

      <View style={styles.content}>
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
      </View>

      {typeof submitButtonProps.onPress === 'function' ? (
        <Button {...submitButtonProps} />
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
  submitButtonProps: { title: 'Next', onPress: null },
};
