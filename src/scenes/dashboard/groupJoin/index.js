import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import { connect } from 'react-redux';
const PLColors = require('PLColors');
import {TextInput, Alert} from 'react-native';
import styles  from './styles';
import update from 'immutability-helper';
import IconVI from 'react-native-vector-icons/dist/FontAwesome';

import { getGroupRequiredFields, joinGroup, getGroupPermissions } from 'PLActions';
import {
    Content,
    Container,
    Item,
    Input,
    Title,
    Button,
    Header,
    Body,
    Left,
    Right,
    Label,
    Icon,
    List,
    ListItem,
    Thumbnail,
    Text
} from 'native-base';
import { Actions } from 'react-native-router-flux';

class GroupJoin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: null,
            passcode: null,
            input: {},
            permissions: [],
            passcodeError: null,
            showConfirmationModal: false
        };
        this.renderPasscodeInput = this.renderPasscodeInput.bind(this);
    }
    permissionsLabels = {
        "permissions_name":"Name",
        "permissions_address":"Street Address",
        "permissions_city":"City",
        "permissions_state":"State",
        "permissions_country":"Country",
        "permissions_zip_code":"Zip Code",
        "permissions_email":"Email",
        "permissions_phone":"Phone Number",
        "permissions_responses":"Responses"
      };
    componentDidMount() {
        console.log('mounted', this.props.data);
        if(this.props.data.fill_fields_required) {
            this.loadFields(); 
        }
        getGroupPermissions(this.props.token, this.props.data.id).then(data => {
            if(data.required_permissions){
                data.required_permissions.map((value, index) => {
                    this.state.permissions.push(this.permissionsLabels[value]);
                });
                this.setState({
                    refresh: true
                });
            }
        }).catch(err => {
            console.log('error on loading group permissions', err);
        });
    }

    loadFields() {
        const { token } = this.props;
        const { id } = this.props.data;
        getGroupRequiredFields(token, id)
            .then(result => {
                console.log(getGroupRequiredFields);
                this.setState({
                    fields: result
                });
            })    
            .catch(err => {
                this.setState({
                    error: err
                });
            });
    }


    renderPasscodeInput() {
        if(this.props.data.membership_control === 'passcode') {
            return (
                <ListItem style={styles.listItem}>
                    <View>
                        <View style={{flex: 1, minWidth: '100%'}}>
                            <Text style={{alignSelf: 'flex-start', color: PLColors.inactiveText, fontSize: 13}}>Group Password *</Text>
                            <TextInput
                                placeholder='Group password'
                                style={styles.inputText}
                                autoCorrect={false}
                                underlineColorAndroid={'transparent'}
                                value={this.state.passcode}
                                onChange={(event) => this.setState({passcode: event.nativeEvent.text, passcodeError: null})}
                        />
                            {this.state.passcodeError ?
                                <Text style={{fontSize: 12, color: 'red', alignSelf:'flex-start'}}>{this.state.passcodeError}</Text>:
                            null
                        }
                        </View>
                    </View>
                </ListItem>
            );
        }
    }

    onTextChange(field, value) {
        console.log(field, value);
        let obj = {};
        obj[field] = value;
        this.setState(update(this.state, {input: {$merge: obj}})); 
    }

    renderFields() {
        if(this.state.fields) {
            const { fields } = this.state;
            return (
                <ListItem style={styles.listItem}>
                    <View>
                        {
                            fields.map((field, index) => {
                                return (
                                    <View style={{flex: 1, minWidth: '100%'}}>
                                        <Text style={{alignSelf: 'flex-start', color: PLColors.inactiveText, fontSize: 13}}>{field.field_name}</Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            key={index}
                                            placeholder='required field'
                                            style={styles.inputText}
                                            autoCorrect={false}
                                            underlineColorAndroid={'transparent'}
                                            onChange={(event) => this.onTextChange(field.field_name, {id: field.id, answer: event.nativeEvent.text})}
                                        />
                                    </View>
                                );
                            })
                        }
                    </View>
                </ListItem>
            );
            
        }
        return;
    }

    validateFields () {
        if(this.buildArrayOfAnsweredFields(this.state.input).length < this.state.fields.length) {
            return false;
        }
        return true;
    }

    buildArrayOfAnsweredFields(obj) {
        let arr = [];
        for(key in obj) {
            if(obj.hasOwnProperty(key)) {
                if(obj[key].answer !== null && obj[key].answer.length > 0) {
                    arr.push(obj[key]); 
                }
            }
        }
        return arr;
    }

    doJoin() {
        const { id } = this.props.data;
        const { token, data } = this.props;
        var answeredFields;
        if(data.membership_control === 'passcode') {
            if(!this.state.passcode) {
                this.setState({passcodeError: true});
                return;
            }
        }
        if(data.fill_fields_required) {
            if(this.validateFields()) {
                // Alert.alert('You should fill in the required Fields');
                // return;
            }
        }
        if(true || data.membership_control === 'passcode' && !data.fill_fields_required) {
            joinGroup(token, id, this.state.passcode)
                .then(response => {
                    if(response.join_status !== 'active') {
                        this.setState({
                            passcodeError: 'Wrong Password'
                        });
                        return;
                    }
                    Actions.pop({refresh: {
                        shouldRefresh: true
                    }});
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if(data.membership_control !== 'passcode' && data.fill_fields_required) {
            joinGroup(token, id, null, this.buildArrayOfAnsweredFields(this.state.input))    
                .then(response => {
                    if(response.join_status !== 'active') {
                        this.setState({
                            validationError: 'Something Went Wrong, please try again'
                        });
                        return;
                    }
                    Actions.pop({refresh: {
                        shouldRefresh: true
                    }});
                }) 
                .catch(err => {
                    console.log(err);
                });
        }
        
        if(data.membership_control === 'passcode' && data.fill_fields_required) {
            joinGroup(token, id, this.state.passcode, this.buildArrayOfAnsweredFields(this.state.input))    
                .then(response => {
                    console.log('response', response);
                    if(response.join_status !== 'active') {
                        this.setState({
                            passcodeError: 'Wrong Password'
                        });
                        return;
                    }
                    Actions.pop({refresh: {
                        shouldRefresh: true
                    }});
                }) 
                .catch(err => {
                    console.log(err);
                });
        }
        if(data.membership_control !== 'passcode' && !data.fill_fields_required) {
            joinGroup(token, id)    
                .then(response => {
                    if(response.code >= 400) {
                        this.setState({
                            error: 'Something went wrong, please try again'
                        });
                        return;
                    }
                    Actions.pop({refresh: {
                        shouldRefresh: true
                    }});
                }) 
                .catch(err => {
                    console.log(err);
                });
        }
        this.setState({showConfirmationModal: false})
    }

    render() {
        console.log(this.state.permissions);
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                            <Icon active name='arrow-back' style={{color: 'white'}} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{color: 'white'}}>Group Join</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {
                            this.setState({showConfirmationModal: true});
                        }}>
                            <Label style={{color: 'white'}}>Join</Label>
                        </Button>
                    </Right>
                </Header>
                <Content padder>
                    <List>
                        <ListItem style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 17}}>
                            {this.props.data.avatar_file_path?
                                <Thumbnail style={styles.avatar} square source={{uri: this.props.data.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}} />:
                                <View style={styles.avatar} />
                            }
                            <Body>
                                <Text style={{color: PLColors.main}}>{this.props.data.official_name}</Text>                             
                            </Body>
                        </ListItem>
                        
                        {this.renderPasscodeInput()}
                        {this.renderFields()}
                    </List>
                </Content> 
                <Modal visible={this.state.showConfirmationModal} presentationStyle='pageSheet' transparent>
                    <View style={{flex: 1, backgroundColor: rgb(0,0,0,0.7), alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{height: '60%', width: '90%', backgroundColor: 'white', alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 20}} >
                            <Text style={{alignSelf: 'center', color: 'black', fontSize: 20}}>Permissions</Text>
                            <Text style={{alignSelf: 'center', fontSize: 12, color: 'grey'}}>The group owner is requesting your:</Text>
                            {
                                PERMS.sort(item => !this.state.permissions.includes(item)).map(item => {
                                    return (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}} >
                                            <IconVI style={{ color: colorPicker(this.state.permissions, item)}} name={iconPicker(this.state.permissions, item)} />
                                            <Text style={{color: colorPicker(this.state.permissions, item), marginLeft: 20, fontSize: 18}}>{item}</Text>
                                        </View>
                                    )
                                })
                            }
                            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-around'}}>
                                <Button transparent onPress={() => this.setState({
                                    showConfirmationModal: false
                                })}>
                                    <Label style={{color: PLColors.main}}>Cancel</Label>
                                </Button>
                                <Button transparent onPress={() => this.doJoin()}>
                                    <Label style={{color: PLColors.main}}>Confirm</Label>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Container>
        );
    }
}

const PERMS = ['Name', "Street Address", "City", "Country", "State", "Zip Code", "Email", "Phone Number", "Responses"]; 

const colorPicker = (array, item) => {
    if(array.includes(item)) {
        return PLColors.main;
    } else {
        return 'grey';
    }
};
const iconPicker = (array, item) => {
    if(array.includes(item)) {
        return 'circle';
    } else {
        return 'circle-o';
    }
};
const mapState = state => ({
    token: state.user.token
});

const mapActions = (dispatch) => ({});

export default connect(mapState, mapActions) (GroupJoin);