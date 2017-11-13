import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {CheckBox} from 'react-native-elements';

class Option extends Component{

    constructor(props){
        super(props);
    }

    // same as poll
    renderEventOption(){
        return null;
    }
    //  easier
    renderPollOption(opt){
        return (
            <CheckBox onPress={() => this.props.onCheck()} checked={opt.checked} uncheckedIcon={'circle-o'} checkedColor={'#183E63'} containerStyle={{backgroundColor: opt.checked ? '#ADD8E6' : '#fff', borderColor: '#fff', borderBottomColor: '#efefef', borderWidth: 2, margin: 0}} title={
                <View style={{flex: 1, paddingLeft: 20, height: '100%'}}>
                    <Text style={styles.mainText}>{opt.value}</Text>
                    <Text style={styles.caption}>33 responses</Text>
                </View>}
            />
        );
    }

    // might be editable
    renderFundraiserOption(){
        return null;
    }

    render() {
        let {opt, type} = this.props;
        console.log(opt, type);
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
    }
};

export default Option;
