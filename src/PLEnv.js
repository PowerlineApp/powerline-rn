/**
 * @providesModule PLEnv
 * @flow
 */
import Mixpanel from 'react-native-mixpanel';

let MixpanelToken = '41d5e20219405736fed2c133437f2953';

Mixpanel.sharedInstanceWithToken(MixpanelToken);


'use strict';

// let mode = 'dev';
// let mode = 'staging';
// let mode = 'prod';

module.exports = {
    testMenuEnabled: true,

    API_URL: 'https://api-dev.powerli.ne/api',
    // API_URL: 'https://api-staging.powerli.ne/api',
    // API_URL: 'https://api.powerli.ne/api',

    version: 301,
    fontFamily: undefined,
    PER_PAGE: 20,
    youTubeAPIKey: 'AIzaSyC2911BA6uHZWYcB0154TC1KcYKc6d337s',
    MixpanelToken: '41d5e20219405736fed2c133437f2953',
    Mixpanel,
    stripeAPIKey: 'pk_test_QUgSE3ZhORW9yoDuCkMjnaA2'
    // pk_test_QUgSE3ZhORW9yoDuCkMjnaA2 pk_live_hRBIgf1WvZ1qyhDpP3KQHEyE
};



