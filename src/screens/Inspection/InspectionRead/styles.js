import { utils } from '@monkvision/toolkit';
import { Platform, StyleSheet } from 'react-native';

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
  cardActions: {
    justifyContent: 'flex-end',
  },
  images: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
  },
  tasks: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
    marginBottom: spacing(2),
  },
  image: {
    width: 300,
    height: 225,
    marginHorizontal: spacing(0),
  },
  previewImage: {
    flex: 1,
    width: 400,
    height: 400,
    marginHorizontal: spacing(0),
  },
  dialog: {
    maxWidth: 450,
    alignSelf: 'center',
    padding: 12,
  },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
  button: { width: '100%', marginVertical: 4 },
  actionButton: { marginLeft: spacing(1) },

  process: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    margin: spacing(2),
  },
  processButton: {
    margin: spacing(1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
