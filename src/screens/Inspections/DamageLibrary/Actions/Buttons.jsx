import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, useTheme, Text } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';

import GuideIcon from '../../../../assets/svg/icons/GuideIcon.svg';

const styles = StyleSheet.create({
  validateButton: {
    justifyContent: 'center',
    height: 60,
    width: 178,
    backgroundColor: '#5CCC68',
  },
  validateButtonText: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 18,
    lineHeight: 40,
  },
  guideBtnText: {
    color: '#274B9F',
    alignSelf: 'center',
    fontSize: 17,
  },
  guideIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export const ValidateButton = (props) => {
  const theme = useTheme();
  return (
    <Button mode="contained" uppercase={false} style={styles.validateButton} onPress={props.onPress} color={theme.colors.primary}>
      <Text style={styles.validateButtonText}>{props.text ?? 'Validate'}</Text>
    </Button>
  );
};

export const GuideButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.guideIcon}><SvgXml xml={GuideIcon} height={63} width={63} /></View>
      <Text style={styles.guideBtnText}>Guide</Text>
    </TouchableOpacity>
  );
};
