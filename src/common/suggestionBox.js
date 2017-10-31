import React, {Component} from 'react';
import {ScrollView, View, Modal, Text, FlatList, TouchableHighlight} from 'react-native';

class SuggestionBox extends Component {
    render () {
        if (!this.props.displaySuggestionBox) {
            return null;
        }
        console.log(this.props.displaySuggestionBox, this.props.userList ? this.props.userList.length : '');
        return (
            <View style={styles.boxStyle}>
                <FlatList
                    data={this.props.userList}
                    renderItem={({item, index}) =>
                        {
                            console.log(item, index, this.props.userList.length)
                            return <TouchableHighlight key={item.id} onPress={() => this.props.substitute('@' + item.username + ' ')}>
                            <View style={styles.itemStyle} >
                                <Text style={styles.textStyle} >{'@' + item.username + ' ' + item.first_name + ' ' + item.last_name}</Text>
                                {index !== this.props.userList.length -1 ? <View style={styles.divider} /> : null}
                            </View>
                        </TouchableHighlight>}
                    }
                    />
            </View>
        );
    }
}

const styles = {
    boxStyle: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        padding: 8
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        width: '100%'
    },
    itemStyle: {
        backgroundColor: '#fff',
        height: 40,
        justifyContent: 'space-around'
    },
    textStyle: {
        color: '#030747',
        justifySelf: 'center'
    }
}


export default SuggestionBox;
