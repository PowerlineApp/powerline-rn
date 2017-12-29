import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert
} from 'react-native';
import PLColors from 'PLColors';


import Frisbee from 'frisbee';
import {Button, Icon} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import SmsListener from 'react-native-android-sms-listener';

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
const brandColor = '#6A6AD5';

const styles = StyleSheet.create({
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
    textInput: {
        padding: 0,
        margin: 0,
        flex: 1,
        fontSize: 20,
        color: brandColor
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
});

export default class PhoneVerification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enterCode: false,
            spinner: false,
            country: {
                cca2: 'US',
                callingCode: '1'
            }
        };
        // if (Platform.OS === 'android'){
        //     let subscription = SmsListener.addListener(message => {
        //         let code = message.body.match(/[\d]{6}/)[0];
        //         props.onChangeCode(code);
        //         // subscription.remove();
        //     });
        // }
    }

    componentDidMount(){
        // console.log('~>', this.refs.countryPicker.props.countryList);
    }

    _getCode () {
        this.props.onSendCode();
    }

    _verifyCode () {
        this.props.onVerifyCode();
    }

    _tryAgain () {
        this.refs.form.refs.textInput.setNativeProps({ text: '' });
        this.refs.form.refs.textInput.focus();
        this.props.resetForm();
        this.setState({ enterCode: false });
    }

    _getSubmitAction () {
        this.props.enterCode ? this._verifyCode() : this._getCode();
    }

    _changeCountry (country) {
        this.setState({ country });
        this.props.setCountryCode(country.callingCode);
        this.refs.form.refs.textInput.focus();
    }

    _renderFooter () {

        if (this.props.enterCode)
            return (
                <View>
                    <Text style={styles.wrongNumberText} onPress={() => this._tryAgain()}>
            Enter the wrong number or need a new code?
          </Text>
                </View>
            );

        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    _renderCountryPicker () {

        if (this.props.enterCode)
            return (
                <View />
            );

        return (
            <CountryPicker
                ref={'countryPicker'}
                closeable
                style={styles.countryPicker}
                onChange={(c) => this._changeCountry(c)}
                cca2={this.state.country.cca2}
                styles={countryPickerCustomStyles}
                translation='eng' />
        );

    }

    _renderCallingCode () {
        if (this.props.enterCode)
            return (
                <View />
            );
        return (
            <View style={styles.callingCodeView}>
                <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
            </View>
        );

    }

    render() {

        let headerText = `What's your ${this.props.enterCode ? 'verification code' : 'phone number'}?`;
        let buttonText = this.props.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
        let textStyle = this.props.enterCode ? {
            height: 50,
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: 'Courier'
        } : {};

        return (
            <View style={styles.container}>
                {
                    this.props.type === 'login' &&
                    <Button transparent onPress={() => this.props.onBack()} style={{ width: 200, height: 50 }}  >
                        <Icon active name='arrow-back' style={{ color: '#6A6AD5' }} />
                    </Button>
                }
                <Text style={styles.header}>{headerText}</Text>
                <Form ref={'form'} style={styles.form}>
                    <View style={{ flexDirection: 'row' }}>
                        {this._renderCountryPicker()}
                        {this._renderCallingCode()}
                        <TextInput
                            ref={'textInput'}
                            name={this.props.enterCode ? 'code' : 'phoneNumber'}
                            type={'TextInput'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(value) => { this.props.enterCode ? this.props.onChangeCode(value) :  this.props.onChangePhone(value);}}
                            placeholder={this.props.enterCode ? '_ _ _ _' : 'Phone Number'}
                            value={this.props.enterCode ?  this.props.code : this.props.phone}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={[ styles.textInput, textStyle ]}
                            returnKeyType='go'
                            autoFocus
                            placeholderTextColor={brandColor}
                            selectionColor={brandColor}
                            maxLength={this.props.enterCode ? 6 : 20}
                            onSubmitEditing={() => this._getSubmitAction()} />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => this._getSubmitAction()}>
                        <Text style={styles.buttonText}>{ buttonText }</Text>
                    </TouchableOpacity>
                    {this._renderFooter()}
                </Form>
                <Spinner
                    visible={this.props.loading}
                    textContent={'One moment...'}
                    textStyle={{ color: '#fff' }} />
            </View>
        );
    }
}