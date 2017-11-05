import React, { PureComponent, PropTypes } from 'react';
import { Label as NSLabel, Button } from 'native-base';
import { View, Text } from 'react-native';
import { exportReports } from 'PLActions';

import { Label, Input, PopupLabel } from '../components';
import styles from '../styles';

class Reports extends PureComponent {
  static propTypes = {
    groupId: PropTypes.string,
  };

  export = () => {
    const { token, dispatch, groupId } = this.props;

    dispatch(exportReports(token, groupId));
  }

  render() {
    return (
      <View>
        <Button block style={styles.submitButtonContainer} onPress={this.export}>
          <NSLabel style={styles.submitButtonText}>Export Roster</NSLabel>
        </Button>
      </View>
    );
  }
}

export default Reports;