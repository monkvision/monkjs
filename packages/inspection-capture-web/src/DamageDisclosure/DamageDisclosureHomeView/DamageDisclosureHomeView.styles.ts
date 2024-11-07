import { Styles } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';

export const styles: Styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 24px',
    boxSizing: 'border-box',
  },
  containerLandscape: {
    __media: {
      landscape: true,
    },
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    padding: '24px 0',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 0',
  },
  sectionLandscape: {
    __media: {
      landscape: true,
    },
    width: '40%',
    padding: 0,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  description: {
    opacity: 0.8,
    fontSize: 16,
    padding: '14px 0 24px 0',
    textAlign: 'center',
  },
  button: {
    width: '80%',
  },
};

export function useDamageDisclosureHomeViewStyles() {
  const { palette } = useMonkTheme();

  return {
    rootStyle: {
      color: palette.text.primary,
    },
  };
}
