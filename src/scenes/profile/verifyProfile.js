import React, {Component} from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
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
import { updateUserProfile, loadUserProfileById, verifyCode, sendCode } from 'PLActions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import ImageSelector from '../../common/PLImageSelector'
import PLButton from 'PLButton';
import PhoneVerification from '../../components/auth/PhoneVerification';


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

    updateUser() {
        let {zip, address1, address2, city, state, email, country, phone} = this.state
        // at this point, if user changed his phone, it is already done. it doesnt seem right, he should validate his phone first.
        // this same logic should happen when registering: what happens if user types the wrong number??
        // we need an endpoint just to send an sms!
        updateUserProfile(this.props.token, {zip, address1, address2, city, state, email, country, phone})
            .then(response => {
                console.log(response)
                Actions.pop();
                Actions.profile();
            })
            .catch(err => console.log(err));
    }

    updateUserAvatar(image) {
        this.setState(state => {
            state.user.avatar_file_name = image.path
            return state
        })
        updateUserProfile(this.props.token, {avatar_file_name: image.data})
    }

    onAutoComplete = (data, details) => {
        console.log('!!!!!!!!!!!!!!!')
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
        verifyCode(countryCode + phone, code).then(r => r.json()).then(r => {
            if (r.token){
                // here validation worked.
                this.setState({showPhoneScreen: false})
            }
            // what to do here??? user's phone was updated, but he did not validate it... change it back? and if he did not have a phone???
            // ask Jesse/Igor.

            this.setState({loading: false})
        }).catch(e => {
            // same as comment above.
            this.setState({loading: false})
        })
    }

    async sendCode(){
        this.setState({loading: true});
        let {countryCode, phone} = this.state;
        countryCode = countryCode || '+1';
        
        // update user's phone
        await updateUserProfile(this.props.token, {phone: phone});
        // send code via sms
        await sendCode(countryCode + phone);
        this.setState({enterCode: true, loading: false})
    }

    renderPhoneScreen(){
        return <PhoneVerification
        onRegister={() => this.register()}
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


    render() {
        // console.log('this.state', this.state);
        if (this.state.showPhoneScreen){
            return this.renderPhoneScreen();
        }


        let {zip, address1, address2, city, state, email, country, phone} = this.state
        console.log({zip, address1, address2, city, state, email, country, phone})
            return (
            <Content contentContainerStyle={{alignItems: 'center'}}>
                <View style={{position: 'absolute', borderRadius: 25, flex: 1, zIndex: 3, marginTop: 16}}>
                    <ImageSelector onConfirm={(i) => this.updateUserAvatar(i)} iconSize={20} iconColor='#000' onError={err => console.log(err)}/>
                </View> 
                <Thumbnail source={{uri: this.state.user.avatar_file_name}} style={{marginBottom: 4, borderRadius: 25}} />
                <Card>
                    <List style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{padding: 20}}>
                            <Label>Verify or Complete your data</Label>
                        </View>

                        <GooglePlacesAutocomplete
                            placeholder='Street Address'
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'Done'}
                            listViewDisplayed='auto'
                            fetchDetails
                            renderDescription={(row) => row.description}  
                            onPress={this.onAutoComplete}                      
                            query={{
                                key: 'AIzaSyBQOJDsIGt-XxuSNI7Joe1KRpAOJwDAEQE',
                                language: 'en'
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
                            filterReverseGeocodingByTypes={['street_number', 'route','neighborhood', 'locality','administrative_area_level_1','country','postal_code']}
                            debounce={200}
                    />
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder='Zipcode'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={zip}
                                onChangeText={(v) => this.onChange(v, 'zip')}
                                underlineColorAndroid={'transparent'}
                        />
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder='City'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={city}
                                onChangeText={(v) => this.onChange(v, 'city')}
                                underlineColorAndroid={'transparent'}
                        />
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder='State'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={state}
                                onChangeText={(v) => this.onChange(v, 'state')}
                                underlineColorAndroid={'transparent'}
                        />
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder='Country'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={country}
                                onChangeText={(v) => this.onChange(v, 'country')}
                                underlineColorAndroid={'transparent'}
                        />
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder='Email'
                                style={styles.textInput}
                                autoCorrect={false}
                                value={email}
                                onChangeText={(v) => this.onChange(v, 'email')}
                                underlineColorAndroid={'transparent'}
                            />
                        </View>
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
                    </List>
                </Card>
                        <PLButton
                            caption={'Update profile'}
                            onPress={() => this.updateUser()}
                        />
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
        height: 44,
        fontSize: 14,
        color: PLColors.lightText,
        flex: 1,
        margin: 0,
        backgroundColor: 'transparent'
    },
    fieldContainer: {
        marginTop: 5,
        height: 44,
        borderRadius: 5,
        borderWidth: 0.5,
        width: '80%',
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
        width: '80%'
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