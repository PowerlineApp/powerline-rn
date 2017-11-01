var { Platform } = require('react-native');

var PLColors = require('PLColors');
const { WINDOW_WIDTH: viewportWidth, WINDOW_HEIGHT: viewportHeight } = require('PLConstants');

const platform = Platform.OS;

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

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
  iconP: {
    tintColor: PLColors.main,
    width: 13,
    height: 20,
    resizeMode: 'cover',
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
    ...Platform.select({
      ios: {
        borderTopWidth: 2,
        borderTopColor: '#d8dddf',
        backgroundColor: 'white',
        overflow: 'visible',
        position: 'absolute',
        bottom: 0
      },
      android: {
        backgroundColor: 'rgba(255,255,255,1)',
        height: 75,
        position: 'absolute',
        alignItems: 'flex-end',
        bottom: 0,
      },
    })
  },
  tabText: {
    fontSize: wp(2.3),
    fontWeight: '500'
  },
  iconPlus: {
    color: '#030366',
    ...Platform.select({
      android: { paddingBottom: 4, fontSize: wp(21) },
      ios: { paddingBottom: 8, fontSize: wp(20) },
    })
  },
  containerTabButton: {
    ...Platform.select({
      android: { flex: 1, height: 55, alignSelf: 'flex-end', width: wp(20), backgroundColor: 'white' }
    })
  },
  borderTop: {
    ...Platform.select({
      android: { borderTopWidth: 2, borderTopColor: '#d8dddf' }
    })
  },
  fillButton: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0, top: 20,
    backgroundColor: 'white',
  },
  fillCircle: {
    position: 'absolute',
    bottom: 0,
    left: wp(9), // TODO: fix if need landscape mode
    top: 5,
    width: wp(2),
    backgroundColor: 'white',
  }
};
