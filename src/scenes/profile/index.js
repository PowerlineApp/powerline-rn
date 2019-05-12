//This looks like it's actually the Newsfeed tab (GH13) and the User Profile screen (GH44) combined. Each item in the newsfeed is referred to as the Standard Item Container. 
//The backend call for this scene will be driven primarily by https://api-dev.powerli.ne/api-doc#get--api-v2-activities
//The default view is "All" feed, but a specific group may be called for group Feed (GH45), Friends Feed (GH51), a specific user's feed (GH44)
//Group Feed will look very different depending if in Feed View or Conversation View. 

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    ActionSheet,
    Container,
    Header,
    Left,
    Right,
    Button,
    Icon,
    Text,
    Content,
    Body,
    Title,
    Grid,
    Col,
    Row,
    ListItem, 
    Thumbnail, 
    List, 
    Card, 
    CardItem, 
    Label,
    Input,
    View
} from 'native-base';
import { RefreshControl, TouchableOpacity, Image, WebView, Platform, FlatList } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styles , { sliderWidth, itemWidth } from './styles';
const PLColors = require('PLColors');
import Filter from '../../common/PLSegmentedControls'
import ImageSelector from '../../common/PLImageSelector'
import { loadUserProfileById, loadUserProfile, resetActivities, editFollowers, votePost, loadActivitiesByUserId, getUserDiscountCode, getFollowingUser, unFollowings, putFollowings } from 'PLActions';
import TimeAgo from 'react-native-timeago';
import ImageLoad from 'react-native-image-placeholder';
import YouTube from 'react-native-youtube';
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
const { youTubeAPIKey } = require('PLEnv');
import {
    TouchableWithoutFeedback,
    Alert
} from 'react-native';

// custom components import
import FeedActivity from '../../components/Feed/FeedActivity';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import MyInfo from './components/myInfo'
import { updateUserProfile } from 'PLActions'
class Profile extends Component{
    static propTypes = {
        token: React.PropTypes.string
    };

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            isLoadingTail: false,
            user: null,
            activities: [],
            following_status: null,
            selected: 'My Posts',
            referal_code: null
        };

        var { token, id, loggedUserId } = this.props;

        this.props.dispatch(loadUserProfile(token));

        loadUserProfileById(token, id || loggedUserId)
        .then(data => {
            console.log('LOAD USER PROFILE BY ID RESPONSE', data)
            this.setState({
                user: data
            });
        })
        .catch(err => {

        });

        loadActivitiesByUserId(token, 1, 20, null, id || loggedUserId).then(data => {
            console.log('res ---', data);
            this.setState({
                activities: data.data.items
            });
        })
        .catch(err => {

        });

        getFollowingUser(token, id).then(data => {
            if(!data.code){
                this.setState({
                    following_status: data.status
                });
            }else{
                this.setState({
                    following_status: null
                });
            }
        })
        .catch(err => {
        });

        getUserDiscountCode(token).then(data => {
                this.setState({
                    referal_code: data.code
                })
        }).catch(err => console.log(err))
        this.follow = this.follow.bind(this);
        this.renderSelectedView = this.renderSelectedView.bind(this);
        this.updateUserAvatar = this.updateUserAvatar.bind(this);


    }


    mute() {
        var { token, id, dispatch } = this.props;
        ActionSheet.show(
            {
                options: ['1 hour', '8 hours', '24 hours', 'Cancel'],
                title: 'Temporarily mute notifications from this user'
            },

            buttonIndex => {
                var hours = 1;
                if (buttonIndex == 1) {
                    hours = 8;
                } else if (buttonIndex == 2) {
                    hours = 24;
                }
                if (buttonIndex === 3) {
                    return;
                }

                var newDate = new Date((new Date()).getTime() + 1000 * 60 * 60 * hours);
                editFollowers(token, id, false, newDate)
                    .then(data => {
                        showToast('User muted');
                    })
                    .catch(err => {
                        showToast('Muting user failed');

                    });
            }
        );
    }

    follow(){
        var { token, id } = this.props;
        if(this.state.following_status != null){
            if(this.state.following_status == 'active'){
                //unfollow
                Alert.alert("Confirm", "Do you want to stop following " + this.state.user.username + " ?", [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            unFollowings(token, id)
                            .then((ret) => {
                                this.setState({
                                    following_status: null
                                });
                            })
                            .catch(err => {

                            });
                        }
                    }            
                ]);
            }
        }else{
            //follow
            putFollowings(token, id)
            .then(() => {
                this.setState({
                    following_status: 'pending'
                });
            })
            .catch(err => {
                
            });
        }
    }

    _onRefresh() {
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
    }

    _onEndReached() {
        const { props: { page, count } } = this;
        if (this.state.isLoadingTail === false && count > 0) {
            this.loadNextActivities();
        }
    }

    _renderHeader(item) {
        return <FeedHeader item={item} />
    }

    renderSelectedView() {
        const { selected } = this.state;
        if(selected === 'My Posts') {
            return (
                <FlatList 
                        data={this.state.activities}
                        refreshing={false}
                        initialNumToRender={3}
                        style={{ marginBottom: 48 }}
                        renderItem={(item) => <FeedActivity key={item.id} item={item.item} token={this.props.token} profile={this.props.profile} />}
                    /> 
                // <List dataArray={this.state.activities} renderRow={item => {
                //     return <FeedActivity item={item} token={this.props.token} profile={this.props.profile} />
                // }}
                // />
            )
        }
        if(selected === 'My Info') {
            return (
                <MyInfo token={this.props.token} referal_code={this.state.referal_code}></MyInfo>
            )
        }
    }

    updateUserAvatar = (image) => {
        console.log(image)
        this.setState({image_data: image.data, mime: image.mime})
        updateUserProfile(this.props.token, {avatar_file_name: image.data})
    }

    karmaAlert = () => {
        Alert.alert(
          'Karma',
          'Earn karma for being an active on Powerline!\n' +
          'View My Reps - 25 points\n' +
          'Follow another user - 10 points\n' +
          'Approve a follower - 10 points\n' +
          'Join a group - 10 points\n' +
          'Create a post - 10 points\n' +
          'Answer a poll - 2 points\n' +
          'Earn an upvote on a post - 2 points each\n' +
          'Earn an upvote on a comment - 2 points each\n' +
          'View a new announcement - 2 points'
        );
    };

    // It would appear that the below is the User Profile Screen GH44
    render(){
        console.log('USER', this.state, this.props.profile)
        let isOwnUser = !this.props.id || Number(this.props.id) === Number(this.props.profile.id);
        console.log('isOwnUser', isOwnUser, this.state.activities);
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container style={styles.container}> 
                    {this.state.user ?      
                    <View style={{backgroundColor: PLColors.main}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 }}>
                            <View>                            
                                <Button transparent onPress={() => Actions.pop()}>
                                    <Icon active name="arrow-back" style={{color: 'white'}}/>
                                </Button>                           
                            </View>
                                <View style={{flexDirection: 'column', right: 0, marginTop: 16, width: 50, position: 'absolute'}}>
                                {(!isOwnUser && this.state.following_status === 'active') &&
                                    <Button transparent onPress={() => this.mute()}>
                                        <Icon active name="md-volume-off" style={{ color: 'white', fontSize: 22 }} />
                                    </Button>}
                                    {
                                        !isOwnUser &&
                                    <Button transparent onPress={() => this.follow()}>                              
                                        <View  style={{flexDirection: 'row', backgroundColor: 'white', padding: 0, width: 28, height: 28, borderRadius: 24, borderWidth: 1, borderColor: '#11c1f3'}}>
                                            {!isOwnUser && this.state.following_status == 'pending'?
                                            <Icon name="ios-person" style={{marginLeft: 5, fontSize: 20, color: PLColors.lightText}}/> 
                                            :
                                            <Icon name="ios-person" style={{marginLeft: 5,fontSize: 20, color: '#11c1f3'}}/>   
                                            } 
                                            {!isOwnUser && this.state.following_status == 'active'?                                            
                                            <Icon name="remove-circle" style={{marginLeft: -3,fontSize: 8, color: PLColors.lightText, marginTop: 13}}/>:
                                            !isOwnUser && this.state.following_status == 'pending'?
                                            <Icon name="ios-clock-outline" style={{marginLeft: -3,fontSize: 8, color: '#11c1f3', marginTop: 13}}/>:
                                            <Icon name="add-circle" style={{marginLeft: -3,fontSize: 8, color: PLColors.lightText, marginTop: 13}}/>
                                            }
                                        </View>                  
                                    </Button>  
                                    }
                                </View>
                        </View> 
                        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 8}}>
                            <Thumbnail
                                key={this.state.user.avatar_file_name}
                                source={this.state.image_data ? {uri: `data:${this.state.mime};base64,${this.state.image_data}`} : this.state.user.avatar_file_name ? { uri: this.state.user.avatar_file_name + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")}
                                defaultSource={require("img/blank_person.png")}
                                />
                            {/* <Thumbnail source={{uri: this.state.user.avatar_file_name}} style={{ borderRadius: 30, width: 60, height: 60}}> */}
                                
                            {/* </Thumbnail>        */}
                            { this.state.selected === "My Info"
                                ? <View style={{position: 'absolute', alignContent: 'center', alignItems: 'center', borderRadius: 15, width: 30, height: 30, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                                    <ImageSelector onConfirm={this.updateUserAvatar} iconSize={27} iconColor='#fff' onError={err => console.log(err)}/>
                                </View> 
                                : null
                            }
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>{this.state.user.first_name} {this.state.user.last_name}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 16, marginBottom: 5}}>{this.state.user.slogan}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        {/*This should not have the state hard-coded in here*/}
                            <Text style={{color: 'white', fontSize: 14,  marginBottom: 5}}>{this.state.user.state} {this.state.user.country}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
                            <Text style={{color: 'white', fontSize: 14,  marginBottom: 5, marginRight: 5 }}>Karma: {this.state.user.karma}</Text>
                            <TouchableOpacity onPress={this.karmaAlert}>
                                <Icon style={{ color: "#fff", fontSize: 18 }} ios="ios-help-circle" android="md-help-circle" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{color: 'white', fontSize: 12,  marginBottom: 5}}>{this.state.user.bio}</Text>
                        </View>
                    </View>: null}
                    {/*The user's posts should be displayed below the user profile information*/}
                    {/*This is driven by Activity API for specific user*/}
                    {
                        isOwnUser
                        ? <Filter options={OPTIONS} selected={this.state.selected} onSelection={item => this.setState({selected: item})}/>             
                        : null
                    }
                    <Content>
                        {this.renderSelectedView()}
                    </Content>              
                </Container>
            </MenuContext>
        );
    }
}

const OPTIONS = ['My Posts', 'My Info']

const menuContextStyles = {
  menuContextWrapper: styles.container,
  backdrop: styles.backdrop,
};


async function timeout(ms: number): Promise {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

const mapStateToProps = state => ({
    token: state.user.token,
    loggedUserId: state.user.profile.id,
    profile: state.user.profile,
    page: state.activities.page,
    totalItems: state.activities.totalItems,
    payload: state.activities.payload,
    count: state.activities.count,
});

export default connect(mapStateToProps)(Profile);