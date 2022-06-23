/* eslint-disable no-alert */
import { Alert as RNAlert } from 'react-native';

const webPrompt = ({ title, message, callback }) => { callback(prompt(title, message)); };

const Alert = { prompt: webPrompt, alert: RNAlert.alert };

export default Alert;
