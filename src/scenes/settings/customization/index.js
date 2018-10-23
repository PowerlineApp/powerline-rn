import React from "react";
import Prompt from "react-native-prompt";
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

class CustomizationSettings extends React.Component {
  state = {
    isPromptOpen: false,
    codes: [
      { key: 1, code: "aHiej7UeFiuxkeQz" },
      { key: 2, code: "0u7Knub47NuqzTw" }
    ]
  };

  componentDidMount = () => {
    Alert.alert(
      "Information",
      "There's currently not an API endpoint set up for this, I've referenced the documentation and the .XLS file.  api-profile-update has been removed and v2.2-user-agency only has a GET parameter."
    );
  };

  addCode = () => {
    const { codes } = this.state;
    if (codes.length >= 2) {
      Alert.alert(
        "Oops",
        "You may only have a maximum of two customization codes."
      );
      return;
    }

    this.setState({ isPromptOpen: true });
  };

  removeCode = code => {
    Alert.alert("Are you sure?", "Removing this code will ...?", [
      { text: "Nevermind" },
      {
        text: "Yes I'm sure",
        onPress: () => {
          this.setState({
            codes: this.state.codes.filter(c => c.key != code.key)
          });
        }
      }
    ]);
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
            <Title style={{ color: 'white' }}>Customization</Title>
          </Body>
        </Header>
        <Text style={styles.description}>
          By entering a code below, you are allowing us to customize your
          Powerline experience.
        </Text>
        <FlatList
          style={{ marginTop: 40 }}
          data={this.state.codes}
          ListHeaderComponent={() => {
            return (
              <View style={styles.headerContainer}>
                <Text style={styles.headerLabel}>ACTIVE CODES</Text>
                <TouchableOpacity onPress={this.addCode}>
                  <Text style={styles.headerLabel}>Add Code</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemInfoContainer}>
                <Text style={styles.itemLabel}>{item.code}</Text>
              </View>
              <TouchableOpacity onPress={() => this.removeCode(item)}>
                <Icon
                  style={styles.deleteIcon}
                  name="md-close-circle"
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}
        />

        <Text style={styles.description}>
          Your code may link you to other users or groups. You may manually
          leave groups or unfollow users at any time.
        </Text>

        <Prompt
          title="Enter your code"
          placeholder="Start typing"
          visible={this.state.isPromptOpen}
          onCancel={() => {
            /* cancel */
            this.setState({ isPromptOpen: false });
          }}
          onSubmit={value => {
            /* onSubmit */
            this.setState({
              isPromptOpen: false,
              codes: this.state.codes.concat({
                key: Math.random(),
                code: value
              })
            });
          }}
        />
      </MenuContext>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  token: user.token
});

export default connect(mapStateToProps)(CustomizationSettings);
