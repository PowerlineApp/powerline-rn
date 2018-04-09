import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, View, TouchableHighlight } from "react-native";
import { Actions } from "react-native-router-flux";

import styles from "./styles";

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

export default () => (
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
              <Icon name={icon.icon} size={40} color="#121768" />
            </TouchableHighlight>
            <Text style={styles.label}>{icon.label}</Text>
          </View>
        );
      })}
    </View>
  </View>
);