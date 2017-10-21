var React = require('react');
var {
    StyleSheet,
    View,
    Text, 
    TextInput,
    TouchableWithoutFeedback,
    Image,
    ScrollView,
    Dimensions,
    Switch,
    Alert
}  = require('react-native');
var PLColors = require('PLColors');
var PLConstants = require('PLConstants');
var PLButton = require('PLButton');
var { connect } = require('react-redux');
import PLOverlayLoader from 'PLOverlayLoader';

const {width} = Dimensions.get('window');
import {
    NavigationActions
} from 'react-navigation';
var { findByUsername, register, registerFromFB }  = require('PLActions');
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

class Register extends React.Component{

    // static propTypes = {
    //     back: React.PropTypes.func.isRequired,
    //     onLoggedIn: React.PropTypes.func.isRequired,
    //     isFb: React.PropTypes.bool.isRequired,
    //     fbData: React.PropTypes.object.isRequired,
    //     tour: React.PropTypes.func.isRequired
    // };

    state: {
        isLoading: boolean;
        position: boolean;
        first_name: string;
        last_name: string;
        username: string;
        password: string;
        confirm_password: string;
        address1: string;
        zip: string;
        city: string;
        state: string;
        country: string;
        email: string;
        is_over_13: boolean;
    };

    constructor(props){
        super(props);
        var { isFb, fbData } = this.props;
        this.state = {
            isLoading: false,
            first_name: isFb? fbData.first_name: "",
            last_name: isFb? fbData.last_name: "",
            username: isFb? fbData.username: "",
            password: "",
            confirm_password: "",
            address1: isFb? fbData.address1: "",
            zip: isFb? fbData.zip: "",
            city: isFb? fbData.city: "",
            state: isFb? fbData.state: "",
            country: isFb? fbData.country: "",
            email: isFb? fbData.email: "",
            is_over_13: false,
            position: false,
            autoAddress: null,
            isFb: isFb
        };
        this.onNext = this.onNext.bind(this);
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

    onChangePassword = password => {
        this.setState({ password: password });
    }

    onChangeConfirmPassword = confirm_password => {
        this.setState({ confirm_password: confirm_password });
    }   

    onChangeZip = zip => {
        this.setState({ zip: zip });
    }

    onChangeCity = city => {
        this.setState({ city: city });
    }

    onChangeState = state => {
        this.setState({ state: state });
    }

    onChangeCountry = country => {
        this.setState({ country: country });
    }

    onChangeEmail = email => {
        this.setState({ email: email });
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
        var { back } = this.props;
        var { position } = this.state;
        if(position == true){
            this.setState({
                position: false
            });
        }else{
            back & back();
        }        
    }

    async onNext() {
        var { email, position, first_name, last_name, username, password, address1, zip, city, state, country, is_over_13, confirm_password} = this.state;
        var { onLoggedIn, isFb, fbData, tour } = this.props;
        if(position == false){
            
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
            if(password == "" && !isFb){
                alert("Password is empty.");
                return;
            }
            if(password.length < 6 && !isFb){
                alert("Password must be six characters long");
                return;
            }
            if(confirm_password == "" && !isFb){
                alert("Confirm password is empty.");
                return;
            }
            if(confirm_password != password && !isFb){
                alert("Password doesn't match. Try again.");
                return;
            }
            
            this.setState({
                isLoading: true
            });

            if(isFb){
                this.setState({
                    position: true,
                    isLoading: false
                });
            }else{
                findByUsername(username).then(users => {
                    if(users.length > 0){
                        this.setState({
                            isLoading: false
                        });
                        alert("This username is taken.");
                        return;
                    }else{
                        this.setState({
                            position: true,
                            isLoading: false
                        });
                    }                
                })
                .catch(err => {
                    this.setState({
                        position: true,
                        isLoading: false
                    });
                });
            }                
        }else{
            if(is_over_13 == false){
                alert("You must be 13 or older to register to Powerline.");
                return;
            }
            if(address1 == "" || address1.trim() == ""){
                alert("Address is empty.");
                return;
            }
            if(zip == "" || zip.trim() == ""){
                alert("Zipcode is empty.");
                return;
            }
            if(city == "" || city.trim() == ""){
                alert("City is empty.");
                return;
            }
            if(state == "" || state.trim() == ""){
                alert("State is empty.");
                return;
            }
            if(country == "" || country.trim() == ""){
                alert("Country is empty.");
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

            if(isFb){
                var data = fbData;
                data.username = username;
                data.first_name = first_name;
                data.last_name = last_name;
                data.email = email;
                data.email_confirm = email;
                data.address1 = address1;
                data.city = city;
                data.state = state;
                data.country = country;
                data.zip = zip;
                this.setState({
                    isLoading: true
                });
                registerFromFB(data)
                .then(ret => {
                    this.setState({
                        isLoading: false
                    });
                    
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
            }else{
                //email registration
                var data = {
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    password: password,                
                    address1: address1,
                    city: city,
                    state: state,
                    country: country,
                    zip: zip,
                    email: email,
                    confirm: confirm_password,
                    email_confirm: email
                };
                this.setState({
                    isLoading: true
                });

                register(data)
                .then(ret => {
                    this.setState({
                        isLoading: false
                    });
                    
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

    renderBasic = () => {
        var { first_name, last_name, username, password, confirm_password, position } = this.state;
        var { isFb } = this.props;
        return (
            <ScrollView style={styles.container}>
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
                    {isFb?null:
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="Password"
                            style={styles.textInput}
                            autoCorrect={false}
                            value={password}
                            onChangeText={this.onChangePassword}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                        />
                        <View style={styles.iconContainer}>
                            <Image source={require('img/lock.png')} style={styles.icon}/>
                        </View>
                    </View>
                    }
                    {isFb?null:
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="Confirm Password"
                            style={styles.textInput}
                            autoCorrect={false}
                            value={confirm_password}
                            onChangeText={this.onChangeConfirmPassword}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                        />
                        <View style={styles.iconContainer}>
                            <Image source={require('img/lock.png')} style={styles.icon}/>
                        </View>
                    </View>   
                    }
                    <View style={styles.markContainer}>
                        <View style={styles.markWrapper}>
                            <View style={[styles.markItem, styles.markActiveItem]}></View>
                            <View style={styles.markItem}></View>
                        </View>
                    </View>             
                </View>
            </ScrollView>
        )
    }

    renderContact(){
        var { city, state, country, zip, email, position, is_over_13 } = this.state;
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.titleText}>Enter your contact details.</Text>
                <Text style={styles.descriptionText}>You're almost done!</Text>
                <View style={styles.formContainer}>
                    <Text style={[styles.requireText, {textAlign: 'left'}]}>
                        <Text style={styles.starText}>*</Text>
                        Powerline requires this information to link you to your communities and, if available, your specific elected leaders. This helps prove you are real and not a robot. We  may also aggregate this information for anonymous reporting purposes.
                    </Text>
                    <GooglePlacesAutocomplete
                        placeholder='Street Address'
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'Done'}
                        listViewDisplayed='auto'
                        fetchDetails={true}
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
                            placeholder="Zipcode"
                            style={styles.textInput}
                            autoCorrect={false}
                            value={zip}
                            onChangeText={this.onChangeZip}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="City"
                            style={styles.textInput}
                            autoCorrect={false}
                            value={city}
                            onChangeText={this.onChangeCity}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="State"
                            style={styles.textInput}
                            autoCorrect={false}
                            value={state}
                            onChangeText={this.onChangeState}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="Country"
                            style={styles.textInput}
                            autoCorrect={false}
                            value={country}
                            onChangeText={this.onChangeCountry}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            autoCorrect={false}
                            value={email}
                            onChangeText={this.onChangeEmail}
                            onEndEditing={this.onConfirmEmail}
                            underlineColorAndroid={'transparent'}
                        />
                        <View style={styles.iconContainer}>
                            <Image source={require('img/envelope.png')} style={styles.icon}/>
                        </View>
                    </View>
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
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    renderBottom(){
        var { position } = this.state;
        return (
            <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback onPress={this.onBack}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Back</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.onNext}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>{position?'Register':'Next'}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    render(){
        var { position, isLoading } = this.state;
        return (
            <View style={styles.container}>
                {position?this.renderContact():this.renderBasic()}
                {this.renderBottom()}
                <PLOverlayLoader visible={this.state.isLoading} logo />
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
        color: PLColors.lightText
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