import commonColor from '../../../../native-base-theme/variables/commonColor';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const serviceOfferConfirmPopupWidth = 300;
const serviceOfferConfirmPopupHeight = 380;

const serviceRemoveConfirmPopupWidth = 300;
const serviceRemoveConfirmPopupHeight = 180;

const errorAlertPopupWidth = 300;
const errorAlertPopupHeight = 180;

export default {
  iosHeader: {
    backgroundColor: '#fff'
  },
  aHeader: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
    elevation: 3
  },
  iosHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: commonColor.brandPrimary
  },
  aHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
    color: commonColor.brandPrimary
  },
  headerTitle: {
    fontWeight: '400',
    padding: 15,
    fontSize: 18,
    color: '#888'
  },
  listcustom: {
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    borderTopWidth: 0,
    marginLeft: 0,
    paddingLeft: 15,
    backgroundColor: '#fff'
  },
  listContainer: {
    flexDirection: 'row'
    // flexWrap: 'no-wrap'
  },
  lextText: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'flex-start'
  },
  textColor: {
    color: '#444',
    fontSize: 16,
    alignSelf: 'flex-start',
    fontWeight: '400'
  },
  rightText: {
    // width: 40,
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  buttonContinue: {
    alignSelf: 'stretch',
    borderRadius: 0
  },

  modal: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    width: 300
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayTouch: {
    position: 'absolute',
    width: width,
    height: height
  },
  serviceOfferConfirm: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    top: (height - serviceOfferConfirmPopupHeight) / 2,
    left: (width - serviceOfferConfirmPopupWidth) / 2,
    width: serviceOfferConfirmPopupWidth,
    padding: 20
  },
  serviceRemoveConfirm: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    top: (height - serviceRemoveConfirmPopupHeight) / 2,
    left: (width - serviceRemoveConfirmPopupWidth) / 2,
    width: serviceRemoveConfirmPopupWidth,
    height: serviceRemoveConfirmPopupHeight,
    padding: 20
  },
  serviceConfirmContent: {
    alignItems: 'flex-start',
    width: width - 100
  },
  serviceConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16
  },
  serviceConfirmTitle: {
    fontSize: 16,
    marginBottom: 16
  },
  serviceConfirmDescription: {
    fontSize: 15,
    marginBottom: 10
  },
  serviceConfirmInput: {
    width: serviceOfferConfirmPopupWidth - 20,
    borderColor: '#7f7f7f',
    borderWidth: 0.8,
    marginBottom: 16
  },
  buttonPanel: {
    width: 100
  },
  errorAlert: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    top: (height - errorAlertPopupHeight) / 2,
    left: (width - errorAlertPopupWidth) / 2,
    width: errorAlertPopupWidth,
    height: errorAlertPopupHeight,
    padding: 20
  },
  errorAlertText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center'
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
