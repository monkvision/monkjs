import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';
import { useComplianceIds, useHandlers } from './hooks';

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
    marginVertical: spacing(0.6),
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
  loadingLayout: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsLayout: {
    marginTop: spacing(2),
  },
});

const getItemById = (id, array) => array.find((item) => item.id === id);

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
  const { height } = useWindowDimensions();

  const states = useMemo(() => ({ compliance, sights, uploads }), [compliance, sights, uploads]);

  const { ids, state } = useComplianceIds({ navigationOptions, ...states });
  const { handldeRetakeAll, handleRetake, handleReupload } = useHandlers({
    inspectionId,
    task,
    onRetakeAll,
    checkComplianceAsync,
    ids,
    ...states,
  });

  const hasPendingComplianceAndNoRejectedUploads = useMemo(() => (state.hasPendingCompliance
    || state.unfulfilledComplianceIds?.length) && !state.uploadIdsWithError?.length,
  [state.hasPendingCompliance, state.unfulfilledComplianceIds, state.uploadIdsWithError]);

  const hasTooMuchTodoCompliances = useMemo(
    () => state.notReadyCompliance?.length > sights.state.tour.length * 0.2,
    [sights.state.tour, state.notReadyCompliance],
  );

  const hasFulfilledAllUploads = useMemo(() => state.unfulfilledUploadIds.length === 0,
    [state.unfulfilledUploadIds]);

  const hasSubmitButton = useMemo(() => typeof submitButtonProps.onPress === 'function',
    [submitButtonProps.onPress]);

  const hasNoCompliancesLeft = useMemo(() => !state.hasPendingCompliance && ids && ids.length === 0,
    [ids, state.hasPendingCompliance]);

  const hasRejectedAll = useMemo(() => state.uploadIdsWithError.length === sights.state.tour.length,
    [sights.state.tour, state.uploadIdsWithError]);

  useEffect(() => {
    if (submitted === false && hasNoCompliancesLeft && hasSubmitButton) {
      submitButtonProps.onPress(states);
      submit(true);
    }
  }, [submitButtonProps, submitted, ids, state.hasPendingCompliance,
    hasSubmitButton, hasNoCompliancesLeft, states]);

  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.container}
    >
      <View style={{ minHeight: height - height * 0.2 }}>
        {/* content */}
        <Text style={styles.title}>
          🏎️ Upload statuses and compliance results
        </Text>

        <Text style={styles.subtitle}>
          Improve image compliance will result to a better AI inspection.
          Thank you for your understanding.
        </Text>

        {hasPendingComplianceAndNoRejectedUploads ? (
          <Text style={styles.subtitle}>
            Verifying the pictures compliance...
          </Text>
        ) : null}

        {hasTooMuchTodoCompliances ? (
          <Text style={[styles.subtitle, { color: '#ff9800' }]}>
            {'We couldn\'t check all pictures compliance, this might affect the result accuracy'}
          </Text>
        ) : null}

        {hasRejectedAll ? (
          <Text style={[styles.subtitle, { color: '#fa603d' }]}>
            {'We couldn\'t upload any picture, please re-upload'}
          </Text>
        ) : null}

        {/* loading */}
        {hasNoCompliancesLeft ? (
          <View style={styles.loadingLayout}>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>Loading...</Text>
          </View>
        ) : null}

        {/* upload cards */}
        <View style={styles.cardsLayout}>
          {ids.map((id) => (
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
      </View>

      {/* actions */}
      {hasSubmitButton ? (
        <Button
          style={styles.button}
          disabled={isSubmitting || hasRejectedAll}
          {...submitButtonProps}
        />
      ) : null}

      {hasFulfilledAllUploads ? (
        <TouchableOpacity onPress={handldeRetakeAll} style={styles.button}>
          <Text style={{ textAlign: 'center', color: '#274B9F' }}>
            {`RETAKE ALL (${ids.length})`}
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
