//User should be able to create a new group from the My Groups Screen and the Burger Menu
//GH149
//https://api-dev.powerli.ne/api-doc#post--api-v2-user-groups

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Header,
    Body,
    Context,
    Icon,
    Left,
    Title,
    Button,
    Content,
    Form,
    Item,
    Label,
    Input,
    Right,
    Text,
    ActionSheet
} from 'native-base';

import {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

const PLColors = require('PLColors');
import styles from './styles';
import { openDrawer } from '../../../actions/drawer';
import {
    View,
    TouchableOpacity,
    TextInput,
    Picker,
    Alert
} from 'react-native';
import { loadUserData, createGroup } from 'PLActions';

class CreateGroup extends Component{
    typeList = ["Educational", "Non-Profit(Not Campaign)", "Non-Profit(Campaign)", "Business", "Cooperative/Union", "Other"];

    constructor(props){
        super(props);

        //These are intentionally blank
        this.state = {
                manager_first_name: "",
                manager_last_name: "",
                manager_email: "",
                manager_phone: "",
                official_name: "",
                official_type: "",
                official_description: "",
                acronym: ""
        };

        var { token } = this.props;
       //This data is required on backend to create a group.
        loadUserData(token)
        .then(data => {
            this.state.manager_first_name = data.first_name;
            this.state.manager_last_name = data.last_name;
            this.state.manager_email = data.email;
            this.state.manager_phone = data.phone;
        })
        .catch(err => {
            console.log(err);
        });
    }

    showActionSheet(){
        ActionSheet.show({
            options: this.typeList,
            title: "Group Type"
        }, buttonIndex => {
            this.setState({
                official_type: this.typeList[buttonIndex]          
            })
        })
    }

    //Parent Teacher Association
    onChangeName(text){
        this.setState({
            official_name: text
        });
    }

    // A group to bring parents and teachers together in our school district.
    onChangeDesc(text){
        this.setState({
            official_description: text
        });
    }

    //Parent Teacher Association => PTA
    onChangeAcron(text){
        this.setState({
            acronym: text
        });
    }

    onSend(){
        //Actions.groupprofile();
        
        var { token } = this.props;
        createGroup(token, this.state)
        .then(data => {
            if(!data.message){
                Alert.alert(
                    "Alert",
                    "Way to go! You've created a new Powerline group. Invite your followers from the next screen or login via our website for group management features. Check your e-mail for more information.",
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                Actions.groupprofile(data);
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }else{
                alert(data.message);
            }
            
        })
        .catch(err => {
            alert(JSON.stringify(err));
        });
        
    }

    render(){
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Button transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{color: 'white'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>New Group</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.onSend()}>
                                <Label style={{color: 'white'}}>Send</Label>
                            </Button>
                        </Right>
                    </Header>
                    <Content padder style={{backgroundColor: 'white'}}>
                        <View style={styles.formContainer}>
                            <View style={styles.itemContainer}>
                                <TextInput
                                    placeholder="Group Name*"
                                    style={styles.inputText}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.official_name}
                                    onChangeText={(text) => this.onChangeName(text)}
                                />
                            </View>
                            <View style={styles.itemContainer} onPress={() => this.showActionSheet()}>
                                <TextInput
                                    placeholder="Group Type*"
                                    style={styles.inputText}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    onFocus={() => this.showActionSheet()}
                                    value={this.state.official_type}
                                />
                            </View>
                            <View style={styles.itemContainer}>
                                <TextInput
                                    placeholder="Group Description*"
                                    style={styles.inputText}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.official_description}
                                    onChangeText={(text) => this.onChangeDesc(text)}
                                />
                            </View>
                            <View style={styles.itemContainer}>
                                <TextInput
                                    placeholder="Group Acron*"
                                    style={styles.inputText}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.acronym}
                                    onChangeText={(text) => this.onChangeAcron(text)}
                                />
                            </View>
                        </View>                        
                    </Content>
                </Container>
            </MenuContext>
        );
    }
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop
};

const mapStateToProps = state => ({
    token: state.user.token
});

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);