import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Proptypes from 'prop-types';

import { useInterval, utils } from '@monkvision/toolkit';

const { spacing, shadow } = utils.styles;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: spacing(2),
    margin: spacing(2),
    color: '#A0A3A6',
  },
  playgraound: {
    ...shadow(6, 0.1),
    backgroundColor: '#FFF',
    borderRadius: 22,
  },
});

const DELAY = 3000;
/**
 * @param texts
 * @return {JSX.Element}
 * @constructor
 */
export default function Texts({ texts }) {
  const [currentText, setCurrentText] = useState(texts[0]);

  const nextText = useMemo(() => {
    const currentIndex = texts.indexOf(currentText);
    return texts[currentIndex + 1];
  }, [currentText, texts]);

  const delay = nextText ? DELAY : null;

  const handleGetNextText = useCallback(() => setCurrentText(nextText), [nextText]);

  useInterval(handleGetNextText, delay);

  return (
    <View>
      <Text style={styles.text}>
        {currentText}
      </Text>
    </View>
  );
}

Texts.propTypes = {
  texts: Proptypes.arrayOf(Proptypes.string),
};
Texts.defaultProps = {
  texts: ['Warming up', 'Loading ressources...'],
};
