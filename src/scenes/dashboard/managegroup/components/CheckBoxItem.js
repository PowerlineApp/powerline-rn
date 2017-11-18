import React, { PureComponent, PropTypes } from 'react';

import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Left,
  Right,
  Thumbnail,
  List,
  ListItem,
  Button,
  Icon,
  Label as NSLabel,
  CheckBox
} from 'native-base';
import { View, Text } from 'react-native';
import { loadGroupPermissions } from 'PLActions';
import PLColors from 'PLColors';

import Label from './Label';
import styles from '../styles';

class CheckBoxItem extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    title: PropTypes.string,
    onPress: PropTypes.func,
  };


  render() {
    const { id, title, checked, disabled, onPress, ...otherProps } = this.props;

    return (
      <ListItem>
        <CheckBox
          {...otherProps}
          disabled={disabled}
          checked={checked}
          onPress={onPress}
          color={disabled ? PLColors.lightText : PLColors.blueArrow}
        />
        <Body>
          <Label disabled={disabled} style={{ marginTop: 0, marginLeft: 8 }}>{title}</Label>
        </Body>
      </ListItem>
    );
  }
}

export default CheckBoxItem;