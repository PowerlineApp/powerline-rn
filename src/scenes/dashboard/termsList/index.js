import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, ScrollView} from 'react-native';
import {Button, Icon, Title} from 'native-base';
import PLButton from '../../../common/PLButton';
import TermsList from '../../auth/TermsList';
import {Actions} from 'react-native-router-flux';

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class TermsListScene extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: '#020860', flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 1}}>
                        <Button transparent onPress={() => Actions.pop()} style={{ height: 50, flex: 1 }}  >
                            <Icon active name='arrow-back' style={{ color: 'white' }} />
                        </Button>
                    </View>
                    <View style={{flex: 4}} >
                        <Title style={{color: '#fff'}}>
                            {
                                    this.props.title
                                }
                        </Title>
                    </View>
                    <View style={{flex: 1, height: 50}} />
                </View>
                <ScrollView>
                    <TermsList terms={this.props.terms} />
                </ScrollView>
            </View>
        );
    }
}

module.exports = TermsListScene;