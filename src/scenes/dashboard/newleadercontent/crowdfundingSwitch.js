import React, {Component} from 'react';
import {View, Text, TextInput, Switch, TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import styles from './styles';

class CrowdfundingSwitch extends Component{
    constructor(props){
        super(props);
        this.state = {
            date: null,
            time: null,
            goal: '',
            mode: '',
            pickervisible: false,
            is_crowdfunding: false
        }
    }
    openModal(mode){
        this.setState({mode, pickervisible: true})
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

    updateAnswer(key, value){
        let {state} = this;
        state[key] = value;
        this.setState(state, () => this.updateProps());
        // this.props.setAnswer(answers);
    }

    setCrowfunding(bool) {
        this.setState({
            date: null,
            time: null,
            mode: '',
            goal: '',
            pickervisible: false,
            is_crowdfunding: bool
        }, () => this.updateProps())
    }

    handlePicker(content){
        let {state} = this;
        let {mode} = state;
        state[mode] = content;
        this.setState({...state, pickervisible: false}, () => this.updateProps());
    }

    updateProps(){
        let { date, time, mode, goal, pickervisible, is_crowdfunding } = this.state;
        let deadline = moment(date).startOf('day').add(moment(time).hour(), 'hour').add(moment(time).minutes(), 'minutes').format('YYYY-MM-DD HH:mm:ssZZ').split(' ').join('T');
        this.props.updateCrowdfundingInfo({deadline, goal, is_crowdfunding});
    }


    render(){
        let {is_crowdfunding} = this.state;
        return (
            <View style={styles.crowdfundingSwitch}>
                <DateTimePicker
                    isVisible={this.state.pickervisible}
                    onConfirm={(data) => this.handlePicker(data)}
                    onCancel={() => this.setState({pickervisible: false})}
                    mode={this.state.mode}
                />
                <View style={styles.switchContainer}>
                    <Text>Make this a crowfunder?</Text>
                    <Switch value={is_crowdfunding} onChange={() => this.setCrowfunding(!is_crowdfunding)} />
                </View>
                {
                    is_crowdfunding &&
                    <View style={styles.crowfundingPanel}>
                        <View style={styles.crowdfundingGoal}>
                            <Text>Crowdfunding goal:</Text>
                            <View style={styles.answerOptionContainer}>
                            {[
                                <TextInput
                                    maxLength={10000}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    ref={(r) => this.descriptionRef = r}
                                    onSelectionChange={this.onSelectionChange}
                                    placeholderTextColor='rgba(0,0,0,0.1)'
                                    style={styles.crowdfundingGoalInput}
                                    value={this.state.goal}
                                    onChangeText={(amount) => this.updateAnswer('goal', amount)}
                                />,
                                <View style={styles.suffixContainer} >
                                    <Text style={styles.suffix} >USD</Text>
                                </View>
                            ]}
                            </View>
                        </View>
                        <View style={styles.crowdFundingDeadLine}>
                            <TouchableOpacity onPress={() => this.openModal('date')}>
                                <View style={styles.dateContainer}>
                                    <Text style={styles.crowdfundingDateTitle}>Deadline day</Text>
                                    <Text style={styles.crowdfundingDate}>
                                        {this.formatDate(this.state.date)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.openModal('time')}>
                                <View style={styles.dateContainer}>
                                    <Text style={styles.crowdfundingDateTitle}>Deadline hour</Text>
                                    <Text style={styles.crowdfundingDate}>
                                        {this.formatHour(this.state.time)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

export default CrowdfundingSwitch;