/**
 * @providesModule PLEnv
 * @flow
 */
let Mixpanel = {};
try {
  Mixpanel = require("react-native-mixpanel");
  let MixpanelToken = "41d5e20219405736fed2c133437f2953";
  Mixpanel.sharedInstanceWithToken(MixpanelToken);
} catch (error) {
  console.warn("Somehow mixpanel import failed in PLEnv.js .");
}

const stripeTest = "pk_test_QUgSE3ZhORW9yoDuCkMjnaA2";
const stripeProd = "pk_live_hRBIgf1WvZ1qyhDpP3KQHEyE";
const stagingURL = "https://api-staging.powerline.app/api";
const prodURL = "https://api.powerline.app/api";
const devURL = "https://api-dev.powerline.app/api";
const staging = false;
const forceDev = true;

const dev = __DEV__ || forceDev;

if (!dev || staging) {
  console.log = () => {};
  console.warn = () => {};
}
// console.log = () => {};
// console.warn = () => {};

let env = {
  testMenuEnabled: true,
  API_URL: dev && !staging ? devURL : staging ? stagingURL : prodURL,
  version: 301,
  fontFamily: undefined,
  PER_PAGE: 20,
  youTubeAPIKey: "AIzaSyC2911BA6uHZWYcB0154TC1KcYKc6d337s",
  MixpanelToken: "41d5e20219405736fed2c133437f2953",
  Mixpanel,
  stripeAPIKey: dev ? stripeTest : stripeProd
};

setEnv = (key, value) => {
  if (dev || env.staging) {
    env[key] = value;
  }
};

setStaging = () => {
  if (!dev || !env.staging) {
    return;
  }
  env.API_URL = stagingURL;
  env.stripeAPIKey = stripeProd;
  env.staging = true;
  console.error(
    "WARNING!!! YOU'RE ABOUT TO SET STAGING URL FOR API AND PROD STRIPE API KEY! THIS IS ONLY" +
      " AVAILABLE IN DEV MODE"
  );
};

setDev = () => {
  if (!dev || !env.staging) {
    return;
  }
  env.API_URL = devURL;
  env.stripeAPIKey = stripeTest;
  env.staging = false;
};

("use strict");

// let mode = 'dev';
// let mode = 'staging';
// let mode = 'prod';

module.exports = { ...env, staging, setEnv, setStaging };
