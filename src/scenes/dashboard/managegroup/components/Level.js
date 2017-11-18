import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Label, Button } from 'native-base';
import PLColors from 'PLColors';
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get('window');

class Level extends PureComponent {
  static propTypes = {
    isSelected: PropTypes.boolean,
    name: PropTypes.string,
    price: PropTypes.number,
    title: PropTypes.string,
    audience: PropTypes.string,
    size: PropTypes.string,
    onPress: PropTypes.func,
  };

  static defaultProps = {

  };

  render() {
    const {
      isSelected,
      name,
      price,
      title,
      audience,
      size,
      onPress,
    } = this.props;

    return (
      <TouchableOpacity style={levelStyle.container} onPress={() => onPress({name, audience, title, price})}>
        <View style={levelStyle.border}>
          <LinearGradient style={levelStyle.namePrice} colors={['#303079', '#050548']}>
            <Text style={{color: 'white', textAlign: 'center'}}>{`$${price}/month`}</Text>
          </LinearGradient>
        </View>
        <View style={levelStyle.description}>
          <Label style={StyleSheet.flatten(levelStyle.titleText)}>{title}</Label>
          <Label style={StyleSheet.flatten(levelStyle.audienceSizeText)}>{`Audience: ${audience}`}</Label>
          <Label style={StyleSheet.flatten(levelStyle.audienceSizeText)}>{`Size: ${size}`}</Label>
          {!isSelected &&
            <Button style={StyleSheet.flatten(levelStyle.selectButton)}>
              <Label style={{ color: 'white' }}>Select</Label>
            </Button>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const levelStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  border: {
    width: width / 4,
    height: width / 4,
    backgroundColor: '#E8EDF1',
    borderRadius: width / 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  namePrice: {
    width: width / 4 - 16,
    height: width / 4 - 16,
    borderRadius: width / 8 - 8,
    backgroundColor: PLColors.main,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  description: {
    zIndex: 0,
    backgroundColor: '#F0F8FF',
    height: width / 4 - 20,
    marginLeft: - width / 8,
    paddingLeft: width / 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAF0F4'
  },
  selectButton: {
    backgroundColor: '#4ABEFF',
  },
  titleText: {
    color: '#000048',
  },
  audienceSizeText: {
    color: '#667177'
  }
})

export default Level;
