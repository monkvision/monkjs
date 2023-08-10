import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, Platform } from 'react-native';

import { IconSeverityNone, SeveritiesWithIcon } from '../../../assets';
import { CommonPropTypes, DamageMode } from '../../../resources';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  allContainer: {
    justifyContent: 'space-around',
  },
  pricingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityContainer: {
    alignItems: 'center',
  },
  severityLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    paddingVertical: 8,
  },
  pricingLabel: {
    paddingLeft: 10,
  },
  severityCount: {
    ...Platform.select({
      web: { fontWeight: 'medium' },
      native: { fontWeight: 'normal' },
    }),
    fontSize: 12,
    color: '#FFFFFF',
  },
});

const severities = [
  ...SeveritiesWithIcon,
  { key: 'none', Icon: IconSeverityNone },
];

export default function DamageCounts({ damageMode, counts }) {
  const { t } = useTranslation();
  const total = useMemo(
    () => severities.reduce((prev, curr) => prev + counts[curr.key], 0),
    [severities, counts],
  );

  return damageMode === DamageMode.PRICING ? (
    <View style={[styles.container, styles.pricingContainer]}>
      <IconSeverityNone />
      <Text style={[styles.severityLabel, styles.pricingLabel]}>
        {`${total} ${t('severityLabels.pricingOnly')}`}
      </Text>
    </View>
  ) : (
    <View style={[styles.container, styles.allContainer]}>
      {severities.map((severity) => (
        severity.key === 'none' && counts.none === 0 ? null : (
          <View key={severity.key} style={[styles.severityContainer]}>
            <severity.Icon />
            <Text style={[styles.severityLabel]}>
              {t(`severityLabels.${severity.key}`)}
            </Text>
            <Text style={[styles.severityCount]}>
              {`${counts[severity.key]} / ${total}`}
            </Text>
          </View>
        )
      ))}
    </View>
  );
}

DamageCounts.propTypes = {
  counts: PropTypes.shape({
    high: PropTypes.number,
    low: PropTypes.number,
    medium: PropTypes.number,
    none: PropTypes.number,
  }),
  damageMode: CommonPropTypes.damageMode,
};

DamageCounts.defaultProps = {
  counts: {
    high: 0,
    low: 0,
    medium: 0,
    none: 0,
  },
  damageMode: DamageMode.ALL,
};
