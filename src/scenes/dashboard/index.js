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
    getAgency,
    loadUserProfile,
    loadActivities,
    setGroup,
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
    getGroups,
    signLeaderPetition
} from 'PLActions';
import {ImageCache} from "react-native-img-cache";
import PLOverlayLoader from 'PLOverlayLoader';



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
import {Mixpanel} from '../../PLEnv';
// import { get } from 'http';


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
        // this.selectGroup = this.selectGroup.bind(this);
    }

    componentWillReceiveProps(nextProps){
        console.warn('componentWillReceiveProps at dashboard');
        if (nextProps.shouldResetHome){
            this.props.dispatch({type: 'HOME_WAS_RESET'})
            const data =  {id: 'all', group: 'all', header: 'all'};
            this.props.setGroup(data, this.props.token, 'all');
            this.setState({tab1: true, tab2: false, tab3: false, tab4: false})
        }
    }

    componentWillMount() {
        const { props: { profile, token, dispatch } } = this;
        this.preCacheAgencyImages();
        
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
                if (data.type !== "" && data.value !== "") {
                        Actions.share({ token: this.props.token});
                }
            });
    }

    preCacheAgencyImages(){
        getAgency(this.props.token)
        .then(r => {
            // console.log('hehe => agency', r)
            if (r.splash_screen){ // r.splash_screen; //
                let uri = r.splash_screen; //"https://static-cdn.jtvnw.net/jtv_user_pictures/panel-62449166-image-47d2742a-e94a-4b31-b987-1de9fffea6b5";
                ImageCache.get().on({
                    uri
                }, (path) => {
                    console.log(
                        'TRYING TO CACHE => ', path
                    )
                    if (path){
                        AsyncStorage.setItem('splashScreen', uri);
                    }
                })
            }
            if (r.onboarding_screens){ // r.splash_screen; //
                r.onboarding_screens.map(splash => {
                    let uri = splash.image; //"https://static-cdn.jtvnw.net/jtv_user_pictures/panel-62449166-image-47d2742a-e94a-4b31-b987-1de9fffea6b5";
                    ImageCache.get().on({
                        uri
                    }, (path) => {
                        console.log(
                            'TRYING TO CACHE => ', path
                        );
                        if (path){
                            console.log('caching onboarding screens done.')
                            AsyncStorage.setItem('onboarding', JSON.stringify(r.onboarding_screens || {}));
                        }
                    })
                })
            }
        })
        .catch(e => {
            console.log(e)
        })
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
        try {
            AsyncStorage.getItem('freshRegister').then(item => {
                setTimeout(() => {
                    if (item === 'true'){
                        Alert.alert('Verify now?', 'Your profile is only 50% complete.', [
                            // missing: configure action buttons for these.
                            {text: "Verify", onPress: () => Actions.verifyProfile()}, 
                            {text: "Later", onPress: () => {
                                let h_48 = (48 * 1000 * 60 * 60);
                                try {
                                    OneSignal.postNotification({
                                        'en': 'Remember to finish your registration!'
                                    },
                                    {},
                                    data.userId,
                                    {
                                        send_after: new Date(new Date().getTime() + h_48)
                                    })
                                } catch (error) {
                                    console.warn('couldnt set notification to verify later', error)
                                }
                        }}
                    ])
                }
            }, 5000)
        });
        AsyncStorage.setItem('freshRegister', 'false');
        } catch (error) {
            console.log(error);   
        }
    }

    componentDidCatch(err){
        console.log('err', err)
    }

    onIds(data) {
        console.log('oneSignal on ids', data)
        OneSignal.removeEventListener('ids');
        if (this.gotIds) return;
        this.gotIds = true;
        console.log('oneSignal /this idsss', data);
        let { token } = this.props;
        AsyncStorage.setItem('pushId', data.userId);
        // AsyncStorage.setItem('freshRegister', 'true').then(item => {
            this.verifyProfile(data);
        // });
        let params = {
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
                console.log('oneSignal REGISTER RESPONSE', data);
            })
            .catch(err => {
                console.log('oneSignal REGISTER ERROR', err);
            });
    }

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
            case 'follow-request':
                Actions.myInfluences()
            default:
                this.itemDetail(notification, options);
                break;
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
                    comment: (res.comments || []).find(comment => comment.id === target.comment_id),
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
    // here
    _signLeaderPetition(token, data) {
        let { target } = data.notification.payload.additionalData.entity;
        signLeaderPetition(token, target.id, target.option.id);
    }

    onOpened(data) {
        console.log('OPENED', data);
        
        let { token, dispatch } = this.props;
        let {type} = data.notification.payload.additionalData;
        let actionButton = data.action.actionID;

        if (!actionButton) {
            this.redirect(type, data.notification.payload);
            return;
        }

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
            case 'rsvp-button':
                return this.redirect(type, data.notification.payload);
                break;
            case 'reply-comment-button':
                return this.redirect(type, data.notification.payload, {commenting: true, commentText: '@' + data.notification.payload.additionalData.user.username});
                break;
            case 'open-comment-button':
                return this._openComment(token, data);
                break;
            case 'sign-petition-button':
                return this._signPetition(token, data);
                break;
            case 'sign-leader-petition-button':
                return this._signLeaderPetition(token, data);
                break;
            case 'mute-petition-button':
                return this._mutePetition(token, data);
                break;
            case 'approve-follow-request-button':
                return this._approveFollowRequest(token, data, dispatch);
                break;
            case 'ignore-follow-request-button':
                return this._ignoreFollowRequest(token, data, dispatch);
                break;
            case 'upvote-post-button':
                return this._upvotePost(token, data);
                break;
            case 'downvote-post-button':
                return this._downvotePost(token, data);
                break;
            case 'share-post-button':
                return this._sharePost(token, data);
                break;
            // own post boosted and own post commented, follow post commented, own post voted
            case 'mute-post-button':
                return this._mutePost(token, data);
                break;
            // invite
            case 'join-group-button':
                return this._joinGroup(token, data);
                break;
            case 'mute-poll-button':
                return this._mutePoll(token, data);
                break;
            // announcement
            case 'share-announcement-button':
                this._shareAnnouncement(token, data);
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
        const data =  {id: 'all', group: 'all', header: 'all'};
        this.props.setGroup(data, this.props.token, 'all')
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
    async selectGroup(group){
            console.warn('TIME INITIAL', new Date().getTime())
            let init = new Date().getTime();
            let { token, dispatch } = this.props;
        if (group == 'all') {
            let data =  {id: 'all', group: 'all', header: 'all'};
            this.props.setGroup(data, token, 'all')
            // dispatch(loadActivities(token, 0, 20, 'all'));
            // dispatch({type: 'SAVE_OFFSET', payload: 0})

        } else {
            // return;
            let groupObj = this.props.groupList.find(groupObj => groupObj.group_type_label === group);
            // let groupObj = this.props.groupList[0];
            if (!groupObj) return;
            // console.warn('SELECTED GROUP', groupObj)
            
            
            let {id, official_name, avatar_file_path, conversation_view_limit, total_members, user_role} = groupObj;
            let data = {header: group, user_role,id, group: id, groupName: official_name, groupAvatar: avatar_file_path, groupLimit: conversation_view_limit, groupMembers: total_members, conversationView: total_members < conversation_view_limit};
            this.props.setGroup(data, token, id);
        }
        console.warn('===>', (new Date()).getTime() - init, init)
        // this.setState({ group: group });
    }

    // This is the menu to create new content (GH8)
    selectNewItem(value) {
        let {selectedGroup} = this.props;
        // console.log('selected group ==> ', selectedGroup)
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
        // this.setState({
        //     group: 'more'
        // });
        Actions.groupSelector();
    }

    renderSelectedTab() {
        if (this.state.tab1) {
            return <Newsfeed setLoading={this.setLoading} />;
        } else if (this.state.tab2) {
            return <Friendsfeed setLoading={this.setLoading} />;
        } else if (this.state.tab3) {
            return <Messages setLoading={this.setLoading} />;
        } else if (this.state.tab4) {
            return <Notifications setLoading={this.setLoading} />;
        } else {
            return (
                <View style={{ flex: 1 }} />
            );
        }
    }

    setLoading = (loading) => {
        this.setState({loading})
    }

    showBadgeForActivities() {
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

    renderMenuOptions(isLeader){
        // console.log('SELECTED GROUP', group);
        let options = [
            <MenuOption key="petition" value={'petition'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('petition'); Mixpanel.track("Opened New User Petition Form");}}>
                    <Icon name="ios-clipboard" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Petition</Text>
                </Button>
            </MenuOption>,
            <MenuOption key="post" value={'post'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('post'); Mixpanel.track("Opened New Post Form");}}>
                    <Icon name="ios-flag" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Post</Text>
                </Button>
            </MenuOption>
        ]
        if (isLeader)
        options.unshift(
            // <MenuOption value={'group_announcement'}>
            //     <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_announcement'); Mixpanel.track("Opened New Announcement Form");}}>
            //         <Icon name="volume-up" style={styles.menuIcon} />
            //         <Text style={styles.menuText}>New Group Announcement</Text>
            //     </Button>
            // </MenuOption>,
            <MenuOption key="group_fundraiser" value={'group_fundraiser'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_fundraiser'); Mixpanel.track("Opened New Fundraiser Form");}}>
                    <Icon name="ios-cash" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Fundraiser</Text>
                </Button>
            </MenuOption>,
            <MenuOption key="group_event" value={'group_event'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_event'); Mixpanel.track("Opened New Event Form");}}>
                    <Icon name="ios-calendar" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Event</Text>
                </Button>
            </MenuOption>,
            <MenuOption key="group_petition" value={'group_petition'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_petition'); Mixpanel.track("Opened New Group Petition Form");}}>
                    <Icon name="ios-clipboard" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Petition</Text>
                </Button>
            </MenuOption>,
            <MenuOption key="group_discussion" value={'group_discussion'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_discussion'); Mixpanel.track("Opened New Discussion Form");}}>
                    <Icon name="ios-chatbubbles" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Discussion</Text>
                </Button>
            </MenuOption>,
            <MenuOption key="group_poll" value={'group_poll'}>
                <Button iconLeft transparent dark onPress={() => {this.selectNewItem('group_poll'); Mixpanel.track("Opened New Poll Form");}}>
                    <Icon name="ios-stats" style={styles.menuIcon} />
                    <Text style={styles.menuText}>New Group Poll</Text>
                </Button>
            </MenuOption>
        )

        return  options;
    }

    render() {
        // console.warn('render at dashboard')
        let isLeader = false; 
        for (let group of this.props.groupList) {
            if(group.user_role === 'owner' || group.user_role === 'manager') {
                isLeader = true;
                break;
            }

        }
        let {selectedGroup} = this.props;

        
        return (
            <MenuContext customStyles={menuContextStyles}>
                {/* <Container> */}
                    <Header searchBar rounded style={styles.header}>
                        <Left style={{ flex: 0.1 }}>
                            <Button style={{width: '100%'}}  transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{ color: 'white' }} />
                            </Button>
                        </Left>
                        {this.state.tab2 != true && this.state.tab4 != true ?
                            <Item style={styles.searchBar}>
                                <Input style={styles.searchInput} placeholderTextColor="#ccc" placeholder="Search groups, people, topics" autoCorrect={false} spellCheck={false} /*onEndEditing={() => this.onSearch()}*/ onChangeText={(text) => this.onChangeText(text)} />
                                <Icon active name="search" style={{color: '#ccc'}} onPress={() => this.onSearch(this.state.search)} />
                            </Item> :
                            <Item style={styles.header} />}
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
                                        <Button id="local" style={selectedGroup.header == 'local' ? styles.iconActiveButton : styles.iconButton} onPress={() => { Keyboard.dismiss(); this.selectGroup('local'); Mixpanel.track("Town Feed Loaded from Home");}}>
                                            <Icon active name="pin" style={styles.icon} />
                                        </Button>
                                        <Text style={styles.iconText} numberOfLines={1}>{this.props.town}</Text>
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
                                        <Button style={selectedGroup.header == 'more' ? styles.iconActiveButton : styles.iconButton} onPress={this.goToGroupSelector}>
                                            <Icon active name="more" style={styles.icon} />
                                        </Button>
                                        <Text style={styles.iconText} onPress={() => { Keyboard.dismiss(); this.goToGroupSelector(); }}>More</Text>
                                    </Col>
                                </Row>
                            </Grid>
                        </View> : null}
                    {this.renderSelectedTab()}
                    <PLOverlayLoader visible={this.state.loading || this.props.loadingActions} marginTop={200} logo />
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
                                                this.renderMenuOptions(isLeader)
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
                {/* </Container> */}
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
    backdrop: styles.backdrop,
};

function bindAction(dispatch) {
    return {
        openDrawer: () => { Keyboard.dismiss(); dispatch(openDrawer()); },
        loadUserGroups: (token) => dispatch(loadUserGroups(token)),
        dispatch: (a) => dispatch(a),
        setGroup: (data, token, id) => dispatch(setGroup(data, token, id))
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
    // activities: [],
    pushId: state.user.pushId,
    town: state.groups.town,
    state: state.groups.state,
    country: state.groups.country,
    newsfeedUnreadCount: state.activities.newsfeedUnreadCount,
    groupList: state.groups.payload,
    // selectedGroup: {},
    selectedGroup: state.activities.selectedGroup,
    shouldResetHome: state.drawer.shouldResetHome,
    loadingActions: state.activities.loading
});

export default connect(mapStateToProps, bindAction)(Home);
