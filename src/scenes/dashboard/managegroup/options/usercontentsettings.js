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
import { getUserContentSettings, updateUserContentSettings } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';

class UserContentSettings extends Component {
  static propTypes = {
    groupId: PropTypes.number,
  };

  state = {
    petition_per_month: "30",
    petition_percent: "10",
    petition_duration: "7",
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

  saveSettings = () => {
    const { token, dispatch, groupId } = this.props;

    if (
      !this.state.petition_per_month &&
      !this.state.petition_percent &&
      !this.state.petition_duration
    ) {
      alert("All inputs should be filled.")
      return;
    };

    dispatch(updateUserContentSettings(token, groupId, this.state));
  }

  render() {
    const {
      petition_per_month,
      petition_percent,
      petition_duration
    } = this.state;

    return (
      <View>
        <Label small>Limit of user petitions and posts per month{'\n'}(choose value between 1 and 1000)</Label>
        <Input
          maxLength={3}
          keyboardType="numeric"
          value={petition_per_month}
          onChangeText={petition_per_month => this.setState({ petition_per_month })}
        />

        <Label small>Quorum percentage{'\n'}(choose value between 1 and 50)</Label>
        <Input
          maxLength={2}
          keyboardType="numeric"
          value={petition_percent}
          onChangeText={petition_percent => this.setState({ petition_percent })}
        />

        <Label small>Quorum duration in days{'\n'}(choose value between 1 and 30)</Label>
        <Input
          maxLength={2}
          keyboardType="numeric"
          value={petition_duration}
          onChangeText={petition_duration => this.setState({ petition_duration })}
        />

        <Button block style={styles.submitButtonContainer} onPress={this.saveSettings}>
          <NSLabel style={styles.submitButtonText}>Save</NSLabel>
        </Button>
      </View>
    );
  }
}

export default UserContentSettings;