import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '16px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '25%',
    maxWidth: '25%',
    alignItems: 'center',
    paddingBottom: '24px',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: '10px',
    width: 'calc(100% - 10px)',
    height: 'auto',
    cursor: 'pointer',
  },
  text: {
    textAlign: 'center',
    fontWeight: '500',
    padding: '8px',
  },
  contentSmallScreen: {
    __media: { maxWidth: 762 },
    flex: '33.33%',
    maxWidth: '33.33%',
  },
  contentMediumScreen: {
    __media: { minWidth: 1000 },
    flex: '20%',
    maxWidth: '20%',
  },
};
