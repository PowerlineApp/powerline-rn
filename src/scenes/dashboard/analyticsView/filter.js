import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { RadioButtons } from 'react-native-radio-buttons';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
class FilterAnalytics extends Component {
    constructor(props) {
        super(props);
        this.setSelectedOption = this.setSelectedOption.bind(this);
        this.renderOption = this.renderOption.bind(this);
    }
    setSelectedOption(item) {
        // console.log('setSelectedOption', item)
        this.props.onChange(item);
    }

    renderContainer(optionsNodes) {
        return (
            <View>
                {optionsNodes}
            </View>
        );
    }

    renderOption(option, selected, onSelect, index){
        return (
            <TouchableWithoutFeedback  onPress={onSelect} key={index}>
                <View style={{flexDirection: 'row', padding: 4, margin: 10}}>
                    <Icon name='circle-o' size={25} color={this.props.selected === option ? 'blue' : 'grey'} active />
                    <Text style={{fontSize: 20, marginLeft: 20, color: (this.props.selected === option ? 'blue' : 'grey')}}>{option}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return (
            <View style={styles.filterContainer}>
                <View style={styles.filterContent}>
                    <Text style={{fontSize: 20}}>Filter data by:</Text>
                    <RadioButtons
                        options={this.props.options}
                        onSelection={this.setSelectedOption}
                        renderContainer={this.renderContainer}
                        renderOption={this.renderOption}
                    />
                </View>
            </View>
        );
    }
}

export default FilterAnalytics;