/**
 * @providesModule PLAlert
 * @flow
 */

import { Alert } from 'react-native';

export const showAlertYesNo = (text: string, onSuccess: Function = () => {}) => {
  Alert.alert(
    'Alert',
    text,
    [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: onSuccess },
    ],
    { cancelable: false }
  );
};

