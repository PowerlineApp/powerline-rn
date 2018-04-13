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

import {} from "../../../actions/users";

import styles from "./styles";

class Notifications extends React.Component {
  state = {
    dnd: false,
    newPosts: false,
    boostedPosts: true
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
            <Button style={{ width: "100%" }} transparent onPress={Actions.pop}>
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
  token: user.token
});

export default connect(mapStateToProps)(Notifications);
