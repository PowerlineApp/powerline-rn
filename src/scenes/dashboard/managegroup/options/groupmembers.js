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
import { Actions } from 'react-native-router-flux'
import styles from '../styles';

class GroupMemberSettings extends Component {
  render() {
    return (
      <View>
        <Button block style={styles.submitButtonContainer} onPress={() => Actions.manageGroupMembers({group: this.props.group})}>
          <NSLabel style={styles.submitButtonText}>Go to members page</NSLabel>
        </Button>
      </View>
    );
  }
}

export default GroupMemberSettings;