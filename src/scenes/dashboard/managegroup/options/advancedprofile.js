import React, { Component, PropTypes } from 'react';

import { Text, View } from 'react-native';
import {
  Button,
  Label as NSLabel
} from 'native-base';
import { updateProfileSetup, getGroupAdvancedAttributes, groupAdvancedAttribsInputChange, updateGroupAdvancedAttributes } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';

class AdvancedProfile extends Component {
    constructor(props) {
        super(props);
        this.inputChange = this.inputChange.bind(this)
    }
  componentWillMount() {
    const { token, dispatch, group: { id } } = this.props;
    dispatch(getGroupAdvancedAttributes(id))
  }

  saveProfile = () => {
    const { data, group: { id }, dispatch } = this.props;

    dispatch(updateGroupAdvancedAttributes(id, data));
  }

  inputChange(key, prop) {
    const {dispatch} = this.props;
    dispatch(groupAdvancedAttribsInputChange({key, prop}))
  }
  
  render() {
    return (
      <View>
        <Label>Welcome Message (optional)</Label>
        <Input
            value={this.props.data.welcome_message}
            onChangeText={text => this.inputChange('welcome_message', text)}
        />

        <Label>Welcome Video (optional)</Label>
        <Input
            value={this.props.data.welcome_video}
          onChangeText={text => this.inputChange('welcome_video', text)}
        />

        <Button block style={styles.submitButtonContainer} onPress={this.saveProfile}>
          <NSLabel style={styles.submitButtonText}>Save</NSLabel>
        </Button>
      </View>
    );
  }
}

export default AdvancedProfile;