import React from 'react'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { CachedImage } from 'react-native-img-cache'
import { FlatList, View, Text, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux'

import styles from './styles'

export default class UserList extends React.Component {
    static defaultProps = {
        renderAvatars: true,
        renderActions: true,
        renderEmail: false,
        subTextKey: 'username',
        subTextKeySeperator: '',
        users: []
    }

    renderPositiveAction = (label, onPress) => {
        if (!this.props.renderActions) return null
        return (
            <View style={styles.actionButtonContainer}>
                <TouchableHighlight onPress={onPress} style={styles.actionButton}>
                    <Text style={styles.actionButtonLabel}>{label}</Text>
                </TouchableHighlight>
            </View>
        )
    }

    renderNegativeAction = (label, onPress) => {
        if (!this.props.renderActions) return null
        return (
            <View style={styles.actionButtonContainer}>
                <TouchableHighlight onPress={onPress} style={styles.actionButtonRed}>
                    <Text style={styles.actionButtonLabel}>{label}</Text>
                </TouchableHighlight>
            </View>
        )
    }

    renderItem = ({ item }) => {
        return (
            <View />
        )
    }
    
    render() {
        const { users } = this.props;
        console.log('user----', users);
        return (
            <View style={styles.container}>
                {
                    users && (<FlatList
                    style={{ flex: 1 }}
                    data={users}
                    renderItem={this.renderItem}
                    />)
                }
            </View>
        )
    }
}
