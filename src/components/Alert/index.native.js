import { Alert as RNAlert, Platform } from 'react-native';
import prompt from 'react-native-prompt-android';

const androidPrompt = ({ title, message, callback }) => {
  prompt(
    title,
    message,
    [{ text: 'OK', onPress: callback }],
    { type: 'plain-text', cancelable: false, placeholder: message },
  );
};
const iosPrompt = ({ title, message, callback }) => { prompt(title, message, callback, 'plain-text'); };

const Alert = {
  prompt: Platform.select({ android: androidPrompt, ios: iosPrompt }),
  alert: RNAlert.alert,
};

export default Alert;
