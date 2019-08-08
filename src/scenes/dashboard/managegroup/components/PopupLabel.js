import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Text, Label as NBLabel, Icon, Button } from 'native-base';
import { View } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import PLColors from '../../../../common/PLColors';

import styles from '../styles';

class PopupLabel extends PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string),
    onPress: PropTypes.func,
    show: PropTypes.string,
    returned: PropTypes.string,
  };

  static defaultProps = {
    options: [],
    onPress: () => { },
  };

  _onPress = (option, index) => {
    const { returned, onPress } = this.props;

    if (returned) {
      onPress(option[returned], index);
    } else {
      onPress(option, index);
    }
  }

  render() {
    const { options, show, returned } = this.props;

    return (
      <Menu ref={(ref) => { this.menu = ref; }}>
        <MenuTrigger>
          <View style={styles.inputContainer}>
            <View style={{ flex: 1 }}>
              <NBLabel style={styles.popupText}>{this.props.children}</NBLabel>
            </View>
            <Icon name="md-arrow-dropdown" style={styles.popupIcon} />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={styles.optionsContainer}>
          {
            options.map((option, index) => (
              <MenuOption onSelect={() => this._onPress(option, index)}>
                <Button iconLeft transparent dark onPress={() => {
                  this._onPress(option, index);
                  this.menu && this.menu.close();
                }}>
                  <Text style={styles.menuText}>
                    {show ? option[show] : option}
                  </Text>
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
