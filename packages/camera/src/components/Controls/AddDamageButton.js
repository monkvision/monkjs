import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export default function AddDamageButton({ customStyle }) {
  const { t } = useTranslation();

  return (
    <Text
      testID="addDamageButton"
      style={[{
        color: '#fff',
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 10,
        textTransform: 'uppercase',
      }, customStyle]}
    >
      {t('controls.addDamage')}
    </Text>
  );
}

AddDamageButton.propTypes = {
  customStyle: PropTypes.object,
};

AddDamageButton.defaultProps = {
  customStyle: {},
};
