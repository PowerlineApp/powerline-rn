
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Text, ListItem, List, Left, Icon, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { closeDrawer } from '../../actions/drawer';
import { logOut, logOutWithPrompt } from 'PLActions';

import styles from './style';
import OneSignal from 'react-native-onesignal';
import { AsyncStorage, Keyboard } from 'react-native';

const datas = [
  {
    name: 'Home',
    route: 'home',
    icon: 'home',
    bg: '#C5F442',
  },
  {
    name: 'Search',
    route: 'search',
    icon: 'search',
    bg: '#477EEA',
  },
  {
    name: 'My Groups',
    route: 'myGroups',
    icon: 'people',
    bg: '#DA4437',
  },
  {
    name: 'Create Group',
    route: 'createGroup',
    icon: 'add',
    bg: '#4DCAE0',
  },
  {
    name: 'My Influences',
    route: 'myInfluences',
    icon: 'git-network',
    bg: '#1EBC7C',
  },
  {
    name: 'Representatives',
    route: 'representatives',
    icon: 'color-filter',
    bg: '#B89EF5',
  },
  //{
  //  name: 'Favorites',
  //  route: 'favorites',
  //  icon: 'star',
  //  bg: '#EB6B23',
  //},
  //{
  //  name: 'My Profile',
  //  route: 'myProfile',
  //  icon: 'contact',
  //  bg: '#3591FA',
  //},
  //{
  //  name: 'Settings',
  //  route: 'settings',
  //  icon: 'settings',
  //  bg: '#3591FA',
  //},
  //{
  //  name: 'Find Friends',
  //  route: 'findFriends',
  //  icon: 'contacts',
  //  bg: '#3591FA',
  //},
  //{
  //  name: 'Other Apps',
  //  route: 'otherApps',
  //  icon: 'more',
  //  bg: '#3591FA',
  //},
  {
    name: 'Take Tour',
    route: 'takeTour',
    icon: 'school',
    bg: '#3591FA',
  },
  {
    name: 'Share this App',
    route: 'shareApp',
    icon: 'share',
    bg: '#3591FA',
  },
  {
    name: 'Logout',
    route: 'logout',
    icon: 'log-out',
    bg: '#3591FA',
  },
];

class SideBar extends Component {

  static propTypes = {
    logOut: React.PropTypes.func,
    closeDrawer: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  onSelectItem(route: string) {
    if (route == 'logout') {
      var { token } = this.props;
      this.props.logOut(token);
             
    } else if(route == 'takeTour'){
      Actions['takeTour']();
    }else if(route == 'myInfluences'){
      Actions['myInfluences']();  
    }else if(route == 'representatives'){
      Actions['representatives']();
    }else if(route == 'createGroup'){
      Actions['createGroup']();
    }else if(route == 'myGroups'){
      Actions['myGroups']();
    }else if(route == 'search'){
      Actions['search']();
    }else{
      Keyboard.dismiss();
      Actions['home']();
    }
    this.props.closeDrawer();
  }

  render() {
    return (
      <Container style={styles.sidebar}>
        <Content>
          <List
            dataArray={datas} renderRow={data =>
              <ListItem button noBorder onPress={() => this.onSelectItem(data.route)} >
                <Left>
                  <Icon active name={data.icon} style={{ color: 'white', fontSize: 26, width: 30 }} />
                  <Text style={styles.text}>{data.name}</Text>
                </Left>
                {(data.types) &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{ borderRadius: 3, height: 25, width: 72, backgroundColor: data.bg }}
                    >
                      <Text style={styles.badgeText}>{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>
                }
              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    logOut: (token) => dispatch(logOutWithPrompt(token)),
  };
}

const mapStateToProps = state => ({
  token: state.user.token,
  pushId: state.user.pushId
});

export default connect(mapStateToProps, bindAction)(SideBar);
