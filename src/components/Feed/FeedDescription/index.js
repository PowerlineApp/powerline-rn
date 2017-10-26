import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text, Left, Body, CardItem, Label, Icon } from 'native-base';
import { parseString } from 'react-native-xml2js';
import ParsedText from './ParsedText';
import styles from '../styles';

class FeedDescription extends Component {
    redirect (item, options) {
        let type = 'poll';
        if (item.entity.type === 'post') {
            type = 'post'
          } else if (item.entity.type === 'user-petition'){
            type = 'user-petition' 
          }
        Actions.itemDetail({entityType: type, entityId: item.entity.id, ...options});
    }

    _renderTitle (item) {
        if (item.title) {
            return (<Text style={styles.title}>{item.title}</Text>);
        } else {
            return null;
        }
  }
  // The priority zone counter lists the count of total priority zone items in the newsfeed
  _renderZoneIcon(item) {
    if (item.zone === 'prioritized') {
      return (<Icon active name='ios-flash' style={styles.zoneIcon} />);
    } else {
      return null;
    }
  }

  handleUrlPress = url => {
    Linking.openURL(url);
  }

  handleUserPress = user => {
    try {
      const html = this.props.item.description_html;
      parseString(`<body>${html}</body>`, function (err, result) {
          result.body.a.forEach(value => {
            if (value._ === user) {
              Actions.profile({ id: value.$['data-user-id'] });
              return;
            }
          })
      });
    } catch(err) {

    }
  }

  handleHashtagPress = hashtag => {
    Actions.search({ search: hashtag.substring(1), initialPage: 2 });
  }

  render() {
    let { item } = this.props;

    return (
      <CardItem style={{ paddingLeft: 15, paddingRight: 15 }}>
        <Left>
          <View style={styles.descLeftContainer}>
            {this._renderZoneIcon(item)}
            <Label style={styles.commentCount}>{item.responses_count}</Label>
          </View>
          <Body style={styles.descBodyContainer}>
            <TouchableOpacity onPress={() => this.redirect(item)}>
              {this._renderTitle(item)}
              <ParsedText
                style={styles.description}
                parse={
                  [
                    { type: 'url', style: styles.url, onPress: this.handleUrlPress },
                    { pattern: /@(\w+)/, style: styles.username, onPress: this.handleUserPress },
                    { pattern: /#(\w+)/, style: styles.hashtag, onPress: this.handleHashtagPress },
                  ]
                }
                numberOfLines={5}
                childrenProps={{ allowFontScaling: false }}
              >
                {item.description}
              </ParsedText>
            </TouchableOpacity>
          </Body>
        </Left>
      </CardItem>
    );
  }
}
export default FeedDescription;

