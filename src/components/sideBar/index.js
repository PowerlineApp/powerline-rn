import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Text,
  ListItem,
  List,
  Left,
  Icon,
  Right,
  Button
} from "native-base";
import { Actions } from "react-native-router-flux";

import { closeDrawer } from "../../actions/drawer";
import { logOut, logOutWithPrompt, setGroup, fetchConferences } from "../../actions";

import styles from "./style";
import OneSignal from "react-native-onesignal";
import { Keyboard, Modal, TextInput, View, FlatList, TouchableOpacity } from "react-native";
import { Mixpanel } from "../../PLEnv";
import AsyncStorage from '@react-native-community/async-storage';


let datas = [
  {
    name: "Home",
    route: "home",
    icon: "home",
    bg: "#C5F442",
    option: { type: "reset" }
  },
  {
    name: "Search",
    route: "search",
    icon: "search",
    bg: "#477EEA"
  },
  {
    name: "My Groups",
    route: "myGroups",
    icon: "people",
    bg: "#DA4437"
  },
  {
    name: "Create Group",
    route: "createGroup",
    icon: "add",
    bg: "#4DCAE0"
  },
  {
    name: "My Influences",
    route: "myInfluences",
    icon: "git-network",
    bg: "#1EBC7C"
  },
  // {
  //   name: 'Custom Code',
  //   route: 'enter-custom-code',
  //   icon: 'more',
  //   bg: '#1EBC7C',
  // },
  {
    name: "Representatives",
    route: "representatives",
    icon: "color-filter",
    bg: "#B89EF5"
  }
];

let verifyProfile = [
  {
    name: "Verify Profile",
    route: "verifyProfile",
    icon: "contact",
    bg: "#3591FA"
  }
];

let data2 = [
  {
    name: "My Profile",
    route: "profile",
    icon: "contact",
    bg: "#3591FA"
  },
  //{
  //  name: 'Favorites',
  //  route: 'favorites',
  //  icon: 'star',
  //  bg: '#EB6B23',
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
    name: "Settings",
    route: "settings",
    icon: "settings",
    bg: "#C5F442"
  },
  {
    name: "Take Tour",
    route: "takeTour",
    icon: "school",
    bg: "#3591FA"
  },
  {
    name: "Share this App",
    route: "shareApp",
    icon: "share",
    bg: "#3591FA"
  },
  {
    name: "Logout",
    route: "logout",
    icon: "log-out",
    bg: "#3591FA"
  }
];

class SideBar extends Component {
  constructor() {
    super();
    this.state = {
      enterCustomCode: false
    };
  }

  navigateTo(route) {
    this.props.navigateTo(route, "home");
  }

  enterCustomCode() {
    this.setState({ enterCustomCode: true });
  }

  onSelectItem(route, option) {
    if (route === "home") {
      let data = { id: "all", group: "all", header: "all" };
      Actions.home();
      setTimeout(() => {
        this.props.setGroup(data, this.props.token, "all");
      }, 1000);
    }

    else if (route == "logout") {
      let { token } = this.props;
      this.props.logOut(token);
      Mixpanel.track("Logout via Menu");
    } else if (route === "enter-custom-code") {
      this.enterCustomCode();
    } else if (typeof route === "string") {
      Actions[route](option);
    } else {
      Keyboard.dismiss();
      Actions["home"]();
    }
    this.props.closeDrawer();
  }

  enterCustomCode() {
    let code = this.state.customCode;
    if (this.state.sending) return;
    this.setState({ sending: true });
    // send

    // show toast on success/error

    this.setState({ sending: false, enterCustomCode: false });
  }

  customCodeModal() {
    return (
      <Modal
        visible={this.state.enterCustomCode}
        transparent
        style={styles.container}
        onRequestClose={() => {}}
      >
        <View style={styles.background}>
          <View style={styles.prompt}>
            <Text style={styles.promptTitle}>
              Enter a custom code to attach it to your profile!
            </Text>
            <Text style={styles.promptContent}>
              Custom codes can link you to specific agency groups and much more!
            </Text>

            <View style={styles.textInput}>
              <TextInput
                keyboardType={"default"}
                onChangeText={value => this.setState({ customCode: value })}
                placeholder={"Custom code"}
                value={this.state.customCode}
              />
            </View>
            <View style={styles.buttonsRow}>
              <Button
                style={styles.button}
                onPress={() => this.setState({ enterCustomCode: false })}
              >
                <Text style={{ fontWeight: "700" }}>Cancel</Text>
              </Button>
              <Button
                style={styles.button}
                onPress={() => this.enterCustomCode()}
              >
                <Text style={{ fontWeight: "700" }}>Send</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    let data = [...datas];
    if (!this.props.is_verified) {
      data = [...data, ...verifyProfile]; // data.concat(verifyProfile);
    }
    data = [...data, ...data2];
    return (
      <View style={styles.sidebar}>
      {this.customCodeModal()}
      <FlatList
          data={data}
          renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.onSelectItem(item.route, item.option)} >
                <View
                  style={{marginLeft: 17, paddingVertical: 15, paddingRight: 17, height: 56, width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}
                  button
                  noBorder
                  >
                  <Icon
                    active
                    name={item.icon}
                    style={{ color: "white", fontSize: 26, width: 30 }}
                    />
                  <Text style={styles.text}>{item.name}</Text>
                  <View />
                  <View />
                </View>
              </TouchableOpacity>
          )}
        />
      </View >
    );
  }
}




function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    logOut: token => dispatch(logOutWithPrompt(token)),
    setGroup: (data, token, group) => dispatch(setGroup(data, token, group)),
    fetchConferences: token => dispatch(fetchConferences(token))
  };
}

const mapStateToProps = state => ({
  token: state.user.token,
  is_verified: state.user.profile && state.user.profile.is_verified,
  pushId: state.user.pushId,
  conferences: state.conferences,
});

export default connect(mapStateToProps, bindAction)(SideBar);
