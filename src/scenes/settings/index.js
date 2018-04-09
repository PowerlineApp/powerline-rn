import React from "react";
import Ionicon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { Text, View, TouchableHighlight } from "react-native";
import { Actions } from "react-native-router-flux";
import { MenuContext } from "react-native-popup-menu";
import { Header, Left, Title, Body, Button, Icon, Item } from "native-base";

import styles from "./styles";
import { openDrawer } from "../../actions/drawer";

var PLColors = require("PLColors");

const icons = [
  {
    icon: "md-lock",
    label: "Privacy Settings",
    onPress: () => Actions.privacySettings()
  },
  { icon: "md-options", label: "Customization Code", onPress: () => {} },
  { icon: "md-eye-off", label: "Blocked Users", onPress: () => {} },
  { icon: "md-card", label: "Payment Info", onPress: () => {} },
  { icon: "md-notifications", label: "Notifications", onPress: () => {} },
  { icon: "md-person", label: "My Profile", onPress: () => {} },
  { icon: "md-mail", label: "Contact Us", onPress: () => {} },
  { icon: "md-list", label: "Terms of Service", onPress: () => {} },
  { icon: "md-list", label: "Privacy Policy", onPress: () => {} }
];

const Component = () => (
  <MenuContext>
    <Header
      searchBar
      rounded
      style={[styles.header, { backgroundColor: PLColors.main }]}
    >
      <Left
        style={{
          flex: 0.1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button style={{ width: "100%" }} transparent onPress={this.saveOnExit}>
          <Icon active name="arrow-back" style={{ color: "white" }} />
        </Button>
      </Left>
      <Body>
        <Title>Settings</Title>
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
                onPress={icon.onPress}
              >
                <Ionicon name={icon.icon} size={40} color="#121768" />
              </TouchableHighlight>
              <Text style={styles.label}>{icon.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  </MenuContext>
);

const mapStateToProps = () => ({});
const mapDispatch = {
  openDrawer
};

export default connect(mapStateToProps, mapDispatch)(Component);
