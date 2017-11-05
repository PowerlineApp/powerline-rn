import React, { Component, PropTypes } from 'react';
import { Content, Text, Center } from 'native-base';
import { View, StyleSheet } from 'react-native';

const styles = {
  container: { 
    flex: 1, 
    justifyContent: 'center',
     alignItems: 'center'
  },
  title: {
    fontSize: 15,
    fontWeight: '500'
  }
};

const ContentPlaceholder = ({ empty, title, children, ...otherProps }) => {
  if (empty) {
    otherProps.contentContainerStyle = StyleSheet.flatten(styles.container);
  }

  return (
    <Content {...otherProps}>
      {
        empty ?
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
          </View>
        :
          children
      }
    </Content>
  );
};

ContentPlaceholder.propTypes = {
  empty: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.children,
};

ContentPlaceholder.defaultProps = {
  empty: false,
  title: '',
};

export default ContentPlaceholder;
