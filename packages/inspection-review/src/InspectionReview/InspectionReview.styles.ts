import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 55px 10px 55px',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '0 10px',
  },
  downloadImagesButton: {
    padding: '5px 0px',
  },
};
