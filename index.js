/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Settings as FacebookSettings } from 'react-native-fbsdk-next';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

MaterialCommunityIcons.loadFont();
Ionicons.loadFont();

FacebookSettings.initializeSDK();

/**
 * Push en background / app cerrada. Debe registrarse en el modulo raiz, fuera
 * de cualquier componente, antes de `AppRegistry.registerComponent`.
 */
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  console.log('[push] Mensaje en background:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
