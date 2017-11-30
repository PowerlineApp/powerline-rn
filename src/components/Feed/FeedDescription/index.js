import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text, Left, Right, Body, CardItem, Label, Icon, Thumbnail } from 'native-base';
import { parseString } from 'react-native-xml2js';
import ParsedText from './ParsedText';
import styles from '../styles';

class FeedDescription extends Component {
  redirect(item, options, scene = 'itemDetail') {
      let type;
      if (item.poll) {
          type = 'poll';
      } else if (item.post) {
          type = 'post';
      } else if (item.user_petition) {
          type = 'user-petition';
      }
      Actions[scene]({ entityType: type, entityId: item.entity.id, ...options });
  }

    _renderTitle (item) {
        if (item.title) {
            return (<Text style={styles.descriptionTitle}>{item.title}</Text>);
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

  _renderAttachedImage(item){
    if (this.props.isInDetail) return null;
    // console.log(item);
    let imgURL;
    let blur;
    if (item.post){
        imgURL = item.post.image;
    } else if (item.user_petition) {
        imgURL = item.user_petition.image;
    }
    if (!imgURL) return null;

    if (item.user.follow_status === 'active'){
      blur = '0';
    } else if (item.user.id !== this.props.profile.id){
      blur = '1000';
    }
    return (
      <View style={{width: 80, marginRight: 0, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-start'}} >
        <Thumbnail medium square
            source={{uri: imgURL +`&w=150&h=150&blur=${blur}&auto=compress,format,q=95`}}
            />
      </View>);
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
//Priority Zone, Comment, Counter, and Main Text Body
    return (
      <CardItem style={{ paddingLeft: 5, paddingRight: 15 }}>
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
                numberOfLines={this.props.isInDetail ? null : 5}
                childrenProps={{ allowFontScaling: false }}
              >
                {item.description}
              </ParsedText>
            </TouchableOpacity>
          </Body>
            {this._renderAttachedImage(item)}
        </Left>
      </CardItem>
    );
  }
}
export default FeedDescription;

