// This is the Home Screen (GH7). It consists of the burger menu, search bar, Group Selector (GH9), and 4 tabs: Newsfeed (GH13), Friends Feed (GH51), Messages (NA), and Notifications Feed (GH37). The option to create new content (GH8) is also on this screen.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Title, Content, Button, Footer, FooterTab, Text, Body, Left, Right, Icon, Item, Input, Grid, Row, Col, Badge, Label } from 'native-base';

import { View, Image, AsyncStorage, Alert } from 'react-native';

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
  getComments
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
var Platform = require('Platform');

class Home extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    if(props.notification){
      this.state = {
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
        group: 'all',
        search: ''
      };
    }else{
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

    //When user logs in, the device subscription is set to True to allow for notifications. If false, device cannot receive notifications
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

    ShareExtension.data().then((data) => {
        if(data.type != "" && data.value != ""){
          Actions.newpost({data: data});
        }        
    });
  }

  onReceived(data){
    // console.log('received: ', data);
  }

  onRegistered(data){
    // console.log('registered :', data);
  }

  onIds(data){
    var { token } = this.props;
    AsyncStorage.setItem('pushId', data.userId);

    var params = {
      id: data.userId,
      identifier: DeviceInfo.getUniqueID(),
      timezone: (new Date()).getTimezoneOffset()* 60,
      version: DeviceInfo.getVersion(),
      os: DeviceInfo.getSystemName(),
      model: DeviceInfo.getModel(),
      type: Platform.OS
    };

    //Device needs to be registered with Powerline backend after token received from OneSignal
    registerDevice(token, params)
    .then(data => {
    })
    .catch(err => {
    });
  }
  
    // these are the action buttons actions
    _signPetition(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      
      signUserPetition(token, target.id).then(res => console.log(res));
    }
    _viewPetition(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      Actions.itemDetail({ entityId: target.id, entityType: target.type });
    }

    _mutePetition(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      
      unsubscribeFromPetition(token, target.id).then(ans => console.log(ans));
    }
    _openComment(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      // this is to be changed!!! the commentDetail component doesnt accept an id, but the comment object, so I must do this!
      let comment = getComments(token, target.type, target.id).then(
        res => {
          Actions.commentDetail({
            comment: res.comments.find(comment => comment.id === target.comment_id), 
            entityType: target.type,
            entityId: target.id
           });
        }
      )      
    }
    _openPost(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      Actions.itemDetail({ entityId: entity.id, entityType: entity.type });
    }
    _approveFollowRequest(token, data, dispatch){
      acceptFollowers(token, data.notification.payload.additionalData.entity.target.id).then((ret) => {  
        dispatch({type: 'RESET_FOLLOWERS'});
        getFollowers(token, 1, 20).then(ret1 => {
          dispatch({type: 'LOAD_FOLLOWERS', data: ret1});
        }).catch(err => {
          
        });      
        Actions.myInfluences();
      }).catch(err => {
        console.log(err);
      });
    }
    _ignoreFollowRequest(token, data, dispatch){
      unFollowers(token, data.notification.payload.additionalData.entity.target.id).then((ret) => {   
        dispatch({type: 'RESET_FOLLOWERS'});
        getFollowers(token, 1, 20).then(ret1 => {
          dispatch({type: 'LOAD_FOLLOWERS', data: ret1});
        }).catch(err => {
          
        });               
        Actions.myInfluences();                    
      }).catch(err => {
        
      });
    }
    _upvotePost(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      votePost(token, target.id, 'upvote')
    }
    _downvotePost(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      votePost(token, target.id, 'downvote')
    }
    _sharePost(token, data){
      // TODO
    }
    _viewPost(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      Actions.itemDetail({ entityId: target.id, entityType: target.type });
    }
    _mutePost(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      unsubscribeFromPost(token, target.id)
    }
    _joinGroup(token, data){
      let groupId = data.notification.payload.additionalData.entity.target.id;
      joinGroup(token, groupId)
    }
    _ignoreInvite(token, data){
      // does nothing? if yes, working
    }
    _openGroup(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      Actions.groupprofile(440);
    }
    _viewPoll(token, data){
      let {target} = data.notification.payload.additionalData.entity;
      Actions.itemDetail({ entityId: target.id, entityType: target.type });
    }
    _mutePoll(token, data){
      let {target} = data.notification.payload.additionalData.entity;      
      unsubscribeFromPoll(token, target.id);
    }
    _replyComment(token, data){
      // navigates to the post/petition/poll -> opens comment -> fill the input with the other user username // for now it only goes to the post/poll/petition
      // console.log('replyComment', token, data);
      let {target} = data.notification.payload.additionalData.entity;
      Actions.itemDetail({ entityId: target.id, entityType: target.type });
    }

    _shareAnnouncement(token, data){
      // TODO
      // console.log('shareAnnouncement', token, data);
    }

    _rspv(token, data){
      // console.log('rspv', token, data);
      let {target} = data.notification.payload.additionalData.entity;      
      Actions.itemDetail({ entityId: target.id, entityType: target.type });
    }

    _handleDefault(token, data){
      // user didnt click an action button? redirect to a specific place, depending on the notification
      let {type} = data.notification.payload.additionalData;
      switch(type){
        case 'own-post-commented' || 'follow-post-commented' || 'own-post-voted' || 'own-post-commented' :
          this._viewPost(token, data);
          break;
        case 'user-petition-boosted' || 'own-user-petition-commented' || 'own-user-petition-signed' || 'follow-user-petition-commented' || 'petition-created':
          this._viewPetition(token, data);
          break;
        case 'comment-mentioned' || 'comment-replied':
          this._openComment(token, data);
          break;
        case 'post-mentioned':
          this._viewPost(token, data);
          break;
        case 'follow-request':
          Actions.myInfluences();
          break;
        case 'follow-post-created':
          this._viewPost(token, data);
          break;
        case 'post-boosted':
          this._viewPost(token, data);
          break;
        case 'follow-user-petition-created':
          this._viewPetition(token, data);
          break;
        case 'own-post-boosted':
          this._viewPost(token, data);
          break;
        case 'group-permissions-changed':
          this._openGroup(token, data);
          break;
        case 'poll-answered' || 'own-poll-commented' || 'follow-poll-commented' || 'poll-created':
          this._viewPoll(token, data);
          break;

      }
    }

  onOpened(data){
    let { token,dispatch } = this.props;
    let {action} = data;
    if (!action) return;
    let {actionID} = action;
    console.log(actionID, data);
    switch(actionID){
      case 'ignore-button': 
        break;
      case 'sign-petition-button': 
        this._signPetition(token, data);
        break;
      case 'view-petition-button': 
        this._viewPetition(token, data);
        break;
      case 'mute-petition-button': 
        this._mutePetition(token, data);
        break;
      case 'open-comment-button': 
        this._openComment(token, data);
        break;
      case 'open-post-button': 
        this._openPost(token, data);
        break;
      case 'open-poll-button':
        this._viewPoll(token, data);
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
      case 'view-post-button': 
        this._viewPost(token,data);
        break;
      case 'mute-post-button': 
        this._mutePost(token, data);
        break;
      // invite
      case 'join-group-button': 
        this._joinGroup(token, data);
        break;
      case 'ignore-invite-button': 
        this._ignoreInvite(token, data);
        break;
      //group permission changed
      case 'open-group-button': 
        this._openGroup(token, data);
        break;
      // own poll commented, poll answered and follow poll commented
      case 'view-poll-button': 
        this._viewPoll(token, data);
        break;
      case 'mute-poll-button': 
        this._mutePoll(token, data);
        break;
      // comment replied
      case 'reply-comment-button': 
        this._replyComment(token, data);
        break;
      // announcement
      case 'share-announcement-button': 
        this._shareAnnouncement(token, data);
        break;
      case 'respond-button':
        this._viewPoll(token, data);
      case 'rsvp-button':
        this.rspv(token, data);
      default: 
        this._handleDefault(token, data);
    }
  }

  async loadCurrentUserProfile() {
    const { props: { token, dispatch } } = this;
    try {
      await Promise.race([
        dispatch(loadUserProfile(token)),
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
    }
  }

  // Newsfeed Tab
  toggleTab1() {
    this.setState({
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false,
    });
  }

  // Friends Feed Tab
  toggleTab2() {
    this.setState({
      tab1: false,
      tab2: true,
      tab3: false,
      tab4: false,
    });
  }

  // Messages Tab
  toggleTab3() {
    this.setState({
      tab1: false,
      tab2: false,
      tab3: true,
      tab4: false,
    });
  }

  // Notifications Feed Tab
  toggleTab4() {
    this.setState({
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: true,
    });
  }

  //JC: I believe this loads to the group feed when a group is selected from Group Selector More menu
  selectGroup(group) {
    var { token, dispatch } =  this.props;
    if(group == 'all'){
      dispatch({type: 'RESET_ACTIVITIES'});
      dispatch(loadActivities(token, 0, 20, 'all'));
    }
    this.setState({ group: group });
  }

  //This is the menu to create new content (GH8)
  selectNewItem(value) {
    this.bottomMenu.close();
    if(value == 'post'){
      Actions.newpost();
    }else if(value == 'petition'){
      Actions.newpetition();
    //The ability to create new "leader" content has not yet been added, but it will go here (GH118)
    }
  }

  onRef = r => {
    this.bottomMenu = r;
  }

  //Tapping the "More" button should open the Group Selector which lists all groups the user is joined to
  goToGroupSelector() {
    this.setState({
      group: 'more'
    });
    Actions.groupSelector();
  }

  renderSelectedTab() {
    if (this.state.tab1) {
      return <Newsfeed />;
    } else if (this.state.tab2){
      return <Friendsfeed/>;
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
  
  showBadgeForActivities(){
      var count = 0;
      for(var i = 0; i < this.props.activities.length; i++){
        if(this.props.activities[i].zone == 'non_prioritized'){
          count++;
        }
      }

      return count;
  }

  //This is the search bar for GH43. When user enters text, it should automatically display search results (defaulting to group results) for that query
  onChangeText(text){
    this.setState({
      search: text
    });
  }

  onSearch(){
    var { token } = this.props;
    Actions.search({search: this.state.search});
  }

  render() {
    return (
      <MenuContext customStyles={menuContextStyles}>
        <Container>
          <Header searchBar rounded style={styles.header}>
            <Left style={{ flex: 0.1 }}>
              <Button transparent onPress={this.props.openDrawer}>
                <Icon active name="menu" style={{ color: 'white' }} />
              </Button>
            </Left>
            {this.state.tab2!=true && this.state.tab4!=true?
            //We need to make this placeholder text a little brighter/whiter
            <Item style={styles.searchBar}>
              <Input style={styles.searchInput} placeholder="Search groups, people, topics" onEndEditing={() => this.onSearch() } value={this.state.search} onChangeText={(text) => this.onChangeText(text)}/>
              <Icon active name="search" />
            </Item>:
            null}
          </Header>
          {this.state.tab2 != true && this.state.tab4 != true ?
          //This is the Group Selector and provides All, Town, State, Country, and More options. Each button loads appropriate selected feed into Newsfeed tab.
          //GH153
          <View style={styles.groupSelector}>
            <Grid>
              <Row>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'all' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('all')}>
                    <Image
                      style={styles.iconP}
                      source={require("img/p_logo.png")}
                    />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('all')}>All</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'town' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('town')}>
                    <Icon active name="pin" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('town')}>Town</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'state' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('state')}>
                    <Icon active name="pin" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('state')}>State</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'country' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('country')}>
                    <Icon active name="pin" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('country')}>Country</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'more' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.goToGroupSelector()}>
                    <Icon active name="more" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.goToGroupSelector()}>More</Text>
                </Col>
              </Row>
            </Grid>
          </View>:null}
          {this.renderSelectedTab()}

          <Footer style={styles.footer}>
            <FooterTab>
              {this.showBadgeForActivities()!=0?
              <Button badge={true} active={this.state.tab1} onPress={() => this.toggleTab1()} > 
                <Badge><Text>{this.showBadgeForActivities()}</Text></Badge>
                <Icon active={this.state.tab1} name="ios-flash" />
                <Text>NEWSFEED</Text>
              </Button>:
              <Button active={this.state.tab1} onPress={() => this.toggleTab1()} >
                <Icon active={this.state.tab1} name="ios-flash" />
                <Text>NEWSFEED</Text>
              </Button>
              }
              <Button active={this.state.tab2} onPress={() => this.toggleTab2()} >
                <Icon active={this.state.tab2} name="md-people" />
                <Text>FRIENDS</Text>
              </Button>
            {/* This is the New Item Menu GH8. Only New Post and New Petition are expected to work at this time */}
              <Button>
                <Menu name="create_item" renderer={SlideInMenu} onSelect={value => this.selectNewItem(value)} ref={this.onRef}>
                  <MenuTrigger>
                    <Icon name="ios-add-circle" style={styles.iconPlus} />
                  </MenuTrigger>
                  <MenuOptions customStyles={optionsStyles}>
                    <MenuOption value={'group_announcement'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_announcement')}>
                        <Icon name="volume-up" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Group Announcement</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_fundraiser'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_fundraiser')}>
                        <Icon name="ios-cash" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Group Fundraiser</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_event'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_event')}>
                        <Icon name="ios-calendar" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Group Event</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_petition'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_petition')}>
                        <Icon name="ios-clipboard" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Group Petition</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_discussion'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_discussion')}>
                        <Icon name="ios-chatbubbles" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Group Discussion</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_poll'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_poll')}>
                        <Icon name="ios-stats" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Group Poll</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'petition'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('petition')}>
                        <Icon name="ios-clipboard" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Petition</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'post'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('post')}>
                        <Icon name="ios-flag" style={styles.menuIcon} />
                        <Text style={styles.menuText}>New Post</Text>
                      </Button>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </Button>
              {/* This is the Messages/Announcements tab. It is not working yet */}
              <Button active={this.state.tab3} onPress={() => this.toggleTab3()} >
                <Icon active={this.state.tab3} name="md-mail" />
                <Text>MESSAGES</Text>
              </Button>
              {/* This is the Notifications Feed tab. It should be working. */}
              <Button active={this.state.tab4} onPress={() => this.toggleTab4()} >
                <Icon active={this.state.tab4} name="md-notifications" />
                <Text>NOTIFICATIONS</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </MenuContext >
    );
  }
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#fafafa',
    paddingLeft: 5,
  },
};

const menuContextStyles = {
  menuContextWrapper: styles.container,
  backdrop: styles.backdrop,
};

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
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
  pushId: state.user.pushId
});

export default connect(mapStateToProps, bindAction)(Home);
