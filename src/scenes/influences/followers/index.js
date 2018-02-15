import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  View
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
import PLOverlayLoader from 'PLOverlayLoader';
import {Mixpanel} from 'PLEnv';


class Followers extends Component {
  static propTypes = {
    token: React.PropTypes.string
  }

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

    Alert.alert("Confirm", "Do you want to unapprove " + this.state.followers[index].username + " from following you ?", [
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
        title="Hmm. Looks like you don't have any followers yet. The best way to gain followers is to create posts!"
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
        {/* <PLOverlayLoader visible={refreshing} logo />       */}
        { followers.length > 0 &&
          <List>
            {
              followers.map((follow, index) => {
                return (
                  <ListItem avatar key={index} onPress={() => this.goToProfile(follow.id)}>
                    <View style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                    {!follow.is_verified &&
                      <Image small
                      style={{width: 60, height: 60}}
                      resizeMode='stretch'
                      source={require("img/outline_8.png")}
                      />}
                      <Thumbnail small
                          defaultSource={require("img/blank_person.png")}
                          style={{position: 'absolute', alignSelf: 'center'}}
                          source={follow.avatar_file_name ? { uri: follow.avatar_file_name + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")}
                      />
                    </View>
                    <Body>
                      <Text>{follow.username}</Text>
                      <Text note>{follow.full_name}</Text>
                    </Body>
                    <Right style={styles.itemRightContainer}>
                      {follow.status === 'active' ?
                        <TouchableOpacity onPress={() => this.unFollowers(index)}>
                          <Left style={styles.buttonContainer}>
                            <Icon name="ios-person" style={styles.activeIconLarge} />
                            <Icon name="remove-circle" style={styles.activeIconSmall} />
                          </Left>
                        </TouchableOpacity>
                        :
                        <Left style={styles.buttonContainer}>
                          <TouchableOpacity onPress={() => this.acceptFollower(index)}>
                            <Icon name="checkmark" style={styles.acceptIcon} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.unFollowers(index)}>
                            <Icon name="close" style={styles.rejectIcon} />
                          </TouchableOpacity>
                        </Left>
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