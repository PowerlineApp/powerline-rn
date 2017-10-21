import React, { Component, PropTypes } from 'react';
import { Content, Text, Center } from 'native-base';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', },
  title: { fontSize: 15, fontWeight: '500', },
});

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


export default ContentPlaceholder;
