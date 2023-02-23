import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Text } from 'react-native';

export default function FullScreenButton({ label }) {
  const { t } = useTranslation();
  return (
    <Text
      style={{
        color: '#FFF',
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 10,
        textTransform: 'uppercase',
      }}
    >
      {t(label)}
    </Text>
  );
}

FullScreenButton.propTypes = {
  label: PropTypes.string.isRequired,
};
