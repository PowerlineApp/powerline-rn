import React, {Component} from 'react';
import {View, Modal, Text, FlatList, TouchableHighlight} from 'react-native';

class SuggestionBox extends Component {

    applyFilter(list, search){
        return list.filter(user => {
            return -1 !== user.username.toLowerCase().search(search) ||
            -1 !== user.first_name.toLowerCase().search(search) ||
            -1 !== user.last_name.toLowerCase().search(search)
        })
    }

    render(){
        if (!this.props.displaySuggestionBox){
            return null;
        }
        let list = this.applyFilter(this.props.userList, this.props.suggestionSearch.substring(1));
        console.log(list);
        return (
            <View>
                    <FlatList
                        data={list}
                        renderItem={({item}) =>
                        <TouchableHighlight style={{height: 44, backgroundColor:'#ccc' }} key={item.id} onPress={() => this.props.substitute('@' + item.username)}>
                            <Text style={{color: '030747'}}>{'@' + item.username + ' ' +item.first_name + ' '+ item.last_name}</Text>
                        </TouchableHighlight>}
                    />
            </View>
        )
    }
}

export default SuggestionBox;