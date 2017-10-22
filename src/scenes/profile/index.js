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
import { RefreshControl, TouchableOpacity, Image, WebView, Platform } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styles , { sliderWidth, itemWidth } from './styles';
const PLColors = require('PLColors');
import PLLoader from 'PLLoader';

<<<<<<< HEAD
import { loadUserProfileById, resetActivities, votePost, loadActivitiesByUserId, getFollowingUser, unFollowings, putFollowings } from 'PLActions';
// import TimeAgo from 'react-native-timeago';
// import ImageLoad from 'react-native-image-placeholder';
=======
import { loadUserProfileById, resetActivities, editFollowers, votePost, loadActivitiesByUserId, getFollowingUser, unFollowings, putFollowings } from 'PLActions';
import TimeAgo from 'react-native-timeago';
import ImageLoad from 'react-native-image-placeholder';
>>>>>>> develop
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

class Profile extends Component{
    // static propTypes = {
    //     token: React.PropTypes.string
    // };

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            isLoadingTail: false,
            user: null,
            activities: [],
            following_status: null
        };

        var { token, id } = this.props;

        loadUserProfileById(token,  id)
        .then(data => {
            this.setState({
                user: data
            });
        })
        .catch(err => {

        });

        loadActivitiesByUserId(token, 1, 20, id).then(data => {
            console.log(data);
            this.setState({
                activities: data.payload
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

        this.follow = this.follow.bind(this);
    }

    mute() {
        var { token, id, dispatch } = this.props;
        ActionSheet.show(
            {
                options: ['1 hour', '8 hours', '24 hours'],
                title: 'MUTE NOTIFICATIONS FOR THIS USER'
            },

            buttonIndex => {
                var hours = 1;
                if (buttonIndex == 1) {
                    hours = 8;
                } else if (buttonIndex == 2) {
                    hours = 24;
                }

                var newDate = new Date((new Date()).getTime() + 1000 * 60 * 60 * hours);
                editFollowers(token, id, false, newDate)
                    .then(data => {

                    })
                    .catch(err => {

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

    _renderTailLoading() {
        if (this.state.isLoadingTail === true) {
            return (
                <PLLoader position="bottom" />
            );
        } else {
            return null;
        }
    }

    _renderHeader(item) {
        return <FeedHeader item={item} />
    }

    // It would appear that the below is the User Profile Screen GH44
    render(){
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container style={styles.container}> 
                    {this.state.user?      
                    <View style={{backgroundColor: PLColors.main}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                            <View>                            
                                <Button transparent onPress={() => Actions.pop()}>
                                    <Icon active name="arrow-back" style={{color: 'white'}}/>
                                </Button>                           
                            </View>
                            {
                                this.state.following_status === 'active' &&
                                <View>
                                    <Button transparent onPress={() => this.mute()}>
                                        <Icon active name="md-volume-off" style={{ color: 'white' }} />
                                    </Button>
                                </View>
                            }
                        </View> 
                        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Thumbnail source={{uri: this.state.user.avatar_file_name+'&w=50&h=50&auto=compress,format,q=95'}} style={{marginBottom: 8}}/>  
                            <TouchableWithoutFeedback onPress={() => this.follow()}>                              
                                <View  style={{flexDirection: 'row', backgroundColor: 'white', padding: 1, marginTop: 30, marginLeft: -15, width: 28, height: 28, borderRadius: 24, borderWidth: 1, borderColor: '#11c1f3'}}>
                                    {this.state.following_status == 'pending'?
                                    <Icon name="ios-person" style={{marginLeft: 5,fontSize: 20, color: PLColors.lightText}}/> 
                                    :
                                    <Icon name="ios-person" style={{marginLeft: 5,fontSize: 20, color: '#11c1f3'}}/>   
                                    } 
                                    {this.state.following_status == 'active'?                                            
                                    <Icon name="remove-circle" style={{marginLeft: -3,fontSize: 8, color: PLColors.lightText, marginTop: 13}}/>:
                                    this.state.following_status == 'pending'?
                                    <Icon name="ios-clock-outline" style={{marginLeft: -3,fontSize: 8, color: '#11c1f3', marginTop: 13}}/>:
                                    <Icon name="add-circle" style={{marginLeft: -3,fontSize: 8, color: PLColors.lightText, marginTop: 13}}/>
                                    }
                                </View>                  
                            </TouchableWithoutFeedback>         
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>{this.state.user.full_name}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 11, marginBottom: 5}}>{this.state.user.karma}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        {/*This should not have the state hard-coded in here*/}
                            <Text style={{color: 'white', fontSize: 11,  marginBottom: 5}}>California, {this.state.user.country}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 11,  marginBottom: 5}}>{this.state.user.bio}</Text>
                        </View>
                    </View>: null}
                    {/*The user's posts should be displayed below the user profile information*/}
                    {/*This is driven by Activity API for specific user*/}
                    <Content>                   
                        <List dataArray={this.state.activities} renderRow={item => {
                            return <FeedActivity item={item} token={this.props.token} profile={this.props.profile} />
                        }}
                        />
                    </Content>              
                </Container>
            </MenuContext>
        );
    }
}

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
    page: state.activities.page,
    totalItems: state.activities.totalItems,
    payload: state.activities.payload,
    count: state.activities.count,
});

export default connect(mapStateToProps)(Profile);