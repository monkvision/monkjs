import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, StyleSheet, useWindowDimensions, View } from 'react-native';
import PropTypes from 'prop-types';

import { useSentry, utils } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';

import UploadCard from './UploadCard';
import { useComplianceIds, useHandlers, useMixedStates } from './hooks';
import Button from './button';
import log from '../../utils/log';

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
  onComplianceCheckFinish,
  onComplianceCheckStart,
  onRetakeAll,
  checkComplianceAsync,
  inspectionId,
  task,
  mapTasksToSights,
  colors,
  Sentry,
}) {
  const [submitted, submit] = useState(false);
  const { height } = useWindowDimensions();
  const { t, i18n } = useTranslation();

  const states = useMemo(() => ({ compliance, sights, uploads }), [compliance, sights, uploads]);

  const { ids, state } = useComplianceIds({ navigationOptions, ...states });
  const { Span } = useSentry(Sentry);

  const { handleRetakeAll, handleRetake, handleReUpload, handleRecheck } = useHandlers({
    inspectionId,
    task,
    mapTasksToSights,
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
    log(['[Event] Entering the Upload center']);
    if (Sentry) {
      const transaction = new Span('upload-center-user-time', SentryConstants.operation.USER_TIME);

      return () => transaction.finish();
    }

    return () => undefined;
  }, []);

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
        <Button
          colors={colors}
          color={colors.actions.secondary}
          onPress={(e) => {
            log(['[Click] Skip retaking photo']);
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
  Sentry: PropTypes.any,
  sights: PropTypes.objectOf(PropTypes.any).isRequired,
  task: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  uploads: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploadCenter.defaultProps = {
  onComplianceCheckFinish: () => {},
  onComplianceCheckStart: () => {},
  checkComplianceAsync: () => {},
  onRetakeAll: () => {},
  inspectionId: null,
  isSubmitting: false,
  mapTasksToSights: [],
  navigationOptions: {
    retakeMaxTry: 1,
    allowSkipImageQualityCheck: true,
  },
  Sentry: null,
  task: 'damage_detection',
};
