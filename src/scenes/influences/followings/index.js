import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image
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
import PLOverlayLoader from 'PLOverlayLoader';

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
    // alert("update");
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
        title="Follow people who you respect and who you want to get notifications from!"
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
        {this.state.followings.length > 0 ?
          <List>
            {
              this.state.followings.map((follow, index) => {
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
        {/* Turning off Pulse Loader until we can stabilize its performance
        */}
        {/* <PLOverlayLoader visible={true || this.state.refreshing} logo /> */}
      </ContentPlaceholder>
    );
    }
    
}

const mapStateToProps = state => ({
  token: state.user.token
});

export default connect(mapStateToProps)(Followings);