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
import { View, Text, ActivityIndicator } from 'react-native';
import { getUserContentSettings, updateUserContentSettings } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';
import { showToast } from '../../../../utils/toast';

class UserContentSettings extends Component {
  static propTypes = {
    groupId: PropTypes.number,
  };

  state = {
    petition_per_month: "30",
    petition_percent: "10",
    petition_duration: "7",
    loading: false
  };

  componentDidMount = async () => {
    const { token, groupId } = this.props;
    const response = await getUserContentSettings(token, groupId);
    const settings = await response.json();

    this.setState({
      petition_per_month: settings.petition_per_month.toString() || '30',
      petition_percent: settings.petition_percent.toString() || '10',
      petition_duration: settings.petition_duration.toString() || ' 7',
    })
  }

  onSuccess = () => {
    this.setState({loading: false});
    showToast('Update success!')

  } 
onFail = () => {
    this.setState({loading: false});
    showToast('Update failed')
} 


  saveSettings = () => {
    const { token, dispatch, groupId } = this.props;
    let cb = {onSucces: this.onSuccess, onFail: this.onFail}

    if (
      !this.state.petition_per_month &&
      !this.state.petition_percent &&
      !this.state.petition_duration
    ) {
      alert("All inputs should be filled.")
      return;
    };

    dispatch(updateUserContentSettings(token, groupId, this.state, cb));
  }

  render() {
    const {
      petition_per_month,
      petition_percent,
      petition_duration
    } = this.state;

    return (
      <View>
        <Label small>Number of posts or petitions per user per month{'\n'}(choose value between 30 and 1000)</Label>
        <Input
          maxLength={3}
          keyboardType="numeric"
          value={petition_per_month}
          onChangeText={petition_per_month => this.setState({ petition_per_month })}
        />

        <Label small>Auto-boosting percentage{'\n'}(choose value between 30 and 50)</Label>
        <Input
          maxLength={2}
          keyboardType="numeric"
          value={petition_percent}
          onChangeText={petition_percent => this.setState({ petition_percent })}
        />

        <Label small>Post expiration in days{'\n'}(choose value between 10 and 30)</Label>
        <Input
          maxLength={2}
          keyboardType="numeric"
          value={petition_duration}
          onChangeText={petition_duration => this.setState({ petition_duration })}
        />
        {
          this.state.loading
          ? <ActivityIndicator style={{marginTop: 20, marginBottom: 12}} color={'#020860'} animating={this.state.loading} /> 
          : <Button block style={styles.submitButtonContainer} onPress={this.saveSettings}>
              <NSLabel style={styles.submitButtonText}>Save</NSLabel>
            </Button>
        }
      </View>
    );
  }
}

export default UserContentSettings;