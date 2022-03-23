import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';
import log from '../../utils/log';
import { useComplianceIds, useHandlers, useMixedStates } from './hooks';

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
  uploads,
  isSubmitting,
  onComplianceCheckFinish,
  onComplianceCheckStart,
  onRetakeAll,
  submitButtonLabel,
  checkComplianceAsync,
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

  /**
   * NOTE(Ilyass): For a better readability I made the `useMixedStates` hook that holds a well
   * named states variables to be used inside JSX
   *  */
  const {
    hasPendingComplianceAndNoRejectedUploads,
    hasTooMuchTodoCompliances,
    hasFulfilledAllUploads,
    hasNoCompliancesLeft,
    hasAllRejected,
  } = useMixedStates({ state, sights, ids });

  // END METHODS //
  // EFFECTS //

  useEffect(() => {
    if (submitted === false && hasNoCompliancesLeft) {
      onComplianceCheckFinish(states);
      log([`Image quality check has been finished`]);
      submit(true);
    }
  }, [submitted, ids, state.hasPendingCompliance,
    hasNoCompliancesLeft, states, onComplianceCheckFinish]);

  useEffect(() => {
    onComplianceCheckStart();
    log([`Conpliance check has been started`]);
  }, [onComplianceCheckStart]);

  // END EFFECTS //
  // RENDERING //

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

        {hasAllRejected ? (
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
      <Button
        style={styles.button}
        title={submitButtonLabel}
        onPress={onComplianceCheckFinish}
        disabled={isSubmitting || hasAllRejected}
      />

      <TouchableOpacity
        onPress={handldeRetakeAll}
        style={styles.button}
        disabled={!hasFulfilledAllUploads}
      >
        <Text style={{ textAlign: 'center', color: '#274B9F' }}>
          {`RETAKE ALL (${ids.length})`}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );

  // END RENDERING //
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
  onComplianceCheckFinish: PropTypes.func,
  onComplianceCheckStart: PropTypes.func,
  onRetakeAll: PropTypes.func,
  sights: PropTypes.objectOf(PropTypes.any).isRequired,
  submitButtonLabel: PropTypes.string,
  task: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  uploads: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploadCenter.defaultProps = {
  onComplianceCheckFinish: () => {},
  onComplianceCheckStart: () => {},
  submitButtonLabel: 'Skip retaking',
  checkComplianceAsync: () => {},
  onRetakeAll: () => {},
  inspectionId: null,
  isSubmitting: false,
  navigationOptions: {
    retakeMaxTry: 1,
  },
  task: 'damage_detection',
};
