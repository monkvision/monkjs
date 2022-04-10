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
    flex: 0.8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: utils.styles.spacing(2),
  },
  right: {
    flex: 1.2,
    display: 'flex',
    paddingVertical: utils.styles.spacing(2),
    paddingLeft: utils.styles.spacing(2),
  },
  title: {
    marginTop: 0,
    marginBottom: utils.styles.spacing(1),
    fontWeight: 'normal',
  },
  card: {
    flexGrow: 1,
  },
  cardContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  cardAction: {
    justifyContent: 'flex-end',
  },
  list: {
    height: '100%',
    width: '100%',
  },
});
