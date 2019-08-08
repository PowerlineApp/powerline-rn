import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Label as NSLabel, Button } from 'native-base';
import { View, Text, ActivityIndicator } from 'react-native';
import { sendGroupInvites } from '../../../../actions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';
import { showToast } from '../../../../utils/toast';

class Invites extends Component {
    static propTypes = {
      groupId: PropTypes.string,
    };

  state = {
    emails: '',
    loading: false
  };

  onSuccess = () => {
    this.setState({loading: false});
    showToast('Update success!')

  } 
onFail = () => {
    this.setState({loading: false});
    showToast('Update failed')
} 




  setPermission = pId => {
    this.setState({
      permissions: {
        ...this.state.permissions,
        [pId]: !this.state.permissions[pId]
      }
    })
  }

  sendInvites = () => {
    const { token, dispatch, groupId } = this.props;
    let cb = {onSuccess: this.onSuccess, onFail: this.onFail}
    
    this.setState({loading: true})
    

    dispatch(sendGroupInvites(token, groupId, this.state.emails, cb));
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
        {
          this.state.loading
          ? <ActivityIndicator style={{marginTop: 20, marginBottom: 12}} color={'#020860'} animating={this.state.loading} /> 
          : <Button block style={styles.submitButtonContainer} onPress={this.sendInvites}>
                <NSLabel style={styles.submitButtonText}>Save</NSLabel>
            </Button>
        }
      </View>
    );
  }
}

export default Invites;