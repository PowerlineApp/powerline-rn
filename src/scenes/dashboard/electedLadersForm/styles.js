var PLColors = require('PLColors');
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

  avatar: {
    width: 80,
    height: 80
  },

  unjoinBtn: {
    marginLeft: 12,
    marginTop: 10,
    backgroundColor: '#802000'
  },

  joinBtn: {
    marginLeft: 12,
    marginTop: 10,
    backgroundColor: PLColors.main
  },

  listItem: {
    backgroundColor: 'white',
    marginLeft: 0,
    paddingLeft: 17
  },

  groupDescription: {
    fontSize: 14,
    color: PLColors.lightText
  },

  listItemTextField: {
    color: PLColors.lightText,
    fontSize: 10
  },
  listItemValueField: {
    color: PLColors.main,
    fontSize: 16
  }
};
