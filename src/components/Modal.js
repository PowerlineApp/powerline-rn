import React from 'react';
import { ScrollView  } from 'react-native';

export default class FormModalScreen extends React.Component {
    render () {
        return (
            <ScrollView style={{marginTop: 55}}>
                { this.props.renderScene() }
            </ScrollView>
        );
    }
}