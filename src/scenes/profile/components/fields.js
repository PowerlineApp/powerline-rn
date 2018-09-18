import React, {Component} from 'react';
import { View } from 'react-native';
import {ListItem, Button, Text, Icon, Input, Picker, Item} from 'native-base'
import PLColors from 'PLColors'
import DatePicker from 'react-native-datepicker'
class Fields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            value: props.value
        }
        this.renderFields = this.renderFields.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    renderFields() {
        if(this.state.editMode) {
            if(this.props.date) {
                return (
                    <DatePicker 
                        showIcon={false}
                        date={this.state.value}
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        format="MM-DD-YYYY"
                        onDateChange={date => this.setState({value: date})}
                        customStyles={{
                            dateInput: {
                                borderColor: '#fff'
                            },
                            dateText: {
                                color: '#000',
                                fontSize: 16,
                                fontWeight: '400',
                                marginBottom: -5
                            }
                        }}
                    />
                )
            } else {
                return (
                    <Input style={{borderBottomWidth: 1, borderBottomColor: 'grey'}} onChangeText={text => this.setState({value: text})}/>
                )
            }
        } else {
            if(this.state.value) {
                return (
                    <Text>{this.state.value.length > 12 ? `${this.state.value.substr(0, 12)}...`: this.state.value}</Text>
                )
            }
            return (
                <Text style={{color: 'grey'}}>Empty</Text>
            )
        }
    }

    renderButton() {
        if(this.state.editMode) {
            return (
                <Button onPress={() => this.onSave()} transparent>
                    <Text>Save</Text>
                </Button>
            )
        }
        return (
            <Button onPress={() => this.setState({
                editMode: true
            })} transparent>
                <Text>Edit</Text>
            </Button>
        )
    }
    
    onSave() {
        this.setState({
            editMode: false
        })
        this.props.onSave(this.state.value)
    }

    render() {
        return (
            <ListItem>
                <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                    <Icon name='contact' color={PLColors.main} style={{marginRight: 10}}></Icon>
                    <Text style={{color: 'grey'}}>{this.props.label}</Text>
                </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                        {this.renderFields()}
                        {this.renderButton()}
                </View>
            </ListItem>
        )
    }
}

export default Fields