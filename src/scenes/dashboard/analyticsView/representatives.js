import React, { Component } from 'react';
import { View, Text } from 'react-native'
import {List, ListItem, Spinner } from 'native-base';

class RepresentativesList extends Component {
    componentDidMount() {

    }
    renderRepresentatives (representatives) {
        return (
            <List>
                {representatives.map(rep => {
                    return (
                        <ListItem style={{paddingVertical: 20, height: 80, justifyContent: 'space-between'}} >
                            <View style={{alignItems: 'flex-start'}}>
                                <Text>{rep.first_name} {rep.last_name}</Text>
                                <Text style={{fontSize: 13,color: 'grey', alignSelf: 'flex-start'}}>{rep.official_title}</Text>
                            </View>
                            {this._viewTypeSelector(rep)}
                        </ListItem>
                    )
                })}
            </List>
        )
    }
    render() {
        if(this.props.representatives !== null) {
            return this.renderRepresentatives(this.props.representatives)
        }

        return <Spinner />
    }
}
export default RepresentativesList