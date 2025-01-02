import { Styles } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';

export const styles: Styles = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 999999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding: '50px 10%',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginLeft: 16,
  },
  description: {
    fontSize: 16,
    paddingTop: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
};

export function useOrientationEnforcerStyles() {
  const { palette } = useMonkTheme();

  return {
    containerStyle: {
      ...styles['container'],
      backgroundColor: palette.background.base,
    },
  };
}
