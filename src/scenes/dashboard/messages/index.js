import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Left, Body, Right, Thumbnail, Button, Icon, Container } from 'native-base';
import {
  TouchableOpacity,
  View
} from 'react-native';

import ContentPlaceholder from '../../../components/ContentPlaceholder';

class Messages extends Component {
  state = {
    messages: []
  }

  render() {
    return (
      <Container style={{flex: 1, marginBottom: 48}}>

      <ContentPlaceholder
        empty={this.state.messages.length === 0}
        title="The only announcement right now is that there are no announcements."
      >
        <List style={{ backgroundColor: 'white' }}>
        </List>
      </ContentPlaceholder>
      </Container >
    );
  }

}

export default connect()(Messages);