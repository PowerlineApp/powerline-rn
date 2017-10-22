import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';

import {
  List,
  ListItem,
  Text,
  Content,
  Left,
  Body,
  Thumbnail,
  Right,
  Icon
} from 'native-base';
import { Actions } from 'react-native-router-flux';
const PLColors = require('PLColors');
import { getFollowers, unFollowers, acceptFollowers } from 'PLActions';
import styles from './styles';
import ContentPlaceholder from '../../../components/ContentPlaceholder';
import PLLoader from 'PLLoader';

class Followers extends Component {
  // static propTypes = {
  //   token: React.PropTypes.string
  // }

  constructor(props) {
    super(props);

    this.state = {
      followers: [],
      page: 1,
      per_page: 10,
      items: 10,
      totalItems: 0,
      refreshing: false
    }
  }

  componentWillMount() {
    this._onRefresh();
  }

  loadFollowers() {
    var { token } = this.props;
    var { page, per_page } = this.state;

    getFollowers(token, page, per_page)
      .then(ret => {
        this.setState({
          followers: ret.payload,
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
    this.loadFollowers();
  }

  unFollowers(index) {
    var { token } = this.props;

    Alert.alert("Confirm", "Do you want to stop " + this.state.followers[index].username + " from following you ?", [
      {
        text: 'Cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          unFollowers(token, this.state.followers[index].id)
            .then((ret) => {
              this.state.followers.splice(index, 1);
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

  acceptFollower(index) {
    var { token } = this.props;

    Alert.alert("Confirm", "Do you want to approve " + this.state.followers[index].username + " ?", [
      {
        text: 'Cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          acceptFollowers(token, this.state.followers[index].id)
            .then((ret) => {
              this.state.followers[index].status = 'active';
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
    const { followers, refreshing } = this.state;

    return (
      <ContentPlaceholder
        empty={followers.length === 0}
        title="Hmm. Looks like you don't have any followers yet. Create a post!"
        refreshControl={Platform.OS === 'android' &&
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        onScroll={(e) => {
          var offset = e.nativeEvent.contentOffset.y;

          if (Platform.OS === 'ios' && offset < -3) {
            this._onRefresh();
          }
        }}
      >
        {this.state.refreshing && <PLLoader position="bottom" />}
        { followers.length > 0 &&
          <List>
            {
              followers.map((follow, index) => {
                return (
                  <ListItem avatar key={index} onPress={() => this.goToProfile(follow.id)}>
                    <Left>
                      { follow.avatar_file_name &&
                        <Thumbnail source={{ uri: follow.avatar_file_name + '&w=50&h=50&auto=compress,format,q=95' }} />
                      }
                    </Left>
                    <Body>
                      <Text>{follow.username}</Text>
                      <Text note>{follow.full_name}</Text>
                    </Body>
                    <Right style={styles.itemRightContainer}>
                      {follow.status === 'active' ?
                        <TouchableOpacity onPress={() => this.unFollowers(index)}>
                          <View style={styles.buttonContainer}>
                            <Icon name="ios-person" style={styles.activeIconLarge} />
                            <Icon name="remove-circle" style={styles.activeIconSmall} />
                          </View>
                        </TouchableOpacity>
                        :
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity onPress={() => this.acceptFollower(index)}>
                            <Icon name="checkmark" style={styles.acceptIcon} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.unFollowers(index)}>
                            <Icon name="close" style={styles.rejectIcon} />
                          </TouchableOpacity>
                        </View>
                      }
                    </Right>
                  </ListItem>
                );
              })
            }
          </List>
        }
      </ContentPlaceholder>
    );
  }

}

const mapStateToProps = state => ({
  token: state.user.token
});

export default connect(mapStateToProps)(Followers);