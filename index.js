'use strict';
import DeprecListView from 'react-native-depre'
const { AppRegistry } = require('react-native');
const setup = require('./src/PLSetup');
AppRegistry.registerComponent('Powerline', setup);
import ReactNative from 'deprecated-react-native-listview'
ReactNative.ListView = DeprecListView
