import React,  { PureComponent, PropTypes } from 'react';
import { View } from 'react-native'
// import Accordion from 'react-native-accordion';
import Accordion from 'react-native-collapsible/Accordion';
import {
  Body,
  Content,
  Right,
  ListItem,
  Icon,
  Text
} from 'native-base';
import styles from '../styles';

class AccordionItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
  };

  renderHeader = (section, index, isActive) => {
    return (
      <ListItem
        style={{
          ...styles.listItem,
          borderBottomWidth: isActive ? 0 : 1,
        }}
        onPress={() => this.accordion._toggleSection(0)}
      >
        <Body>
          <Text>{section}</Text>
        </Body>
        <Right>
          <Icon name={isActive ? 'ios-arrow-up' : 'ios-arrow-down'} />
        </Right>
      </ListItem>
    );
  }

  renderContent = (section, index, isActive) => {
    return (
      <View style={styles.contentItem}>
        <View style={styles.dashLine} />
        { this.props.children }
      </View>
    );
  }

  render() {
    return (
      <Accordion
        ref={ref => { this.accordion = ref; }}
        sections={[this.props.title]}
        renderHeader={this.renderHeader}
        renderContent={this.renderContent}
        easing="easeOutCubic"
      />
    );
  }
}

export default AccordionItem;