/** @format */

import {AppRegistry} from 'react-native';
const setup = require('./src/PLSetup');
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => setup);
