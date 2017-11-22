import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, View, Image, Text, Switch, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from "react-native-linear-gradient";

import PLButton from 'PLButton';
import PLColors from 'PLColors';
import PLConstants, { WINDOW_WIDTH } from 'PLConstants';
import { logInManually, logInWithFacebook, verifyCode, sendCode }  from 'PLActions';

import PhoneVerification from './PhoneVerification';

class Login extends React.Component {


  constructor() {
    super();
    this.state = {
      isLoading: false,
      displayManualLogin: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChangeUserName = username => {
    this.setState({ username: username });
  };

  onChangePassword = password => {
    this.setState({ password: password });
  };

  onForgotPassword = () => {
    let { forgotPassword } = this.props;
    forgotPassword && forgotPassword();
  };

  onSignUp = () => {
    let { register, tour } = this.props;
    register && register(false, {});
  };

  onTermsOfService = () => {
    let { openTerms } = this.props;
    openTerms && openTerms();
  };

  onPrivacyPolicy = () => {
    let { openPolicy } = this.props;
    openPolicy && openPolicy();
  };

  async onLogIn() {
    let { dispatch, onLoggedIn } = this.props;
    this.setState({displayManualLogin: true})

    // onLoggedIn && onLoggedIn();
  }

  async onLogInWithFacebook() {
    let { dispatch, register } = this.props;
    this.setState({ isLoading: true });
    logInWithFacebook()
      .then((data) => {
        console.log('data => ', data);
        this.setState({ isLoading: false });
        if (data.token) {
          console.log('DATA BEING DISPATCHED FROM LOGIN WITH FACEBOOK', data)
          dispatch({ type: 'LOGGED_IN', data: data });
        } else {
          console.log('DATA BEING DISPATCHED FROM REGISTER WITH FACEBOOK', data)
          register && register(true, data);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
        alert("Facebook Login Error");
      });
  }

  renderLoginForm = () => {
    let { username, password } = this.state;
    return (
      <View style={styles.loginFormContainer}>
        <PLButton
          caption={this.state.isLoading ? "Please wait..." : "Login"}
          style={styles.loginButton}
          onPress={() => this.onLogIn()}
        />
        <View style={styles.termsContainner}>
          <Text style={styles.termsText}>By logging in, you agree to our </Text>
          <TouchableOpacity onPress={this.onTermsOfService}>
            <Text style={styles.termsUnderlineText}>Terms of Service </Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>and </Text>
          <TouchableOpacity onPress={this.onPrivacyPolicy}>
            <Text style={styles.termsUnderlineText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderFBLoginForm = () => {
    return (
      <View style={styles.fbLoginContainer}>
        <PLButton
          style={styles.fbLoginButton}
          icon={require('img/f-logo.png')}
          caption="Log in with Facebook"
          onPress={() => this.onLogInWithFacebook()}
        />
        <Text style={styles.fbTermsText}>Powerline will not post to Facebook without your permission</Text>
      </View>
    )
  };
  renderSignUp = () => {
    return (
      <View style={styles.signUpContainer}>
        <PLButton
          type="bordered"
          caption="Sign Up With E-mail"
          onPress={this.onSignUp}
        />
        <TouchableOpacity onPress={this.onForgotPassword}>
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    );
  };

  sendCode(){
    let {phone, countryCode} = this.state;
    countryCode = countryCode || '+1';
    
    this.setState({loading: true});
    sendCode(countryCode + phone).then(r => {
        console.log(r);
        this.setState({loading: false, enterCode: true})
    }).catch(e => {
        console.log(e)
        this.setState({loading: false})
    })
  }
  verifyCode(){
    let { dispatch } = this.props;
    
    this.setState({loading: true});
    let {phone, code, countryCode} = this.state;
    countryCode = countryCode || '+1';    
    this.setState({code: ''})
    verifyCode(countryCode + phone, code).then(r => r.json()).then(r => {
        console.log(r);
        if (r.token){
          dispatch({ type: 'LOGGED_IN', data: r });
        }
        this.setState({loading: false})
    }).catch(e => {
        console.log(e);
        this.setState({loading: false})
    })
}

  render() {
    if (this.state.displayManualLogin){
      return(
        <PhoneVerification
          onRegister={() => this.register()}
          onBack={() => this.setState({displayManualLogin: false})}
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
      )
    }
    return (
      <LinearGradient colors={['#afcbe6', '#fff', '#afcbe6']} style={styles.container}>
        <Image source={require("img/logo.png")} style={styles.imgLogo} />
        {this.renderLoginForm()}
        {this.renderFBLoginForm()}
        <View style={{ flex: 1 }} />
        {this.renderSignUp()}
      </LinearGradient>
    );
  }
}

async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgLogo: {
    marginTop: 30,
    width: WINDOW_WIDTH * 0.7,
    height: WINDOW_WIDTH * 0.7 * 0.32,
    resizeMode: "cover",
    alignSelf: "center",
  },
  loginFormContainer: {
    marginHorizontal: 40,
    marginTop: 100
  },
  nameContainer: {
    marginTop: 5,
    height: 44,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: PLColors.textInputBorder,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  textInput: {
    paddingVertical: 0,
    height: 44,
    fontSize: 14,
    color: PLColors.lightText
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  switchText: {
    color: PLColors.lightText,
    fontSize: 12,
    backgroundColor: 'transparent',
    marginHorizontal: 5
  },
  loginButton: {
    marginTop: 15
  },
  loginText: {
    color: 'white',
    fontWeight: '100'
  },
  termsContainner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  termsText: {
    color: PLColors.lightText,
    fontSize: 9,
    backgroundColor: 'transparent'
  },
  termsUnderlineText: {
    color: PLColors.lightText,
    fontSize: 9,
    textDecorationLine: 'underline',
    backgroundColor: 'transparent'
  },
  forgotText: {
    marginTop: 10,
    color: PLColors.actionText,
    fontSize: 12,
    alignSelf: "center",
    textDecorationLine: 'underline',
    backgroundColor: 'transparent'
  },
  fbLoginContainer: {
    marginTop: 15,
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fbLoginButton: {
    alignSelf: 'center',
    width: 270,
  },
  fbTermsText: {
    marginTop: 10,
    color: PLColors.lightText,
    fontSize: 9,
    backgroundColor: 'transparent'
  },
  signUpContainer: {
    width: 270,
    marginBottom: 10,
    alignSelf: "center"
  }
});

module.exports = connect()(Login);
