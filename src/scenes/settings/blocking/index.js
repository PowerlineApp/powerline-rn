import React from "react";
import { FlatList, TouchableHighlight, View, Image, Text } from "react-native";
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

import { getBlockedUsers, unblockUser } from "../../../actions/users";

import styles from "./styles";

const PLACEHOLDER_SOURCE = [
  {
    key: 0,
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    date: "January 2nd, 2018",
    name: "Christian"
  },
  {
    key: 1,
    avatar: "https://randomuser.me/api/portraits/men/27.jpg",
    date: "January 21st, 2018",
    name: "Robert"
  },
  {
    key: 2,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    date: "Feburary 3rd, 2018",
    name: "Thomas"
  },
  {
    key: 3,
    avatar: "https://randomuser.me/api/portraits/men/59.jpg",
    date: "March 7th, 2018",
    name: "Elliot"
  }
];

class BlockedUsers extends React.Component {
  componentDidMount = () => {
    getBlockedUsers(this.props.token)
      .then(data => {
        console.error("BlockedUsers:", data);
      })
      .catch(err => {
        console.error("Error:", err);
      });
  };

  render() {
    return (
      <MenuContext>
        <Header searchBar rounded style={styles.header}>
          <Left
            style={{
              flex: 1,
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
          <Body style={{ flex: 6 }}>
            <Title>Blocked Users</Title>
          </Body>
          <Right
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button style={{ width: "100%" }} transparent onPress={Actions.pop}>
              <Icon active name="md-add" color="white" size={32} />
            </Button>
          </Right>
        </Header>
        <Item style={styles.searchBar}>
          <Input
            style={styles.searchInput}
            placeholder="Filter blocked users"
            value={""}
            onChangeText={text => {}}
          />
          <Icon active name="search" style={styles.searchIcon} />
        </Item>
        <Text style={styles.description}>
          Blocked users are shown below. Blocked users will not appear in your
          feed and you will not appear in their feed. Blocked users cannot
          engage with you or your content.
        </Text>
        <Text style={[styles.description, { marginTop: 0 }]}>
          Tap and hold on user to unblock.
        </Text>
        <FlatList
          data={PLACEHOLDER_SOURCE}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image style={styles.itemAvatar} source={{ uri: item.avatar }} />
              <View style={styles.itemInfoContainer}>
                <Text style={styles.itemLabel}>{item.name}</Text>
                <Text style={styles.itemSubLabel}>
                  You blocked {item.name} on {item.date}
                </Text>
              </View>
            </View>
          )}
        />
      </MenuContext>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  token: user.token
});

export default connect(mapStateToProps)(BlockedUsers);
