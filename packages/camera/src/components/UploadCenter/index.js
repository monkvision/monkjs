import { utils } from '@monkvision/toolkit';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import log from '../../utils/log';
import Button from './button';
import { useComplianceIds, useHandlers, useMixedStates } from './hooks';

import UploadCard from './UploadCard';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    zIndex: 1,
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
  loadingLayout: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsLayout: {
    marginTop: spacing(2),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: spacing(2),
  },
});

const getItemById = (id, array) => array.find((item) => item.id === id);

export default function UploadCenter({
  compliance,
  navigationOptions,
  sights,
  uploads,
  isSubmitting,
  enableCarCoverage,
  onComplianceCheckFinish,
  onComplianceCheckStart,
  onRetakeAll,
  onRetakeNeeded,
  onSkipRetake,
  checkComplianceAsync,
  inspectionId,
  task,
  mapTasksToSights,
  colors,
  endTour,
}) {
  const [submitted, submit] = useState(false);
  const { height } = useWindowDimensions();
  const { t, i18n } = useTranslation();

  const states = useMemo(() => ({ compliance, sights, uploads }), [compliance, sights, uploads]);

  const { ids, state } = useComplianceIds({ navigationOptions, ...states, endTour });

  const { handleRetakeAll, handleRetake, handleReUpload, handleRecheck } = useHandlers({
    inspectionId,
    task,
    mapTasksToSights,
    onRetakeAll,
    checkComplianceAsync,
    enableCarCoverage,
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
  } = useMixedStates({ state, sights, ids, endTour });

  // END METHODS //
  // EFFECTS //

  useEffect(() => {
    if (submitted === false && hasNoCompliancesLeft) {
      onComplianceCheckFinish(states);
      submit(true);
    }
  }, [submitted, ids, state.hasPendingCompliance,
    hasNoCompliancesLeft, states, onComplianceCheckFinish]);

  useEffect(() => {
    onComplianceCheckStart();
  }, [onComplianceCheckStart]);

  const displayRetakeAll = useMemo(
    () => Object.values(uploads.state).some((u) => !!u.error) || Object.values(compliance.state)
      .some((c) => ['rejected', 'unsatisfied'].includes(c.status)
        || c?.result?.data?.compliances?.image_quality_assessment?.is_compliant === false),
    // || c?.result?.data?.compliances?.zoom_level?.is_compliant === false),
    [compliance, uploads],
  );

  const statEventsData = useMemo(() => ({
    retakesNeeded: ids.length,
    compliances: Object.entries(compliance.state)
      .filter(([key]) => ids.includes(key))
      .map(([, value]) => ({
        sightId: value?.id,
        error: value?.error,
        result: {
          coverage360: {
            isCompliant: value?.result?.data?.compliances?.coverage_360?.is_compliant,
            reasons: value?.result?.data?.compliances?.coverage_360?.reasons,
            status: value?.result?.data?.compliances?.coverage_360?.status,
          },
          image_quality_assessment: {
            isCompliant: value?.result?.data?.compliances?.image_quality_assessment?.is_compliant,
            reasons: value?.result?.data?.compliances?.image_quality_assessment?.reasons,
            status: value?.result?.data?.compliances?.image_quality_assessment?.status,
          },
          // zoom_level: {
          //   isCompliant: value?.result?.data?.compliances?.zoom_level?.is_compliant,
          //   reasons: value?.result?.data?.compliances?.zoom_level?.reasons,
          //   status: value?.result?.data?.compliances?.zoom_level?.status,
          // },
        },
      })),
  }), [ids, compliance.state]);

  useEffect(() => {
    onRetakeNeeded(statEventsData);
  }, [ids.length, onRetakeNeeded]);

  // END EFFECTS //
  // RENDERING //

  return (
    <ScrollView
      style={[styles.card, { backgroundColor: colors.background, height }]}
      contentContainerStyle={styles.container}
    >
      <View style={{ minHeight: height - height * 0.2 }}>
        {/* content */}
        <Text style={[styles.title, { color: colors.text }]}>
          {t('uploadCenter.view.title')}
        </Text>

        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          {t('uploadCenter.view.subtitle')}
        </Text>

        {hasPendingComplianceAndNoRejectedUploads ? (
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>{t('uploadCenter.view.verifying')}</Text>
        ) : null}

        {hasTooMuchTodoCompliances ? (
          <Text style={[styles.subtitle, { color: colors.accent }]}>
            {t('uploadCenter.view.tooMuchTodo')}
          </Text>
        ) : null}

        {hasAllRejected ? (
          <Text style={[styles.subtitle, { color: colors.error }]}>
            {t('uploadCenter.view.allRejected')}
          </Text>
        ) : null}

        {/* loading */}
        {hasNoCompliancesLeft ? (
          <View style={styles.loadingLayout}>
            <Text style={[styles.subtitle, { textAlign: 'center', color: colors.placeholder }]}>
              {t('uploadCenter.view.loading')}
            </Text>
          </View>
        ) : null}

        {/* upload cards */}
        <View style={styles.cardsLayout}>
          {ids.reverse().map((id) => (
            <UploadCard
              key={`uploadCard-${id}`}
              onRetake={handleRetake}
              onReupload={handleReUpload}
              id={id}
              label={getItemById(id, sights.state.tour).label[i18n.language]}
              picture={sights.state.takenPictures[id]}
              upload={uploads.state[id]}
              compliance={compliance.state[id]}
              colors={colors}
              onRecheck={handleRecheck}
            />
          ))}
        </View>
      </View>

      {/* actions */}
      <View style={styles.actions}>
        {displayRetakeAll ? (
          <Button
            onPress={handleRetakeAll}
            colors={colors}
            color={colors.actions.primary}
            disabled={!hasFulfilledAllUploads}
          >
            <Text style={{ color: colors.actions.primary.text || colors.text }}>
              {`${t('uploadCenter.view.retakeAll')} ${ids.length ? `(${ids.length})` : ''}`}
            </Text>
          </Button>
        ) : null}
        <Button
          colors={colors}
          color={colors.actions.secondary}
          onPress={(e) => {
            log(['[Click] Skip retaking photo']);
            onSkipRetake(statEventsData);
            onComplianceCheckFinish(e);
          }}
          disabled={isSubmitting || hasAllRejected
             || !hasFulfilledAllUploads || !navigationOptions.allowSkipImageQualityCheck}
        >
          <Text style={{ color: colors.actions.secondary.text || colors.text }}>
            {t('uploadCenter.view.submit')}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );

  // END RENDERING //
}

UploadCenter.propTypes = {
  checkComplianceAsync: PropTypes.func,
  colors: PropTypes.shape({
    accent: PropTypes.string,
    actions: PropTypes.shape({
      primary: PropTypes.shape({
        background: PropTypes.string,
        text: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        background: PropTypes.string,
        text: PropTypes.string,
      }),
    }),
    background: PropTypes.string,
    boneColor: PropTypes.string,
    disabled: PropTypes.string,
    error: PropTypes.string,
    highlightBoneColor: PropTypes.string,
    notification: PropTypes.string,
    onSurface: PropTypes.string,
    placeholder: PropTypes.string,
    primary: PropTypes.string,
    success: PropTypes.string,
    surface: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  compliance: PropTypes.objectOf(PropTypes.any).isRequired,
  enableCarCoverage: PropTypes.bool,
  endTour: PropTypes.bool,
  inspectionId: PropTypes.string,
  isSubmitting: PropTypes.bool,
  mapTasksToSights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      tasks: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    }),
  ),
  navigationOptions: PropTypes.shape({
    allowNavigate: PropTypes.bool,
    allowRetake: PropTypes.bool,
    allowSkipImageQualityCheck: PropTypes.bool,
    retakeMaxTry: PropTypes.number,
    retakeMinTry: PropTypes.number,
  }),
  onComplianceCheckFinish: PropTypes.func,
  onComplianceCheckStart: PropTypes.func,
  onRetakeAll: PropTypes.func,
  onRetakeNeeded: PropTypes.func,
  onSkipRetake: PropTypes.func,
  sights: PropTypes.objectOf(PropTypes.any).isRequired,
  task: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  uploads: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploadCenter.defaultProps = {
  enableCarCoverage: false,
  endTour: false,
  onComplianceCheckFinish: () => {},
  onComplianceCheckStart: () => {},
  checkComplianceAsync: () => {},
  onRetakeAll: () => {},
  onRetakeNeeded: () => {},
  onSkipRetake: () => {},
  inspectionId: null,
  isSubmitting: false,
  mapTasksToSights: [],
  navigationOptions: {
    retakeMaxTry: 1,
    allowSkipImageQualityCheck: true,
  },
  task: 'damage_detection',
};
