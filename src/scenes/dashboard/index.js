
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

import { loadUserProfile, loadActivities, registerDevice, acceptFollowers,unFollowers, search, getActivities } from 'PLActions';

// Tab Scenes
import Newsfeed from './newsfeed/'
import Friendsfeed from './friendsfeed/';
import Notifications from './notifications';

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
  }

  componentWillMount() {
    const { props: { profile, token, dispatch } } = this;

    OneSignal.configure();

    OneSignal.setSubscription(true);
    
    OneSignal.addEventListener('ids', this.onIds);

    OneSignal.addEventListener('opened', this.onOpened);

    if (!profile) {
      this.loadCurrentUserProfile();
    }

    ShareExtension.data().then((data) => {
        if(data.type != "" && data.value != ""){
          Actions.newpost({data: data});
        }        
    });
  }

  onIds(data){
    var { token } = this.props;
    console.log("push ids", data);
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

    registerDevice(token, params)
    .then(data => {
    })
    .catch(err => {
    });
  }

  onOpened(data){
    var { token,dispatch } = this.props;
    console.log("push notification opened", data);    
    if(data.action.actionID == 'approve-follow-request-button'){
      console.log("accept button", data.notification.payload.additionalData.entity.target.id);
      console.log("token", token);
      acceptFollowers(token, data.notification.payload.additionalData.entity.target.id)
      .then((ret) => {
        dispatch({type: 'RESET_NOTIFICATION'});
        getActivities(token).then(res => {
          dispatch({type: 'LOAD_NOTIFICATION', data: res});
        })
        .catch(err => {

        });
        Actions.home({notification: true});
      })
      .catch(err => {
          console.log(err);
      });
    }else if(data.action.actionID == 'ignore-follow-request-button'){
      console.log("ignore button", data.notification.payload.additionalData.entity.target.id);
      unFollowers(token, data.notification.payload.additionalData.entity.target.id)
      .then((ret) => {      
        dispatch({type: 'RESET_NOTIFICATION'});
        getActivities(token).then(res => {
          dispatch({type: 'LOAD_NOTIFICATION', data: res});
        })
        .catch(err => {

        });                  
        Actions.home({notification: true});                    
      })
      .catch(err => {

      });
    }else if(data.notification.payload.additionalData.type == 'follow-request'){
      console.log("notification click");
      Actions.home({notification: true});
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

  // Friends Tab
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

  // Notifications Tab
  toggleTab4() {
    this.setState({
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: true,
    });
  }

  selectGroup(group) {
    var { token, dispatch } =  this.props;
    if(group == 'all'){
      dispatch({type: 'RESET_ACTIVITIES'});
      dispatch(loadActivities(token, 0, 20, 'all'));
    }
    this.setState({ group: group });
  }

  selectNewItem(value) {
    this.bottomMenu.close();
    if(value == 'post'){
      Actions.newpost();
    }else if(value == 'petition'){
      Actions.newpetition();
    }
  }

  onRef = r => {
    this.bottomMenu = r;
  }

  goToGroupSelector() {
    this.setState({
      group: 'more'
    });
    Actions.groupSelector();
  }

  renderSelectedTab() {
    if (this.state.tab1 === true) {
      return (<Newsfeed />);
    } else if(this.state.tab2 === true){
      return (<Friendsfeed/>);
    } else if(this.state.tab4 === true){
      return (<Notifications/>);
    }else{
      return (
        <View style={{ flex: 1 }} />
      );
    }
  }

  showBadgeForActivities(){
      var count = 0;
      for(var i = 0; i < this.props.activities.length; i++){
        if(this.props.activities[i].zone == 'non_prioritized'){
          count++;
        }
      }

      return count;
  }

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
            <Item style={styles.searchBar}>
              <Input style={styles.searchInput} placeholder="Search groups, people, topics" onEndEditing={() => this.onSearch() } value={this.state.search} onChangeText={(text) => this.onChangeText(text)}/>
              <Icon active name="search" />
            </Item>:
            null}
          </Header>
          {this.state.tab2 != true && this.state.tab4 != true ?
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
                <Text>Newsfeed</Text>
              </Button>:
              <Button active={this.state.tab1} onPress={() => this.toggleTab1()} >
                <Icon active={this.state.tab1} name="ios-flash" />
                <Text>Newsfeed</Text>
              </Button>
              }
              <Button active={this.state.tab2} onPress={() => this.toggleTab2()} >
                <Icon active={this.state.tab2} name="md-people" />
                <Text>Friends</Text>
              </Button>
              <Button>
                <Menu name="create_item" renderer={SlideInMenu} onSelect={value => this.selectNewItem(value)} ref={this.onRef}>
                  <MenuTrigger>
                    <Icon name="ios-add-circle" style={{ fontSize: 42, color: '#030366' }} />
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
              <Button active={this.state.tab3} onPress={() => this.toggleTab3()} >
                <Icon active={this.state.tab3} name="md-mail" />
                <Text>Messages</Text>
              </Button>
              <Button active={this.state.tab4} onPress={() => this.toggleTab4()} >
                <Icon active={this.state.tab4} name="md-notifications" />
                <Text>Notifications</Text>
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
