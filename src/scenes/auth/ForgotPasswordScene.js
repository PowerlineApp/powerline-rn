//GH5 - User has ability to reset password. Sent via e-mail.
var React = require('react');
var { Component } = require('react');
var { StyleSheet, View, TextInput } = require('react-native');
import PropTypes from 'prop-types';

import PLButton from '../../common/PLButton'
import {PLText} from '../../common/PLText'
import PLColors from '../../common/PLColors'
import {forgotPassword} from '../../actions'

// var PLButton = require(../../../common/PLButton);
// var { Text } = require('PLText');
// var PLColors = require('../../../common/PLColors');

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    formContainer: {
        marginHorizontal: 40,
        marginTop: 20
    },
    description: {
        alignSelf: 'center',
        color: PLColors.lightText
    },
    emailContainer: {
        marginTop: 15,
        height: 44,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: PLColors.textInputBorder,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    textInput: {
        height: 44,
        fontSize: 14,
        color: PLColors.lightText
    },
    submitButton: {
        marginTop: 35
    },
});

class ForgotPasswordScene extends Component {
    static navigationOptions = {
        title: "Forgot Password",
    };
    state: {
        submitted: boolean;
        email: string;
    };

    constructor() {
        super();
        this.state = {
            submitted: false,
            email: ''
        };
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    async submit() {
        let { email } = this.state;
        if (email == '') {
            alert('Email address is empty');
            return;
        }
        if (!this.validateEmail(email)) {
            alert('Please input valid email address');
            return;
        }
        this.setState({ submitted: true });
        let response = await forgotPassword(email);
        this.setState({ submitted: false });
        if (response.code) {
            let code = response.code;
            switch (code) {
                case 404:
                    alert('Email is not found. Did you register with a different e-mail address or with Facebook? ');
                    break;
                case 200:
                    alert('A link to reset your password has been sent to your e-mail address.');
                    break;
                default:
                    alert('Something went wrong');
                    break;
            }
        }
        else {
            alert('Something went wrong');
        }
    }

    onChangeEmail = email => {
        this.setState({ email: email });
    };

    render() {
        var { navigation } = this.props;
        var { state } = navigation;
        var { params } = state;
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.description}>Please enter your email address associated with your account.</Text>
                    <View style={styles.emailContainer}>
                        <TextInput
                            placeholder="Email Address"
                            style={styles.textInput}
                            autoCorrect={false}
                            autoFocus={true}
                            autoCapitalize={'none'}
                            keyboardType={'email-address'}
                            editable={!this.state.submitted}
                            value={this.state.email}
                            onChangeText={this.onChangeEmail}
                        />
                    </View>
                    <PLButton
                        caption={this.state.submitted ? "Please wait..." : "Submit"}
                        style={styles.submitButton}
                        onPress={this.submit.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

module.exports = ForgotPasswordScene;