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
import PhoneVerification from '../../components/auth/PhoneVerification';
const googlePlacesKey = 'AIzaSyBQOJDsIGt-XxuSNI7Joe1KRpAOJwDAEQE';


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
            country: props.profile.country,
            user: {}
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
        let {zip, address1, address2, city, state, email, country, phone} = this.state;
        this.setState({loading: true})
        updateUserProfile(this.props.token, {zip, address1, address2, city, state, email, country, phone})
        .then(response => {
            this.setState({loading: false})
            console.log('response', response)
            Actions.pop();
            Actions.profile();
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
        updateUserProfile(this.props.token, {avatar_file_name: image.data})
    }

    onAutoComplete = (data, details) => {
        console.log('!!!!!!!!!!!!!!!', data, details)
        this.setState({
            address1: "",
            state: "",
            city: "",
            country: "",
            zip: ""
        });
        var address_components = details.address_components;
        console.log(address_components);
        for(var i = 0; i < address_components.length; i++){
            if(address_components[i].types.indexOf("street_number") != -1){
                this.state.address1 = address_components[i].long_name;
            }else if(address_components[i].types.indexOf("locality") != -1 || address_components[i].types.indexOf("neighborhood") != -1){
                this.setState({
                    city: address_components[i].long_name
                });
            }else if(address_components[i].types.indexOf("administrative_area_level_1") != -1){
                this.setState({
                    state: address_components[i].long_name
                });
            }else if(address_components[i].types.indexOf("country") != -1){                
                this.setState({
                    country: address_components[i].short_name
                });
            }else if(address_components[i].types.indexOf("postal_code") != -1){
                this.setState({
                    zip : address_components[i].long_name
                });
            }else if(address_components[i].types.indexOf("route") != -1){
                this.state.address1 +=" " + address_components[i].long_name;
            }
        }
        this.state.autoAddress.setAddressText(this.state.address1);
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
        // this.setState({loading: true});
        // let {countryCode, phone} = this.state;
        // countryCode = countryCode || '+1';
        
        // // update user's phone
        // // await updateUserProfile(this.props.token, {phone: phone});
        // // send code via sms
        // await sendCode(countryCode + phone);
        // this.setState({enterCode: true, loading: false})
    }

    renderPhoneScreen(){
        return <PhoneVerification
        onBack={() => this.setState({showPhoneScreen: false})}
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


    render() {
        console.log('this.state', this.state);
        if (this.state.showPhoneScreen){
            return this.renderPhoneScreen();
        }

        let {zip, address1, address2, city, state, email, country, phone} = this.state
        console.log({zip, address1, address2, city, state, email, country, phone})
            return (
            <Content contentContainerStyle={{alignItems: 'center', marginTop: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', justifyContent: 'center'}}>
                    <View style={{flex: 8}}>
                        <Button transparent onPress={() => Actions.pop()} style={{ width: 200, height: 50 }}  >
                            <Icon active name='arrow-back' style={{ color: '#6A6AD5' }} />
                        </Button>
                    </View>
                    <View style={{flex: 10}}>
                        <Thumbnail source={{uri: this.state.user.avatar_file_name}} style={{marginTop: 8, borderRadius: 25}} />
                        {/* <View style={{position: 'absolute', alignSelf:'center', borderRadius: 25, flex: 1, zIndex: 3, marginTop: 16}}>
                            <ImageSelector onConfirm={(i) => this.updateUserAvatar(i)} iconSize={20} iconColor='#000' onError={err => console.log(err)}/>
                        </View>  */}
                    </View>
                </View>
                <Card style={{alignItems: 'center'}}>
                    {/* <List style={{alignItems: 'center', justifyContent: 'center'}}> */}
                    <ScrollView contentContainerStyle={{alignItems: 'center', paddingBottom: 20}}>

                        <View style={{padding: 20}}>
                            <Label>Verify or Complete your data</Label>
                        </View>

                        {/* <GooglePlacesAutocomplete
                        placeholder='Zipcode'
                        minLength={2}
                        autoFocus={false}
                        getDefaultValue={() => this.state.zip}
                        textInputProps={{
                            onChangeText: (text) => {this.onChangeZip(text); this.setState({listViewDisplayed: true})},
                            onBlur: () => {this.setState({listViewDisplayed: false})}
                        }}
                        returnKeyType={'Done'}
                        listViewDisplayed={this.state.listViewDisplayed}
                        fetchDetails={true}
                        renderDescription={(row) => row.description}  
                        onPress={this.onAutoComplete}                      
                        query={{
                            key: googlePlacesKey,
                            language: 'en',
                            components: this.state.country ? `country:${this.state.country}` : ''
                        }}
                        ref={(zipobj) => {
                            this.state.autoZip = zipobj;
                        }}
                        styles={{
                            container: styles.autoContainer,
                            textInputContainer: styles.autoTextInputContainer,
                            textInput: styles.autoTextInput,
                            description: styles.autoDescription,
                            predefinedPlacesDescription: styles.autoPredefinedPlacesDescription
                        }}
                        currentLocation={false}                        
                        nearbyPlacesAPI='GoogleReverseGeocoding'
                        filterReverseGeocodingByTypes={['street_number', 'route','neighborhood', 'locality','administrative_area_level_1','country']}

                        debounce={200}
                    /> */}

                        <GooglePlacesAutocomplete
                            placeholder='Zip Code'
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'Done'}
                            listViewDisplayed='auto'
                            fetchDetails
                            getDefaultValue={() => this.state.zip}

                            renderDescription={(row) => {console.log(row); return row.description}}  
                            onPress={this.onAutoComplete}    
                            query={{
                                key: 'AIzaSyBQOJDsIGt-XxuSNI7Joe1KRpAOJwDAEQE',
                                language: 'en',
                                components: country ? `country:${country}` : ''                                
                            }}
                            ref={(addressobj) => {
                                this.state.autoAddress = addressobj;
                            }}
                            styles={{
                                container: styles.autoContainer,
                                textInputContainer: styles.autoTextInputContainer,
                                textInput: styles.autoTextInput,
                                description: styles.autoDescription,
                                predefinedPlacesDescription: styles.autoPredefinedPlacesDescription
                            }}
                            currentLocation={false}                        
                            nearbyPlacesAPI='GoogleReverseGeocoding'
                            filterReverseGeocodingByTypes={['postal_code']}
                            debounce={200}
                    />
                        {/* <View style={styles.fieldContainer}> */}
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
                        {/* </View> */}
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
                                onChangeText={(v) => this.onChange(v, 'email')}
                                underlineColorAndroid={'transparent'}
                            />

                        <View style={styles.fieldContainer}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => this.validatePhone()}>
                                <Text style={styles.autoTextInput} >{phone || 'Enter phone'}</Text>
                            </TouchableOpacity>
                            </View>
                        </View> 
                        <View style={{padding: 20}}>
                            <Text style={{fontSize: 10, color: 'grey'}}>We may occasionally contact you via e-mail, but we will never sell your information.</Text>
                        </View>
                    {/* </List> */}
                    {
                        this.state.loading
                        ? <ActivityIndicator color={'#fff'} animating={this.state.sending} />
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
        marginTop: 5
    },
    autoTextInputContainer: {
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: PLColors.textInputBorder,
        backgroundColor: PLColors.textInputBackground,
        width: '95%'
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
    }
};

const mapState = (state) => ({
    profile: state.user.profile,
    token: state.user.token
});

export default connect(mapState)(VerifyProfile);