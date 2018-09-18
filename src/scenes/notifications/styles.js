var PLColors = require('PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
  defaultButton: {
      color: PLColors.main,
      borderWidth: 1,
      borderRadius: 7,
      width: 100,
      paddingTop: 5,
      paddingBottom: 5,
      backgroundColor: 'white',
      textAlign: 'center',
      marginBottom: 5
  },
  icon: {
    color: PLColors.lightText,
    fontSize: 15
  }
};
