import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
    Container,
    Content,
    Header,
    Body,
    Title,
    Left,
    Right,
    Label,
    Thumbnail,
    List,
    ListItem,
    Input,
    Button,
    Icon,
    Text
  } from 'native-base';
import styles from './styles';
import { Actions } from 'react-native-router-flux';
import Filter from '../../../../../common/PLSegmentedControls';
import { getGroupPendingUsers, promoteUserToManager, approveUserToGroup, removeUserFromGroup, unPromoteUserToMember } from '../../../../../actions/groups';
const OPTIONS = ['Pending requests', 'Managers', 'All Users'];
class GroupMembersManagingScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'Pending requests'
        };
        console.log(props);
        this.renderSelected = this.renderSelected.bind(this);
        this.renderPendingUsers = this.renderPendingUsers.bind(this);
        this.renderListOfUsers = this.renderListOfUsers.bind(this);
        props.getGroupPendingUsers(props.group.id);
    }

    renderSelected () {
        if(this.state.selected === 'Pending requests') {
            return this.renderPendingUsers();
        }
        if(this.state.selected === 'Managers') {
            return this.renderListOfUsers();
        }
        if(this.state.selected === 'All Users') {
            return this.renderListOfUsers();
        }
    }

    renderPendingUsers () {
        if(!this.props.loading && this.props.pendingUsers) {
            return (
                <List>
                    {this.returnArrayOfElements(this.props.pendingUsers)}
                </List>
            );
        }
    }

    renderListOfUsers() {
        if(!this.props.loading && this.props.joinedUsers) {
            return (
                <List>
                    {this.returnArrayOfElements(this.props.joinedUsers)}
                </List>
            );
        }
    }

    renderRowActionButtons (user) {
        const { promoteUserToManager, group, approveUserToGroup, removeUserFromGroup, unPromoteUserToMember } = this.props;
        if(user.join_status === 'pending') {
            return (
                <TouchableOpacity onPress={() => approveUserToGroup(group.id, user.id)}>
                    <Icon style={{alignSelf: 'center'}} name='thumbs-up' size={40} color='blue' />
                    <Text>Approve</Text>
                </TouchableOpacity>
            );
        }
        if(user.join_status === 'active' && this.state.selected === 'Managers' && user.user_role === 'member') {
            return (
                <TouchableOpacity onPress={() => promoteUserToManager(group.id, user.id)}>
                    <Icon style={{alignSelf: 'center'}} name='thumbs-up' size={40} color='blue' />
                    <Text>Promote</Text>
                </TouchableOpacity>
            );
        }
        if(user.join_status === 'active' && this.state.selected === 'Managers' && user.user_role === 'manager') {
            return (
                <TouchableOpacity onPress={() => unPromoteUserToMember(group.id, user.id)}>
                    <Icon style={{alignSelf: 'center'}} name='thumbs-down' size={40} color='blue' />
                    <Text>Unpromote</Text>
                </TouchableOpacity>
            );
        }
        if(user.join_status === 'active' && this.state.selected === 'Managers' && user.user_role === 'owner') {
            return (
                <TouchableOpacity>
                    <Icon style={{alignSelf: 'center'}} name='star' size={40} color='blue' />
                    <Text>Owner</Text>
                </TouchableOpacity>
            );
        }
        if(user.join_status === 'active' && this.state.selected === 'All Users') {
            return (
                <TouchableOpacity onPress={() => removeUserFromGroup(group.id, user.id)}>
                    <Icon style={{alignSelf: 'center'}} name='thumbs-down' size={40} color='blue' />
                    <Text>Ban user</Text>
                </TouchableOpacity>
            );
        }
    }

    returnArrayOfElements(array) {
        return array.map(item => {
            return (
                <ListItem>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 40}}>
                        <Text>{item.first_name} {item.last_name}</Text>
                        {this.renderRowActionButtons(item)}
                    </View>
                </ListItem>
            );
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button style={{width: '100%'}}  transparent onPress={() => Actions.pop()}>
                            <Icon active name='arrow-back' style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>Manage Group</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder >
                    <Filter options={OPTIONS} selected={this.state.selected} onSelection={item => this.setState({selected: item})} />
                    <View>
                        {this.renderSelected()}
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapState = (state) => ({
    pendingUsers: state.groupManagement.pending,
    joinedUsers: state.groupManagement.joined,
    loading: state.groupManagement.loading
});

const mapActions = (dispatch) => ({
    getGroupPendingUsers: (groupId) => dispatch(getGroupPendingUsers(groupId)),
    promoteUserToManager: (groupId, userId) => dispatch(promoteUserToManager(groupId, userId)),
    approveUserToGroup: (groupId, userId) => dispatch(approveUserToGroup(groupId, userId)),
    unPromoteUserToMember: (groupId, userId) => dispatch(unPromoteUserToMember(groupId, userId)),
    removeUserFromGroup: (groupId, userId) => dispatch(removeUserFromGroup(groupId, userId))
});

export default connect(mapState, mapActions)(GroupMembersManagingScene);