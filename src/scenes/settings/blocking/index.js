import React from "react";
import {
  Alert,
  FlatList,
  TouchableHighlight,
  View,
  Image,
  Text
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
  state = { users: [] };

  componentDidMount = () => {
    getBlockedUsers(this.props.token)
      .then(data => {
        this.setState({ users: data });
      })
      .catch(err => {
        Alert.alert(
          "Oops",
          "There was an error getting the list of blocked users, please try again."
        );
        Actions.pop();
      });
  };

  unblock = user => {
    Alert.alert(
      "Information",
      "Are you sure you want to unblock " + user.first_name + "?",
      [
        {
          text: "Yes",
          onPress: () => {
            unblockUser(this.props.token, user.id)
              .then(() => {
                const users = this.state.users.filter(u => u.id != user.id);
                this.setState({ users });
              })
              .catch(err => {
                console.error("Erro unblocking user:", err);
              });
          }
        },
        { text: "Nevermind" }
      ]
    );
  };

  render() {
    return (
      <MenuContext>
        <Header searchBar rounded style={styles.header}>
          <Left
            style={{
              flex: null,
              paddingLeft: 10,
              width: 50,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button style={{ width: "100%" }} transparent onPress={Actions.pop}>
              <Icon active name="arrow-back" style={{ color: "white" }} />
            </Button>
          </Left>
          <Body
            style={{
              justifyContent: "flex-start"
            }}
          >
            <Title>Blocked Users</Title>
          </Body>
          <Right
            style={{
              flex: null,
              paddingRight: 10,
              width: 50,
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
          data={this.state.users}
          renderItem={({ item }) => (
            <TouchableHighlight
              onLongPress={() => {
                this.unblock(item);
              }}
            >
              <View style={styles.item}>
                <Image
                  style={styles.itemAvatar}
                  source={{ uri: item.avatar_file_name }}
                />
                <View style={styles.itemInfoContainer}>
                  <Text style={styles.itemLabel}>
                    {item.first_name + " " + item.last_name}
                  </Text>
                  <Text style={styles.itemSubLabel}>
                    You blocked {item.first_name} on PLACEHOLDER_DATE
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
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
