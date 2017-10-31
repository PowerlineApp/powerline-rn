import React, { Component, PropTypes } from 'react';
import { Label as NSLabel, Button } from 'native-base';
import { View, Text } from 'react-native';
import { sendGroupInvites } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';

class Invites extends Component {
    static propTypes = {
      groupId: PropTypes.string,
    };

  state = {
    emails: '',
  };

  sendInvites = () => {
    const { token, dispatch, groupId } = this.props;

    dispatch(sendGroupInvites(token, groupId, this.state.emails));
  }

  render() {
    const { emails } = this.state;

    return (
      <View>
        <Input
          value={emails}
          placeholder="Enter email addresses"
          onChangeText={emails => this.setState({ emails })}
        />
        <Label>Use comma to separate addressed, e.g. kate@email.com, john@doe.com</Label>
        <Button block style={styles.submitButtonContainer} onPress={this.sendInvites}>
          <NSLabel style={styles.submitButtonText}>Send</NSLabel>
        </Button>
      </View>
    );
  }
}

export default Invites;