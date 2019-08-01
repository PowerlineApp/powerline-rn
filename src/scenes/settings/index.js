import React from "react";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { Text, View, TouchableHighlight, Alert, AsyncStorage } from "react-native";
import { Actions } from "react-native-router-flux";
import { MenuContext } from "react-native-popup-menu";
import { Header, Left, Title, Body, Button, Icon, Item } from "native-base";
import { ImageCache } from "react-native-img-cache";

import Prompt from '../../components/prompt';
import styles from "./styles";
import { openDrawer } from "../../actions/drawer";
import { updateUserProfile } from "../../actions/users";

import {
  getAgency,
  fetchConferences
} from "../../actions";
import PLOverlayLoader from "../../common/PLOverlayLoader";

var PLColors = require("../../common/PLColors");
var { TERMS_OF_SERVICE, PRIVACY_POLICY } = require("../../common/PLConstants");

const icons = [
  {
    icon: "md-lock",
    label: "Privacy Settings",
    onPress: () => Actions.privacySettings()
  },
  {
    icon: "md-options",
    label: "Customization Code",
    onPress: $this => {
      $this.setState(
        {
          promptValue: $this.props.user.profile.agency || ""
        },
        () => {
          $this.setState({
            isPromptOpen: true
          });
        }
      );
      // Actions.customizationSettings();
    }
  },
  {
    icon: "md-eye-off",
    label: "Blocked Users",
    onPress: () => {
      Actions.blockedUsers();
    }
  },
  {
    icon: "md-card",
    label: "Payment Info",
    onPress: () => {
      Actions.manageCards();
    }
  },
  {
    icon: "md-notifications",
    label: "Notifications",
    onPress: () => {
      Actions.notificationSettings();
    }
  },
  {
    icon: "md-person",
    label: "My Profile",
    onPress: () => {
      Actions.pop();
      Actions.profile();
    }
  },
  { icon: "md-mail", label: "Contact Us", onPress: () => {} },
  {
    icon: "md-list",
    label: "Terms of Service",
    onPress: () => {
      Actions.terms({ terms: TERMS_OF_SERVICE, title: "Terms of Service" });
    }
  },
  {
    icon: "md-list",
    label: "Privacy Policy",
    onPress: () => {
      Actions.terms({ terms: PRIVACY_POLICY, title: "Privacy Policy" });
    }
  }
];

class Component extends React.Component {
  state = {
    isPromptOpen: false,
    promptValue: "",
    loading: false,
  };

  componentDidMount = () => {
    // console.error("Agency:", JSON.stringify(this.props.agency, null, 2));
    // this.props.fetchConferences(this.props.token)
    // console.log('fetch fui!')
  };

  render() {
    const { loading } = this.state;
    return (
      <MenuContext>
        <Header
          searchBar
          rounded
          style={[styles.header, { backgroundColor: PLColors.main }]}
        >
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
              justifyContent: "flex-start",
              alignItems: 'center' 
            }}
          >
            <Title style={{ color: 'white' }}>Settings</Title>
          </Body>
        </Header>

        <View style={styles.container}>
          <View style={styles.wrapper}>
            {icons.map((icon, index) => {
              return (
                <View style={styles.item}>
                  <TouchableHighlight
                    key={index}
                    style={styles.iconContainer}
                    underlayColor="#474b87"
                    onPress={() => icon.onPress(this)}
                  >
                    <Ionicon name={icon.icon} size={40} color={PLColors.main} />
                  </TouchableHighlight>
                  <Text style={styles.label}>{icon.label}</Text>
                </View>
              );
            })}
          </View>
          
          <PLOverlayLoader
            visible={loading}
            marginTop={200}
            logo
          />
          
        </View>
        
        <Prompt
          title="Enter your code"
          placeholder="Start typing"
          visible={this.state.isPromptOpen}
          defaultValue={this.state.promptValue}
          onCancel={() => {
            /* cancel */
            this.setState({ isPromptOpen: false });
          }}
          onSubmit={value => {
            value = value.toUpperCase()
            /* onSubmit */
            this.setState({ loading: true });
            updateUserProfile(this.props.user.token, { agency: value })
              .then(() => {
                this.props.dispatch({
                  type: "USER_STATE",
                  payload: { profile: { agency: value } }
                });
                getAgency(this.props.user.token)
                .then(r => {
                  if (r.splash_screen) {
                    let uri = r.splash_screen; //"https://static-cdn.jtvnw.net/jtv_user_pictures/panel-62449166-image-47d2742a-e94a-4b31-b987-1de9fffea6b5";
                    ImageCache.get().on(
                      {
                        uri
                      },
                      path => {
                        console.log("TRYING TO CACHE => ", path);
                        if (path) {
                          AsyncStorage.setItem("splashScreen", uri);
                          this.setState({ loading: false });
                          Alert.alert(
                              "Alert",
                              "The Customization Code was applied successfully and will take effect the next time you restart the app.",
                              [
                                  {
                                      text: 'OK',
                                      onPress: () => {
                                          this.props.fetchConferences(this.props.token)
                                          Actions.pop();
                                      }
                                  }
                              ],
                              { cancelable: false }
                          );
                        }
                      }
                    );
                  }
                })
                .catch(e => {
                  this.setState({ loading: false });
                  console.log(e);
                });
                
              })
              .catch(err => {
                this.setState({ loading: false });
                console.error("Error:", err.message);
              });
            this.setState({
              isPromptOpen: false,
            });
          }}
        />
      </MenuContext>
    );
  }
}

const mapStateToProps = ({ agency, user }) => ({
  agency,
  user,
  token: user.token
});

const mapActionToProps = dispatch => ({
  fetchConferences: token => dispatch(fetchConferences(token)),
  dispatch: action => dispatch(action)
})

export default connect(mapStateToProps, mapActionToProps)(Component);
