import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import { SegmentedControls } from 'react-native-radio-buttons';
import Icon from 'react-native-vector-icons/FontAwesome'

class FilterAnalytics extends Component {
    constructor(props) {
        super(props);
        this.onSelection = this.onSelection.bind(this);
    }
    onSelection (item) {
        this.props.onSelection(item)
    }
    render() {
        return (
            <View>
                <SegmentedControls
                    options={ this.props.options }
                    onSelection={ item => this.onSelection(item) }
                    selectedOption={ this.props.selected }
                />
            </View>
        )
    }
}

export default FilterAnalytics