import React, { Component, PropTypes } from 'react';

import { Text, View, ActivityIndicator } from 'react-native';
import {
  Button,
  Label as NSLabel
} from 'native-base';
import { updateProfileSetup } from '../../../../actions';
import { showToast } from '../../../../utils/toast';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';

class ProfileSetup extends Component {
  static propTypes = {
    group: PropTypes.shape({
      owner: PropTypes.string,
      official_name: PropTypes.string,
      official_description: PropTypes.string,
      official_address: PropTypes.string,
      official_city: PropTypes.string,
      official_state: PropTypes.string,
      official_type: PropTypes.string,
      acronym: PropTypes.string,
    }),
  };

  state = {
    official_name: this.props.group.official_name,
    official_description: this.props.group.official_description,
    official_address: this.props.group.official_address,
    official_city: this.props.group.official_city,
    official_state: this.props.group.official_state,
    official_type: this.props.group.official_type,
    acronym: this.props.group.acronym,
    loading: false
  };

  saveProfile = () => {
    const { token, dispatch, group: { id } } = this.props;
    this.setState({loading: true})

    updateProfileSetup(token, id, this.state).then(r => {
      this.onSuccess();
      console.log(r)
      showToast('Updated with success');
      this.setState({loading: false})
    }).catch(e => {
      this.onFail()
      console.log(e);
      showToast('Something went wrong');
      this.setState({loading: false})
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


  render() {
    const {
      owner,
    } = this.props.group;
    const {
      official_name,
      official_description,
      official_address,
      official_city,
      official_state,
      official_type,
      acronym
    } = this.state;

    return (
      <View>
        <Label>Group Owner:</Label>
        <Text style={styles.inputText}>{owner ? owner.full_name : 'Unknown'}</Text>

        <Label>Group Name</Label>
        <Input
          value={official_name}
          onChangeText={official_name => this.setState({ official_name })}
        />

        <Label>Group Description (optional)</Label>
        <Input
          value={official_description}
          onChangeText={official_description => this.setState({ official_description })}
        />

        <Label>Group Acronym (optional)</Label>
        <Input
          value={acronym}
          onChangeText={acronym => this.setState({ acronym })}
        />

        <Label>Group Type</Label>
        <PopupLabel
          options={["Educational", "Non-Profit (Not Campaign)", "Non-Profit (Campaign)", "Business", "Cooperative/Union", "Other"]}
          onPress={(official_type) => this.setState({ official_type })}
        >{official_type}</PopupLabel>

        <Label>Group Address (optional)</Label>
        <Input
          value={official_address}
          placeholder="Address (optional)"
          onChangeText={official_address => this.setState({ official_address })}
        />

        <Label>City (optional)</Label>
        <Input
          value={official_city}
          placeholder="City (optional)"
          onChangeText={official_city => this.setState({ official_city })}
        />

        <Label>State (optional)</Label>
        <Input
          value={official_state}
          placeholder="State (optional)"
          onChangeText={official_state => this.setState({ official_state })}
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

export default ProfileSetup;