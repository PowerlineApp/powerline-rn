import React, {Component} from 'react';
import {View, Modal, Text} from 'react-native';
import {Button} from 'native-base';
import { Actions } from 'react-native-router-flux';

class FundraiserBlocker extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: true
        };
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.visible){
            this.setState({visible: true});
        }
    }

    render(){
        return <Modal transparent visible={this.state.visible} >
            <View style={styles.background} >
                <View style={styles.prompt}>
                    <Text style={styles.promptTitle} >This group does not have an Bank Account setup yet</Text>
                    <Text style={styles.promptContent} >It seems that your group doesn't have any bank account registered. Please add a bank account to your group or ask the group owner to do so. </Text>
                    <View style={styles.buttonsRow}>
                        <Button style={styles.button} onPress={() => {this.setState({visible: false}); Actions.pop();}}>
                            <Text>Cancel</Text>
                        </Button>
                        <Button style={styles.button} onPress={() => {this.setState({visible: false}); Actions.pop(); setTimeout(() => {Actions.groupprofile({id: this.props.group.id});}, 500);}}>
                            <Text>Go to Group Settings</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>;
    }
}

const styles = {
    background: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    prompt: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '20%',
        width: '80%',
        elevation: 2
    },
    promptTitle: {
        color: '#000',
        fontWeight: '500',
        alignSelf: 'flex-start',
        padding: 20,
        paddingBottom: 0,
        fontSize: 16
    },
    promptContent: {
        alignSelf: 'flex-start',
        paddingLeft: 20,
        paddingTop: 0,
        fontWeight: '400',
        fontSize: 14

    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20
    },
    button: {
        backgroundColor: '#fff',
        flex: 1
    }
};

export default FundraiserBlocker;
