import React, { Component } from 'react';
import { Content, Text, Center } from 'native-base';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = {
    container: { 
        flex: 1,
        width: '100%',
        paddingHorizontal: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
};

const ContentPlaceholder = ({ empty, title, children, refreshControl, ...otherProps }) => {
    if (empty) {
        otherProps.contentContainerStyle = StyleSheet.flatten(styles.container);
    }

    return (
        <Content {...otherProps} refreshControl={refreshControl}>
            {
        empty ?
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
            </View>
        :
          children || null
      }
        </Content>
    );
};

ContentPlaceholder.propTypes = {
};

ContentPlaceholder.defaultProps = {
    empty: false,
    title: '',
};

export default ContentPlaceholder;
