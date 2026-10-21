/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Settings as FacebookSettings } from 'react-native-fbsdk-next';

MaterialCommunityIcons.loadFont();
Ionicons.loadFont();

FacebookSettings.initializeSDK();

AppRegistry.registerComponent(appName, () => App);
