import React, { Component,  } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import {
    Container,
    Content,
    Header,
    Body,
    Title,
    Left,
    Right,
    Label,
    Thumbnail,
    Spinner,
    Item,
    List,
    ListItem,
    Input,
    Card,
    Button,
    Icon,
    Form,
    Text,
    Picker
} from 'native-base';
import HyperLink from 'react-native-hyperlink';
import { connect } from 'react-redux';
import moment from 'moment';
import PLColors from '../../../common/PLColors';
import PLImageSelector from '../../../common/PLImageSelector';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form';
import { createRepresentative } from '../../../actions';
import { ActionTypes } from '../../../reducers/representativesForm';
import styles from './styles';
class ElectedLeadersForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: null,
            official_title: null
        };
        this.updateGroupAvatar = this.updateGroupAvatar.bind(this);
        this.grabDataFromForm = this.grabDataFromForm.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.loading && nextProps.representative) {
            Alert.alert(
                `Success`,
                `${this.state.official_title ? this.state.official_title : 'Your representative'} was submitted for review. Approval pending.`,
                [
                    {
                        text: 'Dismiss',
                        onPress: () => {
                            GiftedFormManager.reset('representatives');
                            Actions.pop();
                        }
                    }
                ]
                );
        }
    }

    updateGroupAvatar(image) {
        console.log(image);
        this.setState({avatar: image});
    }

    //Felipe - Why is this limited to the US? This will work in any country. 
    grabDataFromForm (data) {
        if(data.country === "US" || data.country === 'us') {
            const obj = {
                city: data.city,
                country: data.country.toUpperCase(),
                email: data.emailAddress,
                private_email: data.privateEmailAddress,
                phone: data.phone,
                private_phone: data.privatePhone,
                official_title: data.official_title,
                state: data.state.toUpperCase()
            };
            if(this.state.avatar) {
                obj.avatar = this.state.avatar.data;
            }
            this.setState({
                official_title: data.official_title
            });
            console.log(obj);
            this.props.createRepresentative(obj);
        } else {
            this.setState({error: 'Only supports United States for the moment'});
        }
        
    }

    

    render() {
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent style={{width: '100%'}} onPress={() => Actions.pop()}>
                            <Icon active name='arrow-back' style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body style={{flex: 5}}>
                        <Title style={{ color: 'white' }}>Registration Form</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={{flex: 1}} padder>
                    <Card>
                        <ListItem style={styles.listItem}>
                            <Thumbnail style={styles.avatar} square source={this.state.avatar ? {uri: this.state.avatar.path} : require('../../../assets/blank_person.png')} />
                            <View style={styles.selectorContainer}>
                                <PLImageSelector onConfirm={this.updateGroupAvatar} iconSize={20} iconColor='#000' onError={err => console.log(err)} />
                            </View>
                            <Body>
                                <Text style={{color: PLColors.main}}>Avatar</Text>
                            </Body>
                        </ListItem>
                        <GiftedForm
                            formName='representatives'
                            validators={{
                                official_title: {
                                    name: 'official_title',
                                    validate: [{
                                        validator: 'isLength',
                                        arguments: [1, 23],
                                        message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                                    }]
                                },
                                country: {
                                    title: 'Country',
                                    validate: [{
                                        validator: 'isLength',
                                        arguments: [2],
                                        message: '{TITLE} is required'
                                    }]
                                },
                                emailAddress: {
                                    name: 'emailAddress',
                                    validate: [{
                                        validator: 'isLength',
                                        arguments: [6, 255],
                                    },{
                                        validator: 'isEmail',
                                    }]
                                },
                                privateEmailAddress: {
                                    name: 'privateEmailAddress',
                                    validate: [{
                                        validator: 'isLength',
                                        arguments: [6, 255],
                                    },{
                                        validator: 'isEmail',
                                    }]
                                },
                            }}
                            openModal={route => {
                                Actions.formModal({
                                    title: route.getTitle(),
                                    renderScene: route.renderScene,
                          
                                /*
                                  Option 1: If you like the buttons react-native-gifted-form
                                  gives you, then use this step:
                                */
                                    renderRightButton: route.renderRightButton.bind(route, Actions),
                                
                                /*
                                  Option 2: If you prefer your own right button (or text), then
                                  use this step:
                                */
                                // onRight: route.onClose.bind(null, null, Actions)
                                });
                            }}
                        >
                            <GiftedForm.TextInputWidget
                                name='official_title'
                                title='Official Title'
                            
                                image={require('../../../assets/user-icon.png')}
                                placeholder='Senator Hopkins'
                                clearButtonMode='while-editing'
                        />
                            <GiftedForm.TextInputWidget
                                name='city'
                                title='City'
                            
                                image={require('../../../assets/passport.png')}
                                placeholder='Atlanta'
                                clearButtonMode='while-editing'
                        />
                            <GiftedForm.TextInputWidget
                                name='state'
                                title='State'
                            
                                image={require('../../../assets/passport.png')}
                                placeholder='GA'
                                clearButtonMode='while-editing'
                        />
                            <GiftedForm.ModalWidget
                                title='Country'
                                displayValue='country'
                                image={require('../../../assets/passport.png')}
                                scrollEnabled={false}
                            >
                                <GiftedForm.SelectCountryWidget
                                    code='alpha2'
                                    name='country'
                                    title='Country'
                                    autoFocus
                            />
                            </GiftedForm.ModalWidget>
                            <GiftedForm.TextInputWidget
                                name='phone'
                                title='Phone'
                            
                                image={require('../../../assets/user-icon.png')}
                                placeholder='+1 22 222 2322'
                                clearButtonMode='while-editing'
                        />
                            <GiftedForm.TextInputWidget
                                name='privatePhone'
                                title='Private Phone'
                            
                                image={require('../../../assets/user-icon.png')}
                                placeholder='+1 22 222 2322'
                                clearButtonMode='while-editing'
                        />
                            <GiftedForm.TextInputWidget
                                name='emailAddress' // mandatory
                                title='Email'
                                placeholder='example@nomads.ly'
                                keyboardType='email-address'
                                clearButtonMode='while-editing'
                                image={require('../../../assets/email.png')}
                        />
                            <GiftedForm.TextInputWidget
                                name='privateEmailAddress' // mandatory
                                title='Private Email'
                                placeholder='example@nomads.ly'
                                keyboardType='email-address'
                                clearButtonMode='while-editing'
                                image={require('../../../assets/email.png')}
                        />
                            <GiftedForm.SubmitWidget
                                title='Submit'
                                widgetStyles={{
                                    submitButton: {
                                        backgroundColor: PLColors.main,
                                    }
                                }}
                                onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                    if (isValid === true) {
                                // prepare object
                                        this.grabDataFromForm(values);
                                        return;
                                /* Implement the request to your server using values variable
                                ** then you can do:
                                ** postSubmit(); // disable the loader
                                ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                                ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                                ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                                */
                                    }
                                }}
                        />
                        </GiftedForm>
                    </Card>
                </View>
            </Container>
        );
    }
}
const customStyles = {
    labelStyle: {
        fontSize: 12, 
        color: 'grey', 
        marginLeft: 5,
        marginVertical: 5
    }
};

const mapState = (state) => ({
    loading: state.representativesForm.loading,
    representative: state.representativesForm.representative
});
const mapActions = (dispatch) => ({
    createRepresentative: (data) => dispatch(createRepresentative(data)),
    clearData: (data) => dispatch({type: ActionTypes.CREATE_REPRESENTATIVE_CLEAR})
});

export default connect(mapState, mapActions)(ElectedLeadersForm);