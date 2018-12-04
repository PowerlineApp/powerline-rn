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
        const { renderAvatars, renderEmail } = this.props

        var hasPositive = false
        var hasNegative = false

        hasNegative = { label: 'TODO:', onPress: () => {} }

        var fullName = item.fullName || item.firstName + ' ' + item.lastName
        var subText = ''

        if (Array.isArray(this.props.subTextKey)) {
            this.props.subTextKey.forEach(key => {
                if(!item.hasOwnProperty(key)) {
                    subText += key + ' ' + this.props.subTextKeySeperator
                } else {
                    subText += item[key] + ' ' + this.props.subTextKeySeperator
                }
            })

            subText = subText.substring(
                0,
                subText.length - this.props.subTextKeySeperator.length
            )
        } else {
            subText = item[this.props.subTextKey]
        }

        return (
            <TouchableHighlight
                onPress={() => {
                    console.warn(
                        'TODO:',
                        'GOTO: PROFILE: ' + JSON.stringify(item, null, 4)
                    )
                }}
                underlayColor="#eee">
                <View style={styles.item}>
                    {renderAvatars && (
                        <View style={styles.avatarContainer}>
                            <CachedImage
                                source={{
                                    uri: item.avatarFileName || item.avatarFilePath
                                }}
                                style={styles.avatar}
                            />
                        </View>
                    )}
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee'
                        }}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{fullName}</Text>
                            {renderEmail &&
                                item.email && (
                                    <Text style={styles.subText}>{item.email}</Text>
                                )}
                            <Text style={styles.subText}>{subText}</Text>
                        </View>

                        {hasNegative &&
                            this.renderNegativeAction(
                                hasNegative.label,
                                hasNegative.onPress
                            )}
                        {hasPositive &&
                            this.renderPositiveAction(
                                hasPositive.label,
                                hasPositive.onPress
                            )}
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
    
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.props.users}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}
