//The Group Selector consists of two parts: 1) The Home Screen Selector Bar (All/Town/State/Country/More) and 2) The More Group Selector Screen which shows all the users groups including town/state/country groups
//The Group Selector provides a shortcut to join a group, which brings user to Group Search / Add Group Screen
//The Group Selector shows each group's name and avatar and a priority zone badge-counter per each item
//https://api-dev.powerli.ne/api-doc#get--api-v2-user-groups
//GH33, GH9


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, ListItem, Thumbnail, List, Badge } from 'native-base';
import { View, RefreshControl, Platform } from 'react-native';
import { loadUserGroups, clearGroupsInCache, loadActivities,resetActivities } from 'PLActions';
import PLOverlayLoader from 'PLOverlayLoader';

import styles from './styles';

const PLColors = require('PLColors');
const { WINDOW_HEIGHT } = require('PLConstants');

class GroupSelector extends Component {

    static propTypes = {
        token: React.PropTypes.string,
    }


    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            // isLoadingTail: false,
        };
    }


    //Shows user's joined groups, including town/state/country groups
    async loadInitialGroups() {
        this.setState({ isLoading: true });
        const { props: { token, dispatch } } = this;
        try {
            await Promise.race([
                dispatch(loadUserGroups(token)),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            }
            else {
                alert('Timed out. Please check internet connection');
            }
            return;
        } finally {
            this.setState({ isLoading: false });
        }
    }

    // async loadNextGroups() {
    //     this.setState({ isLoadingTail: true });
    //     const { props: { token, page, dispatch } } = this;
    //     try {
    //         await Promise.race([
    //             dispatch(loadUserGroups(token, page)),
    //             timeout(15000),
    //         ]);
    //     } catch (e) {
    //         const message = e.message || e;
    //         if (message !== 'Timed out') {
    //             alert(message);
    //         }
    //         else {
    //             alert('Timed out. Please check internet connection');
    //         }
    //         return;
    //     } finally {
    //         this.setState({ isLoadingTail: false });
    //     }
    // }

    _onRefresh() {
        this.props.dispatch(clearGroupsInCache());
        this.loadInitialGroups();
    }

    // _onEndReached() {
    //     const { props: { page, count } } = this;
    //     if (this.state.isLoadingTail === false && count > 0) {
    //         this.loadNextGroups();
    //     }
    // }

    //Selecting this should load the Town Group Feed into the Newsfeed tab
    _renderTownGroup() {
        if (this.props.town !== 'Town') {
            let group = this.props.groupList.find(group => group.official_name === this.props.town)
            console.log('Town', group)
            return (
            <ListItem icon style={{ paddingVertical: 5 }} onPress={() => this.goToGroupFeed(group)} >
                    <Left>
                        <Button style={styles.iconButton}>
                            <Icon active name="pin" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.cellText}>{this.props.town}</Text>
                    </Body>
                </ListItem>
            );
        } else {
            return null;
        }
    }

    //Selecting this should load the State Group Feed into the Newsfeed tab
    _renderStateGroup() {
        if (this.props.state !== 'State') {
            let group = this.props.groupList.find(group => group.official_name === this.props.state)
            console.log('State', group)
            return (
                    <ListItem icon style={{ paddingVertical: 5 }} onPress={() => this.goToGroupFeed(group)} >
                    <Left>
                        <Button style={styles.iconButton}>
                            <Icon active name="pin" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.cellText}>{this.props.state}</Text>
                    </Body>
                </ListItem>
            );
        } else {
            return null;
        }
    }
    //Selecting this should load the Country Group Feed into the Newsfeed tab
    _renderCountryGroup() {
        if (this.props.country !== 'Country') {
            let group = this.props.groupList.find(group => group.official_name === this.props.country)
            console.log('Country', group)
            return (
                <ListItem icon style={{ paddingVertical: 5 }} onPress={() => this.goToGroupFeed(group)} >
                    <Left>
                        <Button style={styles.iconButton}>
                            <Icon active name="pin" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.cellText}>{this.props.country}</Text>
                    </Body>
                </ListItem>
            );
        } else {
            return null;
        }
    }

    renderGroupItem(group){
        return (
            <ListItem avatar style={{ paddingVertical: 5 }} onPress={() => this.goToGroupFeed(group)} badge>                                
                <Left style={{position: 'relative'}}>                                
                    <Thumbnail small source={group.avatar_file_path ? { uri: group.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} style={styles.thumbnail} />
                    {group.priority_item_count!=0?
                    <Badge style={{position: 'absolute', bottom: 0, right: -5, height: 18, paddingLeft: 3, paddingRight: 3, paddingTop: 1.7, paddingBottom: 1.7}}>
                        <Text style={{fontSize: 11, lineHeight: 14, textAlign: 'center'}}>
                        {group.priority_item_count}
                        </Text>
                    </Badge>:null}
                </Left>
                <Body>
                    <Text style={styles.cellText}>{group.official_name}</Text>
                </Body>
        </ListItem>);
    }

    //Selecting this should load the appropriate/selected Group Feed into the Newsfeed tab
    //Depending on group, "Newsfeed View" will display or "Conversation View" will display
    //GH45, GH142
    goToGroupFeed(group){
        let {id, official_name, avatar_file_path, conversation_view_limit, total_members} = group;
        // console.log(groupId, groupName, avatar, limit)     
        var { dispatch, token } = this.props;
        dispatch({type: 'SET_GROUP', data: {id, name: official_name, avatar: avatar_file_path, limit: conversation_view_limit, totalMembers: total_members, conversationView: total_members < conversation_view_limit}});
        
        dispatch(loadActivities(token, 0, 20, id));
        Actions.pop();        
        
    }

    //GH142
    goToGroupConversation(){
        Actions.groupConversation();
    }

    render() {
        console.log(this.props.groupList, this.props)
        const { isLoading, isRefreshing } = this.state;
        return (
            <Container style={styles.container}>
                <Header searchBar rounded style={styles.header}>
                    <Left style={{ flex: 0.1 }}>
                        <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                            <Icon active name="arrow-back" style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Item style={styles.searchBar}>
                        <Input style={styles.searchInput} placeholder="Search for groups" />
                        <Icon active name="search" />
                    </Item>
                </Header>

                <Content padder
                    refreshControl={Platform.OS === 'android' &&
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    onScroll={(e) => {
                        var offset = e.nativeEvent.contentOffset.y;
                        if (Platform.OS === 'ios' && offset < -3) {
                            this._onRefresh();
                        }
                    }}
                >
                    <ListItem itemHeader first style={{ borderBottomWidth: 0 }}>
                        <Left>
                            <Text style={styles.titleText}>Choose Group</Text>
                        </Left>
                        <Right>
                            <Button small iconLeft transparent style={{ alignSelf: 'flex-end', width: 100 }}>
                                <Icon name="ios-add-circle" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>ADD GROUP</Text>
                            </Button>
                        </Right>
                    </ListItem>
                    {this._renderTownGroup()}
                    {this._renderStateGroup()}
                    {this._renderCountryGroup()}
                    <List
                        dataArray={this.props.others} renderRow={(group) => this.renderGroupItem(group)}>
                    </List>
                </Content>
                <PLOverlayLoader visible={isLoading || isRefreshing} logo />
            </Container>
        );
    }
}

async function timeout(ms: number): Promise {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

const mapStateToProps = state => ({
    token: state.user.token,
    page: state.groups.page,
    count: state.groups.items,
    others: state.groups.others,
    town: state.groups.town,
    state: state.groups.state,
    country: state.groups.country,
    groupList: state.groups.payload
});


export default connect(mapStateToProps)(GroupSelector);
