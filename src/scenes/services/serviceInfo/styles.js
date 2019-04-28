import commonColor from "../../../../native-base-theme/variables/commonColor";
import PLColors from 'PLColors'
const React = require("react-native");

const { Dimensions, Platform } = React;

const deviceWidth = Dimensions.get("window").width;

const popupWidth = 300;

export default {
  overlay: {
    flex: 1,
    backgroundColor: PLColors.darkBackground + 'AA',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoView: {
    flex: 1,
    backgroundColor: 'white',
    minWidth: 300,
    width: '80%',
    margin: 80,
    borderRadius: 10,
    padding: 16,
    paddingTop: 22,
    // ios
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
        height: 0,
        width: 0
    },
    // android
    elevation: 3
  },
  titleItem: {
    marginBottom: 10
  },
  serviceTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: PLColors.darkGreyText
  },
  textAreaItem: {
    marginBottom: 10
  },
  item: {
    marginBottom: 8
  },
  memoArea: {
    height: 120,
    marginTop: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1
  },
  reservationPanel: {
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    padding: 8
  },
  reservationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  dateButton: {
    height: 30,
    flex: 2,
    // width: 240,
    // paddingLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  dateText: {
    fontSize: 13
  },
  numberSpinner: {
    flexDirection: 'row',
    // alignItems: 'space-between'
  },
  numberSpinnerInput: {
    // borderColor: '#7f7f7f',
    // borderWidth: 0.5,
    // height: 30,
  },
  numberSpinnerButton: {
    height: 30
  },
  buttonPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  labelContainer: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)'
  },
  labelText: {
    color: PLColors.lightText,
    fontWeight: '350'
  },
  priceText: {
    color: PLColors.greenMoney,
    fontWeight: 'bold'
  },
  labelValue: {
    color: PLColors.darkGreyText,
    fontWeight: 'bold'
  },
  reservationIconContainer: {
    margin: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
      // ios
      shadowOpacity: 0.3,
      shadowRadius: 1,
      shadowOffset: {
          height: 0,
          width: 0
      },
      // android
      elevation: 2
  },
  reservationIcon: {
    fontSize: 34,
    color: PLColors.actionText
  },
  reservationInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 120,
    alignItems: 'center'
  },
  numberOfPeopleContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  reservationLabel: {
    fontSize: 14,
    color: PLColors.darkText
  }
};
