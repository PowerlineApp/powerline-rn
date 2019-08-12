//GH2, GH3, GH4, GH5
var React = require('react');
var { Component } = require('react');
import PropTypes from 'prop-types';

var { StyleSheet, View } = require('react-native');
var Login = require('../../components/auth/Login')
var { connect } = require('react-redux');
import { Router, Scene } from "react-native-router-flux";
// import LoginScene from './scenes/auth/LoginScene';
import TermsPolicyScene from './TermsPolicyScene';
import ForgotPasswordScene from './ForgotPasswordScene';
import RegisterScene from './RegisterScene';
import TourScene from './TourScene';

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class LoginRouter extends Component {
  static navigationOptions = {
    title: "Login",
    header: null
  };

  render() {


    return (
      // <Router>
        <React.Fragment>
          {/* <Scene hideNavBar initial={!this.props.isLoggedIn} key="Login" component={Login} initial />        
          <Scene key="TermsAndPolicy" component={TermsPolicyScene} />        
          <Scene key="ForgotPassword" component={ForgotPasswordScene} />        
          <Scene key="Register" component={RegisterScene} />        
          <Scene key="Tour" component={TourScene} /> */}
        </React.Fragment>
      // </Router>
      // <View style={styles.container}>
      //   <Login
      //     openTerms={() => navigate('TermsAndPolicy', { isTerms: true })}
      //     openPolicy={() => navigate('TermsAndPolicy', { isTerms: false })}
      //     forgotPassword={() => navigate('ForgotPassword')}
      //     register={(isFb, fbData) => navigate('Register', { isFb: isFb, fbData: fbData })}
      //   />
      // </View>
    );
  }
}

module.exports = connect()(LoginRouter);
