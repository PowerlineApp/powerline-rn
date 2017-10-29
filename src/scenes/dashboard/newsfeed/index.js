//Newsfeed tab GH13
//The backend call for this scene will be driven primarily by https://api-dev.powerli.ne/api-doc#get--api-v2-activities
//The default view is "All" feed, but a specific group may be called for group Feed (GH45), Friends Feed (GH51), a specific user's feed (GH44)
//Group feed will look very different depending on if in Feed view or Conversation view.

import React, { Component } from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, ListItem, Thumbnail, List, Card, CardItem, Label, Footer } from 'native-base';
import { ScrollView, FlatList, View, RefreshControl, TouchableOpacity, Image, WebView, Platform, Share } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { loadActivities, resetActivities, votePost, editFollowers, loadActivityByEntityId, createPostToGroup, deletePost, deletePetition } from 'PLActions';
import styles, { sliderWidth, itemWidth } from './styles';
import TimeAgo from 'react-native-timeago';
import ImageLoad from 'react-native-image-placeholder';
import YouTube from 'react-native-youtube';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import ConversationActivity from '../../../components/Conversation/ConversationActivity';
import FeedActivity from '../../../components/Feed/FeedActivity';
import ContentPlaceholder from '../../../components/ContentPlaceholder';

import PLOverlayLoader from 'PLOverlayLoader';
const PLColors = require('PLColors');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
const { youTubeAPIKey } = require('PLEnv');
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

class Newsfeed extends Component {

    static propTypes = {
        token: React.PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isLoadingTail: false,
            isLoading: false,
            dataArray: [],
            text: "",
            showAvatar: true,
            lastOffset: 0,
        };
        lastScrollPosition: null
    }

    componentWillMount() {
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataArray: nextProps.payload,
        });
    }

    //JC I'm unclear on what this actually is 
    // Felipe - me too. will leave this commented! 

    // subscribe(item) {
    //     Share.share({
    //         message: item.description,
    //         title: ""
    //     });
    // }


    async loadInitialActivities() {
        this.setState({ isRefreshing: true });
        const { props: { token, dispatch, page, group } } = this;
        try {
            await Promise.race([
                dispatch(loadActivities(token, 0, 20, group)),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            }
            else {
                // should we handle errors differently? 
                alert('Timed out. Please check internet connection');
            }
            return;
        } finally {
            this.setState({ isRefreshing: false });
        }
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
    }

    _onRefresh() {
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
    }

    _onEndReached() {
        console.log('end reached')
        const { props: { page, count } } = this;
        if (this.state.isLoadingTail === false && count > 0) {
            this.loadNextActivities();
        }
    }

    // Felipe - unnused method. commenting...
    // _onBeginReached() {
    //     this.props.dispatch(resetActivities());

    //     this.loadInitialActivities();
    // }

    onChangeText(text) {
        this.setState({
            text: text
        });
    }

    /**
     * method to create post from input (only in conversationView mode)
     */
    onCreatePost() {
        if (this.state.postingOnGroup) {
            return;
        }
        var { token, savedGroup, dispatch } = this.props;
        this.setState({ postingOnGroup: true })
        console.log(token, savedGroup, this.state.text)
        if (this.state.text != "" || this.state.text.trim() != "") {
            createPostToGroup(token, savedGroup.group, this.state.text)
                .then(data => {
                    this.setState({
                        text: ""
                    });
                    dispatch({ type: 'DELETE_ACTIVITIES' });
                    this.loadInitialActivities();
                    this.setState({ postingOnGroup: false })
                })
                .catch(err => {
                    this.setState({ postingOnGroup: false })
                })
        }
    }

    /**
     * 
     * method that handles the scroll, to change the header display 
     * 
     * @param {object} event - scroll event
     * @param {boolean} conversation - tell us if we are in conversation or feed view
     */
    onScroll(event, conversation) {
        let {showAvatar} = this.state.showAvatar;
        let lastScrollPosition = this.lastScrollPosition;
        const scrollPosition = event && event.nativeEvent && event.nativeEvent.contentOffset && event.nativeEvent.contentOffset.y;
        if (!lastScrollPosition) this.lastScrollPosition= scrollPosition

        // only update header changes on a 20pixel step
        if (Math.abs(scrollPosition - this.lastScrollPosition) > 20 ){


            // since conversationView is literally the feedview backwards, we need to treat the scroll differently
            if (conversation){
                if (scrollPosition > this.lastScrollPosition){
                    if (!this.state.showAvatar) this.setState({showAvatar: true})
                }
                if (scrollPosition < this.lastScrollPosition){
                    if (this.state.showAvatar) this.setState({showAvatar: false})
                }
                
            } else {
                if (scrollPosition < this.lastScrollPosition){
                    if (!this.state.showAvatar) this.setState({showAvatar: true})
                }
                if (scrollPosition > this.lastScrollPosition){
                    if (this.state.showAvatar) this.setState({showAvatar: false})
                }
            }
            this.lastScrollPosition = scrollPosition;
        }
    }

    renderFullHeader(){
        return (
            <View style={styles.groupFullHeaderContainer}>
                <Thumbnail square source={{ uri: this.props.savedGroup.groupAvatar + '&w=200&h=200&auto=compress,format,q=95' }} style={styles.groupAvatar} />
                <Text style={styles.groupName}>{this.props.savedGroup.groupName}</Text>
            </View>);
    }
    
    renderSmallHeader(){
        return (
            <View style={styles.groupSmallHeaderContainer}>
                <Thumbnail square small source={{ uri: this.props.savedGroup.groupAvatar + '&w=100&h=100&auto=compress,format,q=95' }} style={styles.groupAvatar} />
                <Text style={styles.groupName}>{this.props.savedGroup.groupName}</Text>
            </View>);
    }



    render() {
        const { isRefreshing, isLoading, isLoadingTail } = this.state;

        // test if we should show conversationFeed or ActivityFeed
        let conversationView = this.props.group != 'all' && this.props.payload.length <= this.props.groupLimit;
        // console.log('this.props.group != all && this.props.payload.length', this.props.savedGroup, this.props.savedGroup.group != 'all', this.props.savedGroup && this.props.savedGroup.group != 'all')


        let dataArray = this.state.dataArray;
        // this is hardcode for testing purposes -- I will remove once ConversationFeed is 100% working /Felipe
        conversationView = false;

        return (
                <View style={{flex: 1}}>
                    {    this.props.savedGroup && this.props.savedGroup.group != 'all' &&
                        <TouchableOpacity onPress={() => Actions.groupprofile({ id: this.props.savedGroup.group })}>
                            {
                                this.state.showAvatar
                                ? this.renderFullHeader()
                                : this.renderSmallHeader()
                            }
                        </TouchableOpacity>
                    }
                    <ContentPlaceholder
                        empty={!this.state.isRefreshing && !this.state.isLoading && this.state.dataArray.length === 0}
                        title="The world belongs to those who speak up! Be the first to create a post!" />
                    <FlatList 
                        bounces
                        data={dataArray}
                        extraData={dataArray}
                        scrollEventThrottle={16}
                        refreshing={false}
                        onRefresh={() => this._onRefresh()}
                        onEndReachedThreshold={0.8}

                        /*
                            inverts the list when in conversationView - this is necessary to make the refresh work on the bottom with the builtin listview onRefresh
                            which is impossible to make on android without any native code
                        */
                        style={{  transform: [{ scaleY: conversationView ? -1 : 1 }] }}
                        

                        onScroll={(event) => this.onScroll(event, conversationView)}
                        onEndReached={() => this._onEndReached()}

                        renderItem={item => {
                            return (
                                conversationView 
                                ? <View style={{  transform: [{ scaleY: -1 }] }}>
                                    {/** the transform: scale Y = -1 is necessary to make each item appear correctly*/}
                                    <ConversationActivity key={item.id} item={item.item} token={this.props.token} profile={this.props.profile} />
                                </View>
                                : <FeedActivity key={item.id} item={item.item} token={this.props.token} profile={this.props.profile} />
                            )
                        }} />
                    <PLOverlayLoader visible={isLoading || isLoadingTail || isRefreshing} logo />
                {
                    /**
                     * if we are in conversation view, we have a textinput on the bottom, that creates posts
                     */
                    conversationView
                    ? <Footer style={styles.CFooter}>
                            <Item style={styles.CFooterItem}>
                                <Thumbnail small source={{ uri: this.props.profile.avatar_file_name + '&w=200&h=200&auto=compress,format,q=95' }} />
                                <Input style={styles.CFooterItemInput} value={this.state.text} onChangeText={(text) => !this.state.postingOnGroup ? this.onChangeText(text) : {}} />
                                <Button transparent style={styles.sendBtn} onPress={() => this.onCreatePost()}>
                                    <Text color={'#ccc'} >SEND</Text>
                                    <Icon name="md-send" color={'#ccc'} />
                                </Button>
                            </Item>
                            <KeyboardSpacer />
                        </Footer>
                        : null
                    }
            </View>
        );
    }
}

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
    chooseGroup: state.groups.others,
});

export default connect(mapStateToProps)(Newsfeed);