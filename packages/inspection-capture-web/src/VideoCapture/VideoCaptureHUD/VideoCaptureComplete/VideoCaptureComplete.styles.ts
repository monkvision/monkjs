import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'initial',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    gap: '24px',
    boxSizing: 'border-box',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  title: {
    fontWeight: 700,
    fontSize: '24px',
  },
  text: { opacity: 0.85 },
};
