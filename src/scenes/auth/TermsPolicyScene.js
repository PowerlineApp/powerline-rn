var React = require('react');
var { Component, PropTypes } = require('react');
var { StyleSheet, View, Text } = require('react-native');
var PLButton = require('PLButton');
var TermsList = require('./TermsList');
var PureListView = require('../../common/PureListView');
var { TERMS_OF_SERVICE, PRIVACY_POLICY, TERMS_OF_USE } = require('PLConstants');

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class TermsPolicyScene extends Component {
    render() {
        var { navigation } = this.props;
        var { state } = navigation;
        var { params } = state;
        var isTerms = params.isTerms;
        return (
            <PureListView renderEmptyList={() => (
                <View>
                    <TermsList terms={isTerms === true ? TERMS_OF_USE : PRIVACY_POLICY} />
                </View>
            )}
            />
        );
    }
}

module.exports = TermsPolicyScene;