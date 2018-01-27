import React, { Component, PropTypes } from 'react';
import { Label as NSLabel, Button } from 'native-base';
import { View, Text, ActivityIndicator } from 'react-native';
import { exportReports } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';
import { showToast } from '../../../../utils/toast';

class Reports extends Component {
  state = {
    loaidng: false
  }
  static propTypes = {
    groupId: PropTypes.string,
  };

  onSuccess = () => {
    this.setState({loading: false});
    showToast('Update success!')

  } 
onFail = () => {
    this.setState({loading: false});
    showToast('Update failed')
} 


  export = async () => {
    const { token, dispatch, groupId } = this.props;
    let cb = {onSucces: this.onSuccess, onFail: this.onFail}
    this.setState({loading: true})

    let reports = await exportReports(token, groupId, cb);

    this.setState({loading: false})
  }


  render() {
    return (
      <View>
        {
          this.state.loading
          ? <ActivityIndicator style={{marginTop: 20, marginBottom: 12}} color={'#020860'} animating={this.state.loading} /> 
          : <Button block style={styles.submitButtonContainer} onPress={this.export}>
              <NSLabel style={styles.submitButtonText}>Export Roster</NSLabel>
            </Button>
        }
      </View>
    );
  }
}

export default Reports;