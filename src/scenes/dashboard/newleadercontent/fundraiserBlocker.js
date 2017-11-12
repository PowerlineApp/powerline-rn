import React, {Component} from 'react';
import {View, Modal, Text} from 'react-native';

class FundraiserBlocker extends Component {
    render(){
        return null;
        if (this.props.visible) return null;
        return <Modal>
            <View>
            <Text>It seems that your group does not have any account set up yet!</Text>
            <Text>Dont horry, be happy!!</Text>
            </View>
        </Modal>
    }

}
export default FundraiserBlocker;