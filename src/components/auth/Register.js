import React from 'react';
import {
    StyleSheet,
    View,
    Text, 
    TextInput,
    TouchableWithoutFeedback,
    Image,
    ScrollView,
    Dimensions,
    Switch,
    Alert,
    AsyncStorage,
    PermissionsAndroid,
    KeyboardAvoidingView,
    Keyboard
}  from 'react-native';

import PLColors from 'PLColors';
import PLConstants from 'PLConstants';
import PLButton from 'PLButton';
import { connect } from 'react-redux';
import PLOverlayLoader from 'PLOverlayLoader';
import DeviceInfo from 'react-native-device-info';

import {Button, Icon, Content, Container } from 'native-base';

const {width} = Dimensions.get('window');
import {
    NavigationActions
} from 'react-navigation';
import { findByUsernameEmailOrPhone, register2, registerFromFB, verifyCode, sendCode, verifyNumber, getZipCode }  from 'PLActions';
import PhoneVerification from './PhoneVerification';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const googlePlacesKey = 'AIzaSyBQOJDsIGt-XxuSNI7Joe1KRpAOJwDAEQE';

class Register extends React.Component{

    static propTypes = {
        back: React.PropTypes.func.isRequired,
        onLoggedIn: React.PropTypes.func.isRequired,
        isFb: React.PropTypes.bool.isRequired,
        fbData: React.PropTypes.object.isRequired,
        tour: React.PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        let { isFb, fbData } = this.props;
        console.log('fbdata => ', fbData);
        console.log(DeviceInfo.getDeviceCountry());
        this.state = {
            isLoading: false,
            first_name: isFb? fbData.first_name: "",
            last_name: isFb? fbData.last_name: "",
            username: isFb? fbData.username: "",
            zip: isFb? fbData.zip: "",
            country: isFb? fbData.country : '',
            email: isFb? fbData.email: "",
            agency: '',
            countryCode: '+1',
            is_over_13: false,
            position: 0,
            autoAddress: null,
            isFb: isFb,
            enterCode: false
        };
        this.onNext = this.onNext.bind(this);
    }

    componentDidMount(){
        // getZipCode(googlePlacesKey).then(r => {
        //     this.setState({googleZip: r})
        // })
        this.requestLocation()

        // this.props.tour(() => {
        //     this.props.onLoggedIn({token: '1234'});
        // });


    }

    async requestLocation() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'We need your location'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.setState({country: this.state.country || DeviceInfo.getDeviceCountry()})
          } else {
          }
        } catch (err) {
          console.warn(err)
        }
      }
    

    register(isFb, data){
        this.setState({
            isLoading: true
        });
        if (isFb) {

        } else {
            register(data)
            .then(ret => {
                this.setState({
                    isLoading: false,
                    position: this.state.position + 1
                });
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                });
                alert(JSON.stringify(err));
                return;
            });
        }
    }

    onChangeFirstName = fname => {
        this.setState({ first_name: fname });
    }

    onChangeLastName = lname => {
        this.setState({ last_name: lname });
    }

    onChangeUserName = username => {
        this.setState({ username: username });
    }

    onChangeZip = zip => {
        this.setState({ zip: zip });
    }

    onChangeCountry = country => {
        this.setState({ country: country });
    }

    onChangeEmail = email => {
        this.setState({ email: email });
    }
    onChangeAgency = agency => {
        this.setState({ agency: agency });
    }

    onChangeSwitch = is_over_13 => {
        this.setState({ is_over_13: is_over_13 });
    }

    onConfirmEmail = () => {
        var {email} = this.state;
        Alert.alert(
            'Is this e-mail right?',
            email,
            [
                {text: 'Yes', onPress: () => {}},
                {text: 'No', onPress: () => {this.setState({email: ''})}}            
            ],
            { cancelable: false }
        );
    }

    onBack = () => {
        let { back } = this.props;
        let { position } = this.state;
        if(position > 0){
            this.setState({
                position: position - 1
            });
        }else{
            back & back();
        }        
    }

    async onNext() {
        let { email, position, first_name, last_name, username, zip, country, is_over_13, phone} = this.state;
        let { onLoggedIn, isFb, fbData, tour } = this.props;
        if(position === 0){
            
            if(first_name == "" || first_name.trim() == ""){
                alert("First Name is empty.");
                return;
            }
            if(last_name == "" || last_name.trim() == ""){
                alert("Last Name is empty.");
                return;
            }
            if(username == "" || username.trim() == ""){
                alert("Username is empty.");
                return;
            }
            
            if(email == "" || email.trim() == ""){
                alert("Email is empty.");
                return;
            }
            var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!reg.test(email)){
                alert("Email is invalid.");
                return;
            }

            this.setState({
                isLoading: true
            });

            if(isFb){
                this.setState({
                    position: 1,
                    isLoading: false
                });
            }else{
                try {
                    let usersUsername = await findByUsernameEmailOrPhone({username});
                    let usersEmail = await findByUsernameEmailOrPhone({email});
                    this.setState({position: 1, isLoading: false})
                    
                } catch (error) {
                    Alert.alert('Invalid data',
                    error,
                    [
                        {text: 'Ok', onPress: () => {
                            this.setState({position: 0, isLoading: false})
                        }}
                    ],
                    {cancelable: false}
                    )
                }
            }                
        }else if (position === 1) {
            if(is_over_13 == false){
                alert("You must be 13 or older to register to Powerline.");
                return;
            }
            if(zip == "" || zip.trim() == ""){
                alert("Zipcode is empty.");
                return;
            }
            if(country == "" || country.trim() == ""){
                alert("Country is empty.");
                return;
            }            

            if(isFb){
                let data = fbData;
                data.username = username;
                data.first_name = first_name;
                data.last_name = last_name;
                data.email = email;
                data.email_confirm = email;
                data.country = country;
                data.zip = zip;
                registerFromFB(data)
                .then(ret => {
                    this.setState({
                        isLoading: false
                    });
                    AsyncStorage.setItem('freshRegister', 'true');                
                    
                    tour(() => {
                        onLoggedIn(ret);
                    });
                })
                .catch(err => {
                    this.setState({
                        isLoading: false
                    });
                    alert(JSON.stringify(err));
                    return;
                });
            } else {
                this.setState({position: position + 1})
            }
        }
    }

    onAutoComplete = (data, details) => {
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
            if(address_components[i].types.indexOf("country") != -1){                
                this.setState({
                    country: address_components[i].short_name
                });
            }else if(address_components[i].types.indexOf("postal_code") != -1){
                this.setState({
                    zip : address_components[i].long_name
                });
            }
        }
        this.state.autoZip.setAddressText(this.state.zip);
        this.setState({listViewDisplayed: false})
        Keyboard.dismiss();
    }

    renderBasic = () => {
        var { first_name, last_name, username, email, position, agency } = this.state;
        var { isFb } = this.props;
        return (
            <Container>
            <Content style={styles.container}>
                <Text style={styles.titleText}>Let's set up your account</Text>
                <Text style={styles.descriptionText}>This only requires 2 steps to get started!</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.requireText}>
                        <Text style={styles.starText}>*</Text>
                        All fields are required
                    </Text>                                        
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="First Name"
                            style={styles.textInput}
                            autoCorrect={false}
                            autoCapitalize={'words'}
                            value={first_name}
                            onChangeText={this.onChangeFirstName}
                            underlineColorAndroid={'transparent'}
                            />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="Last Name"
                            style={styles.textInput}
                            autoCorrect={false}
                            autoCapitalize={'words'}
                            value={last_name}
                            onChangeText={this.onChangeLastName}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder="Username"
                                style={styles.textInput}
                                autoCorrect={false}
                                value={username}
                                onChangeText={this.onChangeUserName}
                                underlineColorAndroid={'transparent'}
                            />
                            <View style={styles.iconContainer}>
                                <Image source={require('img/user.png')} style={styles.icon}/>
                            </View>
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder="Email"
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize={false}
                                value={email}
                                onChangeText={this.onChangeEmail}
                                onEndEditing={this.onConfirmEmail}
                                underlineColorAndroid={'transparent'}
                            />
                            <View style={styles.iconContainer}>
                                <Image source={require('img/envelope.png')} style={styles.icon}/>
                            </View>
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                placeholder="Custom Code (optional)"
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize={false}
                                value={agency}
                                onChangeText={this.onChangeAgency}
                                underlineColorAndroid={'transparent'}
                            />
                        </View> 
                        <View style={styles.markContainer}>
                            <View style={styles.markWrapper}>
                                <View style={[styles.markItem, styles.markActiveItem]}></View>
                                <View style={styles.markItem}></View>
                                <View style={styles.markItem}></View>
                            </View>
                        </View>             
                </View>
                
            </Content>
            </Container>
            
        )
    }

    renderContact(){
        var { city, state, country, zip, email, position, is_over_13 } = this.state;
        return (
            <Content>
                <Container style={styles.container}>
                <ScrollView>

                <Text style={styles.titleText}>Enter your contact details.</Text>
                <Text style={styles.descriptionText}>You're almost done!</Text>
                <View style={styles.formContainer}>
                    <Text style={[styles.requireText, {textAlign: 'left'}]}>
                        <Text style={styles.starText}>*</Text>
                        Powerline requires this information to link you to your communities and, if available, your specific elected leaders. This helps prove you are real and not a robot. We  may also aggregate this information for anonymous reporting purposes.
                    </Text>
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="Country"
                            maxLength={2}
                            style={styles.textInput}
                            autoCorrect={false}
                            value={country}
                            onChangeText={this.onChangeCountry}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    <GooglePlacesAutocomplete
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
                        filterReverseGeocodingByTypes={['country']}
                        debounce={200}
                    />


                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>I am 13 or older</Text>
                        <Switch onTintColor="#8fd5e4" value={is_over_13} onValueChange={this.onChangeSwitch}/>
                    </View>
                    <Text style={[styles.requireText, {textAlign: 'left'}]}>
                        Your information is never shared with other users. Group leaders must receive your permission before they can access this information.
                    </Text>
                    <View style={styles.markContainer}>
                        <View style={styles.markWrapper}>
                            <View style={styles.markItem}></View>
                            <View style={[styles.markItem, styles.markActiveItem]}></View>
                            <View style={styles.markItem}></View>
                        </View>
                    </View>
                </View>
                </ScrollView>
                
                </Container>
            </Content>
        );
    }

    async onRegister(){
        this.setState({loading: true})
        if (this.state.registered) return;
        let { first_name, last_name, code, email, username, zip, country, phone, countryCode, agency} = this.state;
        let { onLoggedIn, isFb, fbData, tour } = this.props;
        let data = {
            username,
            first_name,
            last_name,
            email,
            country,
            phone: countryCode + phone,
            zip,
            code,
            agency
        }
        return register2(data).then(r => {
            console.log('register success', r);
            this.setState({loading: false})
            if (r.token){
                AsyncStorage.setItem('freshRegister', 'true');                
                tour(() => {
                    onLoggedIn(r);
                });
            }
        }).catch(e => {
            console.log('register fail', e)
            this.setState({loading: false})
            setTimeout(() => {
                alert(e.message);
            }, 200)
            console.log(e);
        })
        // try {
        //     let r = await register2(data);
        //     return true;
        //     this.setState({enterCode: true, registered: true})
        //     this.setState({loading: false})
        // } catch (error) {
        //     this.setState({loading: false});
        //     alert(error.message);
        //     return false;
        // }
    }

    async sendCode(){
        let {phone, countryCode} = this.state;
        countryCode = countryCode || '+1';        
        phone = countryCode + phone;
        this.setState({loading: true});
        try {
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
            console.log('find', error);
            Alert.alert('Invalid data',
            error,
            [{text: 'Ok', onPress: () => {
                this.setState({isLoading: false})
            }}],
            {cancelable: false})
        }
    }

    verifyCode(){
        // this.setState({loading: true});
        // let {phone, code, countryCode} = this.state;
        // countryCode = countryCode || '+1';
        // let {tour, onLoggedIn} = this.props;
        // this.setState({code: ''});
        this.onRegister();



        // verifyCode(countryCode + phone, code).then(r => r.json()).then(r => {
        //     console.log(r);
        //     if (r.token){
        //         AsyncStorage.setItem('freshRegister', 'true');                
        //         tour(() => {
        //             onLoggedIn(r);
        //         });
        //     }

        //     this.setState({loading: false})
        // }).catch(e => {
        //     alert(e);
        //     console.log(e);
        //     this.setState({loading: false})
        // })
    }
    // 32991139867

    renderPhoneVerification(){
        return <ScrollView style={styles.container}>
                          <Button transparent onPress={() => this.onBack()} style={{ width: 200, height: 50 }}  >
                          <Icon active name='arrow-back' style={{ color: '#6A6AD5' }} />
                      </Button>
        <View style={styles.formContainer}>
            <PhoneVerification
                onBack={() => this.onBack()}
                onSendCode={() => this.sendCode()}   
                onVerifycode={() => this.verifyCode()}
                onVerifySuccess={() => this.verifySuccess()}
                onChangeCode={(value) => {this.setState({code: value}, value.length === 4 ? () => this.verifyCode() : () => {});}}
                code={this.state.code}
                phone={this.state.phone}
                onChangePhone={(value) => this.setState({phone: value})}
                loading={this.state.loading}
                enterCode={this.state.enterCode}
                setCountryCode={(code) => this.setState({countryCode: '+' + code})}
                resetForm={() => this.setState({code: '', phone: '', countryCode: '', enterCode: false})}                
            />

            <View style={styles.markContainer}>
                <View style={styles.markWrapper}>
                    <View style={styles.markItem}></View>
                    <View style={styles.markItem}></View>
                    <View style={[styles.markItem, styles.markActiveItem]}></View>
                </View>
            </View>
        </View>
    </ScrollView>
    }

    renderBottom(){
        var { position } = this.state;
        return (
                position !== 2 &&
            <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback onPress={this.onBack}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Back</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.onNext}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>{position > 2 ?'Register':'Next'}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    componentDidCatch(e) {
        console.log('e', e)
    }

    renderForm(position){
        // console.log(position);
        switch(position){
            case 0:
                return this.renderBasic();
            case 1: 
                return this.renderContact();
            case 2:
                return this.renderPhoneVerification();
        }
    }

    render(){
        var { position, isLoading } = this.state;
        return (
            <View style={styles.container}>
                {this.renderForm(position)}
                {this.renderBottom()}
                {isLoading && <PLOverlayLoader visible={isLoading} logo />}
            </View>
        );
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleText: {
        marginTop: 50,
        color: PLColors.actionText,
        fontWeight: '600',
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
        width: width,
        height: 40
    },
    button: {
        backgroundColor: '#6A6AD5',
        width: width / 2,
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
        backgroundColor: PLColors.textInputBackground
    },
    autoTextInput: {
        backgroundColor: 'transparent',
        fontSize: 14,
        color: PLColors.lightText,
        left: -4
    },
    autoDescription: {
        fontWeight: 'bold',
        backgroundColor: 'transparent'
    },
    autoPredefinedPlacesDescription: {
        color: '#1faadb'
    }
});

const mapDispatchToProps = dispatch => ({
    onLoggedIn : (p) => dispatch({type: 'LOGGED_IN', data: p})
});

module.exports = connect(null, mapDispatchToProps)(Register);