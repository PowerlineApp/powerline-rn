import React, {Component} from 'react';
import {View, Text, TextInput, KeyboardAvoidingView} from 'react-native';
import {Input} from 'native-base';
import {CheckBox} from 'react-native-elements';

class Option extends Component{

    constructor(props){
        super(props);

        this.state = {
            value: props.opt.payment_amount || 0
        };
    }

    // same as poll
    renderEventOption(opt){
        return (
            <CheckBox 
                onPress={() => this.props.onCheck()} 
                checked={opt.checked} 
                uncheckedIcon={'circle-o'} 
                checkedColor={'#183E63'} 
                containerStyle={styles.optionContainer(opt)} 
                title={
                    <View style={{flex: 1, paddingLeft: 20, height: '100%'}}>
                        <Text style={styles.mainText}>{opt.value}</Text>
                    </View>}
            />
        );
    }
    //  easier
    renderPollOption(opt){
        return (
            <CheckBox 
                onPress={() => this.props.onCheck()} 
                checked={opt.checked} 
                uncheckedIcon={'circle-o'} 
                checkedColor={'#183E63'} 
                containerStyle={styles.optionContainer(opt)} 
                title={
                    <View style={{flex: 1, paddingLeft: 20, height: '100%'}}>
                        <Text style={styles.mainText}>{opt.value}</Text>
                    </View>}
        />
        );
    }

    // might be editable
    renderFundraiserOption(opt){
        return (
            <CheckBox 
                onPress={() => this.props.onCheck(this.state.value)} 
                checked={opt.checked} 
                uncheckedIcon={'circle-o'} 
                checkedColor={'#183E63'} 
                containerStyle={styles.optionContainer(opt)} 
                title={
                    <View style={{flex: 1, flexDirection: 'row', paddingLeft: 20, height: '100%'}}>
                        <Text style={styles.dolarSign}>$</Text>
                        {opt.is_user_amount 
                            ? <Input 
                                style={styles.valueInput} 
                                value={this.state.value} 
                                onChangeText={(value) => {
                                    this.setState({value}); 
                                    this.props.onCheck(value);
                                }} 
                            /> 
                            : <Text>{opt.payment_amount}   </Text> }
                        <Text style={styles.mainText}>{opt.value}</Text>
                    </View>
                }
            />
        );
    }

    render() {
        let {opt, type} = this.props;
        console.log('SS', this.state.value);
        // console.log(opt, type);
        switch(type){
        case 'leader-event': 
            return this.renderEventOption(opt);
        case 'question':
            return this.renderPollOption(opt);
        case 'crowdfunding-payment-request':
            return this.renderFundraiserOption(opt);
        default:
            return null;
        }
    }
}

const styles = {
    caption: {
        fontSize: 11
    },
    mainText: {
        fontSize: 14,
        fontWeight: '500'
    },
    optionContainer: (opt) =>  ({
        backgroundColor: opt.checked ? '#ADD8E6' : '#fff',
        borderColor: '#fff',
        borderBottomColor: '#efefef',
        borderWidth: 2,
        margin: 0
    }),
    dolarSign: {
        fontSize: 11,
        fontWeight: '500'
    },
    valueInput: {
        minWidth: 60,
        backgroundColor: '#eee',
        fontSize: 14,
        marginRight: 8
    }
};

export default Option;
