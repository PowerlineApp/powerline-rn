//Newsfeed tab GH13
//The backend call for this scene will be driven primarily by https://api-dev.powerli.ne/api-doc#get--api-v2-activities
//The default view is "All" feed, but a specific group may be called for group Feed (GH45), Friends Feed (GH51), a specific user's feed (GH44)
//Group feed will look very different depending on if in Feed view or Conversation view.

import React, { Component } from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {KeyboardAvoidingView} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, ListItem, Thumbnail, List, Card, CardItem, Label, Footer } from 'native-base';
import { ScrollView, FlatList, View, RefreshControl, TouchableOpacity, Image, WebView, Platform, Share } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { setGroup, loadActivities, getActivities2, resetActivities, votePost, editFollowers, loadActivityByEntityId, createPostToGroup, deletePost, deletePetition, getGroups, saveOffSet } from 'PLActions';
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
            rerenderMarreta: 0,
            text: "",
            showAvatar: true
        };
        lastScrollPosition: null
    }

    shouldComponentUpdate(nextProps, nextState){
        // console.warn('should component update', nextProps)
        if (this.state !== nextState){
            return true;
        }
        if (this.props.selectedGroup !== nextProps.selectedGroup) {
            return true;
        }
        if (this.props.loadingActions !== nextProps.loadingActions) {
            console.log('here => ', this.props.loadingActions, nextProps.loadingActions)
            return true;
        }
        if (this.props.payload !== nextProps.payload){
            return true;
        }
        // console.log('????????????????????????')
        return false;
        // if (this.props.lastOffset !== nextProps.lastOffset){
        //     return false;
        // }
    }

    componentWillMount(){
        // console.log(this.props)
        // alert(JSON.stringify(this.props.selectedGroup))
        if (!this.props.selectedGroup || !this.props.selectedGroup.id){
            let data = {id: 'all', group: 'all', header: 'all'};
            this.props.dispatch(setGroup(data, this.props.token, 'all'));
        }
        setTimeout(() => {
            this.props.dispatch({type: 'SET_LOADING', payload: false})
        }, 15000)
    }
    
    componentDidMount() {
        // this.flatListRef.scrollToOffset({offset: this.props.lastOffset, animated: false})
        // console.warn('componentDidMount', this.props.payload.length)
        console.warn('last offset: ====>', this.props.lastOffset, this.props.payload.length)
        setTimeout(() => {
            this.flatListRef && this.flatListRef.scrollToOffset({offset: this.props.lastOffset, animated: true})
        }, 1000)       

    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            dataArray: nextProps.payload,
        });
    }

    async loadInitialActivities(nextProps) {
        this.setState({ isRefreshing: true });
        this.setLoading(true);
        const { props: { token, dispatch, page } } = this;
        const group = nextProps ? nextProps.selectedGroup.group : this.props.selectedGroup.group;
        try {
            // let activities = await loadActivities(token, 0, 20, group);
            let activities = await getActivities2(token, group, 0, 0, this.props.cursor);
            console.log('got activities', activities.type);
            dispatch(activities);
        } catch (e) {
            console.log('e', e)
            this.setState({ isRefreshing: false });
            this.setLoading(false)
            
            const message = e.message || e;
            if (typeof message === 'string') {
                alert('Timed out. Please check internet connection');
            }
        } finally {
            this.setState({ isRefreshing: false });
            this.setLoading(false)
        }
    }

    async loadNextActivities() {
        this.setState({ isLoadingTail: true });
        this.setLoading(true);
        const { props: { token, page, dispatch } } = this;
        const {group} = this.props.selectedGroup;
        try {
            let activities = this.props.cursor ? await getActivities2(token, group, 0, 0, this.props.cursor) : {type: ''}
            dispatch(activities);
        } catch (e) {
            this.setState({ isLoadingTail: false }, () => {
                this.setLoading(false);
                setTimeout(() => {
                    const message = e.message || e;
                    if (typeof message === 'string') {
                        alert('Timed out. Please check internet connection' + message);
                    }
                }, 500)
            });
        } finally {
            this.setState({ isLoadingTail: false });
            this.setLoading(false);
        }
    }

    _onRefresh() {
        console.log('onRefresh')
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
        getGroups(this.props.token)
        .then(data => {
            this.props.dispatch([{
                type: 'LOADED_GROUPS',
                data: { payload: data.payload }
            }, {
                type: 'SET_NEWSFEED_COUNT',
                count: data.payload.reduce((a, b) => a += b.priority_item_count, 0),
            }]);
        });
    }

    _onEndReached() {
        const { props: { page, count } } = this;
        if (this.state.isLoadingTail === false && count > 0) {
            this.loadNextActivities();
        }
    }

    onChangeText(text) {
        this.setState({
            text: text
        });
    }

    onCreatePost() {
        if (this.state.postingOnGroup) {
            return;
        }
        var { token, selectedGroup, dispatch } = this.props;
        this.setState({ postingOnGroup: true })
        if (this.state.text != "" || this.state.text.trim() != "") {
            createPostToGroup(token, selectedGroup.group, this.state.text)
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
     * @param {object} event - scroll event
     * @param {boolean} conversation - tell us if we are in conversation or feed view
     */
    onScroll(event, conversation) {

        const scrollPosition = event && event.nativeEvent && event.nativeEvent.contentOffset && event.nativeEvent.contentOffset.y;
        this.props.dispatch({type: 'SAVE_OFFSET', payload: scrollPosition})
    }


    renderFullHeader(){
        return (
            <View style={styles.groupFullHeaderContainer}>
                <Thumbnail square source={{ uri: this.props.selectedGroup.groupAvatar + '&w=200&h=200&auto=compress,format,q=95' }} style={styles.groupAvatarFull} />
                <Text style={styles.groupName}>{this.props.selectedGroup.groupName}</Text>
            </View>);
    }
    
    renderSmallHeader(){
        return (
            <View style={styles.groupSmallHeaderContainer}>
                <Thumbnail round small source={{ uri: this.props.selectedGroup.groupAvatar + '&w=100&h=100&auto=compress,format,q=95' }} style={styles.groupAvatarSmall} />
                <Text style={styles.groupName}>{this.props.selectedGroup.groupName}</Text>
            </View>);
    }

    renderHeader(group){
        return (group && group.group != 'all' &&
        <TouchableOpacity onPress={() => {
            if (group.header !== 'local' && group.header !== 'state' && group.header !== 'country')
            Actions.groupprofile({ id: this.props.selectedGroup.group })}
            }>
            {

                this.state.showAvatar
                ? this.renderSmallHeader()
                : this.renderSmallHeader()
            }
        </TouchableOpacity>)
    }

    renderActivity = (item) => (
         <FeedActivity key={item.id} item={item.item} token={this.props.token} profile={this.props.profile} />
    )

    setLoading = (loading) => {
        this.props.setLoading(loading);
    }

    render() {
        const { isRefreshing, isLoading, isLoadingTail } = this.state;

        // console.log('selected group', this.props)
        let loading =  (
            this.props.loadingActions ||
            isLoading ||
            isLoadingTail ||
            isRefreshing
        )

        let dataArray = this.state.dataArray || [];

        this.conversationView = false;
        if (this.props.selectedGroup && this.props.selectedGroup.group !== 'all' && this.props.selectedGroup.conversationView){
            // conversationView is disabled by default for now
            this.conversationView = false;
        }

        return (
            <Container style={{flex: 1}}>
                    {    
                        this.renderHeader(this.props.selectedGroup)
                    }
                    <ContentPlaceholder
                        refreshControl={<RefreshControl onRefresh={() => this._onRefresh()} refreshing={false} />}
                        empty={!this.state.isRefreshing && !this.state.isLoading && dataArray.length === 0}
                        title="The world belongs to those who speak up! Be the first to create a post!" />
                    <FlatList 
                        data={dataArray}
                        extraData={this.state.rerenderMarreta}
                        scrollEventThrottle={500}
                        style={dataArray[0] && dataArray[dataArray.length - 1].first_comment ? {marginBottom: 48} : {}} // allowing to see comment preview of last activity
                        refreshing={false}
                        onRefresh={() => this._onRefresh()}
                        onEndReachedThreshold={0.8}
                        initialNumToRender={3}
                        ref={(ref) => this.flatListRef = ref}
                        onScroll={(event) => this.onScroll(event)}
                        onEndReached={() => this._onEndReached()}
                        renderItem={(item) => <FeedActivity key={item.id} onUpdateActivity={this.onUpdateActivity} item={item.item} token={this.props.token} profile={this.props.profile} />}
                    /> 
                    {/* <PLOverlayLoader visible={loading} logo /> */}
                    {
                        this.conversationView
                        ?
                        <KeyboardAvoidingView behavior={Platform.select({android:'height', ios: 'padding'})}>
                        <Footer style={styles.CFooter}>
                                <Item style={styles.CFooterItem}>
                                    <Thumbnail small source={{ uri: this.props.profile.avatar_file_name + '&w=200&h=200&auto=compress,format,q=95' }} />
                                    <Input style={styles.CFooterItemInput} value={this.state.text} onChangeText={(text) => !this.state.postingOnGroup ? this.onChangeText(text) : {}} />
                                    <Button transparent style={styles.sendBtn} onPress={() => this.onCreatePost()}>
                                        <Text style={{color: this.state.postingOnGroup ? '#ccc' : '#3F51b5'}} >SEND</Text>
                                        <Icon name="md-send" />
                                    </Button>
                                </Item>
                            </Footer>
                    </KeyboardAvoidingView> 
                            : null
                        }
            </Container>
        );
    }
}

async function timeout(ms: number): Promise {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

const mapStateToProps = state => 

{
    // console.log('activities state', state.activities)
    return ({
    token: state.user.token,
    page: state.activities.page,
    totalItems: state.activities.totalItems,
    cursor: state.activities.cursor,
    // totalItems: 5,
    payload: state.activities.payload,
    loadingActions: state.activities.loading,
    count: state.activities.count,
    profile: state.user.profile,
    userId: state.user.id,
    selectedGroup: state.activities.selectedGroup,
    lastOffset: state.activities.lastOffset,
    // selectedGroup: {},
    // group: state.activities.group,
    drawerState: state.drawer.drawerState
    // groupName: state.activities.groupName,
    // groupAvatar: state.activities.groupAvatar,
    // groupLimit: state.activities.groupLimit,
    // groupMembers: state.activities.groupMembers,
    // conversationView: state.activities.conversationView,
    // chooseGroup: state.groups.others
})
}
;

export default connect(mapStateToProps, (dispatch) => ({saveOffSet, dispatch, setGroup}))(Newsfeed);
