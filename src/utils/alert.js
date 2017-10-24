/**
 * @providesModule PLAlert
 * @flow
 */

import { Alert } from 'react-native';

const yesNo = onPress => [
  { text: 'No', style: 'cancel' },
  { text: 'Yes', onPress },
];

const okCancel = onPress => [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Ok', onPress },
];

export const showAlertYesNo = (text: string, onSuccess: Function = () => {}) => {
  const title = yesNo(onSuccess);
  Alert.alert(
    'Alert',
    text,
    yesNo(onSuccess),
    { cancelable: false }
  );
};

export const showAlertOkCancel = (text: string, onSuccess: Function = () => {}) => {
  Alert.alert(
    'Alert',
    text,
    okCancel(onSuccess),
    { cancelable: false }
  );
};

