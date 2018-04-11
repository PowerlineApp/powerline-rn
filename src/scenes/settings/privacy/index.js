import _ from "lodash";
import React from "react";
import ActionSheet from "react-native-actionsheet";
import Ionicon from "react-native-vector-icons/Ionicons";
import PLOverlayLoader from "PLOverlayLoader";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { Alert, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { MenuContext } from "react-native-popup-menu";
import { Header, Left, Title, Body, Button, Icon, Item } from "native-base";

import {
  getPrivacySettings,
  updatePrivacySettings
} from "../../../actions/users";

import styles from "./styles";
var PLColors = require("PLColors");

const menuContextStyles = {
  menuContextWrapper: { height: 50 },
  backdrop: styles.backdrop
};

class PrivacySettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.privacy_settings,
      loading: true,
      actionSheet: {
        title: "",
        options: [],
        cancelButtonIndex: 0,
        destructiveButtonIndex: null,
        onPress: () => {}
      }
    };
  }

  componentDidMount = () => {
    console.log("Privacy Mounted");
    getPrivacySettings(this.props.token)
      .then(data => {
        console.log("Privacy Resolved");
        this.props.dispatch({
          type: "PRIVACY_SETTINGS_STATE",
          payload: data
        });

        console.log("Privacy dispatched:", Date.now());

        this.setState({ loading: false });
      })
      .catch(err => {
        console.log("Privacy Error:", err);
        Alert.alert(
          "Oops..",
          err == "timeout"
            ? "Response timed out."
            : "There was an error loading your privacy settings, please try again later."
        );
        this.setState({ loading: false });
        Actions.pop();
      });
  };

  componentWillReceiveProps = nextProps => {
    console.warn("Privacy ComponentWillReceiveProps executed:", Date.now());
    var obj = { ...nextProps.privacy_settings };
    this.setState(obj);
  };

  saveOnExit = () => {
    const purgedState = _.omit(
      this.state,
      "actionSheet",
      "loading",
      "email",
      "name",
      "country",
      "zip",
      "responses",
      "karma",
      "referral_code",
      "username"
    );

    const purgedProps = _.omit(
      this.props.privacy_settings,
      "email",
      "name",
      "country",
      "zip",
      "responses",
      "karma",
      "referral_code",
      "username"
    );

    let promise = Promise.resolve();
    if (!_.isEqual(this.props.privacy_settings, purgedState)) {
      this.setState({ loading: true });
      promise = new Promise((resolve, reject) => {
        updatePrivacySettings(this.props.token, purgedState)
          .then(data => {
            this.props.dispatch({
              type: "PRIVACY_SETTINGS_STATE",
              payload: data
            });
            resolve();
          })
          .catch(err => reject(err));
      });
    }

    promise
      .then(() => {
        this.setState({ loading: false });
        Actions.pop();
      })
      .catch(err => {
        this.setState({ loading: false });
        Alert.alert(
          "Oops",
          "There was an unexpected error when saving your settings.",
          [{ text: "Ok" }, { text: "Leave anyway", onPress: Actions.pop }]
        );
      });
  };

  render() {
    return (
      <MenuContext>
        <Header
          searchBar
          rounded
          style={[styles.header, { backgroundColor: PLColors.main }]}
        >
          <Left
            style={{
              flex: 0.1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button
              style={{ width: "100%" }}
              transparent
              onPress={this.saveOnExit}
            >
              <Icon active name="arrow-back" style={{ color: "white" }} />
            </Button>
          </Left>
          <Body>
            <Title>Privacy Settings</Title>
          </Body>
        </Header>
        <ScrollView style={styles.container}>
          {Object.keys(this.state).map((key, index) => {
            if (key == "actionSheet" || key == "loading") return null;
            console.warn("Key:", key);
            const options = map[key].options;
            return (
              <Setting
                key={key}
                first={index === 0}
                label={key}
                value={this.state[key]}
                onPress={
                  options == null
                    ? null
                    : () => {
                        this.setState({
                          actionSheet: {
                            title: "Select one",
                            options: options.concat("Cancel"),
                            cancelButtonIndex: options.length,
                            onPress: index => {
                              if (index == options.length) {
                                return;
                              }

                              var updateObj = {};
                              updateObj[key] = options[index];
                              this.setState(updateObj);
                            }
                          }
                        });
                        this.actionSheet.show();
                      }
                }
              />
            );
          })}

          <ActionSheet
            ref={ref => (this.actionSheet = ref)}
            {...this.state.actionSheet}
          />

          {this.state.loading && (
            <PLOverlayLoader
              visible={this.state.loading}
              marginTop={200}
              logo
            />
          )}
        </ScrollView>
      </MenuContext>
    );
  }
}

class Setting extends React.Component {
  remapValue = value => {
    switch (value) {
      case "group leaders":
        return "approved group leaders";
    }
    return value.replace("and", "&");
  };

  remapLabel = label => {
    switch (label) {
      case "referral_code":
        return "Referral Code";
      case "street_address":
        return "Street Address";
      case "joined_groups":
        return "Joined Groups";
      case "number_of_followers":
        return "# of Followers";
      case "number_of_followings":
        return "# of Followings";
      case "social_media_links":
        return "Social Media";
      default:
        return label.charAt(0).toUpperCase() + label.slice(1);
    }
  };

  render() {
    const containerStyles = [styles.item];
    if (this.props.first) containerStyles.push(styles.itemFirst);

    return (
      <View style={containerStyles}>
        <Text style={styles.itemLabel}>
          {this.remapLabel(this.props.label)}
        </Text>
        <View style={styles.itemActionContainer}>
          <TouchableOpacity
            onPress={this.props.onPress}
            disabled={this.props.onPress == null}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={styles.itemValue}>
                {this.remapValue(this.props.value)}
              </Text>
              {this.props.onPress && (
                <Ionicon
                  name="ios-arrow-forward"
                  size={22}
                  color="#C6C6C6"
                  style={{ marginLeft: 10 }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const EVERYONE = "everyone";
const GROUP_LEADERS = "group leaders";
const APPROVED_AND_GROUP_LEADERS = "group leaders and followers";
const APPROVED_FOLLOWERS = "followers";
const NOBODY = "no one";

const map = {
  name: { default: EVERYONE },
  country: { default: EVERYONE },
  zip: { default: GROUP_LEADERS },
  email: { default: GROUP_LEADERS },
  responses: { default: EVERYONE },
  karma: { default: EVERYONE },
  referral_code: { default: EVERYONE },
  username: { default: EVERYONE },
  street_address: { default: GROUP_LEADERS, options: [GROUP_LEADERS, NOBODY] },
  phone: { default: GROUP_LEADERS, options: [GROUP_LEADERS, NOBODY] },
  joined_groups: { default: NOBODY, options: [NOBODY, APPROVED_FOLLOWERS] },
  followers: { default: NOBODY, options: [NOBODY, EVERYONE] },
  followings: { default: NOBODY, options: [NOBODY, EVERYONE] },
  birthdate: {
    default: APPROVED_AND_GROUP_LEADERS,
    options: [APPROVED_AND_GROUP_LEADERS, GROUP_LEADERS, EVERYONE, NOBODY]
  },
  city: {
    default: APPROVED_AND_GROUP_LEADERS,
    options: [APPROVED_AND_GROUP_LEADERS, GROUP_LEADERS, EVERYONE, NOBODY]
  },
  state: {
    default: APPROVED_AND_GROUP_LEADERS,
    options: [APPROVED_AND_GROUP_LEADERS, GROUP_LEADERS, EVERYONE, NOBODY]
  },
  social_media_links: {
    default: APPROVED_AND_GROUP_LEADERS,
    options: [APPROVED_AND_GROUP_LEADERS, GROUP_LEADERS, EVERYONE, NOBODY]
  },
  number_of_followers: {
    default: EVERYONE,
    options: [APPROVED_AND_GROUP_LEADERS, GROUP_LEADERS, EVERYONE, NOBODY]
  },
  number_of_followings: {
    default: EVERYONE,
    options: [APPROVED_AND_GROUP_LEADERS, GROUP_LEADERS, EVERYONE, NOBODY]
  }
};

const mapStateToProps = state => ({
  privacy_settings: {
    ...state.privacySettings
  },
  token: state.user.token
});

export default connect(mapStateToProps)(PrivacySettings);
