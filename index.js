'use strict';
import DeprecListView from 'react-native-depre'
import jest from 'jest'
const { AppRegistry } = require('react-native');
const setup = require('./src/PLSetup');
AppRegistry.registerComponent('Powerline', setup);
// import ReactNative from 'deprecated-react-native-listview'
// ReactNative.ListView = DeprecListView


jest.mock('react-native-splash-screen', () => {
    return { 
      hide: jest.fn(),
      show: jest.fn()
    };
  });
