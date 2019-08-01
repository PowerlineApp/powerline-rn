var PLColors = require('../../common/PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
  container: {
    backgroundColor: '#e2e7ea',
    flex: 1,
  },
  header: {
    backgroundColor: PLColors.main,
  },
  
  itemHeaderStyle: {
    backgroundColor: '#f1f7f9',
    paddingBottom: 12
  },

  itemHeaderText: {
    color: '#11c1f3'
  },

  text1: {
    fontSize: 10
  }
};
