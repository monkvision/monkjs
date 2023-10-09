import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: '#000000BE',
  },
  errorPopup: {
    padding: 25,
    paddingBottom: 10,
    borderRadius: 15,
    flexDirection: 'column',
    backgroundColor: '#232429',
  },
  errorMessage: {
    color: '#ffffff',
    fontSize: 16,
  },
  errorButtonsContainer: {
    marginTop: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  errorButton: {
    padding: 10,
    borderRadius: 4,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
