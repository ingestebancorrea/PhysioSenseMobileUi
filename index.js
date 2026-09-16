/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

MaterialCommunityIcons.loadFont();
Ionicons.loadFont();

AppRegistry.registerComponent(appName, () => App);
