import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
import { View, Text, ActivityIndicator } from 'react-native';
import { Label, Input, PopupLabel } from '../components';
import { Actions } from 'react-native-router-flux';
import { groupGetBankAccounts, groupCreateBankAccount, groupDeleteBankAccount } from '../../../../actions';

import styles from '../styles';
import { showToast } from '../../../../utils/toast';

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
                    <Text>Setup a bank account to send fundraisers. We charge a small fee per transaction only on what you collect!</Text>
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