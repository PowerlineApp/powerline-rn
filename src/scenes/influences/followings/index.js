import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import {
  List,
  ListItem,
  Text,
  Content,
  Left,
  Body,
  Right,
  Icon,
  Thumbnail
} from 'native-base';
import { Actions } from 'react-native-router-flux';
const PLColors = require('PLColors');
import { getFollowings, unFollowings } from 'PLActions';
import styles from './styles';
import ContentPlaceholder from '../../../components/ContentPlaceholder';

class Followings extends Component {
  static propTypes = {
    token: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      followings: [],
      page: 1,
      per_page: 10,
      items: 10,
      totalItems: 0,
      refreshing: false
    };
  }

  componentWillMount() {
    this._onRefresh();
  }

  componentWillReceiveProps() {
    alert("update");
  }

  loadFollowings() {
    var { token } = this.props;
    var { page, per_page } = this.state;

    getFollowings(token, page, per_page)
    .then(ret => {
        this.setState({
            followings: ret.payload,
            page: ret.page,
            items: ret.items,
            totalItems: ret.totalItems,
            refreshing: false
        });
    })
    .catch(err => {

    });
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.loadFollowings();
  }

  removeFollowing(index) {
    var { token } = this.props;

    Alert.alert("Confirm", "Do you want to stop following " + this.state.followings[index].username + " ?", [
      {
        text: 'Cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          unFollowings(token, this.state.followings[index].id)
            .then((ret) => {
              this.state.followings.splice(index, 1);
              this.setState({
                per_page: this.state.per_page
              });
            })
            .catch(err => {

            });
        }
      }
    ]);
  }

  goToProfile(id) {
    Actions.profile({ id: id });
  }

  render() {
    return (
      <ContentPlaceholder
        empty={this.state.followings.length === 0}
        title="Follow people who you respect!"
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >
        {this.state.followings.length > 0 ?
          <List>
            {
              this.state.followings.map((follow, index) => {
                return (
                  <ListItem avatar key={index} onPress={() => this.goToProfile(follow.id)}>
                    <Left>
                      <Thumbnail source={{ uri: follow.avatar_file_name }} />
                    </Left>
                    <Body>
                      <Text>{follow.username}</Text>
                      <Text note>{follow.status == 'active' ? follow.full_name : 'pending approval'}</Text>
                    </Body>
                    <Right style={styles.itemRightContainer}>
                      {follow.status == 'active' ?
                        <TouchableOpacity onPress={() => this.removeFollowing(index)}>
                          <View style={styles.buttonContainer}>
                            <Icon name="ios-person" style={styles.activeIconLarge} />
                            <Icon name="remove-circle" style={styles.activeIconSmall} />
                          </View>
                        </TouchableOpacity> :
                        <View style={styles.buttonContainer}>
                          <Icon name="ios-person" style={styles.disableIconLarge} />
                          <Icon name="ios-clock-outline" style={styles.disableIconSmall} />
                        </View>
                      }
                    </Right>
                  </ListItem>
                );
              })
            }
          </List> :
          <Text></Text>
        }
      </ContentPlaceholder>
    );
  }

}

const mapStateToProps = state => ({
  token: state.user.token
});

export default connect(mapStateToProps)(Followings);