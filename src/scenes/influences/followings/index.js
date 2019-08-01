import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  FlatList
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
const PLColors = require('../../../common/PLColors');
import { getFollowings, unFollowings } from '../../../actions';
import styles from './styles';
import ContentPlaceholder from '../../../components/ContentPlaceholder';
import PLOverlayLoader from '../../../common/PLOverlayLoader';

class Followings extends Component {


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

    loadFollowings(forcePage) {
        var { token } = this.props;
        var { page, per_page } = this.state;

        getFollowings(token, forcePage || (page +1), per_page)
    .then(ret => {
        this.setState({
            followings: forcePage ? ret.payload : [...this.state.followings, ...ret.payload],
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



    renderFollow(follow, index){
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
                                <Icon name='ios-person' style={styles.activeIconLarge} />
                                <Icon name='remove-circle' style={styles.activeIconSmall} />
                            </View>
                        </TouchableOpacity> :
                        <View style={styles.buttonContainer}>
                            <Icon name='ios-person' style={styles.disableIconLarge} />
                            <Icon name='ios-clock-outline' style={styles.disableIconSmall} />
                        </View>
    }
                </Right>
            </ListItem>
        );
    }





    render() {
        const { followings, refreshing } = this.state;
    
        if (followings.length <= 0){
            return (
                <ContentPlaceholder
                    empty={followings.length === 0}
                    title='Follow people who you respect and who you want to get notifications from!'
                    refreshControl={
              Platform.OS === 'android' &&
              <RefreshControl
                  refreshing={false}
                  onRefresh={() => this.loadFollowings(1)}
              />
            }
                    onScroll={(e) => {
                        var offset = e.nativeEvent.contentOffset.y;
    
                        if (Platform.OS === 'ios' && offset < -3) {
                            this.loadFollowings(1);
                        }
                    }}
           />
            );
        }
        return <FlatList 
            data={followings}
            refreshing={this.state.refreshing}
            extraData={this.state}
            onRefresh={() => this.loadFollowings(1)}
            initialNumToRender={3}
            onEndReached={() => this.loadFollowings()}
            renderItem={({item, index}) => this.renderFollow(item, index)}
          />; 
    }
    
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(Followings);