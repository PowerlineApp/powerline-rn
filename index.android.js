'use strict';

const { AppRegistry } = require('react-native');
// const setup = require('./src/PLSetup');

// const { AppRegistry } = require('react-native');
// const setup = require('./src/PLSetup');
AppRegistry.registerComponent('Powerline', () => require('./src/PLSetup'));
AppRegistry.registerComponent('PowerlineShare', () => require('./src/PLShare'));
