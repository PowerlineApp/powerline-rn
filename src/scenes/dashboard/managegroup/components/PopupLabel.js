import React, { PureComponent, PropTypes } from 'react';

import { Text, Label as NBLabel, Icon, Button } from 'native-base';
import { View } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import PLColors from 'PLColors';
import styles from '../styles';

class PopupLabel extends PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    options: [],
    onPress: () => { },
  };

  render() {
    const { options, onPress } = this.props;

    return (
      <Menu ref={(ref) => { this.menu = ref; }}>
        <MenuTrigger>
          <View style={styles.inputContainer}>
            <NBLabel style={styles.popupText}>{this.props.children}</NBLabel>
            <Icon name="md-arrow-dropdown" style={styles.popupIcon} />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={styles.optionsContainer}>
          {
            options.map((option, index) => (
              <MenuOption onSelect={() => onPress(option, index)}>
                <Button iconLeft transparent dark onPress={() => {
                  onPress(option, index);
                  this.menu && this.menu.close();
                }}>
                  <Text style={styles.menuText}>{option}</Text>
                </Button>
              </MenuOption>
            ))
          }
        </MenuOptions>
      </Menu>
    );
  }
}

export default PopupLabel;
