import React, {Component} from 'react';
import { View, TextInput, TouchableOpacity, Alert, ScrollView, BackHandler, ActivityIndicator } from 'react-native';
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

    updateUser() {
        let {zip, address1, address2, city, state, email, country, phone, birth, user: {avatar_file_name}, countryInfo: {callingCode}} = this.state;
        this.setState({loading: true})
        console.log('updating => ', {zip, address1, address2, city, state, email, country, phone: '+' + callingCode + phone, birth, avatar_file_name});
        updateUserProfile(this.props.token, {zip, address1, address2, city, state, email, country, phone: '+' + callingCode + phone, birth, avatar_file_name})
        .then(response => {
            this.setState({loading: false})
            console.log('response from updating user profile', response)
            Actions.pop();
            Actions.reset('home');
        })
        .catch(err => {
            this.setState({loading: false})
            console.log('err', err)});
    }

    updateUserAvatar(image) {
        this.setState(state => {
            state.user.avatar_file_name = image.path
            return state
        })
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
        console.log({zip, address1, address2, city, state, email, country, phone, birth})
            return (
            <Content contentContainerStyle={{alignItems: 'center', marginTop: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', justifyContent: 'center'}}>
                    <View style={{flex: 2}}>
                        <Button transparent onPress={() => Actions.pop()} style={{ width: 60, height: 50 }}  >
                            <Icon active name='arrow-back' style={{ color: '#6A6AD5' }} />
                        </Button>
                    </View>
                    <View style={{flex: 10, alignItems: 'center', justifyContent: 'center'}}>
                        <Thumbnail source={{uri: this.state.user.avatar_file_name}} />
                        <View style={{position: 'absolute', alignItems: 'center', alignSelf:'center', width: 25, height: 25, borderRadius: 30, flex: 1, zIndex: 3, marginTop: 16, backgroundColor: '#eeeeee70'}}>
                            <ImageSelector onConfirm={(i) => this.updateUserAvatar(i)} iconSize={20} iconColor='#000' onError={err => console.log(err)}/>
                        </View> 
                    </View>
                    <View style={{flex: 2}} />
                </View>
                <Card style={{alignItems: 'center', marginBottom: 40}}>
                    <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{alignItems: 'center', paddingBottom: 20}}>
                    <View style={{padding: 20}}>
                        <Label>Verify or Complete your data</Label>
                    </View>

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
                        renderDescription={(row) =>{console.log('row', row); return row.description}}
                        onPress={(data, details, any) => {console.log(any); this.onAutoComplete(data, details); }}                      
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
                            description: styles.autoDescription,
                            predefinedPlacesDescription: styles.autoPredefinedPlacesDescription,
                            listView: {
                                height: 200,
                                width: '100%'
                            }
                        }}
                        currentLocation={false}                        
                        nearbyPlacesAPI='GoogleReverseGeocoding'
                        filterReverseGeocodingByTypes={['postal_code']}
                        debounce={200}
                    />
                            <TextInput
                                placeholder='Address 1'
                                autoCorrect={false}
                                style={styles.textInput}
                                value={address1}
                                onChangeText={(v) => this.onChange(v, 'address1')}
                                underlineColorAndroid={'transparent'}
                            />
                            <TextInput
                                placeholder='Address 2'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={address2}
                                onChangeText={(v) => this.onChange(v, 'address2')}
                                underlineColorAndroid={'transparent'}
                            />
                            <TextInput
                                placeholder='City'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={city}
                                onChangeText={(v) => this.onChange(v, 'city')}
                                underlineColorAndroid={'transparent'}
                        />
                            <TextInput
                                placeholder='State'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={state}
                                onChangeText={(v) => this.onChange(v, 'state')}
                                underlineColorAndroid={'transparent'}
                        />
                            <TextInput
                                placeholder='Country'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={country}
                                onChangeText={(v) => this.onChange(v, 'country')}
                                underlineColorAndroid={'transparent'}
                        />
                            <TextInput
                                placeholder='Email'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={email}
                                keyboardType={'email-address'}
                                onChangeText={(v) => this.onChange(v, 'email')}
                                underlineColorAndroid={'transparent'}
                            />
                            <View style={styles.fieldContainer}>
                            <DatePicker 
                                showIcon={false}
                                mode='date'
                                format='YYYY-MM-DD'
                                style={{flex: 1}}
                                customStyles={{
                                    dateInput: {
                                        width: '100%', flex: 1,textAlign: 'center', padding: 0, borderWidth: 0, color: PLColors.lightText
                                    },
                                    placeholderText: {
                                        color: PLColors.lightText, fontSize: 17, marginLeft: 20
                                    },
                                    dateText: {
                                        fontSize: 14, fontWeight: '400', color: PLColors.lightText, marginLeft: 20
                                    }}}
                                onDateChange={date => this.setState({date, birth: new Date(date).toISOString()})}
                                date={this.state.date}
                                confirmBtnText='Confirm'
                                cancelBtnText='Cancel'
                            />
                            </View>
                        {
                            !this.props.profile.phone && this._renderPhonePicker()
                            // <TextInput
                            //     placeholder='Phone Number'
                            //     style={styles.textInput}
                            //     autoCorrect={false}
                            //     value={this.state.phone}
                            //     onChangeText={(v) => this.onChange(v, 'phone')}
                            //     underlineColorAndroid={'transparent'}
                            // />
                        }
                        <View style={{padding: 20}}>
                            <Text style={{fontSize: 10, color: 'grey'}}>We may occasionally contact you via e-mail, but we will never sell your information.</Text>
                        </View>
                    {
                        this.state.loading
                        ? <ActivityIndicator color={'#020860'} animating={this.state.sending} />
                        : 
                        <PLButton
                        caption={'Update profile'}
                        onPress={() => this.updateUser()}
                        />
                    }
                    </ScrollView>
                    
                </Card>
            </Content>
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
        marginTop: 5,
        borderRadius: 5,
        borderWidth: 0.5,
        width: '80%',
        minWidth: 300,
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
        marginTop: 5,
        height: 44,
        borderRadius: 5,
        borderWidth: 0.5,
        width: '80%',
        minWidth: 300,
        borderColor: PLColors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 10,
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
        width: '83%',
        minWidth: 300,
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
        textAlign: 'center',
        marginTop: 60,
        fontSize: 22,
        margin: 20,
        color: '#4A4A4A',
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