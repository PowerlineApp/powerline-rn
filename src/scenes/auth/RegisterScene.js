//GH10, GH11, GH12... User registration
//E-mail registration requires user to setup account username, password, provide e-mail... FB registration does not. Both require basic address info.
var React  = require('react');
var {
    Component,
    PropTypes
} = require('react');
var {
    StyleSheet,
    View
}  = require('react-native');
var { connect } = require('react-redux');
var Register = require('../../components/auth/Register');
import {
    NavigationActions
} from 'react-navigation';

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class RegisterScene extends Component{
    static navigationOptions = {
        title: 'Register',
        header: null
    };

    // After user registers, he is brought directly to the Tourguide
    // User can register with e-mail or with Facebook. Easier to register with Facebook.
    render(){
        var {navigate, dispatch, state} = this.props.navigation;
        var { params } = state;

        return (
            <View style={styles.container}>
                <Register 
                    back={() => dispatch(NavigationActions.back())} 
                    onLoggedIn={() => dispatch(NavigationActions.reset())}
                    isFb={params.isFb} 
                    fbData={params.fbData} 
                    tour={(callback, screens) =>  navigate('Tour', {callback: callback, screens: screens})}
                    />
            </View>
        );
    }
}

module.exports = connect()(RegisterScene);
