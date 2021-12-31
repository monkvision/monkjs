import { Dimensions, StyleSheet } from 'react-native';
import { utils } from '@monkvision/react-native';

const spacing = utils.styles.spacing;
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    paddingVertical: spacing(1),
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
  },
  cardTitle: {
    fontSize: 16,
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
    marginBottom: spacing(2),
    marginHorizontal: spacing(1),
  },
  image: {
    flex: 1,
    width: 400,
    height: 300,
    marginHorizontal: spacing(1),
  },
  previewImage: {
    flex: 1,
    width: 400,
    height: 400,
    marginHorizontal: spacing(0),
  },
  scrollArea: {
    width: 400,
    backgroundColor: '#FFF',
    alignSelf: 'center',
  },
  flatList: {
    flex: 1,
    width: 360,
    maxHeight: 400,
    marginHorizontal: 0,
  },
  button: { width: '100%', marginVertical: spacing(2), alignSelf: 'center' },
  alignLeft: {
    justifyContent: 'flex-end',
  },
  cell: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingTop: 5,
  },
  buttonLabel: { color: '#FFFFFF' },
  validationButton: { margin: spacing(2), flex: 1 },
  divider: { opacity: 0.3 },
  cameraIcon: { marginRight: spacing(4) },
  cameraPreviewLayout: { position: 'absolute', left: 20, top: 10, zIndex: 99, height: height - 30 },
  cameraPreviewImage: {
    width: 100, height: 100, borderRadius: 8, elevation: 20, marginVertical: spacing(1),
  },
  pickerLayout: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' },
  picker: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    width: '100%',
    height: 300,
    minWidth: 280,
    maxWidth: 512,
  },
});
export default styles;
