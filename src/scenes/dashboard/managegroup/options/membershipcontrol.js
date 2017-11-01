import React, { Component, PropTypes } from 'react';

import { Text, View } from 'react-native';
import {
  Button,
  Label as NSLabel
} from 'native-base';
import _ from 'lodash';
import { updateProfileSetup } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';

const membershipControlOptions = [
  { name: 'Public (Open to all)', value: 'public' },
  { name: 'Approval (User is approved by group leader)', value: 'approval' },
  { name: 'Passcode (User must provide correct passcode to enter)', value: 'passcode' }
];

class ProfileSetup extends Component {
  static propTypes = {
    group: PropTypes.shape({
      id: PropTypes.number,
      membership_control: PropTypes.string,
    }),
  };

  state = {
    control: this.props.group.membership_control,
    passcode: '',
  };


  getTitle(value) {
    const result = membershipControlOptions.find(control => control.value === value);

    return result.name;
  }

  render() {
    const {
      control,
      passcode,
    } = this.state;

    return (
      <View>
        <PopupLabel
          show="name"
          returned="value"
          options={membershipControlOptions}
          onPress={(control, index) => this.setState({ control })}
        >{this.getTitle(control)}</PopupLabel>
        {
          control === 'passcode' &&
          <Input
            style={{ marginTop: 8 }}
            value={passcode}
            placeholder="Type passcode here"
            onChangeText={passcode => this.setState({ passcode })}
          />
        }

        <Button block style={styles.submitButtonContainer}>
          <NSLabel style={styles.submitButtonText}>Save</NSLabel>
        </Button>
      </View>
    );
  }
}

export default ProfileSetup;