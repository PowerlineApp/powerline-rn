import PLColors from 'PLColors';
import { StyleSheet, PixelRatio } from 'react-native';

export default {
  container: {
    backgroundColor: '#e2e7ea',
    flex: 1,
  },

  header: {
    backgroundColor: PLColors.main,
  },

  groupHeaderContainer: {
      backgroundColor: 'white', 
      marginLeft: 0,
      paddingLeft: 17
  },

  avatar: {
    width: 80,
    height: 80
  },

  list: {
      marginLeft: 17, 
      marginTop: 17, 
      marginRight: 17,
      marginBottom: 17
  },

  listItem: {
      backgroundColor: 'white', 
      marginLeft: 0,
  },

  contentItem: {
      backgroundColor: 'white',
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 8,
      borderBottomWidth: (1 / PixelRatio.getPixelSizeForLayoutSize(1)),
      borderColor: '#c9c9c9',
  },

  dashLine: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c9c9c9',
    borderStyle: 'dashed',
    marginBottom: 8
  }

};
