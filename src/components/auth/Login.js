import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, Alert, View, Image, Text, Switch, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {Button, Icon} from 'native-base';
import LinearGradient from "react-native-linear-gradient";

import PLButton from 'PLButton';
import PLColors from 'PLColors';
import PLConstants, { WINDOW_WIDTH } from 'PLConstants';
import { logInManually, logInWithFacebook, verifyCode, sendCode, sendRecoveryEmail, finishRecovery, login2 }  from 'PLActions';
import PLOverlayLoader from 'PLOverlayLoader';
import PhoneVerification from './PhoneVerification';
import logo from '../../assets/logo.png';
class Login extends React.Component {


  constructor() {
    super();
    this.state = {
      isLoading: false,
      displayManualLogin: false,
      countryCode: '+1',
      showNewDevice: false,
      recoveryStep: 0,
      newDevice: {
        token: new Date().getTime().toString().slice(-5)
      }
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
        console.log('facebook error', err);
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
            <Text style={styles.termsUnderlineText}>Terms of Use </Text>
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
          caption="Login with Facebook"
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
          caption="Sign Up With Email"
          onPress={this.onSignUp}
        />
      </View>
    );
  };
  sendCode(){
    let {phone, countryCode, username, password} = this.state;
    countryCode = countryCode || '+1';
    
    this.setState({isLoading: true});
    sendCode(countryCode + phone, "", username, password).then(r => {
        console.log(r);
        this.setState({isLoading: false, enterCode: true})
    }).catch(e => {
        console.log(e);
        Alert.alert('Invalid data',
        'Validation failed.',
        [
            {text: 'Ok', onPress: () => {
                this.setState({isLoading: false})
            }}
        ],
        {cancelable: false}
        )
    })
  }
  verifyCode(){
    let { dispatch } = this.props;
    
    this.setState({isLoading: true});
    let {phone, code, countryCode, username, password} = this.state;
    countryCode = countryCode || '+1';    
    this.setState({code: ''})
    verifyCode({code, username}).then(r => r.json()).then(r => {
        console.log('verify code res', r);
        this.setState({isLoading: false}, () => {
          if (r.token){
            dispatch({ type: 'LOGGED_IN', data: r });
          }
        })
    }).catch(e => {
        console.log('\n------------------------------', e);
        Alert.alert('Invalid data',
        'Validation failed.',
        [
            {text: 'Ok', onPress: () => {
                this.setState({isLoading: false})
            }}
        ],
        {cancelable: false}
        )
    })
}

  onChangeNewDeviceInfo(key, value){
    let state = this.state;
    state.newDevice[key] = value;
    this.setState(state);
  }

  finishRecovery(){
    let {dispatch} = this.props;
    this.setState({isLoading: true})
    let {username, token} = this.state.newDevice;
    finishRecovery({username, token}).then(r => r.json()).then(r =>{
      console.log(r);
      if (r.token){
        dispatch({ type: 'LOGGED_IN', data: r });
      }
      this.setState({isLoading: false})
    }).catch(e => {
      console.warn(e);
      Alert.alert('Invalid data',
      'Validation failed.',
      [
          {text: 'Ok', onPress: () => {
              this.setState({isLoading: false})
          }}
      ],
      {cancelable: false}
      )
  })
  }

  sendRecoveryEmail(){
    console.log('hey');
    let newDevice = this.state.newDevice;
    this.setState({isLoading: true});

    sendRecoveryEmail(newDevice).then(r => {
      console.log(r);
      Alert.alert('Email sent',
      'An email was sent to your registered address.',
      [
          {text: 'Ok', onPress: () => {
              this.setState({isLoading: false, recoveryStep: 1})
          }}
      ],
      {cancelable: false}
      )
    }).catch(e => {
      console.log(e);
      Alert.alert('Invalid data',
      'One of the given info is not correct. Please verify your contact details.',
      [
          {text: 'Ok', onPress: () => {
              this.setState({isLoading: false})
          }}
      ],
      {cancelable: false}
      )
    })
  }

  userNameAuth(){
    this.setState({isLoading: true});
    let {username, password} = this.state;
    login2(username, password).then(r => {
        this.setState({displayPhoneVerification: true, isLoading: false})
    }).catch(e => {
        Alert.alert('Invalid data',
        'Validation failed.',
        [
            {text: 'Ok', onPress: () => {
                this.setState({isLoading: false})
            }}
        ],
        {cancelable: false}
        )
    })
  }

  renderNewDevice(){
    console.log('recoveryStep', this.state)
    // username, phone, zip, token
    // send, wait for response, tell to click on email link and hit login
    return <ScrollView style={{flex: 1, margin: 20}}>
        <Button transparent onPress={() => this.setState({showNewDevice: false, recoveryStep: 0, newDevice: {token: this.state.newDevice.token}})} style={{ width: 200, height: 50 }}  >
            <Icon active name='arrow-back' style={{ color: '#6A6AD5' }} />
        </Button>
        {
          this.state.recoveryStep === 1
          ? <Text style={styles.titleText}>Please click on the link in your email and press "login"</Text>
          : <Text style={styles.titleText}>Enter your contact details. We will use this information to send you an validation email.</Text>
        }
        {
          this.state.recoveryStep !== 1 &&
          <View>

        <View style={styles.fieldContainer}>
        <TextInput
            placeholder="Username"
            style={styles.textInput}
            autoCorrect={false}
            value={this.state.newDevice.username}
            onChangeText={(v) => this.onChangeNewDeviceInfo('username', v)}
            underlineColorAndroid={'transparent'}
            />
        </View>
        <View style={styles.fieldContainer}>
        <TextInput
            placeholder="Old phone number"
            style={styles.textInput}
            keyboardType="numeric"
            autoCorrect={false}
            value={this.state.newDevice.phone}
            onChangeText={(v) => this.onChangeNewDeviceInfo('phone', v)}
            underlineColorAndroid={'transparent'}
            />
        </View>
        <View style={styles.fieldContainer}>
        <TextInput
            placeholder="Zip Code"
            style={styles.textInput}
            autoCorrect={false}
            keyboardType="numeric"            
            value={this.state.newDevice.zip}
            onChangeText={(v) => this.onChangeNewDeviceInfo('zip', v)}
            underlineColorAndroid={'transparent'}
            />
        </View>
        </View>
          }
        <View style={styles.login}>
          <PLButton
            caption={this.state.recoveryStep === 0 ? 'Send email' : 'Login'}
            onPress={() => this.state.recoveryStep === 0 ? this.sendRecoveryEmail() : this.finishRecovery()}
            />
        </View>
    </ScrollView>
  }

  renderUserEntry(){
    return (
      <View style={{flex: 1}}>

        <Button transparent onPress={() => this.setState({displayManualLogin: false})} style={{ width: 200, height: 50 }}  >
            <Icon active name='arrow-back' style={{ color: '#6A6AD5' }} />
        </Button>
    <View style={{flex: 1, paddingHorizontal: 20, marginTop: 60}}>
        <View style={styles.fieldContainer}>
          <TextInput
              placeholder="Username"
              style={styles.textInput}
              autoCorrect={false}
              value={this.state.username}
              onChangeText={(v) => this.setState({username: v})}
              underlineColorAndroid={'transparent'}
              />
        </View>
        <View style={styles.fieldContainer}>
          <TextInput
              placeholder="Password"
              style={styles.textInput}
              autoCorrect={false}
              value={this.state.password}
              secureTextEntry
              onChangeText={(v) => this.setState({password: v})}
              underlineColorAndroid={'transparent'}
              />
        </View>
        <View style={styles.login}>
          <PLButton
            caption={'Login'}
            onPress={() => this.userNameAuth()}
            />
        </View>
    </View>
    </View>
    
        )    
  }

  renderLoginContent(){
    if (this.state.displayManualLogin){
      if (this.state.displayManualLogin && this.state.showNewDevice){
        return (this.renderNewDevice())
      } else if (this.state.displayPhoneVerification) {
        return(
          <LinearGradient colors={['#afcbe6', '#fff', '#afcbe6']} style={styles.container}>

          <View style={{flexDirection: 'column'}}>
          <View style={{flex: 1, minHeight: 400}}>
            <PhoneVerification
              onRegister={() => this.register()}
              onBack={() => this.setState({displayManualLogin: false, displayPhoneVerification: false})}
              type='login'
              onSendCode={() => this.sendCode()}   
              onVerifycode={() => this.verifyCode()}
              onChangeCode={(value) => {this.setState({code: value}, value.length === 4 ? () => this.verifyCode() : () => {});}}
              code={this.state.code}
              phone={this.state.phone}
              onChangePhone={(value) => this.setState({phone: value})}
              loading={this.state.loading}
              enterCode
              setCountryCode={(code) => this.setState({countryCode: '+' + code})}
              resetForm={() => this.setState({code: '', phone: '', countryCode: '', enterCode: false})}
              />
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <PLButton
                  type='bordered'
                  caption={'I have a new phone number'}
                  onPress={() => this.setState({showNewDevice: true})}
                  />
              </View>
          </View>
          </LinearGradient>
        )
      } else {
        return <LinearGradient colors={['#afcbe6', '#fff', '#afcbe6']} style={styles.container}>
          {this.renderUserEntry()}
          <View style={{ flex: 1 }} />
        </LinearGradient>
      }
    }
    return (
      <LinearGradient colors={['#afcbe6', '#fff', '#afcbe6']} style={styles.container}>
        <Image source={logo} style={styles.imgLogo} />
        {this.renderLoginForm()}
        {this.renderFBLoginForm()}
        <View style={{ flex: 1 }} />
        {this.renderSignUp()}
      </LinearGradient>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>

      <PLOverlayLoader marginTop={200} visible={ this.state.isLoading} logo />
      {this.renderLoginContent()}
      </View>
    )
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
  login: {
    flex: 1,
     alignItems: 'center',
     marginTop: 50
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
  textInput: {
    height: 44,
    fontSize: 14,
    color: PLColors.lightText,
    flex: 1,
    margin: 0,
    backgroundColor: 'transparent'
  },
  titleText: {
    color: PLColors.actionText,
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center'
  }
});

module.exports = connect()(Login);
