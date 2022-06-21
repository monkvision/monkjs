import { utils } from '@monkvision/toolkit';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
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
  evenListItem: {
    elevation: 4,
  },
  oddListItem: {
    elevation: 1,
  },
  actions: {
    justifyContent: 'flex-end',
  },
  listLoading: {
    marginHorizontal: utils.styles.spacing(2),
  },
  card: {
    borderRadius: 0,
  },
  // vin
  optionsModal: {
    alignSelf: 'center',
    zIndex: 10,
    borderRadius: 8,
    width: 200,
    height: 'auto',
    padding: 4,
  },
  option: {
    borderRadius: 4,
  },
  pressOutside: {
    zIndex: 1,
    opacity: 0.8,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  blur: {
    width,
    height,
  },
});
