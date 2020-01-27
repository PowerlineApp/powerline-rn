/**
 *
 * @providesModule PLNavigator
 * @flow
 */

"use strict";
import React, { Component } from "React";
import Platform from "Platform";
import StyleSheet from "StyleSheet";
import { Router, Scene } from "react-native-router-flux";
import { connect } from "react-redux";
import { StatusBar, View, Text, TouchableHighlight } from "react-native";

import { Drawer } from "native-base";
import { closeDrawer, setDrawer } from "./actions/drawer";
import Settings from "./scenes/settings";
import PrivacySettings from "./scenes/settings/privacy";
import BlockedUsers from "./scenes/settings/blocking";
import CustomizationSettings from "./scenes/settings/customization";
import NotificationSettings from "./scenes/settings/notifications";
import ManageCards from "./scenes/settings/cards";
import Home from "./scenes/dashboard/";
import SimpleHomeScreen from "./scenes/dashboard/SimpleHomeScreen/SimpleHomeScreen";
import GroupSelector from "./scenes/dashboard/groupSelector/";
import ItemDetail from "./scenes/dashboard/itemDetail/";
import CommentDetail from "./scenes/dashboard/itemDetail/commentDetail";
import SideBar from "./components/sideBar";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import { StyleProvider, variables } from "native-base";
import TourScene from "./scenes/auth/TourScene";
import Influences from "./scenes/influences/";
import SearchFollowing from "./scenes/influences/search/";
import AnalyticsView from "./scenes/dashboard/analyticsView";
import Representatives from "./scenes/representatives/";
import RepresentatyProfile from "./scenes/representatives/profile/";
import Profile from "./scenes/profile/";
import VerifyProfile from "./scenes/profile/verifyProfile";
import CreateGroup from "./scenes/dashboard/creategroup/";
import GroupProfile from "./scenes/dashboard/groupprofile/";
import GroupList from "./scenes/dashboard/grouplist/";
import GroupJoin from "./scenes/dashboard/groupJoin/";
import GroupSearch from "./scenes/dashboard/grouplist/search/";
import GroupMembers from "./scenes/dashboard/groupmembers/";
import GroupInvite from "./scenes/dashboard/groupinvite/";
import ManageGroup from "./scenes/dashboard/managegroup/";
import NewPost from "./scenes/dashboard/newpost/";
import NewPetition from "./scenes/dashboard/newpetition";
import NewLeaderContent from "./scenes/dashboard/newleadercontent";
import Search from "./scenes/search/";
import GroupMembersManagementScene from "./scenes/dashboard/managegroup/scenes/userManagement";
import GroupBankAccountScene from "./scenes/dashboard/managegroup/scenes/fundraiser";
import GroupAddCardScene from "./scenes/dashboard/managegroup/scenes/subscription";
import ElectedLeadersForm from "./scenes/dashboard/electedLadersForm";
import Modal from "./components/Modal";
import UserAddCard from "./scenes/profile/userAddCard.js";
import TermsList from "./scenes/dashboard/termsList";
import ConferenceAttendees from "./scenes/dashboard/ConferenceAttendees/ConferenceAttendees";
import ConferenceEvents from "./scenes/dashboard/ConferenceEvents/ConferenceEvents";
import Services from "./scenes/services";
import CommunityReportForm from './scenes/communityReportForm';
import LoginScene from './scenes/auth/LoginScene';
import TermsPolicyScene from './scenes/auth/TermsPolicyScene';
import ForgotPasswordScene from './scenes/auth/ForgotPasswordScene';
import RegisterScene  from './scenes/auth/RegisterScene';
import Login from './components/auth/Login';
import Share from "./PLShare";
import { Actions } from "react-native-router-flux";
import {fetchConferences} from './actions'

var RouterWithRedux = connect()(Router);

class PLNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCustom: false };
  }
  static propTypes = {
  };
  openDrawer = () => { this.drawer._root.open() };
  closeDrawer = () => { this.drawer._root.close() };
  setDrawer = (drawerRef) => {
    setDrawer(this.openDrawer, this.closeDrawer)
  }

  fetchConferences = () => {
    this.props.fetchConferences(this.props.token, false)
  }

  render() {
    console.log(
      'confs confs', this.props
    )
    return (

      <StyleProvider
        style={getTheme(
          this.props.themeState === "material" ? material : undefined
        )}
      >
        <Drawer
          ref={(ref) => { this.drawer = ref; this.setDrawer(this._drawer) }} 
          content={<SideBar />}
        >
          <MyRouter fetchConferences={this.fetchConferences} isLoggedIn={this.props.isLoggedIn} openDrawer={this.openDrawer} hasConference={this.props.hasConference} />
        </Drawer>
      </StyleProvider>
    );
  }
}

class MyRouter extends Component {
  constructor(props) {
    super(props);
    this.state = { isCustom: false };
  }

  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.drawerState === true && this.props.drawerState === false){
  //     this._drawer.open()
  //   } else if (nextProps.drawerState === false && this.props.drawerState === true) {
  //     this._drawer.close()
  //   }
  // }

  shouldComponentUpdate (nextProps) {
    console.log('this.props.hasConference', this.props.hasConference, nextProps.hasConference)
    if (this.props.isLoggedIn !== nextProps.isLoggedIn) return true
    if (this.props.hasConference !== nextProps.hasConference) return true

    return false
  }

  onBackPress() {
    if (Actions.state.index === 0) {
      return false;
    }
    Actions.pop();
    return true;
  }

  fetchConferences = () => {
    console.log('hasC 1')
    this.props.fetchConferences()
  }

  render() {
    const { hasConference, isLoggedIn } = this.props;
    return (
      <Router key={this.props.isLoggedIn ? this.props.hasConference ? 'hasConference' : 'originalHome' : 'Login'}>
        <Scene key='root'>
          <Scene hideNavBar initial={!this.props.isLoggedIn} key="Login" component={Login} initial />        
          <Scene hideNavBar onEnter={this.fetchConferences} key="home" component={hasConference ? SimpleHomeScreen : Home} initial={isLoggedIn} />
          <Scene hideNavBar onEnter={this.fetchConferences} key="originalHome" component={Home} />
          <Scene hideNavBar key="TermsAndPolicy" component={TermsPolicyScene} />        
          <Scene hideNavBar key="ForgotPassword" component={ForgotPasswordScene} />        
          <Scene hideNavBar key="Register" component={RegisterScene} />        
          <Scene hideNavBar key="Tour" component={TourScene} />
          <Scene hideNavBar key="settings" component={Settings} />
          <Scene hideNavBar key="privacySettings" component={PrivacySettings} />
          <Scene hideNavBar key="blockedUsers" component={BlockedUsers} />
          <Scene hideNavBar key="manageCards" component={ManageCards} />
          <Scene key="customizationSettings" component={CustomizationSettings} />
          <Scene hideNavBar key="notificationSettings" component={NotificationSettings} />
          <Scene hideNavBar key="analyticsView" component={AnalyticsView} />
          <Scene hideNavBar key="conferenceAttendees" component={ConferenceAttendees}  />
          <Scene hideNavBar key="conferenceEvents" component={ConferenceEvents}  />
          <Scene hideNavBar key="groupSelector" component={GroupSelector} />
          <Scene hideNavBar key="takeTour" component={TourScene} />
          <Scene hideNavBar key="itemDetail" component={ItemDetail} animation={"fade"} />
          <Scene hideNavBar key="commentDetail" component={CommentDetail} />
          <Scene hideNavBar key="myInfluences" component={Influences} />
          <Scene hideNavBar key="searchFollowing" component={SearchFollowing} />
          <Scene hideNavBar key="representatives" component={Representatives} />
          <Scene hideNavBar key="representatyprofile" component={RepresentatyProfile} />
          <Scene hideNavBar key="profile" component={Profile} />
          <Scene hideNavBar key="verifyProfile" component={VerifyProfile} />
          <Scene hideNavBar key="createGroup" component={CreateGroup} />
          <Scene hideNavBar key="groupprofile" component={GroupProfile} />
          <Scene hideNavBar key="myGroups" component={GroupList} />
          <Scene hideNavBar key="groupsearch" component={GroupSearch} />
          <Scene hideNavBar key="groupmembers" component={GroupMembers} />
          <Scene hideNavBar key="newCommunityReport" hideNavBar component={CommunityReportForm} animation={"fade"} />
          <Scene hideNavBar key="newpost" component={NewPost} animation={"fade"} />
          <Scene hideNavBar key="newpetition" component={NewPetition} animation={"fade"} />
          <Scene
            hideNavBar
            key="newleadercontent"
            component={NewLeaderContent}
            animation={"fade"}
          />
          <Scene hideNavBar key="search" component={Search} />
          <Scene hideNavBar key="groupInvite" component={GroupInvite} />
          <Scene hideNavBar key="groupJoin" component={GroupJoin} />
          <Scene hideNavBar key="managegroup" component={ManageGroup} />
          <Scene hideNavBar
            key="manageGroupMembers"
            component={GroupMembersManagementScene}
          />
          <Scene hideNavBar
            key="groupBankAccountScene"
            component={GroupBankAccountScene}
          />
          <Scene hideNavBar key="groupAddCardScene" component={GroupAddCardScene} />
          <Scene
            key="formModal"
            hideNavBar={false}
            component={Modal}
            direction="vertical"
            rightTitle="Save"
          />
          <Scene
            key="electedLeadersForm"
            component={ElectedLeadersForm}
            hideNavBar
          />
          <Scene hideNavBar key="userAddCardScene" component={UserAddCard} />
          <Scene hideNavBar key="share" component={Share} />
          <Scene hideNavBar key="terms" component={TermsList} />
          <Scene hideNavBar key="services" component={Services} />
        </Scene>
      </Router>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    fetchConferences: (t, b) => dispatch(fetchConferences(t, b))
  };
}

TermsPolicyScene.navigationOptions = props => {
  var { navigation } = props;
  var { state, setParams } = navigation;
  var { params } = state;
  var navTitle = (params.isTerms === true) ? 'Terms of Service' : 'Privacy Policy';
  return {
      headerTitle: `${navTitle}`,
  };
};

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
  token: state.user.token,
  hasConference: state.conferences.hasConference,
  isLoggedIn: state.user.isLoggedIn
});

module.exports = connect(mapStateToProps, bindAction)(PLNavigator);
