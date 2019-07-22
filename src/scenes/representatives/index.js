//My Representatives is accessible via the burger menu. It loads the logged-in user's linked elected leaders
//Backend will link user to specific elected leaders during registration (and update if user changes information)
//This is GH34

import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Icon,
  Button,
  List,
  ListItem,
  Text,
  Content,
  Thumbnail,
  Right
} from "native-base";

import {
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers
} from "react-native-popup-menu";
import { View, RefreshControl } from "react-native";
import { Platform } from "react-native";

const PLColors = require("PLColors");
import styles from "./styles";
import { getRepresentatives, openDrawer } from "PLActions";
import PLOverlayLoader from "PLOverlayLoader";

class Representatives extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      per_page: 10,
      items: 0,
      groups: [],
      totalItems: 10,
      refreshing: false
    };
  }

  componentWillMount() {
    this._onRefresh();
  }

  loadRepresentatives() {
    var { token } = this.props;
    console.log(token);
    getRepresentatives(token, 1, 20)
      .then(data => {
        console.log("data", data);
        this.setState({
          groups: data,
          refreshing: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          refreshing: false
        });
      });
  }

  //GH35 is the Representative's Specific Page
  goToProfile(storageId, representativeId) {
    Actions.representatyprofile({
      storageId,
      representativeId
    });
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    });
    this.loadRepresentatives();
  }

  render() {
    return (
      <MenuContext customStyles={menuContextStyles}>
        <Container>
          <Header style={styles.header}>
            <Left style={{ flex: 1 }}>
              <Button
                style={{ width: "100%" }}
                transparent
                onPress={this.props.openDrawer}
              >
                <Icon active name="menu" style={{ color: "white" }} />
              </Button>
            </Left>
            <Body
              style={{
                flex: 5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Title style={{ color: "#fff" }}>My Representatives</Title>
            </Body>
            <View style={{ flex: 1 }} />
          </Header>
          <Content
            refreshControl={
              Platform.OS === "android" && (
                <RefreshControl
                  refreshing={false}
                  onRefresh={this._onRefresh.bind(this)}
                />
              )
            }
            onScroll={e => {
              var offset = e.nativeEvent.contentOffset.y;
              if (Platform.OS === "ios" && offset < -3) {
                this._onRefresh();
              }
            }}
          >
            <List style={{ backgroundColor: "white" }}>
              {(this.state.groups || []).map((group, index) => {
                return (
                  <View key={index}>
                    <ListItem itemHeader style={styles.itemHeaderStyle}>
                      <Text style={styles.itemHeaderText}>{group.title}</Text>
                    </ListItem>
                    {group.representatives.map((user, index1) => {
                      // console.log(user);
                      return (
                        <ListItem
                          onPress={() => this.goToProfile(user.id)}
                          key={index1}
                        >
                          <Thumbnail
                            square
                            size={80}
                            source={{
                              uri:
                                user.avatar_file_path +
                                "&w=150&h=150&auto=compress,format,q=95"
                            }}
                          />
                          <Body>
                            <Text style={{ color: PLColors.main }}>
                              {user.first_name} {user.last_name}
                            </Text>
                            <Text note style={styles.text1}>
                              {user.official_title}
                            </Text>
                          </Body>
                          <Right>
                            <Icon name="ios-arrow-forward" />
                          </Right>
                        </ListItem>
                      );
                    })}
                  </View>
                );
              })}
            </List>
            {// The is_registration_complete is the wrong reference. Button should show to all users if verified.
            this.props.is_registration_complete ? (
              <View style={{ padding: 20 }}>
                <Button
                  style={{ width: "100%", justifyContent: "center" }}
                  onPress={Actions.electedLeadersForm}
                  iconRight
                >
                  <Text>Register Representative</Text>
                </Button>
              </View>
            ) : null}
          </Content>
          <PLOverlayLoader
            marginTop={200}
            visible={this.state.refreshing}
            logo
          />
        </Container>
      </MenuContext>
    );
  }
}

const menuContextStyles = {
  menuContextWrapper: styles.container,
  backdrop: styles.backdrop
};

const mapStateToProps = state => ({
  token: state.user.token,
  is_registration_complete: state.user && state.user.profile && state.user.profile.is_registration_complete
});

const mapDispatchToProps = dispatch => ({
  openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Representatives);
