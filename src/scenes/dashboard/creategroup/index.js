//User should be able to create a new group from the My Groups Screen and the Burger Menu
//GH149
//https://api-dev.powerli.ne/api-doc#post--api-v2-user-groups

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {ActivityIndicator} from 'react-native';
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

const PLColors = require('../../../common/PLColors');
import styles from './styles';
import { openDrawer } from '../../../actions/drawer';
import {
    View,
    TouchableOpacity,
    TextInput,
    Picker,
    Alert
} from 'react-native';
import { loadUserData, createGroup, getGroups } from '../../../actions';
import { showToast } from '../../../utils/toast';
import { SERVICE_AGREEMENT, PRIVACY_POLICY, TERMS_OF_USE } from '../../../common/PLConstants';
class CreateGroup extends Component{
    typeList = ["Educational", "Non-Profit (Not Campaign)", "Non-Profit (Campaign)", "Business", "Cooperative/Union", "Other"];

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
        if (this.state.loading) return;
        this.setState({loading: true});
        
        showToast('Creating group...')

        let { token } = this.props;
        let data = {
            manager_first_name: this.state.manager_first_name,
            manager_last_name: this.state.manager_last_name,
            manager_email: this.state.manager_email,
            manager_phone: this.state.manager_phone,
            official_name: this.state.official_name,
            official_type: this.state.official_type,
            official_description: this.state.official_description,
            acronym: this.state.acronym
        }
        createGroup(token, data)
        .then(data => {
            this.setState({loading: false})

            if(!data.message){
                getGroups(this.props.token)
                .then(data => {
                    console.log(data)
                    this.props.dispatch([{
                        type: 'LOADED_GROUPS',
                        data: { payload: data.payload }
                    }, {
                        type: 'SET_NEWSFEED_COUNT',
                        count: data.payload.reduce((a, b) => a += b.priority_item_count, 0),
                    }]);
                });



                Alert.alert(
                    "Alert",
                    "Way to go! You've created a new Powerline group. Invite all of your followers at once from the next screen, send invites from Manage Group screen, or tell people to search for your group using Search.",
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                Actions.groupprofile({backTo:'home', ...data});
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }else{
                try {
                    const children = data.errors.children
                    const error = Object.keys(children).filter((currentChild) => children[currentChild].errors)[0]
                    const errorName = error.split('_').map(lower => lower.charAt(0).toUpperCase() + lower.substring(1)).join(' ')
                    const errorMessage = children[error].errors[0]
                    Alert.alert(errorName, errorMessage);
                } catch (error) {
                    Alert.alert('Validation failed', 'It was not possible to create your group, please try again later')
                }
            }
            
        })
        .catch(err => {
            this.setState({loading: false})
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
                            <Title style={{color: '#fff'}}>New Group</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.onSend()}>
                            {
                                this.state.loading 
                                ? <ActivityIndicator color={'#fff'} animating={this.state.sending} />
                                : <Label style={{color: 'white'}}>{'Send'}</Label>
                            }
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
                            <View style={styles.termsContainner}>
                                <Text style={styles.termsText}>By creating this group, I agree to abide by the </Text>
                                <TouchableOpacity onPress={() => {Actions.terms({terms: SERVICE_AGREEMENT, title: 'Services Agremeent'})}}>
                                    <Text style={styles.termsUnderlineText}>{'Services Agremeent, '}</Text>
                                </TouchableOpacity>
                                <Text style={styles.termsText}>{'the '}</Text>
                                <TouchableOpacity onPress={() => {Actions.terms({terms: TERMS_OF_USE, title: 'Terms of Use'})}}>
                                    <Text style={styles.termsUnderlineText}>{'Terms of Use, '}</Text>
                                </TouchableOpacity>
                                <Text style={styles.termsText}>{'and the '}</Text>
                                <TouchableOpacity onPress={() => {Actions.terms({terms: PRIVACY_POLICY, title: 'Privacy Policy'})}}>
                                    <Text style={styles.termsUnderlineText}>Privacy Policy </Text>
                                </TouchableOpacity>
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
    openDrawer: () => dispatch(openDrawer()),
    dispatch: (action) => dispatch(action)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);