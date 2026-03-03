import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 6,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    cursor: 'pointer',
  },
  showDamagesButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    cursor: 'pointer',
  },
  imageNavigationContainer: {
    position: 'absolute',
    bottom: 10,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    border: 'solid 2px',
  },
  imageLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    fontSize: 16,
    borderRadius: 9999,
  },
  imageLabelIcon: {
    marginRight: 8,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  shortcutsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
};
