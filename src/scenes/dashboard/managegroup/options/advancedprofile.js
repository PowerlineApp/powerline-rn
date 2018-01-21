import React, { Component, PropTypes } from 'react';

import { Text, View, ActivityIndicator } from 'react-native';
import {
  Button,
  Label as NSLabel
} from 'native-base';
import { updateProfileSetup, getGroupAdvancedAttributes, groupAdvancedAttribsInputChange, updateGroupAdvancedAttributes } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';
import { showToast } from '../../../../utils/toast';

class AdvancedProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false
        }
        this.inputChange = this.inputChange.bind(this)
    }
  componentWillMount() {
    const { token, dispatch, group: { id } } = this.props;
    dispatch(getGroupAdvancedAttributes(id))
  }

  onSuccess = () => {
      this.setState({loading: false});
      showToast('Update success!')

    } 
  onFail = () => {
      this.setState({loading: false});
      showToast('Update failed')
  } 

  saveProfile = () => {
    const { data, group: { id }, dispatch, loading } = this.props;
    let cb = {onSucces: this.onSuccess, onFail: this.onFail}
    this.setState({loading: true})

    dispatch(updateGroupAdvancedAttributes(id, data, cb));
  }

  inputChange(key, prop) {
    const {dispatch} = this.props;
    dispatch(groupAdvancedAttribsInputChange({key, prop}))
  }
  
  render() {
    console.log('props on advanced profile', this.props)
    return (
      <View>
        <Label>Welcome Message (optional)</Label>
        <Input
            value={this.props.data ? this.props.data.welcome_message : ''}
            onChangeText={text => this.inputChange('welcome_message', text)}
        />

        <Label>Welcome Video (optional)</Label>
        <Input
            value={this.props.data ? this.props.data.welcome_video : ''}
          onChangeText={text => this.inputChange('welcome_video', text)}
        />
        {
          this.state.loading
          ? <ActivityIndicator style={{marginTop: 20, marginBottom: 12}} color={'#020860'} animating={this.state.loading} /> 
          : <Button block style={styles.submitButtonContainer} onPress={this.saveProfile}>
                <NSLabel style={styles.submitButtonText}>Save</NSLabel>
            </Button>
        }
      </View>
    );
  }
}

export default AdvancedProfile;