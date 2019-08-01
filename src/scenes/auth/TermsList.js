//GH4
/**
 * @flow
 */
'use strict';

var ItemsWithSeparator = require('../../common/ItemsWithSeparator');
var LayoutAnimation = require('LayoutAnimation');
var React = require('React');
var Section = require('./Section');
import {StyleSheet, View} from 'react-native'
// var StyleSheet = require('StyleSheet');
import {Text} from '../../common/PLText'
import PLTouchable from '../../common/PLTouchable'
// var { Text } = require('PLText');
// var PLTouchable = require('PLTouchable');
// var View = require('View');

class TermsList extends React.Component {
  render() {
    let content = this.props.terms.map(({ title, desc }) =>
      (<Row title={title} desc={desc} key={title} />)
    );
    return (
      <Section title="Services Agremeent">
        <ItemsWithSeparator separatorStyle={styles.separator}>
          {content}
        </ItemsWithSeparator>
      </Section>
    );
  }
}

class Row extends React.Component {
  props: {
    title: string;
    desc: string;
  };

  state: {
    expanded: boolean;
  };

  constructor() {
    super();
    this.state = { expanded: false };
  }

  render() {
    var desc;
    if (this.state.expanded) {
      desc = (
        <View style={styles.desc}>
          <Text style={styles.text}>
            {this.props.desc}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <PLTouchable onPress={() => this.toggle()}>
          <View style={styles.title} >
            <Text style={styles.symbol}>
              {this.state.expanded ? '\u2212' : '+'}
            </Text>
            <Text style={styles.text}>
              {this.props.title}
            </Text>
          </View>
        </PLTouchable>
        {desc}
      </View>
    );
  }

  toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  }
}

var styles = StyleSheet.create({
  separator: {
    marginHorizontal: 20,
  },
  title: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  symbol: {
    fontSize: 15,
    lineHeight: 21,
    width: 22,
    color: '#99A7B9',
  },
  desc: {
    padding: 14,
    paddingLeft: 20 + 22,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: '#002350',
    flex: 1,
  },
});

module.exports = TermsList;
