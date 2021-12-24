import { StyleSheet } from 'react-native';
import { spacing } from '../../theme';

export default StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  scene: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    padding: spacing(2),
  },
  avatar: {
    marginHorizontal: spacing(2),
  },
  floatingButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  validationButton: { margin: spacing(2) },
  buttonLabel: { color: '#FFFFFF' },
  dialog: { maxWidth: 450, alignSelf: 'center', padding: 12 },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
  button: { width: '100%', marginVertical: 4 },
});
