import React from "react";
import {
  Alert,
  FlatList,
  TouchableHighlight,
  View,
  Image,
  Text,
  TouchableOpacity
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

class UserCards extends React.Component {
  state = {
    codes: [
      { key: 1, code: "aHiej7UeFiuxkeQz" },
      { key: 2, code: "0u7Knub47NuqzTw" },
      { key: "add", add: true }
    ]
  };

  componentDidMount = () => {};

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
            <Title>Manage Cards</Title>
          </Body>
        </Header>
        <Text style={styles.description}>
          By entering a code below, you are allowing us to customize your
          Powerline experience.
        </Text>
        <FlatList
          data={this.state.cards.concat({ key: "add", add: true })}
          renderItem={({ item }) => {
            if (item.add) {
              return (
                <View
                  style={{
                    marginVertical: 20,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Actions.userAddCardScene({
                        onSuccess: data => {
                          Actions.pop();
                          const { id, cards } = data;
                          this.setState({ cards });
                          alert("You've successfully added a new card");
                        }
                      });
                    }}
                  >
                    <Text style={styles.itemLabel}>Add a new code</Text>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <View style={styles.item}>
                  <View style={styles.itemInfoContainer}>
                    <Text style={styles.numberGroup}>{item.code}</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.deleteCard(item)}>
                    <Icon
                      style={styles.deleteIcon}
                      name="md-close-circle"
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              );
            }
          }}
        />

        <Text style={styles.description}>
          Your code may link you to other users or groups. You may manually
          leave groups or unfollow users at any time.
        </Text>
      </MenuContext>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  token: user.token
});

export default connect(mapStateToProps)(UserCards);
