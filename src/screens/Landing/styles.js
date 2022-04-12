import { utils } from '@monkvision/toolkit';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
  left: {
    flex: 0.75,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: utils.styles.spacing(2),
  },
  right: {
    flex: 1.25,
    display: 'flex',
  },
  evenListItem: {
    elevation: 4,
  },
  oddListItem: {
    elevation: 1,
  },
});
