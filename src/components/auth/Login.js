var React = require('react');
var { StyleSheet, View, Image, Text, Switch, TextInput, TouchableOpacity } = require('react-native');
var PLColors = require('PLColors');
var PLConstants = require('PLConstants');
var PLButton = require('PLButton');
var { logInManually, logInWithFacebook } = require('PLActions');
var { connect } = require('react-redux');
var { WINDOW_WIDTH } = require('PLConstants');

import LinearGradient from "react-native-linear-gradient";

class Login extends React.Component {
  props: {
    dispatch: (action: any) => Promise;
    onLoggedIn: ?() => void;
    openTerms: ?() => void;
    openPolicy: ?() => void;
    forgotPassword: ?() => void;
    register: ?(isFb, fbData) => void;
  };

  state: {
    isLoading: boolean;
    username: string;
    password: string;
  };

  _isMounted: boolean;

  constructor() {
    super();
    this.state = {
      isLoading: false,
      username: "",
      password: ""
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
    var { forgotPassword } = this.props;
    forgotPassword && forgotPassword();
  };

  onSignUp = () => {
    var { register, tour } = this.props;
    register && register(false, {});
  };

  onTermsOfService = () => {
    var { openTerms } = this.props;
    openTerms && openTerms();
  };

  onPrivacyPolicy = () => {
    var { openPolicy } = this.props;
    openPolicy && openPolicy();
  };

  async onLogIn() {
    var { dispatch, onLoggedIn } = this.props;
    if (this.state.username == "") {
      alert("Username is empty.");
      return;
    }
    if (this.state.password == "") {
      alert("Password is empty.");
      return;
    }
    this.setState({ isLoading: true });
    try {
      await Promise.race([
        dispatch(logInManually(this.state.username, this.state.password)),
        timeout(15000),
      ]);
    } catch (e) {
      var message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        alert('Incorrect username or password.');
        console.warn(e);
      }
      return;
    } finally {
      this._isMounted && this.setState({ isLoading: false });
    }

    onLoggedIn && onLoggedIn();
  }

  async onLogInWithFacebook() {
    var { dispatch, register } = this.props;
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
    var { username, password } = this.state;
    return (
      <View style={styles.loginFormContainer}>
        <View style={styles.nameContainer}>
          <TextInput
            placeholder="Username"
            style={styles.textInput}
            autoCorrect={false}
            value={username}
            onChangeText={this.onChangeUserName}
          />
        </View>
        <View style={styles.nameContainer}>
          <TextInput
            placeholder="Password"
            style={styles.textInput}
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={this.onChangePassword}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Keep me logged in</Text>
          <Switch onTintColor="#030366" disabled={true} value={false} />
        </View>
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

  render() {
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
    marginTop: 10
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
