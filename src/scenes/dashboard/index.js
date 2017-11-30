// This is the Home Screen (GH7). It consists of the burger menu, search bar, Group Selector (GH9), and 4 tabs: Newsfeed (GH13), Friends Feed (GH51), Messages (NA), and Notifications Feed (GH37). The option to create new content (GH8) is also on this screen.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Title, Content, Button, Footer, FooterTab, Text, Body, Left, Right, Icon, Item, Input, Grid, Row, Col, Badge, Label } from 'native-base';

import { View, Image, Keyboard, FlatList, AsyncStorage, Alert, Platform, InteractionManager } from 'react-native';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

import {
    loadUserProfile,
    loadActivities,
    registerDevice,
    acceptFollowers,
    unFollowers,
    search,
    getActivities,
    getFollowers,
    votePost,
    joinGroup,
    signUserPetition,
    unsubscribeFromPoll,
    unsubscribeFromPost,
    unsubscribeFromPetition,
    getComments,
    loadUserGroups,
    getGroups
} from 'PLActions';


// Tab Scenes
//GH13 - Newsfeed / Standard Item Container / Same for Group Feed
import Newsfeed from './newsfeed/'
//GH51 - Friends Feed ("posts by friends")
import Friendsfeed from './friendsfeed/';
import Messages from './messages/';
import Notifications from './notifications/';

const { SlideInMenu } = renderers;
import ShareExtension from 'react-native-share-extension';
import OneSignal from 'react-native-onesignal';
var DeviceInfo = require('react-native-device-info');
var { MixpanelToken } = require('../../PLEnv');
var Mixpanel = require('react-native-mixpanel');

const isIOS = Platform.OS === 'ios';

const FooterTabButton = ({ badge = 0, active, onPress, name, title }) => {
    const buttonProps = {
        style: styles.containerTabButton,
        active,
        onPress
    };

    const BudgeButton = ({ children }) => <Button badge {...buttonProps}>{children}</Button>;
    const NormalButton = ({ children }) => <Button {...buttonProps}>{children}</Button>;

    let content = null;
    if (badge > 0) {
        content = (
            <BudgeButton>
                <Badge><Text>{badge}</Text></Badge>
                <Icon active={active} name={name} />
                <Text numberOfLines={1} style={styles.tabText}>{title}</Text>
            </BudgeButton>
        );
    } else {
        content = (
            <NormalButton>
                <Icon active={active} name={name} />
                <Text numberOfLines={1} style={styles.tabText}>{title}</Text>
            </NormalButton>
        );
    }

    if (isIOS) {
        return content;
    }

    return (
        <View style={[styles.containerTabButton, styles.borderTop]}>
            {content}
        </View>
    );
};

const optionsRenderer = options => (
    <FlatList
        data={options.props.children}
        renderItem={({ item }) => React.cloneElement(item, {
            onSelect: options.props.onSelect
        })}
    />
)

class Home extends Component {
    static propTypes = {
        openDrawer: React.PropTypes.func,
    }

    constructor(props) {
        super(props);
        if (props.notification) {
            this.state = {
                tab1: false,
                tab2: false,
                tab3: false,
                tab4: true,
                group: 'all',
                search: ''
            };
        } else {
            this.state = {
                tab1: true,
                tab2: false,
                tab3: false,
                tab4: false,
                group: 'all',
                search: ''
            };
        }

        this.onIds = this.onIds.bind(this);
        this.onOpened = this.onOpened.bind(this);
        this.onReceived = this.onReceived.bind(this);
        this.onRegistered = this.onRegistered.bind(this);
    }

    componentWillMount() {
        const { props: { profile, token, dispatch } } = this;
        
        OneSignal.configure();
        
        // When user logs in, the device subscription is set to True to allow for notifications. If false, device cannot receive notifications
        OneSignal.setSubscription(true);
        OneSignal.enableSound(true);
        OneSignal.enableVibrate(true);
        
        OneSignal.addEventListener('ids', this.onIds);
        
        OneSignal.addEventListener('opened', this.onOpened);

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('registered', this.onRegistered);
        
        if (!profile) {
            this.loadCurrentUserProfile();
        }

    }

    componentDidMount() {
        getGroups(this.props.token)
            .then(data => {
                this.props.dispatch([{
                    type: 'LOADED_GROUPS',
                    data: { payload: data.payload }
                }, {
                    type: 'SET_NEWSFEED_COUNT',
                    count: data.payload.reduce((a, b) => a += b.priority_item_count, 0),
                }]);
            });

            ShareExtension.data().then((data) => {
                // console.log('SHARE EXTENSION DATA: ', data);
                if (data.type != "" && data.value != "") {
                        Actions.newpost({ data: data, sharing: true, onPost: () => ShareExtension.close()});
                }
            });
    }

    onReceived(data) {
        // console.log('received: ', data);
    }

    onRegistered(data) {
        console.log('/this registered :', data);
        // OneSignal.removeEventListener()
    }

    async verifyProfile(data){
        // console.log('Im here...');
        // await AsyncStorage.setItem('freshRegister', 'true'); // for testing.
        AsyncStorage.getItem('freshRegister').then(item => {
            // if (item === 'true'){
                Alert.alert('Verify now?', 'Your profile is only 50% complete.', [
                    // missing: configure action buttons for these.
                    {text: "Verify", onPress: () => Actions.verifyProfile()}, 
                    {text: "Later", onPress: () => {
                        let h_48 = (48 * 1000 * 60 * 60);
                        OneSignal.postNotification({
                            'en': 'Finish your registration!'
                        }, {send_after: (new Date().getTime() + (48 * 1000 * 60 * 60) )}, data.userId)
                    }}
                ])
            // }
        });
        AsyncStorage.setItem('freshRegister', 'false');
    }

    onIds(data) {
        console.log('/this idsss', data);
        var { token } = this.props;
        AsyncStorage.setItem('pushId', data.userId);

        this.verifyProfile(data);

        var params = {
            id: data.userId,
            identifier: DeviceInfo.getUniqueID(),
            timezone: (new Date()).getTimezoneOffset() * 60,
            version: DeviceInfo.getVersion(),
            os: DeviceInfo.getSystemName(),
            model: DeviceInfo.getModel(),
            type: Platform.OS
        };

        // Device needs to be registered with Powerline backend after token received from OneSignal
        registerDevice(token, params)
            .then(data => {
                console.log('REGISTER RESPONSE', data);
            })
            .catch(err => {
                console.log('REGISTER ERROR', err);
            });
    }

    // redirect(item, options = {}) {
    //     console.log('===>', item, '====>', options);
    //     // return;
    //     item = item.notification.payload.additionalData.entity.target;
    //     // let type = 'poll';
    //     // if (item.type == 'post') {
    //     //     type = 'post'
    //     // } else if (item.type == 'user-petition') {
    //     //     type = 'petition'
    //     // }

    //     // console.log('about to go: ', type, item.id)
    //     Actions.itemDetail({ entityType: item.type, entityId: item.id, ...options });
    // }
    itemDetail(notification, options) {
        // return;
        console.log(notification);
        let item = notification.additionalData.entity.target;

        Actions.itemDetail({ entityType: item.type, entityId: item.id, ...options });
    }

    redirect(type, notification, options = {}){
        console.log('redirect', type, notification, options)
        switch(type){
            case 'join-to-group-approved':
                Actions.groupprofile({id: notification.additionalData.entity.target.id});
                break;
            case 'comment-mentioned':
            case 'post-mentioned':
            case 'own-post-commented':
            case 'own-post-voted':
            case 'own-user-petition-signed':
                this.itemDetail(notification, options);
                break;
            case 'follow-request':
                Actions.myInfluences()
        }        
    }


    // these are the action buttons actions
    _signPetition(token, data) {
        let { target } = data.notification.payload.additionalData.entity;

        signUserPetition(token, target.id).then(res => console.log(res));
    }
    _mutePetition(token, data) {
        let { target } = data.notification.payload.additionalData.entity;

        unsubscribeFromPetition(token, target.id).then(ans => console.log(ans));
    }
    _openComment(token, data) {
        let { target } = data.notification.payload.additionalData.entity;
        // What is this Felipe?
        // this is to be changed!!! the commentDetail component doesnt accept an id, but the comment object, so I must do this!
        let comment = getComments(token, target.type, target.id).then(
            res => {
                Actions.commentDetail({
                    comment: res.comments.find(comment => comment.id === target.comment_id),
                    entityType: target.type,
                    entityId: target.id
                });
            }
        );
    }
    _approveFollowRequest(token, data, dispatch) {
        acceptFollowers(token, data.notification.payload.additionalData.entity.target.id).then((ret) => {
            dispatch({ type: 'RESET_FOLLOWERS' });
            getFollowers(token, 1, 20).then(ret1 => {
                dispatch({ type: 'LOAD_FOLLOWERS', data: ret1 });
            }).catch(err => {

            });
            Actions.myInfluences();
        }).catch(err => {
            console.log(err);
        });
    }
    _ignoreFollowRequest(token, data, dispatch) {
        unFollowers(token, data.notification.payload.additionalData.entity.target.id).then((ret) => {
            dispatch({ type: 'RESET_FOLLOWERS' });
            getFollowers(token, 1, 20).then(ret1 => {
                dispatch({ type: 'LOAD_FOLLOWERS', data: ret1 });
            }).catch(err => {

            });
            Actions.myInfluences();
        }).catch(err => {

        });
    }
    _upvotePost(token, data) {
        let { target } = data.notification.payload.additionalData.entity;
        votePost(token, target.id, 'upvote');
    }
    _downvotePost(token, data) {
        let { target } = data.notification.payload.additionalData.entity;
        votePost(token, target.id, 'downvote');
    }
    _sharePost(token, data) {
        //What is this Felipe? Why is this todo?
        // TODO 
    }
    _mutePost(token, data) {
        let { target } = data.notification.payload.additionalData.entity;
        unsubscribeFromPost(token, target.id);
    }
    _joinGroup(token, data) {
        let groupId = data.notification.payload.additionalData.entity.target.id;
        joinGroup(token, groupId);
    }
    _mutePoll(token, data) {
        let { target } = data.notification.payload.additionalData.entity;
        unsubscribeFromPoll(token, target.id);
    }
    _shareAnnouncement(token, data) {
        // TODO
        // console.log('shareAnnouncement', token, data);
    }

    _rspv(data) {
        this.redirect(data);
    }




/*
{
   "notification": {
      "payload": {
         "additionalData": {
            "entity": {
               "target": {
                  "type": "post",
                  "id": 1043,
                  "preview": "@Zxc6"
               },
               "id": 6428
            },
            "user": {
               "username": "Zxc6",
               "id": 146
            },
            "type": "post-mentioned"
         },
         "actionButtons": [
            {
               "icon": "ic_civix_open",
               "text": "Open",
               "id": "open-post-button"
            },
            {
               "icon": "ic_civix_ignore",
               "text": "Ignore",
               "id": "ignore-button"
            }
         ]
      }
   },
   "action": {
      "type": 0
   }
}


{
   "notification": {
      "payload": {
         "additionalData": {
            "entity": {
               "target": {
                  "type": "post",
                  "id": 1043
               },
               "id": 6429
            },
            "user": {
               "username": "Zxc6",
               "id": 146
            },
            "type": "follow-post-created",
         },
         "actionButtons": [
            {
               "icon": "ic_civix_upvote",
               "text": "Upvote",
               "id": "upvote-post-button"
            },
            {
               "icon": "ic_civix_downvote",
               "text": "Downvote",
               "id": "downvote-post-button"
            }
         ],
      },
   },
   "action": {
      "type": 1,
      "actionID": "upvote-post-button"
   }
}


    */

    onOpened(data) {
        console.log('OPENED', data);
        
        let { token, dispatch } = this.props;
        let {type} = data.notification.payload.additionalData;
        let actionButton = data.action.actionID;

        if (!actionButton) {
            this.redirect(type, data.notification.payload);
            return;
        }

        // switch(type){
        //     case 'join-to-group-approved':
        //         Actions.groupprofile({id: notification.group.id});
        //         break;
        //     case 'comment-mentioned':
        //     case 'post-mentioned':
        //     case 'own-post-commented':
        //     case 'own-user-petition-signed':
        //         this.itemDetail(notification, options);
        //         break;
        //     case 'follow-request':
        //         Actions.myInfluences()

        // }

        switch (actionButton) {
            // these simply do nothing
            case 'ignore-button':
            case 'ignore-invite-button':
                break;
            // all of the above just redirect
            case 'view-petition-button':
            case 'open-post-button':
            case 'open-poll-button':
            case 'view-post-button':
            case 'open-group-button':
            case 'respond-button':
            case 'view-poll-button':
                this.redirect(type, data.notification.payload);
                break;
            case 'reply-comment-button':
                this.redirect(type, data.notification.payload, {commenting: true, commentText: '@' + data.notification.payload.additionalData.user.username});
                break;
            case 'open-comment-button':
                this._openComment(token, data);
                break;

            case 'sign-petition-button':
                this._signPetition(token, data);
                break;
            case 'mute-petition-button':
                this._mutePetition(token, data);
                break;
            case 'approve-follow-request-button':
                this._approveFollowRequest(token, data, dispatch);
                break;
            case 'ignore-follow-request-button':
                this._ignoreFollowRequest(token, data, dispatch);
                break;
            case 'upvote-post-button':
                this._upvotePost(token, data);
                break;
            case 'downvote-post-button':
                this._downvotePost(token, data);
                break;
            case 'share-post-button':
                this._sharePost(token, data);
                break;
            // own post boosted and own post commented, follow post commented, own post voted
            case 'mute-post-button':
                this._mutePost(token, data);
                break;
            // invite
            case 'join-group-button':
                this._joinGroup(token, data);
                break;
            case 'mute-poll-button':
                this._mutePoll(token, data);
                break;
            // announcement
            case 'share-announcement-button':
                this._shareAnnouncement(token, data);
                break;
            case 'rsvp-button':
                this.rspv(data);
                break;
            default:
                this.redirect(data);
        }
    }

    async loadCurrentUserProfile() {
        const { props: { token, dispatch } } = this;
        try {
            await Promise.race([
                dispatch(loadUserProfile(token)),
                timeout(15000)
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            } else {
                alert('Timed out. Please check internet connection');
            }
        } finally {
        }
    }

    // Newsfeed Tab
    toggleTab1() {
        this.setState({
            tab1: true,
            tab2: false,
            tab3: false,
            tab4: false
        });
        Mixpanel.track("Newsfeed tab selected");
    }

    // Friends Feed Tab
    toggleTab2() {
        this.setState({
            tab1: false,
            tab2: true,
            tab3: false,
            tab4: false
        });
        Mixpanel.track("Friends Feed tab selected");
    }

    // Messages Tab
    toggleTab3() {
        this.setState({
            tab1: false,
            tab2: false,
            tab3: true,
            tab4: false
        });
        Mixpanel.track("Messages tab selected");
    }

    // Notifications Feed Tab
    toggleTab4() {
        this.setState({
            tab1: false,
            tab2: false,
            tab3: false,
            tab4: true
        });
        Mixpanel.track("Notifications tab selected");
    }

    // JC: I believe this loads to the group feed when a group is selected from Group Selector More menu
    selectGroup(group){
        console.log('SELECTED GROUP', group)
        var { token, dispatch } = this.props;
        if (group == 'all') {
            dispatch({ type: 'RESET_ACTIVITIES' });
            dispatch({type: 'SET_GROUP', data: {id: 'all', header: 'all'}})
            // dispatch(loadActivities(token, 0, 20, 'all'));
        } else {
            let groupObj = this.props.groupList.find(groupObj => groupObj.group_type_label === group);
            if (!groupObj) return;
            console.log('SELECTED GROUP', groupObj)
            

            let {id, official_name, avatar_file_path, conversation_view_limit, total_members, user_role} = groupObj;
            dispatch({type: 'SET_GROUP', data: {header: group, user_role, id, name: official_name, avatar: avatar_file_path, limit: conversation_view_limit, totalMembers: total_members, conversationView: total_members < conversation_view_limit}});
            // dispatch(loadActivities(token, 0, 20, id));
        }
        this.setState({ group: group });
    }

    // This is the menu to create new content (GH8)
    selectNewItem(value) {
        let {selectedGroup} = this.props;
        console.log('selected group ==> ', selectedGroup)
        this.bottomMenu.close();
        if (value === 'post'){
            Actions.newpost({group: selectedGroup.group});
        } else if (value === 'petition'){
            Actions.newpetition({group: selectedGroup.group});
        } else {
            Actions.newleadercontent({contentType: value, group: selectedGroup.group});
        }
        // switch(value){
        //     case 'post':
        //         break;
        //     case 'petition':
        //         break;
        //     case 'group_announcement':
        //         Actions.newgroupannouncement();
        //         break;
        //     case 'group_petition':
        //         Actions.newgrouppetition();
        //         break;
        //     case 'group_poll':
        //         Actions.newgrouppoll();
        //         break;
        //     case 'group_event':
        //         Actions.newgroupevent();
        //         break;
        //     case 'group_fundraiser':
        //         Actions.newgroupfundraiser();
        //         break;
        //     default:
        // }
    }

    onRef = r => {
        this.bottomMenu = r;
    }

    // Tapping the "More" button should open the Group Selector which lists all groups the user is joined to
    goToGroupSelector() {
        this.setState({
            group: 'more'
        });
        Actions.groupSelector();
    }

    renderSelectedTab() {
        if (this.state.tab1) {
            return <Newsfeed />;
        } else if (this.state.tab2) {
            return <Friendsfeed />;
        } else if (this.state.tab3) {
            return <Messages />;
        } else if (this.state.tab4) {
            return <Notifications />;
        } else {
            return (
                <View style={{ flex: 1 }} />
            );
        }
    }

    //Badge for activities should appear on the Newsfeed icon tab in the lower-left
    //The count represents the number of Priority zone items. Priority zone items include:
    //Leader content (new polls, fundraisers, events, discussions, petitions) and 'boosted' user posts and user petitions
    //All priority zone items arrive to all group members with a push notification alert

    showBadgeForActivities() {
        // var count = 0;
        // for(var i = 0; i < this.props.activities.length; i++){
        //   if(this.props.activities[i].zone == 'non_prioritized'){
        //     count++;
        //   }
        // }

        // return count;
        // WARN('COUNUNTONSODFJSODJF', this.props.newsfeedUnreadCount)
        return this.props.newsfeedUnreadCount;
    }

    //This is the search bar for GH43. When user enters text, it should automatically display search results (defaulting to group results) for that query
    onChangeText = (text) => {
        this.setState({
            search: text
        });

        if (text.length >= 2) {
            this.onSearch(text);
        }
    }

    onSearch(search) {
        Actions.search({ search });
    }

    renderMenuOptions(group){
        console.log('SELECTED GROUP', group);
        let options = [
            <MenuOption value={'petition'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('petition'); Mixpanel.track("Opened New User Petition Form");}}>
                    <Icon name="ios-clipboard" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Petition</Text>
                </Button>
            </MenuOption>,
            <MenuOption value={'post'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('post'); Mixpanel.track("Opened New Post Form");}}>
                    <Icon name="ios-flag" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Post</Text>
                </Button>
            </MenuOption>
        ]
        if (group && (group.group === 'all' || group.user_role === 'owner' || group.user_role === 'manager'))
        options.unshift(
            // <MenuOption value={'group_announcement'}>
            //     <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_announcement'); Mixpanel.track("Opened New Announcement Form");}}>
            //         <Icon name="volume-up" style={styles.menuIcon} />
            //         <Text style={styles.menuText}>New Group Announcement</Text>
            //     </Button>
            // </MenuOption>,
            <MenuOption value={'group_fundraiser'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_fundraiser'); Mixpanel.track("Opened New Fundraiser Form");}}>
                    <Icon name="ios-cash" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Fundraiser</Text>
                </Button>
            </MenuOption>,
            <MenuOption value={'group_event'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_event'); Mixpanel.track("Opened New Event Form");}}>
                    <Icon name="ios-calendar" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Event</Text>
                </Button>
            </MenuOption>,
            <MenuOption value={'group_petition'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_petition'); Mixpanel.track("Opened New Group Petition Form");}}>
                    <Icon name="ios-clipboard" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Petition</Text>
                </Button>
            </MenuOption>,
            <MenuOption value={'group_discussion'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_discussion'); Mixpanel.track("Opened New Discussion Form");}}>
                    <Icon name="ios-chatbubbles" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Discussion</Text>
                </Button>
            </MenuOption>,
            <MenuOption value={'group_poll'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_poll'); Mixpanel.track("Opened New Poll Form");}}>
                    <Icon name="ios-stats" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Poll</Text>
                </Button>
            </MenuOption>
        )

        return  options;
    }
    
    render() {
        let {selectedGroup} = this.props;
        //       return (
            // <Container>
            //           <Header searchBar rounded style={styles.header}>
        //             <Left style={{ flex: 0.1 }}>
        //               <Button transparent onPress={this.props.openDrawer}>
        //                 <Icon active name="menu" style={{ color: 'white' }} />
        //               </Button>
        //             </Left>
        //             {this.state.tab2!=true && this.state.tab4!=true?
        //             //We need to make this placeholder text a little brighter/whiter
        //             <Item style={styles.searchBar}>
        //               <Input style={styles.searchInput} placeholder="Search groups, people, topics" autoCorrect={false} spellCheck={false} /*onEndEditing={() => this.onSearch()}*/ onChangeText={(text) => this.onChangeText(text)}/>
        //               <Icon active name="search" onPress={() => this.onSearch(this.state.search)} />
        //             </Item>:
        //             null}
        //           </Header>
        //           </Container>
        //       );
        
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container>
                    <Header searchBar rounded style={styles.header}>
                        <Left style={{ flex: 0.1 }}>
                            <Button transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{ color: 'white' }} />
                            </Button>
                        </Left>
                        {this.state.tab2 != true && this.state.tab4 != true ?
                            //We need to make this placeholder text a little brighter/whiter
                            <Item style={styles.searchBar}>
                                <Input style={styles.searchInput} placeholder="Search groups, people, topics" autoCorrect={false} spellCheck={false} /*onEndEditing={() => this.onSearch()}*/ onChangeText={(text) => this.onChangeText(text)} />
                                <Icon active name="search" onPress={() => this.onSearch(this.state.search)} />
                            </Item> :
                            null}
                    </Header>
                    {this.state.tab2 != true && this.state.tab4 != true ?
                        //This is the Group Selector and provides All, Town, State, Country, and More options. Each button loads appropriate selected feed into Newsfeed tab.
                        //GH153
                        <View style={styles.groupSelector}>
                            <Grid>
                                <Row>
                                    <Col style={styles.col}>
                                        <Button style={selectedGroup.header == 'all' ? styles.iconActiveButton : styles.iconButton} onPress={() => { Keyboard.dismiss(); this.selectGroup('all'); Mixpanel.track("All Feed Loaded"); }}>
                                            <Image
                                                style={styles.iconP}
                                                source={require("img/p_logo.png")}
                                            />
                                        </Button>
                                        <Text style={styles.iconText} onPress={() => { Keyboard.dismiss(); this.selectGroup('all'); }}>All</Text>
                                    </Col>
                                    <Col style={styles.col}>
                                        <Button style={selectedGroup.header == 'local' ? styles.iconActiveButton : styles.iconButton} onPress={() => { Keyboard.dismiss(); this.selectGroup('local'); Mixpanel.track("Town Feed Loaded from Home"); }}>
                                            <Icon active name="pin" style={styles.icon} />
                                        </Button>
                                        <Text style={styles.iconText} numberOfLines={1} onPress={() => { Keyboard.dismiss(); this.selectGroup('town'); }}>{this.props.town}</Text>
                                    </Col>
                                    <Col style={styles.col}>
                                        <Button style={selectedGroup.header == 'state' ? styles.iconActiveButton : styles.iconButton} onPress={() => { Keyboard.dismiss(); this.selectGroup('state'); Mixpanel.track("State Feed Loaded from Home");}}>
                                            <Icon active name="pin" style={styles.icon} />
                                        </Button>
                                        <Text style={styles.iconText} numberOfLines={1} onPress={() => { Keyboard.dismiss(); this.selectGroup('state'); }}>{this.props.state}</Text>
                                    </Col>
                                    <Col style={styles.col}>
                                        <Button style={selectedGroup.header == 'country' ? styles.iconActiveButton : styles.iconButton} onPress={() => { Keyboard.dismiss(); this.selectGroup('country'); Mixpanel.track("Country Feed Loaded from Home"); }}>
                                            <Icon active name="pin" style={styles.icon} />
                                        </Button>
                                        <Text style={styles.iconText} numberOfLines={1} onPress={() => { Keyboard.dismiss(); this.selectGroup('country'); }}>{this.props.country}</Text>
                                    </Col>
                                    <Col style={styles.col}>
                                        <Button style={selectedGroup.header == 'more' ? styles.iconActiveButton : styles.iconButton} onPress={() => { Keyboard.dismiss(); this.goToGroupSelector();}}>
                                            <Icon active name="more" style={styles.icon} />
                                        </Button>
                                        <Text style={styles.iconText} onPress={() => { Keyboard.dismiss(); this.goToGroupSelector(); }}>More</Text>
                                    </Col>
                                </Row>
                            </Grid>
                        </View> : null}
                    {this.renderSelectedTab()}

                    <Footer style={styles.footer}>
                        <FooterTab style={{ backgroundColor: 'transparent' }}>
                            <FooterTabButton
                                badge={this.showBadgeForActivities()}
                                active={this.state.tab1}
                                onPress={() => { Keyboard.dismiss(); this.toggleTab1(); }}
                                name="ios-flash"
                                title="NEWSFEED"
                            />
                            <FooterTabButton
                                active={this.state.tab2}
                                onPress={() => this.toggleTab2()}
                                name='md-people'
                                title='FRIENDS'
                            />
                            {/* This is the New Item Menu GH8. Only New Post and New Petition are expected to work at this time */}
                            <Button style={isIOS ? {} : { height: 75 }} >
                                {!isIOS && <View style={[styles.fillButton, styles.borderTop]} />}
                                {!isIOS && <View style={styles.fillCircle} />}
                                    <Menu name="create_item" renderer={SlideInMenu} onSelect={value => this.selectNewItem(value)} ref={this.onRef}>
                                        <MenuTrigger ref={'menuTrigger'} >
                                            <Icon name="ios-add-circle" style={styles.iconPlus} />
                                        </MenuTrigger>
                                        <MenuOptions ref={r => this.menuOptions = r} customStyles={optionsStyles} renderOptionsContainer={optionsRenderer}>
                                            {
                                                this.renderMenuOptions(selectedGroup)
                                            } 
                                        </MenuOptions>
                                    </Menu>
                            </Button>
                            {/* This is the Messages/Announcements tab. It is not working yet */}
                            <FooterTabButton
                                active={this.state.tab3}
                                onPress={() => this.toggleTab3()}
                                name="md-mail"
                                title="MESSAGES"
                            />
                            {/* This is the Notifications Feed tab. It should be working. */}
                            <FooterTabButton
                                active={this.state.tab4}
                                onPress={() => this.toggleTab4()}
                                name='md-notifications'
                                title='NOTIFICATIONS'
                            />
                        </FooterTab>
                    </Footer>
                </Container>
            </MenuContext >
        );
    }
}

const optionsStyles = {
    optionsContainer: {
        backgroundColor: 'white',
        paddingLeft: 5
    }
};

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop
};

function bindAction(dispatch) {
    return {
        openDrawer: () => { Keyboard.dismiss(); dispatch(openDrawer()); },
        loadUserGroups: (token) => dispatch(loadUserGroups(token)),
    };
}

async function timeout(ms: number): Promise {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

const mapStateToProps = state => ({
    token: state.user.token,
    profile: state.user.profile,
    activities: state.activities.payload,
    pushId: state.user.pushId,
    town: state.groups.town,
    state: state.groups.state,
    country: state.groups.country,
    newsfeedUnreadCount: state.activities.newsfeedUnreadCount,
    groupList: state.groups.payload,
    selectedGroup: state.activities.selectedGroup
});

Mixpanel.sharedInstanceWithToken(MixpanelToken);
export default connect(mapStateToProps, bindAction)(Home);
