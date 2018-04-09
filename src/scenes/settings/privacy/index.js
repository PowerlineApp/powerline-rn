import React from "react";
import { connect } from "react-redux";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import styles from "./styles";

class PrivacySettings extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        {Object.keys(this.props.privacy_settings).map((key, index) => {
          return (
            <Setting
              key={key}
              first={index === 0}
              label={key}
              value={this.props.privacy_settings[key]}
            />
          );
        })}
      </ScrollView>
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
          <TouchableOpacity onPress={() => {}}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={styles.itemValue}>
                {this.remapValue(this.props.value)}
              </Text>
              <Icon
                name="ios-arrow-forward"
                size={22}
                color="#C6C6C6"
                style={{ marginLeft: 10 }}
              />
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

export default connect(mapStateToProps)(PrivacySettings);
