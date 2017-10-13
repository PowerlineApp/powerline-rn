//The Group Selector consists of two parts: 1) The Home Screen Selector Bar (All/Town/State/Country/More) and 2) The More Group Selector Screen which shows all the users groups including town/state/country groups
//The Group Selector provides a shortcut to join a group, which brings user to Group Search / Add Group Screen
//The Group Selector shows each group's name and avatar and a priority zone badge-counter per each item
//https://api-dev.powerli.ne/api-doc#get--api-v2-user-groups
//GH33, GH9


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, Spinner, ListItem, Thumbnail, List, Badge } from 'native-base';
import { View, RefreshControl } from 'react-native';
import { loadUserGroups, clearGroupsInCache, loadActivities,resetActivities } from 'PLActions';
import styles from './styles';

const PLColors = require('PLColors');
const { WINDOW_HEIGHT } = require('PLConstants');

class GroupSelector extends Component {

    static propTypes = {
        token: React.PropTypes.string,
    }

    otherGroups: Array<Object>;
    townGroup: Object;
    stateGroup: Object;
    countryGroup: Object;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isLoadingTail: false,
        };
        this.otherGroups = [];
        this.townGroup = null;
        this.stateGroup = null;
        this.countryGroup = null;
    }

    componentWillMount() {
        const { props: { page, payload } } = this;
        if (page === 0) {
            this.loadInitialGroups();
        }
        else if (payload.length != 0) {
            this.filterGroups(payload);
        }
    }

    componentWillUpdate() {
        const { props: { payload } } = this;
        if (payload.length != 0) {
            this.filterGroups(payload);
        }
    }

    filterGroups(payload) {
        var others = [];
        payload.forEach(function (group) {
            if (group.group_type_label === "local") {
                this.townGroup = group;
            }
            else if (group.group_type_label === "state") {
                this.stateGroup = group;
            } else if (group.group_type_label === "country") {
                this.countryGroup = group;
            }
            else {
                others.push(group);
            }
        }, this);
        this.otherGroups = others;
        console.log(others);
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

    async loadNextGroups() {
        this.setState({ isLoadingTail: true });
        const { props: { token, page, dispatch } } = this;
        try {
            await Promise.race([
                dispatch(loadUserGroups(token, page)),
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
            this.setState({ isLoadingTail: false });
        }
    }

    _onRefresh() {
        this.props.dispatch(clearGroupsInCache());
        this.loadInitialGroups();
    }

    _onEndReached() {
        const { props: { page, count } } = this;
        if (this.state.isLoadingTail === false && count > 0) {
            this.loadNextGroups();
        }
    }

    _renderTailLoading() {
        if (this.state.isLoadingTail === true) {
            return (
                <Spinner color='gray' />
            );
        } else {
            return null;
        }
    }

    //Selecting this should load the Town Group Feed into the Newsfeed tab
    _renderTownGroup() {
        if (this.townGroup) {
            return (
                <ListItem icon style={{ paddingVertical: 5 }}>
                    <Left>
                        <Button style={styles.iconButton}>
                            <Icon active name="pin" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.cellText}>{this.townGroup.official_name}</Text>
                    </Body>
                </ListItem>
            );
        } else {
            return null;
        }
    }

    //Selecting this should load the State Group Feed into the Newsfeed tab
    _renderStateGroup() {
        if (this.stateGroup) {
            return (
                <ListItem icon style={{ paddingVertical: 5 }}>
                    <Left>
                        <Button style={styles.iconButton}>
                            <Icon active name="pin" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.cellText}>{this.stateGroup.official_name}</Text>
                    </Body>
                </ListItem>
            );
        } else {
            return null;
        }
    }
    //Selecting this should load the Country Group Feed into the Newsfeed tab
    _renderCountryGroup() {
        if (this.countryGroup) {
            return (
                <ListItem icon style={{ paddingVertical: 5 }}>
                    <Left>
                        <Button style={styles.iconButton}>
                            <Icon active name="pin" style={styles.icon} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={styles.cellText}>{this.countryGroup.official_name}</Text>
                    </Body>
                </ListItem>
            );
        } else {
            return null;
        }
    }
    //Selecting this should load the appropriate/selected Group Feed into the Newsfeed tab
    //Depending on group, "Newsfeed View" will display or "Conversation View" will display
    //GH45, GH142
    goToGroupFeed(groupId, groupName, avatar,limit){     
        var { dispatch, token } = this.props;
        dispatch({type: 'SET_GROUP', data: {id: groupId, name: groupName, avatar: avatar, limit: limit}});
        
        dispatch(loadActivities(token, 0, 20, groupId));
        Actions.pop();        
        
    }

    //GH142
    goToGroupConversation(){
        Actions.groupConversation();
    }

    render() {

        return (
            <Container style={styles.container}>
                <Header searchBar rounded style={styles.header}>
                    <Left style={{ flex: 0.1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon active name="arrow-back" style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Item style={styles.searchBar}>
                        <Input style={styles.searchInput} placeholder="Search for groups" />
                        <Icon active name="search" />
                    </Item>
                </Header>

                <Content padder
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    onScroll={(e) => {
                        var height = e.nativeEvent.contentSize.height;
                        var offset = e.nativeEvent.contentOffset.y;
                        if ((WINDOW_HEIGHT + offset) >= height && offset > 0) {
                            this._onEndReached();
                        }
                    }}>
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
                        dataArray={this.otherGroups} renderRow={(group) =>
                            <ListItem avatar style={{ paddingVertical: 5 }} onPress={() => this.goToGroupFeed(group.id, group.official_name, group.avatar_file_path, group.conversation_view_limit)} badge>                                
                                <Left style={{position: 'relative'}}>                                
                                    <Thumbnail small source={group.avatar_file_path ? { uri: group.avatar_file_path } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} style={styles.thumbnail} />
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
                            </ListItem>
                        }>
                    </List>
                    {this._renderTailLoading()}
                </Content>
            </Container >
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
    payload: state.groups.payload,
});


export default connect(mapStateToProps)(GroupSelector);
