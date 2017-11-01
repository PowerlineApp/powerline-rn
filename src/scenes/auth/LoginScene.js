//GH2, GH3, GH4, GH5
var React = require('react');
var { Component, PropTypes } = require('react');
var { StyleSheet, View } = require('react-native');
var Login = require('../../components/auth/Login')
var { connect } = require('react-redux');

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class LoginScene extends Component {
  static navigationOptions = {
    title: "Login",
    header: null
  };

  render() {
    var { navigate } = this.props.navigation;
    navigate("dashboard")
    return (
      <View style={styles.container}>
        <Login
          openTerms={() => navigate('TermsAndPolicy', { isTerms: true })}
          openPolicy={() => navigate('TermsAndPolicy', { isTerms: false })}
          forgotPassword={() => navigate('ForgotPassword')}
          register={(isFb, fbData) => navigate('Register', { isFb: isFb, fbData: fbData })}
        />
      </View>
    );
  }
}

module.exports = connect()(LoginScene);
