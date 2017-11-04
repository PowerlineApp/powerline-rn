import React from 'react';
var PLColors = require('PLColors');

const styles = {
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
        marginTop: 17,
        paddingLeft: 17
      },
    
      inputText: {
        paddingVertical: 0,
        height: 44,
        fontSize: 14,
        backgroundColor: 'white',
        color: PLColors.lightText,
      },
    
      itemContainer: {
        marginTop: 5,
        height: 44,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: PLColors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 10,
        backgroundColor: 'white'
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
}

export default styles;

