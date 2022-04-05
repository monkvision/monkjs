/* eslint-disable no-console */
import { Platform, LogBox } from 'react-native';

// sometimes it blocks thrown errors
export default function ignoreLogs(suppressedWarnings, severity = 'error') {
  if (Platform.OS !== 'web') { LogBox.ignoreLogs(suppressedWarnings); return; }

  const backup = console[severity];
  console[severity] = function filterWarnings(msg) {
    if (!suppressedWarnings.some((entry) => msg.includes(entry))) {
      backup.apply(console, [msg]);
    }
  };
}
