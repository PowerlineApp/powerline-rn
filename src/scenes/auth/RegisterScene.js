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

    render(){
        var {navigate, dispatch} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Register back={() => dispatch(NavigationActions.back())}/>
            </View>
        );
    }
}

module.exports = connect()(RegisterScene);
