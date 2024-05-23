import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: 140,
    height: 128,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    borderRadius: 8,
    overflow: 'hidden',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 14,
  },
  containerSelected: {
    width: 192,
    height: 176,
    borderRadius: 12,
    margin: 20,
  },
  assetContainer: {
    width: '100%',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  asset: {
    width: '90%',
  },
  label: {
    fontSize: 16,
    padding: 10,
    alignSelf: 'stretch',
  },
  labelSelected: {
    fontSize: 22,
    padding: 14,
  },
};
