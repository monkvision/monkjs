import { StyleSheet } from 'react-native';

export const getThemedStyles = (theme) => StyleSheet.create({
  columnInfoStyle: {
    width: 55,
    lineHeight: 20,
    color: theme.colors.info,
  },
  columnPhotoNumber: {
    fontSize: 40,
    color: theme.colors.info,
  },
});

export const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    height: '100%',
    padding: 25,
    paddingTop: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.1,
  },
  body: {
    flex: 0.9,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  photoProcess: {
    flex: 0.15,
    justifyContent: 'center',
  },
  columnStyle: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnTextStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  startButton: {
    flex: 0.02,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
