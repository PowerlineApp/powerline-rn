'use strict';

const { AppRegistry } = require('react-native');
const setup = require('./src/PLSetup');
const Share = require('./share');

AppRegistry.registerComponent('Powerline', setup);
AppRegistry.registerComponent('PowerlineShare', setup);
