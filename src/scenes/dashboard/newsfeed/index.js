//Newsfeed tab GH13
//The backend call for this scene will be driven primarily by https://api-dev.powerli.ne/api-doc#get--api-v2-activities
//The default view is "All" feed, but a specific group may be called for group Feed (GH45), Friends Feed (GH51), a specific user's feed (GH44)
//Group feed will look very different depending on if in Feed view or Conversation view.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, ListItem, Thumbnail, List, Card, CardItem, Label, Footer } from 'native-base';
import { ListView, View, RefreshControl, TouchableOpacity, Image, WebView, Platform, Share } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { loadActivities, resetActivities, votePost, editFollowers, loadActivityByEntityId, createPostToGroup, deletePost, deletePetition } from 'PLActions';
import styles, { sliderWidth, itemWidth } from './styles';
// import TimeAgo from 'react-native-timeago';
// import ImageLoad from 'react-native-image-placeholder';
import YouTube from 'react-native-youtube';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import FeedActivity from '../../../components/Feed/FeedActivity';
import ContentPlaceholder from '../../../components/ContentPlaceholder';

import PLOverlayLoader from 'PLOverlayLoader';
import PLLoader from 'PLLoader';
const PLColors = require('PLColors');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
const { youTubeAPIKey } = require('PLEnv');
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

class Newsfeed extends Component {

    // static propTypes = {
    //     token: React.PropTypes.string,
    // }

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            isRefreshing: false,
            isLoadingTail: false,
            isLoading: false,
            dataArray: [],
            dataSource: ds,
            text: "",
            showAvatar: true
        };
    }

    componentWillMount() {
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataArray: nextProps.payload,
            dataSource: this.state.dataSource.cloneWithRows(nextProps.payload),
        });
    }

    //JC I'm unclear on what this actually is 
    subscribe(item) {
        Share.share({
            message: item.description,
            title: ""
        });
    }


    async loadInitialActivities() {
        this.setState({ isRefreshing: true });
        const { props: { token, dispatch, page, group } } = this;
        try {
            await Promise.race([
                dispatch(loadActivities(token, 0, 20, group )),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            }
            else {
                alert('Timed out. Please check internet connection');
            }
            return;
        } finally {
            this.setState({ isRefreshing: false });
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataArray),
        });
    }

    async loadNextActivities() {
        this.setState({ isLoadingTail: true });
        const { props: { token, page, dispatch, group } } = this;
        try {
            await Promise.race([
                dispatch(loadActivities(token, page, 20, group)),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            }
            else {
                alert('Timed out. Please check internet connection');
            }
            return;
        } finally {
            this.setState({ isLoadingTail: false });
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataArray),
        });
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

    _onBeginReached() {
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
    }

    //Related: GH160
    _renderTailLoading() {
        if (this.state.isLoadingTail === true) {
            return <PLLoader position="bottom" />
        } else {
            return null;
        }
    }

    // Feed common components

    _renderHeader(item) {
        return <FeedHeader item={item} />
    }

    onChangeText(text){
        this.setState({
            text: text
        });
    }

    onCreatePost(){
        var { token, group, dispatch } = this.props;

        if(this.state.text != "" || this.state.text.trim() != ""){           
            createPostToGroup(token, group, this.state.text)
            .then(data => {
                this.setState({
                    text: ""
                });
                dispatch({type: 'DELETE_ACTIVITIES'});
                dispatch(loadActivities(token, 0, 20, group ))
            })
            .catch(err => {

            })
        }
    }

    render() {
        if(this.props.group != 'all' && this.props.payload.length <= this.props.groupLimit){
            return (
                <Container style={styles.container}>
                <View style={styles.groupHeaderContainer}>
                    {this.state.showAvatar && this.props.savedGroup && this.props.savedGroup.groupAvatar != '' && this.props.savedGroup.groupAvatar != null ?
                        <Thumbnail square source={{ uri: this.props.savedGroup.groupAvatar + '&w=200&h=200&auto=compress,format,q=95' }} style={styles.groupAvatar} /> : null}
                    <Text style={styles.groupName}>{this.props.savedGroup.groupName}</Text>
                </View>
                {this.state.isRefreshing && <PLLoader position="bottom" />}
                <ContentPlaceholder
                    empty={!this.state.isRefreshing && !this.state.isLoading && this.state.dataArray.length === 0}
                    title="The world belongs to those who speak up! Be the first to create a post!"
                    refreshControl={Platform.OS === 'android' &&
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    onScroll={(e) => {                           
                        var height = e.nativeEvent.contentSize.height;
                        var offset = e.nativeEvent.contentOffset.y;
                        if ((WINDOW_HEIGHT + offset) >= height && offset > 0) {
                            this.setState({
                                showAvatar: false
                            });
                        } else {
                            this.setState({
                                showAvatar: true
                            });
                        }

                        if (Platform.OS === 'ios' && offset < -3) {
                            this._onRefresh();
                        }
                    }}
                >
                    <View style={{flex: 1, height:(this.state.showAvatar && this.props.groupAvatar != '' && this.props.groupAvatar != null? (height - 364):( height -  308)), justifyContent: 'flex-end'}}>
                    <List>
                        {this.state.dataArray.map((activity, index) => {
                            return (
                                <ListItem avatar key={index} style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 15}}>
                                    <Left>
                                        <Thumbnail small source={{uri: activity.user.avatar_file_name+'&w=200&h=200&auto=compress,format,q=95'}}/>
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text style={styles.title}>{activity.user.full_name}</Text>
                                        <Text note style={styles.subtitle}>{activity.description}</Text>
                                    </Body>
                                    <Right style={{borderBottomWidth: 0}}>
                                        {/* <Text style={styles.activityTime}><TimeAgo time={activity.sent_at}/></Text> */}
                                        <Button transparent small onPress={() => this.vote(activity, 'upvote')}>
                                            <Icon name="md-arrow-dropup" style={activity.upvotes_count!=0? styles.footerIconBlue : styles.footerIcon}/>
                                            <Label style={activity.upvotes_count!=0? styles.footerTextBlue : styles.footerText}>{activity.upvotes_count ? activity.upvotes_count : 0}</Label>
                                        </Button>
                                    </Right>
                                </ListItem>
                            );
                        })}                                                
                    </List>
                    </View>
                </ContentPlaceholder>
                <Footer style={styles.CFooter}>
                    <Item style={styles.CFooterItem}>
                        <Thumbnail small source={{uri: this.props.profile.avatar_file_name+'&w=200&h=200&auto=compress,format,q=95'}}/>
                        <Input style={styles.CFooterItemInput} value={this.state.text} onChangeText={(text) => this.onChangeText(text)}/>
                        <Button transparent style={styles.sendBtn} onPress={() => this.onCreatePost()}>
                            <Text>SEND</Text>
                            <Icon name="md-send"/>
                        </Button>
                    </Item>
                </Footer>
                </Container>
            );
        } else{
            return (
                // The default view of the newsfeed is the All feed.
                <Container style={styles.container}>
                {
                    this.props.savedGroup && this.props.savedGroup.group != 'all' &&
                    <View style={styles.groupHeaderContainer}>
                        {this.state.showAvatar && this.props.savedGroup.groupAvatar != '' && this.props.savedGroup.groupAvatar != null ?
                            <Thumbnail square source={{ uri: this.props.savedGroup.groupAvatar + '&w=200&h=200&auto=compress,format,q=95' }} style={styles.groupAvatar} /> : null}
                        <Text style={styles.groupName}>{this.props.savedGroup.groupName}</Text>
                    </View>
                }
                {this.state.isRefreshing && <PLLoader position="bottom" />}
                <ContentPlaceholder
                    empty={!this.state.isRefreshing && !this.state.isLoading && this.state.dataArray.length === 0}
                    title="The world belongs to those who speak up! Be the first to create a post!"    
                    refreshControl={Platform.OS === 'android' &&
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    onScroll={(e) => {
                        var height = e.nativeEvent.contentSize.height;
                        var offset = e.nativeEvent.contentOffset.y;
                        if ((WINDOW_HEIGHT + offset) >= height && offset > 0) {
                            this._onEndReached();
                            this.setState({
                                showAvatar: false
                            })
                        } else {
                            this.setState({
                                showAvatar: true
                            });
                        }

                        if (Platform.OS === 'ios' && offset < -3) {
                            this._onRefresh();
                        }
                    }}
                >
                    <ListView dataSource={this.state.dataSource} renderRow={item => {
                        return <FeedActivity item={item} token={this.props.token} profile={this.props.profile} />
                    }} />
                    <PLOverlayLoader visible={this.state.isLoading} logo />
                    {this._renderTailLoading()}
                </ContentPlaceholder>
                </Container>
            );
        }        
    }
}

const optionsStyles = {
    optionsContainer: {
        backgroundColor: '#fafafa',
        paddingLeft: 5,
        width: WINDOW_WIDTH,
    },
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
    profile: state.user.profile,
    userId: state.user.id,
    group: state.activities.group,
    groupName: state.activities.groupName,
    groupAvatar: state.activities.groupAvatar,
    groupLimit: state.activities.groupLimit,
    savedGroup: state.activities.savedGroup,
});

export default connect(mapStateToProps)(Newsfeed);