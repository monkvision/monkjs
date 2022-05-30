import { utils } from '@monkvision/toolkit';
import { StyleSheet } from 'react-native';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  upload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 100,
    marginVertical: spacing(0.4),
    borderRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    position: 'absolute',
  },
  imageLayout: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: spacing(2),
    position: 'relative',
    justifyContent: 'center',
  },
  imageOverlay: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  textsLayout: {
    flexGrow: 1,
    flex: 1,
  },
  title: {
    textTransform: 'capitalize',
  },
  subtitleLayout: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  subtitle: {
    color: 'gray',
    fontWeight: '500',
    fontSize: 12,
    marginVertical: spacing(0.6),
  },
  statusDot: {
    width: 10,
    height: 10,
    marginRight: 4,
    borderRadius: 99,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  retakeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
export default styles;
