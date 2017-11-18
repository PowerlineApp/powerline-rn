import React, { Component, PropTypes } from 'react';

import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Left,
  Right,
  Thumbnail,
  List,
  ListItem,
  Button,
  Icon,
  Label as NSLabel
} from 'native-base';
import { View, Text } from 'react-native';
import { Label, Input, PopupLabel } from '../components';
import { Actions } from 'react-native-router-flux';
import styles from '../styles';

class FundRaiser extends Component {
    render() {
        return (
            <View>
                <Text>In order to send fundraisers to your group you must provide a bank account first</Text>
                <Button block style={styles.submitButtonContainer} onPress={() => Actions.groupBankAccountScene({group: this.props.group})}>
                    <NSLabel style={styles.submitButtonText}>Add Bank Account</NSLabel>
                </Button>
            </View>
        );
    }
}

export default FundRaiser;