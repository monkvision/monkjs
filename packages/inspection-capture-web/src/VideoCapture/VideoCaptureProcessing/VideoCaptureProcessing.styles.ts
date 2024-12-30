import { Styles } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';

export const styles: Styles = {
  container: {
    width: '100%',
    display: 'flex',
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  labelContainer: {
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px 8px 8px',
    fontSize: 14,
  },
  percentage: {
    fontFamily: 'monospace',
  },
  progressBarContainer: {
    width: '80%',
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  progressBar: {
    height: 10,
    borderRadius: 9999,
  },
  errorMessage: {
    padding: '0 16px',
    textAlign: 'center',
  },
};

export function useVideoCaptureProcessingStyles(progress: number) {
  const { palette } = useMonkTheme();

  return {
    containerStyle: {
      ...styles['container'],
      color: palette.text.primary,
    },
    progressBarContainerStyle: {
      ...styles['progressBarContainer'],
      borderColor: palette.primary.dark,
    },
    progressBarStyle: {
      ...styles['progressBar'],
      backgroundColor: palette.primary.dark,
      width: `${progress * 100}%`,
    },
  };
}
