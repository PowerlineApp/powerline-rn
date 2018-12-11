import commonColor from "../../../../native-base-theme/variables/commonColor";

const React = require("react-native");

const { Dimensions, Platform } = React;

const deviceWidth = Dimensions.get("window").width;

const popupWidth = 300;

export default {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  infoView: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    left: (deviceWidth - popupWidth) / 2,
    width: 300,
    padding: 10
  },
  titleItem: {
    marginBottom: 10
  },
  textAreaItem: {
    marginBottom: 10
  },
  item: {
    marginBottom: 8
  },
  memoArea: {
    height: 120,
    borderColor: '#7f7f7f',
    borderWidth: 0.8
  },
  reservationPanel: {
    borderColor: '#7f7f7f',
    borderWidth: 0.5,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 6
  },
  reservationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dateButton: {
    height: 30,
    width: 240,
    paddingLeft: 8
  },
  dateText: {
    fontSize: 15
  },
  numberSpinner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    width: 116,
    paddingLeft: 8
  },
  numberSpinnerInput: {
    borderColor: '#7f7f7f',
    borderWidth: 0.5,
    height: 30,
  },
  numberSpinnerButton: {
    height: 30
  },
  buttonPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  }
};
