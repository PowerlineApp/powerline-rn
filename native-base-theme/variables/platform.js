import color from 'color';
import PLColors from 'PLColors';

import { Platform, Dimensions, PixelRatio } from 'react-native';
import { darkenHex } from './hex';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const isIOS = Platform.OS === 'ios';
const platformStyle = undefined;

export default {
  platformStyle,
  platform: Platform.OS,
  // AndroidRipple
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',

  // Badge
  badgeBg: '#ED1727',
  badgeColor: '#fff',
  // New Variable
  badgePadding: isIOS ? 3 : 0,

  // Button
  btnFontFamily: isIOS ? 'System' : 'Roboto_medium',
  btnDisabledBg: '#b5b5b5',
  btnDisabledClr: '#f1f1f1',

  // CheckBox
  CheckboxRadius: isIOS ? 13 : 0,
  CheckboxBorderWidth: isIOS ? 1 : 2,
  CheckboxPaddingLeft: isIOS ? 4 : 2,
  CheckboxPaddingBottom: isIOS ? 0 : 5,
  CheckboxIconSize: isIOS ? 21 : 14,
  CheckboxIconMarginTop: isIOS ? undefined : 1,
  CheckboxFontSize: isIOS ? (23 / 0.9) : 18,
  DefaultFontSize: 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: '#fff',

  // Segment
  segmentBackgroundColor: isIOS ? '#F8F8F8' : '#3F51B5',
  segmentActiveBackgroundColor: isIOS ? '#007aff' : '#fff',
  segmentTextColor: isIOS ? '#007aff' : '#fff',
  segmentActiveTextColor: isIOS ? '#fff' : '#3F51B5',
  segmentBorderColor: isIOS ? '#007aff' : '#fff',
  segmentBorderColorMain: isIOS ? '#a7a6ab' : '#3F51B5',

  // New Variable
  get defaultTextColor() {
    return this.textColor;
  },


  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return isIOS ? this.fontSizeBase * 1.1 :
      this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },

  buttonPadding: 2,

  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },


  // Card
  cardDefaultBg: '#fff',


  // Color
  brandPrimary: isIOS ? '#007aff' : '#3F51B5',
  brandInfo: '#62B1F6',
  brandSuccess: '#5cb85c',
  brandDanger: '#d9534f',
  brandWarning: '#f0ad4e',
  brandSidebar: '#252932',


  // Font
  fontFamily: 'Roboto',
  fontSizeBase: 15,

  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },


  // Footer
  footerHeight: 55,
  footerDefaultBg: isIOS ? '#F8F8F8' : '#4179F7',


  // FooterTab
  tabBarTextColor: '#8694ab',
  tabBarTextSize: isIOS ? 9 : 8,
  activeTab: isIOS ? '#007aff' : '#fff',
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: PLColors.main,
  tabActiveBgColor: isIOS ? '#cde1f9' : 'white',

  // Tab
  tabDefaultBg: isIOS ? '#F8F8F8' : '#3F51B5',
  topTabBarTextColor: isIOS ? '#6b6b6b' : '#b3c7f9',
  topTabBarActiveTextColor: isIOS ? '#007aff' : '#fff',
  topTabActiveBgColor: isIOS ? '#cde1f9' : undefined,
  topTabBarBorderColor: isIOS ? '#a7a6ab' : '#fff',
  topTabBarActiveBorderColor: isIOS ? '#007aff' : '#fff',


  // Header
  toolbarBtnColor: isIOS ? '#007aff' : '#fff',
  toolbarDefaultBg: isIOS ? '#F8F8F8' : '#3F51B5',
  toolbarHeight: isIOS ? 64 : 56,
  toolbarIconSize: isIOS ? 20 : 22,
  toolbarSearchIconSize: isIOS ? 20 : 23,
  toolbarInputColor: isIOS ? '#CECDD2' : '#fff',
  searchBarHeight: isIOS ? 30 : 40,
  toolbarInverseBg: '#222',
  toolbarTextColor: isIOS ? '#000' : '#fff',
  toolbarDefaultBorder: isIOS ? '#a7a6ab' : '#3F51B5',
  iosStatusbar: isIOS ? 'light-content' : 'light-content',
  get statusBarColor() {
    return darkenHex(this.toolbarDefaultBg);
  },


  // Icon
  iconFamily: 'Ionicons',
  iconFontSize: isIOS ? 30 : 28,
  iconMargin: 7,
  iconHeaderSize: isIOS ? 33 : 24,


  // InputGroup
  inputFontSize: 17,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',

  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return '#575757';
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8;
  },


  // Line Height
  btnLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  iconLineHeight: isIOS ? 37 : 30,
  lineHeight: isIOS ? 20 : 24,


  // List
  listBorderColor: '#c9c9c9',
  listDividerBg: '#f4f4f4',
  listItemHeight: 45,
  listBtnUnderlayColor: '#DDD',

  // Card
  cardBorderColor: '#ccc',

  // Changed Variable
  listItemPadding: isIOS ? 10 : 12,

  listNoteColor: '#808080',
  listNoteSize: 13,


  // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',


  // Radio Button
  radioBtnSize: isIOS ? 25 : 23,
  radioSelectedColorAndroid: '#3F51B5',

  // New Variable
  radioBtnLineHeight: isIOS ? 29 : 24,

  radioColor: '#7e7e7e',

  get radioSelectedColor() {
    return darkenHex(this.radioColor);    
  },


  // Spinner
  defaultSpinnerColor: '#45D56E',
  inverseSpinnerColor: '#1A191B',


  // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: 15,
  tabTextColor: '#222222',


  // Text
  textColor: '#000',
  inverseTextColor: '#fff',
  noteFontSize: 14,


  // Title
  titleFontfamily: isIOS ? 'System' : 'Roboto_medium',
  titleFontSize: isIOS ? 17 : 19,
  subTitleFontSize: isIOS ? 12 : 14,
  subtitleColor: isIOS ? '#8e8e93' : '#FFF',

  // New Variable
  titleFontColor: isIOS ? '#000' : '#FFF',


  // Other
  borderRadiusBase: isIOS ? 5 : 2,
  borderWidth: (1 / PixelRatio.getPixelSizeForLayoutSize(1)),
  contentPadding: 10,

  get darkenHeader() {
    return darkenHex(this.tabBgColor, 0.03);
  },

  dropdownBg: '#000',
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  jumbotronBg: '#C9C9CE',
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,

  // New Variable
  inputGroupRoundedBorderRadius: 30,
};
