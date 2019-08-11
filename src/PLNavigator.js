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

import Share from "./PLShare";
import { Actions } from "react-native-router-flux";

var RouterWithRedux = connect()(Router);

class PLNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCustom: false };
  }
  static propTypes = {
  };
  openDrawer = () => { this.drawer._root.open() };
  setDrawer = (drawerRef) => {
    setDrawer(this.openDrawer)
  }

  render() {
    return (
      <StyleProvider
        style={getTheme(
          this.props.themeState === "material" ? material : undefined
        )}
      >
        <Drawer
          ref={(ref) => { this.drawer = ref; this.setDrawer(this._drawer) }} 
          content={<SideBar />}
          // open={this.props.drawerState === "opened"}
          // type="overlay"
          // tweenDuration={150}
          // tapToClose
          // acceptPan={false}
          // openDrawerOffset={0.3}
          // panCloseMask={0.2}
          // styles={{
          //   drawer: {
          //     shadowColor: "#000000",
          //     shadowOpacity: 0.8,
          //     shadowRadius: 3
          //   }
          // }}
          // tweenHandler={ratio => {
          //   return {
          //     drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
          //     main: {
          //       opacity: (2 - ratio) / 2
          //     }
          //   };
          // }}
          // negotiatePan
        >
          {/* <TouchableHighlight onPress={() => this.openDrawer()}>
            <View style={{width: 80, height: 80, backgroundColor: '#f0f'}}>
              <Text>open the</Text>
            </View>
          </TouchableHighlight> */}
          <MyRouter openDrawer={this.openDrawer} hasConference={this.props.hasConference} />
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

  onBackPress() {
    if (Actions.state.index === 0) {
      return false;
    }
    Actions.pop();
    return true;
  }

  render() {
    const { hasConference } = this.props;
    return (
      // <RouterWithRedux onBackPress={this.onBackPress} key="router">
      <Router key={this.props.hasConference ? 'hasConference' : 'originalHome'}>
        <Scene key="root" hideNavBar>
          <Scene key="settings" component={Settings} />
          <Scene key="privacySettings" component={PrivacySettings} />
          <Scene key="blockedUsers" component={BlockedUsers} />
          <Scene key="manageCards" component={ManageCards} />
          <Scene
            key="customizationSettings"
            component={CustomizationSettings}
          />
          <Scene key="notificationSettings" component={NotificationSettings} />
          <Scene key="analyticsView" component={AnalyticsView} hideNavBar />

          <Scene key="home" component={hasConference ? SimpleHomeScreen : Home} initial hideNavBar />
          <Scene key="originalHome" component={Home} hideNavBar />
          <Scene key="simpleHome" component={SimpleHomeScreen} hideNavBar  />

          <Scene key="conferenceAttendees" component={ConferenceAttendees} hideNavBar  />
          <Scene key="conferenceEvents" component={ConferenceEvents} hideNavBar  />
          <Scene key="groupSelector" component={GroupSelector} />
          <Scene key="takeTour" component={TourScene} />
          <Scene key="itemDetail" component={ItemDetail} animation={"fade"} />
          <Scene key="commentDetail" component={CommentDetail} />
          <Scene key="myInfluences" component={Influences} />
          <Scene key="searchFollowing" component={SearchFollowing} />
          <Scene key="representatives" component={Representatives} />
          <Scene key="representatyprofile" component={RepresentatyProfile} />
          <Scene key="profile" component={Profile} />
          <Scene key="verifyProfile" component={VerifyProfile} />
          <Scene key="createGroup" component={CreateGroup} />
          <Scene key="groupprofile" component={GroupProfile} />
          <Scene key="myGroups" component={GroupList} />
          <Scene key="groupsearch" component={GroupSearch} />
          <Scene key="groupmembers" component={GroupMembers} />
          <Scene key="newCommunityReport" component={CommunityReportForm} animation={"fade"} />
          <Scene key="newpost" component={NewPost} animation={"fade"} />
          <Scene key="newpetition" component={NewPetition} animation={"fade"} />
          <Scene
            key="newleadercontent"
            component={NewLeaderContent}
            animation={"fade"}
          />
          <Scene key="search" component={Search} />
          <Scene key="groupInvite" component={GroupInvite} />
          <Scene key="groupJoin" component={GroupJoin} />
          <Scene key="managegroup" component={ManageGroup} />
          <Scene
            key="manageGroupMembers"
            component={GroupMembersManagementScene}
          />
          <Scene
            key="groupBankAccountScene"
            component={GroupBankAccountScene}
          />
          <Scene key="groupAddCardScene" component={GroupAddCardScene} />
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
          <Scene key="userAddCardScene" component={UserAddCard} />
          <Scene key="share" component={Share} />
          <Scene key="terms" component={TermsList} />
          <Scene key="services" component={Services} />
        </Scene>
      </Router>
      // </RouterWithRedux>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer())
  };
}

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
  hasConference: state.conferences.hasConference
});

module.exports = connect(mapStateToProps, bindAction)(PLNavigator);
