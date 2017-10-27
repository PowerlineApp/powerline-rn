import React, { Component, PropTypes } from 'react';

import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Left,
  Right,
  Label,
  Thumbnail,
  List,
  ListItem,
  Input,
  Button,
  Icon,
  Text
} from 'native-base';
import { View } from 'react-native';

class ProfileSetup extends Component {
  render() {
    return (
      <View>
        <Label>Group Owner:</Label>
        <Label>Group Name</Label>
        <Label>Group Description (optional)</Label>
        <Label>Group Acronym (optional)</Label>
        <Label>Group Type</Label>
        <Label>Group Address (optional)</Label>
        <Label>City (optional)</Label>
        <Label>State (optional)</Label>
      </View>
    );
  }
}

export default ProfileSetup;