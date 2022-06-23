import { utils } from '@monkvision/toolkit';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: utils.styles.spacing(2),
  },
  topRight: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  mid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 185,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: utils.styles.spacing(2),
  },
  textInput: {
    width: '100%',
    maxWidth: 320,
    margin: 'auto',
  },
  helperText: {
    width: '100%',
    maxWidth: 320,
    margin: 'auto',
    paddingHorizontal: 0,
    textAlign: 'center',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginRight: utils.styles.spacing(1),
  },
});
