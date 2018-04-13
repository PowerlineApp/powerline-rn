import _ from "lodash";
import React from "react";
import Prompt from "react-native-prompt";
import {
  Alert,
  FlatList,
  TouchableHighlight,
  View,
  Image,
  Text,
  TouchableOpacity,
  Switch
} from "react-native";
import { MenuContext } from "react-native-popup-menu";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  Header,
  Left,
  Right,
  Title,
  Body,
  Button,
  Icon,
  Item,
  Input
} from "native-base";

import { setProfileSettings } from "../../../actions/users";

import styles from "./styles";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    const { user: { profile } } = props;

    console.error("Err:", profile);

    this.state = {
      dnd: profile.do_not_disturb,
      newPosts: profile.is_notif_micro_following,
      boostedPosts: profile.is_notif_micro_group
    };
  }

  saveAndExit = () => {
    const {
      dnd: do_not_disturb,
      newPosts: is_notif_micro_following,
      boostedPosts: is_notif_micro_group
    } = this.state;

    const originalValues = {
      do_not_disturb: this.props.user.profile.do_not_disturb,
      is_notif_micro_following: this.props.user.profile
        .is_notif_micro_following,
      is_notif_micro_group: this.props.user.profile.is_notif_micro_group
    };

    const {
      followed_do_not_disturb_till,
      is_notif_questions,
      is_notif_discussions,
      is_notif_messages,
      is_notif_scheduled,
      is_notif_own_post_changed,
      scheduled_from,
      scheduled_to
    } = this.props.user.profile;

    if (!_.isEqual(this.state, originalValues)) {
      setProfileSettings(this.props.user.token, {
        do_not_disturb,
        is_notif_micro_following,
        is_notif_micro_group,
        followed_do_not_disturb_till,
        is_notif_questions,
        is_notif_discussions,
        is_notif_messages,
        is_notif_scheduled,
        is_notif_own_post_changed,
        scheduled_from,
        scheduled_to
      })
        .then(profile => {
          this.props.dispatch({
            type: "USER_STATE",
            payload: { profile }
          });
          Actions.pop();
        })
        .catch(err => {
          console.error("Error:", err.message);
          Alert.alert("Oops", "There was an error saving your settings.", [
            { text: "Try again", onPress: this.saveAndExit },
            { text: "Leave anyway", onPress: Actions.pop }
          ]);
        });
    } else {
      Actions.pop();
    }
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
              onPress={this.saveAndExit}
            >
              <Icon active name="arrow-back" style={{ color: "white" }} />
            </Button>
          </Left>
          <Body>
            <Title>Notifications</Title>
          </Body>
        </Header>
        <View style={styles.container}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderLabel}>Notifications</Text>
            </View>
            <View style={styles.item}>
              <View style={styles.switchBox}>
                <Text style={styles.itemLabel}>Do Not Disturb</Text>
                <Switch
                  value={this.state.dnd}
                  onValueChange={dnd => this.setState({ dnd })}
                />
              </View>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>
                New Posts by Followed Influences
              </Text>
              <CheckBox
                checked={this.state.newPosts}
                onPress={() => {
                  this.setState({
                    newPosts: !this.state.newPosts
                  });
                }}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>Auto-Boosted Posts</Text>
              <CheckBox
                checked={this.state.boostedPosts}
                onPress={() => {
                  this.setState({
                    boostedPosts: !this.state.boostedPosts
                  });
                }}
              />
            </View>
          </View>
        </View>
      </MenuContext>
    );
  }
}

const CheckBox = ({ checked, onPress }) => {
  var component = null;
  if (checked) {
    component = <Icon name="ios-checkmark-circle" style={styles.toggleIcon} />;
  } else {
    component = <View style={styles.togglePlaceholder} />;
  }

  return <TouchableOpacity onPress={onPress}>{component}</TouchableOpacity>;
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Notifications);
