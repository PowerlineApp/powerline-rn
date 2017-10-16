import React, {Component} from 'react';
import {View, Modal, Text, FlatList, TouchableHighlight} from 'react-native';

class SuggestionBox extends Component {

    render(){
        if (!this.props.displaySuggestionBox){
            return null;
        }
        return (
            <View>
                    <FlatList
                        data={this.props.userList}
                        renderItem={({item}) =>
                        <TouchableHighlight style={{height: 44, backgroundColor:'#ccc' }} key={item.id} onPress={() => this.props.substitute('@' + item.username)}>
                            <Text>{'@' + item.username + ' ' +item.first_name + ' '+ item.last_name}</Text>
                        </TouchableHighlight>}
                    />
            </View>
        )
    }
}

export default SuggestionBox;