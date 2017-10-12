import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Left, Body, Right, Thumbnail, Button, Icon } from 'native-base';
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
      <ContentPlaceholder
        empty={this.state.messages.length === 0}
        title="The only announcement right now is that there are no announcements."
      >
        <List style={{ backgroundColor: 'white' }}>
        </List>
      </ContentPlaceholder>
    );
  }

}

export default connect()(Messages);