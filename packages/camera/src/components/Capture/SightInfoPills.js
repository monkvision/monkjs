import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 20,
    left: 120,
    justifyContent: 'center',
    alignContent: 'center',
  },
  pill: {
    padding: 10,
    borderRadius: 30,
    marginBottom: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  label: {
    color: '#ffffff',
  },
  low: {
    backgroundColor: '#ec3c6c',
  },
  mid: {
    backgroundColor: '#9acfcb',
  },
  high: {
    backgroundColor: '#aa5cac',
  },
  pointOfInterest: {
    backgroundColor: '#626262B2',
  },
});

export default function SightInfoPills({ metadata }) {
  const { t, i18n } = useTranslation();
  const hasAngle = useMemo(() => !!metadata.angle, [metadata.angle]);
  const hasPointsOfInterest = useMemo(
    () => !!metadata.pointsOfInterest && metadata.pointsOfInterest.length > 0,
    [metadata.pointsOfInterest],
  );
  const getPointOfInterestLabel = useCallback(
    (pointOfInterest) => pointOfInterest[i18n.language],
    [i18n.language],
  );
  const createPill = useCallback((label, angle, key) => (
    <View
      style={[styles.pill, angle ? styles[metadata.angle] : styles.pointOfInterest]}
      key={key}
    >
      <Text style={[styles.label]}>
        {label}
      </Text>
    </View>
  ), [metadata.angle]);

  return !hasAngle && !hasPointsOfInterest ? null : (
    <View style={styles.container}>
      {hasAngle ? createPill(t(`layout.anglePill.${metadata.angle}`), metadata.angle, 'angle') : null}
      {hasPointsOfInterest ? metadata.pointsOfInterest.map(
        (pointOfInterest, i) => createPill(getPointOfInterestLabel(pointOfInterest), null, `poi-${i}`),
      ) : null}
    </View>
  );
}

SightInfoPills.propTypes = {
  metadata: PropTypes.shape({
    angle: PropTypes.oneOf(['low', 'mid', 'high']),
    pointsOfInterest: PropTypes.arrayOf(PropTypes.shape({
      en: PropTypes.string.isRequired,
      fr: PropTypes.string.isRequired,
    })),
  }),
};

SightInfoPills.defaultProps = {
  metadata: {},
};
