import React, {Component} from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, ScrollView, BackHandler, ActivityIndicator } from 'react-native';
import {Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';
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
    List,
    ListItem,
    Input,
    Button,
    Icon,
    Text,
    Card
} from 'native-base';
import PLColors from 'PLColors';
import { findByUsernameEmailOrPhone, updateUserProfile, loadUserProfileById, verifyNumber, verifyCode, sendCode } from 'PLActions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import ImageSelector from '../../common/PLImageSelector'
import PLButton from 'PLButton';
import DatePicker from 'react-native-datepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import { MenuContext } from "react-native-popup-menu";

import PhoneVerification from '../../components/auth/PhoneVerification';
const googlePlacesKey = 'AIzaSyBQOJDsIGt-XxuSNI7Joe1KRpAOJwDAEQE';
const brandColor = '#6A6AD5';

class VerifyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zip: props.profile.zip,
            address1: props.profile.address1,
            address2: props.profile.address2,
            city: props.profile.city,
            state: props.profile.state,
            email: props.profile.email,
            phone: props.profile.phone,
            country: props.profile.country,
            user: {},
            countryInfo: {
                cca2: 'US',
                callingCode: '1'
            }
        };

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentDidMount(){
        loadUserProfileById(this.props.token,  this.props.profile.id)
        .then(data => {
            this.setState({
                user: data
            });
        })
        .catch(err => {

        });
    }

    handleBackPress = () => {
        if (this.state.showPhoneScreen){
            this.setState({showPhoneScreen: false});
            return true;
        } else {
            Actions.pop()
            return true;
        }
        return false;
    }

    updateUser = () => {
        let {zip, address1, address2, city, state, email, country, phone, birth, user: {avatar_file_name}, countryInfo: {callingCode}} = this.state;
        this.setState({loading: true})
        const json = {
            zip,
            address1,
            address2,
            city,
            state,
            email,
            country,
            phone: phone.indexOf('+') > -1 ? phone : ('+' + callingCode + phone),
            birth,
            avatar_file_name
        }
        console.log('updating > ', json)
        updateUserProfile(this.props.token, json)
        .then(response => {
            this.setState({loading: false})
            console.log('updating > res', response)
            Actions.pop();
            Actions.profile();
        })
        .catch(err => {
            this.setState({loading: false})
            console.log('err', err)});
    }

    updateUserAvatar = (image) => {
        this.setState(state => ({
            user: {
                ...state.user,
                avatar_file_name: image.path
            }
        }))
        // updateUserProfile(this.props.token, {avatar_file_name: image.data})
    }

    onAutoComplete = (data, details) => {
        // console.log('!!!!!!!!!!!!!!!', data, details)
        // this.setState({
        //     address1: "",
        //     state: "",
        //     city: "",
        //     country: "",
        //     zip: ""
        // });
        var address_components = details.address_components;
        console.log(address_components);
        for(var i = 0; i < address_components.length; i++){
            if(address_components[i].types.indexOf("street_number") !== -1){
                console.log('found : address1 ', address_components[i].long_name)
                this.setState({
                    address1: address_components[i].long_name
                })
            }else if(address_components[i].types.indexOf("locality") !== -1 || address_components[i].types.indexOf("neighborhood") !== -1){
                console.log('found : city ', address_components[i].long_name)
                this.setState({
                    city: address_components[i].long_name
                });
            }else if(address_components[i].types.indexOf("administrative_area_level_1") !== -1){
                console.log('found : state ', address_components[i].long_name)
                this.setState({
                    state: address_components[i].long_name
                });
            }else if(address_components[i].types.indexOf("country") !== -1){
                console.log('found : country ', address_components[i].short_name)
                this.setState({
                    country: address_components[i].short_name
                });
            }else if(address_components[i].types.indexOf("postal_code") !== -1){
                console.log('found : zip ', address_components[i].long_name)
                this.setState({
                    zip : address_components[i].long_name
                });
            }else if(address_components[i].types.indexOf("route") !== -1){
                console.log('found : address1 ', address_components[i].long_name)
                this.setState((prevState) => ({
                    address1: prevState.address1 + " " + address_components[i].long_name
                }))
                // this.state.address1 +=" " + address_components[i].long_name;
            }
        }
        this.state.autoZip.setAddressText(this.state.zip);

        // this.state.autoAddress.setAddressText(this.state.address1);
    }

    onChange(value, key){
        console.log('onChange', key, value)
        let state = this.state;
        state[key] = value;
        console.log(state[key]);
        this.setState(state)
    }

    validatePhone(){
        this.setState({showPhoneScreen: true});
    }


    verifyCode(){
        this.setState({loading: true});
        let {phone, code, countryCode} = this.state;
        countryCode = countryCode || '+1';    
        this.setState({code: ''})
        verifyCode({phone: countryCode + phone, code}).then(r => {
            // user successfully validated his phone, so its a real deal.
            this.setState({showPhoneScreen: false, loading: false, phone: countryCode + phone})
        }).catch(error => {
            Alert.alert('Invalid code',
            '',
            [{text: 'Ok', onPress: () => {
                this.setState({loading: false, phone: '', showPhoneScreen: false, enterCode: false})
            }}],
            {cancelable: false})
        })
    }

    async sendCode(){
        let {phone, countryCode} = this.state;
        countryCode = countryCode || '+1';        
        phone = countryCode + phone;
        this.setState({loading: true});
        try {
            // check if number is available and send
            let verified = await findByUsernameEmailOrPhone({phone});
            console.log('find', verified);         
            verifyNumber(phone).then(r => {
                this.setState({loading: false, enterCode: true})
                console.log('send code success', r);
            }).catch(e => {
                console.log('send code fail', e)
                this.setState({loading: false})
                setTimeout(() => {
                    alert(e.message);
                }, 200)
                console.log(e);
            })
        } catch (error) {
            Alert.alert('Invalid data',
            error,
            [{text: 'Ok', onPress: () => {
                this.setState({loading: false})
            }}],
            {cancelable: false})
        }
    }

    renderPhoneScreen(){
        return <PhoneVerification
        onBack={() => this.setState({showPhoneScreen: false, phone: ''})}
        type='login'
        onSendCode={() => this.sendCode()}   
        onVerifycode={() => this.verifyCode()}
        onChangeCode={(value) => {this.setState({code: value}, value.length === 4 ? () => this.verifyCode() : () => {});}}
        code={this.state.code}
        phone={this.state.phone}
        onChangePhone={(value) => this.setState({phone: value})}
        loading={this.state.loading}
        enterCode={this.state.enterCode}
        setCountryCode={(code) => this.setState({countryCode: '+' + code})}
        resetForm={() => this.setState({code: '', phone: '', countryCode: '', enterCode: false})}
      />
    }

    onChangeZip = zip => {
        this.setState({ zip: zip });
    }

    _changeCountry (countryInfo) {
        this.setState({ countryInfo });
        // this.props.setCountryCode(country.callingCode);
        this.refs.form.refs.textInput.focus();
    }

    _renderCountryPicker () {
        return (
            <CountryPicker
                ref={'countryPicker'}
                closeable
                style={styles.countryPicker}
                onChange={(c) => this._changeCountry(c)}
                cca2={this.state.countryInfo.cca2}
                styles={{}}
                translation='eng' />
        );
    }

    _renderCallingCode () {
        return (
            <View style={styles.callingCodeView}>
                <Text style={styles.callingCodeText}>+{this.state.countryInfo.callingCode}</Text>
            </View>
        );

    }

    _renderPhonePicker() {
        return <Form ref={'form'} style={styles.textInput}>
            <View style={{ flexDirection: 'row', flex: 1, alignContent: 'center', alignItems: 'center' }}>
                {this._renderCountryPicker()}
                {this._renderCallingCode()}
                <TextInput
                    ref={'textInput'}
                    name={'phoneNumber'}
                    type={'TextInput'}
                    underlineColorAndroid={'transparent'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={(value) => {this.onChange(value, 'phone')}}
                    placeholder={'Phone Number'}
                    value={this.state.phone}
                    keyboardType={'phone-pad'}
                    style={styles.phonetextInput}
                    returnKeyType='go'
                    placeholderTextColor={brandColor}
                    selectionColor={brandColor}
                    maxLength={20}
                    // onSubmitEditing={() => this._getSubmitAction()}
                />
            </View>
            {/* <TouchableOpacity style={styles.button} onPress={() => this._getSubmitAction()}>
                <Text style={styles.buttonText}>{'Submit number'}</Text>
            </TouchableOpacity> */}
        </Form>
    }


    render() {
        console.log('this.state', this.state);
        if (this.state.showPhoneScreen){
            return this.renderPhoneScreen();
        }
        let {zip, address1, address2, city, state, email, country, phone, facebook_id, birth} = this.state
        return (
            <View style={{flex: 1}}>
                <Header searchBar rounded style={styles.header}>
                    <Left style={{
                            flex: 1,
                            paddingLeft: 10,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center"
                        }} >
                        <Button style={{ width: "100%" }} transparent onPress={Actions.pop}>
                        <Icon active name="arrow-back" style={{ color: "white" }} />
                        </Button>
                    </Left>
                    <Body style={{ alignItems: "center", flex: 5 }}>
                        <Title style={{ color: 'white' }}>Verify your profile</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{alignItems: 'center', paddingHorizontal: 8}}>
                    <Card style={{alignItems: 'flex-start', marginVertical: 8, marginHorizontal: 12, padding: 6, padding: 20}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', justifyContent: 'center'}}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Thumbnail source={{uri: this.state.user.avatar_file_name}} />
                                <View style={{position: 'absolute',
                                            backgroundColor: '#999999DD',
                                            alignItems: 'center',
                                            alignSelf:'center',
                                            width: 30,
                                            height: 30,
                                            top: '60%',
                                            right: '40%',
                                            borderRadius: 30,
                                            zIndex: 3}}>
                                    <ImageSelector icon='md-create' onConfirm={this.updateUserAvatar} iconSize={20} iconColor={PLColors.main} onError={err => console.log(err)}/>
                                </View> 
                            </View>
                        </View>
                        <View style={{padding: 20}}>
                            <Label>Complete your data to verify your profile</Label>
                        </View>
                        <Label style={{textAlign: 'left', fontSize: 14}}>Zip code</Label>
                        <GooglePlacesAutocomplete
                            placeholder='Zipcode'
                            minLength={2}
                            autoFocus={false}
                            getDefaultValue={() => ''}
                            placeholder={this.state.zip}
                            textInputProps={{
                                onChangeText: (text) => {this.onChangeZip(text); this.setState({listViewDisplayed: true})},
                                onBlur: (a) => {this.setState({listViewDisplayed: false})},
                                autoFocus: false
                            }}
                            returnKeyType={'done'}
                            listViewDisplayed={this.state.listViewDisplayed}
                            fetchDetails={true}
                            renderDescription={(row) => row.description}
                            onPress={(data, details, any) => {this.onAutoComplete(data, details); }}                      
                            query={{
                                key: googlePlacesKey,
                                language: 'en',
                                components: this.state.country ? `country:${this.state.country}` : '',
                                types: '(regions)'
                            }}
                            ref={(zipobj) => {
                                this.state.autoZip = zipobj;
                            }}
                            styles={{
                                container: styles.autoContainer,
                                textInputContainer: styles.autoTextInputContainer,
                                textInput: styles.autoTextInput,
                                description: {position: 'relative', flex: 1, color: PLColors.main, height: 50, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#000'},
                                predefinedPlacesDescription: styles.autoPredefinedPlacesDescription,
                                listView: {
                                    height: 180,
                                    marginTop: 45,
                                    position: 'absolute',
                                    backgroundColor: '#ffffffEE',
                                    zIndex: 5,
                                    width: '100%'
                                }
                            }}
                            currentLocation={false}                        
                            nearbyPlacesAPI='GoogleReverseGeocoding'
                            filterReverseGeocodingByTypes={['postal_code']}
                            debounce={200} />
                        <Label style={{textAlign: 'left', fontSize: 14, marginTop: 8}}>Address</Label>
                        <TextInput
                            placeholder='Address line 1'
                            autoCorrect={false}
                            style={styles.textInput}
                            value={address1}
                            onChangeText={(v) => this.onChange(v, 'address1')}
                            underlineColorAndroid={'transparent'} />
                        <TextInput
                            placeholder='Address line 2'
                            style={styles.textInput}
                            autoCorrect={false}
                            value={address2}
                            onChangeText={(v) => this.onChange(v, 'address2')}
                            underlineColorAndroid={'transparent'} />
                        <Label style={{textAlign: 'left', fontSize: 14, marginTop: 8}}>City</Label>
                        <TextInput
                            placeholder='City'
                            style={styles.textInput}
                            autoCorrect={false}
                            value={city}
                            onChangeText={(v) => this.onChange(v, 'city')}
                            underlineColorAndroid={'transparent'} />
                        <Label style={{textAlign: 'left', fontSize: 14, marginTop: 8}}>State</Label>
                        <TextInput
                            placeholder='State'
                            style={styles.textInput}
                            autoCorrect={false}
                            value={state}
                            onChangeText={(v) => this.onChange(v, 'state')}
                            underlineColorAndroid={'transparent'} />
                        <Label style={{textAlign: 'left', fontSize: 14, marginTop: 8}}>Country</Label>                        
                        <TextInput
                            placeholder='Country'
                            style={styles.textInput}
                            autoCorrect={false}
                            value={country}
                            onChangeText={(v) => this.onChange(v, 'country')}
                            underlineColorAndroid={'transparent'} />
                        <Label style={{textAlign: 'left', fontSize: 14, marginTop: 8}}>Email</Label>                        
                        <TextInput
                            placeholder='Email'
                            style={styles.textInput}
                            autoCorrect={false}
                            value={email}
                            keyboardType={'email-address'}
                            onChangeText={(v) => this.onChange(v, 'email')}
                            underlineColorAndroid={'transparent'} />
                        <Label style={{textAlign: 'left', fontSize: 14, marginTop: 8}}>Date of birth</Label>
                        <View style={styles.fieldContainer}>
                            <DatePicker 
                                showIcon={false}
                                mode='date'
                                format='YYYY-MM-DD'
                                style={{flex: 1, minWidth: '100%', margin: 0}}
                                customStyles={{
                                    dateInput: {
                                        minWidth: '100%', flex: 1, paddingLeft: 14, borderWidth: 0, color: PLColors.lightText, alignItems: 'flex-start'
                                    },
                                    placeholderText: {
                                        color: PLColors.lightText, fontSize: 17
                                    },
                                    dateText: {
                                        fontSize: 14, fontWeight: '400', color: PLColors.lightText, textAlign: 'left'
                                    }}}
                                onDateChange={date => this.setState({date, birth: new Date(date).toISOString()})}
                                date={this.state.date}
                                confirmBtnText='Confirm'
                                cancelBtnText='Cancel' />
                        </View>
                        {
                            !this.props.profile.phone && this._renderPhonePicker()
                        }
                        <View style={{alignSelf: 'center'}}>
                            <View style={{padding: 20}}>
                                <Text style={{fontSize: 10, color: 'grey'}}>We may occasionally contact you via e-mail, but we will never sell your information.</Text>
                            </View>
                            {
                                this.state.loading
                                ? <ActivityIndicator color={'#020860'} animating={this.state.sending} />
                                : 
                                <PLButton
                                caption={'Update profile'}
                                onPress={this.updateUser} />
                            }
                        </View>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleText: {
        marginTop: 50,
        color: PLColors.actionText,
        fontWeight: '100',
        fontSize: 20,
        textAlign: 'center'
    },
    descriptionText: {
        fontSize: 12,
        textAlign: 'center',
        color: PLColors.lightText,
        marginTop: 5
    },
    formContainer: {
        marginTop: 20,
        paddingLeft: 50,
        paddingRight: 50
    },
    requireText: {
        fontSize: 14,
        color: PLColors.lightText
    },
    starText: {
        color: '#ff0000'
    },
    textInput: {
        marginTop: 8,
        borderRadius: 5,
        borderWidth: 0.5,
        flex: 1,
        minWidth: '100%',
        borderColor: PLColors.textInputBorder,
        paddingHorizontal: 10,
        backgroundColor: PLColors.textInputBackground,
        height: 44,
        fontSize: 14,
        color: PLColors.lightText,
        // flex: 1,
        // margin: 0,
        // backgroundColor: 'transparent'
    },
    fieldContainer: {
        marginTop: 8,
        height: 44,
        borderRadius: 5,
        borderWidth: 0.5,
        // paddingHorizontal: 10,
        // width: '80%',
        // minWidth: 300,
        borderColor: PLColors.textInputBorder,
        justifyContent: "center",
        // paddingHorizontal: 12,
        backgroundColor: PLColors.textInputBackground,
        flexDirection: 'row'
    },
    iconContainer: {
        width: 20,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 15,
        height: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 40
    },
    button: {
        backgroundColor: '#6A6AD5',
        width: '50%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 17        
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    switchText: {
        color: PLColors.inactiveText,
        fontSize: 12,
        backgroundColor: 'transparent',
        marginHorizontal: 5
    },
    markContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 15
    },
    markWrapper: {
        flexDirection: 'row'
    },
    markItem: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#E6E7E8',
        marginRight: 5
    },
    markActiveItem: {
        backgroundColor: '#8fd5e4'
    },
    autoContainer: {
        marginTop: 5,
        width: '100%',
    },
    autoTextInputContainer: {
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: PLColors.textInputBorder,
        backgroundColor: PLColors.textInputBackground,
        width: '100%'
    },
    autoTextInput: {
        backgroundColor: 'transparent',
        fontSize: 14,
        color: PLColors.lightText
    },
    autoDescription: {
        fontWeight: 'bold',
        backgroundColor: 'transparent'
    },
    autoPredefinedPlacesDescription: {
        color: '#1faadb'
    },
    countryPicker: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1
    },
    header: {
        backgroundColor: PLColors.main
    },
    form: {
        margin: 20
    },
    phonetextInput: {
        color: PLColors.lightText,
        flex: 1
    },
    button: {
        marginTop: 20,
        height: 50,
        backgroundColor: brandColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Helvetica',
        fontSize: 16,
        fontWeight: 'bold'
    },
    wrongNumberText: {
        margin: 10,
        fontSize: 14,
        textAlign: 'center'
    },
    disclaimerText: {
        marginTop: 30,
        fontSize: 12,
        color: 'grey'
    },
    callingCodeView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    callingCodeText: {
        fontSize: 20,
        color: brandColor,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        paddingRight: 10
    }
};

const mapState = (state) => ({
    profile: state.user.profile,
    token: state.user.token
});

export default connect(mapState)(VerifyProfile);