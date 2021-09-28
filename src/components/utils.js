import { Platform } from 'react-native';

const flex = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  ...Platform.select({
    native: { flex: 1 },
    default: { display: 'flex', flexGrow: 1 },
  }),
};

export const styles = {
  flex,
};

export default {
  styles,
};
