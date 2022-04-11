import { StyleSheet } from 'react-native';
import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;
export default StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing(1),
  },
});
