import _ from "lodash";
import React from "react";
import ActionSheet from "react-native-actionsheet";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { Alert, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { MenuContext } from "react-native-popup-menu";
import { Header, Left, Title, Body, Button, Icon, Item } from "native-base";

import { openDrawer } from "../../../actions/drawer";
import styles from "./styles";

const menuContextStyles = {
  menuContextWrapper: { height: 50 },
  backdrop: styles.backdrop
};

class PrivacySettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.privacy_settings,
      actionSheet: {
        title: "",
        options: [],
        cancelButtonIndex: 0,
        destructiveButtonIndex: null,
        onPress: () => {}
      }
    };
  }

  componentWillReceiveProps = nextProps => {
    var obj = { ...nextProps.privacy_settings };
    this.setState(obj);
  };

  saveOnExit = () => {
    const purgedState = _.omit(this.state, "actionSheet");

    let promise = Promise.resolve();
    if (!_.isEqual(this.props.privacy_settings, purgedState)) {
      promise = Promise.resolve();
    }

    promise
      .then(() => {
        Actions.pop();
      })
      .catch(err => {
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
        <Header searchBar rounded style={styles.header}>
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
            if (key == "actionSheet") return null;
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
        </ScrollView>
      </MenuContext>
    );
  }
}

class Setting extends React.Component {
  remapValue = value => {
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
    name: null || map.name.default,
    country: null || map.country.default,
    zip: null || map.zip.default,
    email: null || map.email.default,
    responses: null || map.responses.default,
    karma: null || map.karma.default,
    referral_code: null || map.referral_code.default,
    username: null || map.username.default,
    street_address: null || map.street_address.default,
    phone: null || map.phone.default,
    joined_groups: null || map.joined_groups.default,
    followers: null || map.followers.default,
    followings: null || map.followings.default,
    birthdate: null || map.birthdate.default,
    city: null || map.city.default,
    state: null || map.state.default,
    social_media_links: null || map.social_media_links.default,
    number_of_followers: null || map.number_of_followers.default,
    number_of_followings: null || map.number_of_followings.default
  }
});

const mapDispatch = {
  openDrawer: openDrawer
};

export default connect(mapStateToProps, mapDispatch)(PrivacySettings);
