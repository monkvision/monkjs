/* eslint-disable no-console */
import { Platform, LogBox } from 'react-native';

// sometimes it blocks throwm errors
export default function ignoreLogs(supressedWarnings, severity = 'error') {
  if (Platform.OS !== 'web') { LogBox.ignoreLogs(supressedWarnings); return; }

  const backup = console[severity];
  console[severity] = function filterWarnings(msg) {
    if (!supressedWarnings.some((entry) => msg.includes(entry))) {
      backup.apply(console, [msg]);
    }
  };
}
