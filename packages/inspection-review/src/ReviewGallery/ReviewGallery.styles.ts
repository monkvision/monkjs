import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 6,
    justifyContent: 'center',
    height: 'fit-content',
    gap: 8,
    overflowY: 'auto',
  },
  item: {
    boxSizing: 'border-box',
    padding: 6,
  },
};
