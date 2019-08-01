// @flow
import React, { PropTypes, PureComponent } from 'react';
import { ListItem, Icon, Body, Text, Right, Thumbnail } from 'native-base';
import { View, StyleSheet } from 'react-native';
import PLColors from '../common/PLColors';

type Friend = {
  id: number;
  avatar_file_name: ?string;
  full_name: string;
  username: string;
  first_name: ?string;
  last_name: ?string;
  country: ?string;
  interests: ?Array<object>;
}

class SuggestedFbFriends extends PureComponent {
  static propTypes = {
  };

  static defaultProps = {
    friends: [],
    onPress: () => { },
    onAddPress: () => { },
  }

  render() {
    const { friends, onPress, onAddPress } = this.props;

    if (friends.length > 0) {
      let content = friends.map((friend: Friend, index: number) => (
        <ListItem
          key={friend.id}
          style={styles.item}
          onPress={() => onPress(friend.id)}
        >
          {
            friend.avatar_file_name ?
              <Thumbnail square source={{ uri: friend.avatar_file_name }} />
              :
              <View style={styles.emptyThumbnail} />
          }
          <Body>
            <Text style={styles.usernameText}>{friend.username}</Text>
            <Text style={styles.fullnameText}>{friend.full_name}</Text>
          </Body>
          <Right>
            <Icon name="md-add-circle" style={styles.addIcon} onPress={() => onAddPress(friend.id, index)} />
          </Right>
        </ListItem>
      ));

      return (
        <View style={styles.container}>
          <ListItem itemDivider style={styles.headerItem}>
            <Text style={styles.headerText}>Suggested from Facebook</Text>
          </ListItem>
          {content}
        </View>
      )
    }

    return null;
  }
}

const styles = {
  container: { padding: 12 },
  item: { backgroundColor: 'white', marginLeft: 0, paddingLeft: 17 },
  headerItem: { marginTop: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  headerText: { color: PLColors.lightText, fontSize: 15 },
  emptyThumbnail: { width: 56, height: 56 },
  usernameText: { color: PLColors.main, fontSize: 15 },
  fullnameText: { color: PLColors.lightText, fontSize: 11, marginTop: 2 },
  addIcon: { color: '#11c1f3', fontSize: 28 }
};

export default SuggestedFbFriends;
