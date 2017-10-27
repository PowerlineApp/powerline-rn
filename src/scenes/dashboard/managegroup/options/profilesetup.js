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
  Text
} from 'native-base';
import { View } from 'react-native';
import { Label, Input } from '../components';
import styles from '../styles';

class ProfileSetup extends Component {
  render() {
    const {
      owner,
      official_name,
      official_description,
      official_address,
      official_city,
      official_state,
      acronym
    } = this.props.group;

    return (
      <View>
        <Label>Group Owner:</Label>
        <Text style={styles.inputText}>{owner.full_name}</Text>

        <Label>Group Name</Label>
        <Input value={official_name} />

        <Label>Group Description (optional)</Label>
        <Input value={official_description} />        

        <Label>Group Acronym (optional)</Label>
        <Input value={acronym} />        
        
        <Label>Group Type</Label>
        
        <Label>Group Address (optional)</Label>
        <Input value={official_address} defaultValue="Address (optional)" />
        
        <Label>City (optional)</Label>
        <Input value={official_city} defaultValue="City (optional)" />
        
        <Label>State (optional)</Label>
        <Input value={official_state} defaultValue="State (optional)" />        
      </View>
    );
  }
}

export default ProfileSetup;