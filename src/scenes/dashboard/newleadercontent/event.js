import React, {Component} from 'react';
import {View, Text, Picker, Platform, TouchableOpacity} from 'react-native';
import moment from 'moment';

import DateTimePicker from 'react-native-modal-datetime-picker';
console.log('MOMENT', moment);

class Event extends Component {
    constructor(props){
        super(props);
        this.state = {
            init: {
                date: null,
                time: null
            },
            end: {
                date: null,
                time: null
            },
            shift: '',
            mode: '',
            pickervisible: false
        }
    }

    openDateModal(shift){
        this.setState({mode: 'date', shift, pickervisible: true})
    }
    
    openHourModal(shift){
        this.setState({mode: 'time', shift, pickervisible: true})
    }

    handlePicker(content){
        let {state} = this;
        let {mode, shift} = state;
        state[shift][mode] = content;
        this.setState({...state, pickervisible: false});
        this.props.setEventDate(this.state.init, this.state.end)
    }

    formatDate(date){
        return date 
        ? moment(date).format('MMMM Do YYYY')
        : 'Pick a date.'
    }
    
    formatHour(date){
        return date 
        ? moment(date).format('hh:mm')
        : 'Pick an hour.'
    }


    render(){
        // console.log(this.state);
        return (
            <View style={styles.mainContainer}>
                <DateTimePicker
                    isVisible={this.state.pickervisible}
                    onConfirm={(data) => this.handlePicker(data)}
                    onCancel={() => {}}
                    mode={this.state.mode}
                />
                <TouchableOpacity onPress={() => this.openDateModal('init')}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateTitle}>Start of event (day)</Text>
                        <Text style={styles.date}>
                            {this.formatDate(this.state.init.date)}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openHourModal('init')}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateTitle}>Start of event (hour)</Text>
                        <Text style={styles.date}>
                            {this.formatHour(this.state.init.hour)}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openDateModal('end')}>
                    <View style={styles.dateContainer}>
                    <Text style={styles.dateTitle}>End of event (day)</Text>
                        <Text style={styles.date}>
                            {this.formatDate(this.state.end.date)}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openHourModal('end')}>
                <View style={styles.dateContainer}>
                        <Text style={styles.dateTitle}>End of event (hour)</Text>
                        <Text style={styles.date}>
                            {this.formatHour(this.state.end.hour)}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = {
    dateTitle: {
        color: '#999'
    },
    date: {
        fontWeight: '400', padding: 4
    },
    dateContainer: {
        backgroundColor: '#fff', marginTop: 8, padding: 8
    },
    mainContainer: {
        marginTop: 16
    }
}

export default Event;