import { utils } from '@monkvision/toolkit';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    position: 'relative',
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    position: 'relative',
  },
  portrait: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
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
    paddingRight: utils.styles.spacing(2),
  },
  right: {
    flex: 1.25,
    display: 'flex',
  },
  card: {
    borderRadius: 0,
  },
  textAlignRight: {
    alignItems: 'flex-end',
  },
  feedbackWrapper: {
    marginHorizontal: 15
  }
});
