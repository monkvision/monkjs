import { utils } from '@monkvision/toolkit';
import { StyleSheet } from 'react-native';

const { spacing } = utils.styles;

export default StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
    overflow: 'hidden',
  },
});
