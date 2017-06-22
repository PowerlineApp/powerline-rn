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
  searchBar: {
    backgroundColor: '#030747',
    marginLeft: 15,
    paddingHorizontal: 10,
  },
  searchInput: {
    fontSize: 12,
    color: 'white',
  },
  col: {
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  row: {
    paddingBottom: 20,
  },
  groupSelector: {
    paddingVertical: 5,
    backgroundColor: PLColors.main,
    height: 80,
  },
  iconActiveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#555aa0',
  },
  icon: {
    color: PLColors.main,
    fontSize: (platform === 'ios') ? 18 : 15,
  },
  iconText: {
    paddingVertical: 5,
    fontSize: 11,
    color: 'white',
  },
  backdrop: {
    backgroundColor: 'black',
    opacity: 0.5,
  },
  menuIcon: {
    color: '#223549',
    width: 25,
  },
  menuText: {
    color: '#293f53',
  },
  footer: {
    borderTopWidth: 2,
    borderTopColor: '#d8dddf',
    backgroundColor: 'white',
  },
};
