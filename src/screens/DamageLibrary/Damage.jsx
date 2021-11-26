import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Avatar, Card, Title, IconButton, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  card: {
    margin: 8,
    display: 'flex',
    flexGrow: 1,
    minWidth: 304,
    ...Platform.select({
      native: { maxWidth: Dimensions.get('window').width - 16 },
      default: { maxWidth: 'calc(100% - 16px)' },
    }),
  },
  title: {
    fontSize: 15,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

/**
 * @param damage {object}
 * @returns {JSX.Element}
 * @constructor
 */
export default function DamageCard({ damage }) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Avatar.Icon size={36} icon={damage.created_by === 'algo' ? 'matrix' : 'account'} />
        <Title style={styles.title}>{damage.damage_type}</Title>
        <IconButton icon="trash-can" color={colors.warning} onPress={() => {}} />
      </Card.Content>
    </Card>
  );
}

DamageCard.propTypes = {
  damage: PropTypes.objectOf(PropTypes.any),
};

DamageCard.defaultProps = {
  damage: {},
};
