import { utils } from '@monkvision/toolkit';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  title: {
    marginTop: 0,
    marginBottom: utils.styles.spacing(1),
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
