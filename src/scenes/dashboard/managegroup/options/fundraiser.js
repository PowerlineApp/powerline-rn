import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
import { Label, Input, PopupLabel } from '../components';
import { Actions } from 'react-native-router-flux';
import { groupGetBankAccounts, groupCreateBankAccount, groupDeleteBankAccount } from 'PLActions';

import styles from '../styles';

class FundRaiser extends Component {
    componentDidMount() {
        const { group, getGroupAccounts } = this.props;
        getGroupAccounts(group.id);
    }

    render() {
        let hasAccount = this.props.accounts && this.props.accounts.length > 0;
        return (
            <View>
                {
                    hasAccount === 0 && 
                    <Text>In order to send fundraisers to your group you must provide a bank account first</Text>
                }
                <Button block style={styles.submitButtonContainer} onPress={() => Actions.groupBankAccountScene({group: this.props.group})}>
                    <NSLabel style={styles.submitButtonText}>{ hasAccount ? 'Manage Bank Account' : 'Add Bank Account'}</NSLabel>
                </Button>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    accounts: state.groupManagement.bankAccounts,
    loading: state.groupManagement.bankAccountsLoading
});

const mapDispatchToProps = (dispatch) => ({
    getGroupAccounts: (groupId) => dispatch(groupGetBankAccounts(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FundRaiser);