import React, {Component} from 'react';
import {ScrollView, View, Modal, Text, FlatList, TouchableHighlight} from 'react-native';

class SuggestionBox extends Component {
    render () {
        if (!this.props.displaySuggestionBox) {
            return null;
        }
        console.log(this.props.displaySuggestionBox, this.props.userList ? this.props.userList.length : '');
        return (
            <FlatList
                horizontal={this.props.horizontal}
                keyboardShouldPersistTaps='always'
                data={this.props.userList}
                style={styles.boxStyle}
                renderItem={({item, index}) =>
                    <TouchableHighlight key={item.id} onPress={() => this.props.substitute('@' + item.username + ' ')}>
                        <View style={styles.itemStyle(this.props.horizontal)} >
                            <Text style={styles.textStyle} >{'@' + item.username + ' ' + item.first_name + ' ' + item.last_name}</Text>
                            {index !== this.props.userList.length -1 ? <View style={styles.divider(this.props.horizontal)} /> : null}
                        </View>
                    </TouchableHighlight>
                    }
                    />
        );
    }
}

const styles = {
    boxStyle: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        padding: 8
    },
    divider:(horizontal) =>  ({
        width: horizontal ? 1 : '100%',
        height: horizontal ? '100%' : 1,
        backgroundColor: '#ccc',
        marginHorizontal: horizontal ? 4 : 0
    }),
    itemStyle:(horizontal) =>  ({
        flexDirection: horizontal ? 'row' : 'column',
        backgroundColor: '#fff',
        height: horizontal ? 20 : 40,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }),
    textStyle: {
        color: '#030747'
    }
};


export default SuggestionBox;
