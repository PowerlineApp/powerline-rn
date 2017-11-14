import React, { Component, PropTypes } from 'react';

import { View, TouchableOpacity } from 'react-native';
import {
  Button,
  Label as NSLabel,
  Text
} from 'native-base';
import { getGroupTags, getGroupOwnTags,groupSelectTag } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';

class Tags extends Component {
    constructor(props) {
        super(props);
        this.renderTags = this.renderTags.bind(this)
        this.saveTags = this.saveTags.bind(this)
    }
    componentWillMount() {
        const { token, dispatch, group: { id } } = this.props;
        dispatch(getGroupTags())
        dispatch(getGroupOwnTags(id))
    }

    renderTags() {
        return this.props.data.map(item => {
            return (
                <TouchableOpacity onPress={() => this.saveTags(item)} style={{justifyContent: 'center', padding: 5, backgroundColor: (this.props.groupOwnTags.includes(item) ? '#020860' : 'rgb(85,197,255)'), margin: 2}}>
                    <Text style={{color: 'white'}}>{item.name}</Text>
                </TouchableOpacity>
            )
        })
    }

    saveTags(tag) {
        const { dispatch, group: { id } } = this.props;
        this.props.dispatch(groupSelectTag(id, tag))
    }

    render() {
        return (
        <View>
            <Label>Select Tags (optional)</Label>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.renderTags()}
            </View>
        </View>
        );
    }
}

export default Tags;