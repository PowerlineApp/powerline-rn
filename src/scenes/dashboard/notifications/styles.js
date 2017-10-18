var PLColors = require('PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
  container: {
    ...Platform.select({
      android: { marginBottom: -20 }
    })
  },
  defaultButton: {
      color: PLColors.main,
      borderWidth: 1,
      width: 60,
      paddingTop: 3,
      paddingBottom: 3,
      backgroundColor: 'white',
      textAlign: 'center',
      marginBottom: 5,
      fontSize: 13
  },
  icon: {
    color: PLColors.lightText,
    fontSize: 12
  },
  text1: {
    fontSize: 13,
    color: PLColors.main
  },
  text2: {
    fontSize: 10,
    color: PLColors.lightText
  },
  text3: {
    fontSize: 13,
    color: PLColors.main,
    fontWeight: 'bold'
  },
  listItemBody: {
    borderBottomWidth: 0
  },
  listItem: {
    borderBottomWidth: 0.6,
    borderBottomColor: '#c9c9c9',
    marginLeft: 0,
    paddingLeft: 17,
    paddingTop: 12,
    paddingBottom: 12
  },
  listItemRight: {
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  acceptIcon: {
    color: '#35cd60',
    fontSize: 25,
    width: 25,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 10
  },
  rejectIcon: {
      color: '#ef473a',
      fontSize: 25,
      width: 25,
      paddingLeft: 5,
      paddingRight: 5
  },
  inviteRightItem: {
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0
  },
  inviteRightBtn1: {
    borderRadius: 0,
    marginBottom: 5,
    backgroundColor: PLColors.main,
    borderWidth: 1,
    borderColor: PLColors.main,
    height: 25
  },

  inviteRightBtn2: {
    borderRadius: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: PLColors.main,
    height: 25,
    opacity: 0.5
  },
  inviteRightBtnText1: {
    color: 'white',
    fontSize: 12
  },
  inviteRightBtnText2: {
    color: PLColors.main,
    fontSize: 12
  }
};
