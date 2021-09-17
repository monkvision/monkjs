import { StyleSheet, Platform } from 'react-native';
import { spacing } from 'config/theme';

export default StyleSheet.create({
  root: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      native: {
        flex: 1,
      },
      default: {
        display: 'flex',
        minHeight: '100vh',
      },
    }),
  },
  signIn: {
    margin: spacing(3),
  },
});
