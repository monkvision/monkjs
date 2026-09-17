import { Styles } from '@monkvision/types';

export const styles: Styles = {
  panel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    maxWidth: '70%',
    padding: '8px 10px',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 1.5,
    pointerEvents: 'none',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  label: {
    opacity: 0.7,
  },
};
