import React, { Component, PropTypes } from 'react';

import { Text, View } from 'react-native';
import {
  Button,
  Icon,
  Label as NSLabel
} from 'native-base';
import _ from 'lodash';
import {
  updateMembershipControl,
  getMembershipFields,
  addMembershipField,
  deleteMembershipField,
} from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';
import { showToast } from '../../../../utils/toast';

const membershipControlOptions = [
  { name: 'Public (Open to all)', value: 'public' },
  { name: 'Approval (User is approved by group leader)', value: 'approval' },
  { name: 'Passcode (User must provide correct passcode to enter)', value: 'passcode' }
];

class MembershipControl extends Component {
  static propTypes = {
    group: PropTypes.shape({
      id: PropTypes.number,
      membership_control: PropTypes.string,
    }),
  };

  state = {
    control: this.props.group.membership_control,
    passcode: '',
    fields: [],
    newField: '',
  };

  componentDidMount() {
    const { token, group: { id } } = this.props;
    getMembershipFields(token, id)
      .then(fields => {
        this.setState({ fields })
      });
  }


  getTitle(value) {
    const result = membershipControlOptions.find(control => control.value === value);

    return result.name;
  }

  isControlSettingsChanged = () => {
    const { membership_control: beforeControl } = this.props.group;
    const { control: nextControl, passcode } = this.state;

    if (nextControl === 'passcode') {
      return passcode !== '';
    }
  
    return beforeControl !== nextControl;
  }

  saveControl = async () => {
    const { token, group: { id }, dispatch } = this.props;
    const { control, passcode } = this.state;
    if (control === 'passcode' && passcode === '') {
      alert('Input passcode first and try again');
      return;
    }
  
    updateMembershipControl(token, id, control, passcode).then(r => {
      console.log('r => ', r)
      showToast('Updated with success')
      // this.props.updateGroup();
    }).catch(e => {
      console.log(e);

    });
  }

  setField = (newFieldName, id) => {
    this.setState({
      fields: this.state.fields.map(value => {
        if (id === value.id) {
          return {
            id,
            field_name: newFieldName
          };
        }

        return value;
      })
    });
  }

  removeField = async (id) => {
    const { token } = this.props;
    const response = await deleteMembershipField(token, id);
    if (response.status === 204 && response.ok) {
      this.setState({
        fields: this.state.fields.filter(field => field.id !== id)
      });
    } else {
      alert('Something wrong. Try again');
    }
  }

  addField = async () => {
    const { token, group: { id } } = this.props;
    const { newField } = this.state;
    if (newField === '') {
      alert('Input text before add and try again');
      return;
    }

    const response = await addMembershipField(token, id, newField);
    if (response.id) {
      this.setState({ fields: this.state.fields.concat(response), newField: '' });
    } else {
      alert('Something wrong. Try again');
    }
  }

  render() {
    const {
      control,
      passcode,
      fields,
      newField,
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
            maxLength={255}
            value={passcode}
            placeholder="Type passcode here"
            onChangeText={passcode => this.setState({ passcode })}
          />
        }
        {
          this.isControlSettingsChanged() &&
          <Button block style={styles.submitButtonContainer} onPress={this.saveControl}>
            <NSLabel style={styles.submitButtonText}>Save</NSLabel>
          </Button>
        }
        {
          fields.length === 0
            ?
            <Label small>There are currently no fields users are required to fill in when joining this group.</Label>
            :
            <Label small>Users are required to answer these questions in order to join the group:</Label>
        }
        {
          fields.map(field => (
            <View style={styles.membershipInputContainer}>
              <Input
                disabled
                style={styles.membershipInput}
                value={field.field_name}
                placeholder="Type something here"
                onChangeText={newFieldName => this.setField(newFieldName, field.id)}
              />
              <Button transparent style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.removeField(field.id)}>
                <Icon
                  name="md-close-circle"
                  style={styles.membershipDeleteIcon}
                />
              </Button>
            </View>
          ))
        }
        <View style={styles.memebershipAddContainer}>
          <Input
            style={styles.membershipInput}
            value={newField}
            placeholder="Add Required Field for Entry"
            onChangeText={newField => this.setState({ newField })}
          />
          <Button transparent onPress={() => this.addField()}>
            <Icon
              name="md-add-circle"
              style={styles.membershipAddIcon}
            />
          </Button>
        </View>
      </View>
    );
  }
}

export default MembershipControl;