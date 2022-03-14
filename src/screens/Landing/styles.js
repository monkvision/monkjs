import { utils } from '@monkvision/toolkit';
import { Platform, StyleSheet } from 'react-native';

const { spacing } = utils.styles;

export default StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  id: {
    fontFamily: 'monospace',
  },
  card: {
    borderTopStartRadius: 0,
  },
  cardContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  cardActions: {
    justifyContent: 'flex-start',
  },
  button: {
    marginLeft: spacing(2),
  },
  statusDot: {
    width: 12,
    maxWidth: 12,
    height: 12,
    borderRadius: 999,
    marginHorizontal: spacing(1),
  },
  statusLayout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: 75,
  },
  dateLayout: {
    display: 'flex',
    alignItems: 'center',
    width: 47,
  },
  rowOdd: {
    backgroundColor: '#f6f6f6',
  },
  headerRight: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollListContainer: {
    height: Platform.select({
      native: '100%',
      default: '100vh',
    }),
  },
  scrollList: {
    paddingBottom: 132,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: 150,
  },
});
