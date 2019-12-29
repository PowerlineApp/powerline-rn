//This is the Item Detail Screen. It appears when a user opens an item from the newsfeed.
//Currently it only supports posts and petitions, but it will need to be expnded to support polls, fundraisers, events, and discussions
//GH19, GH20, GH21, GH22, GH23, GH24, GH25, GH26, GH27
//Should probably use https://api-dev.powerli.ne/api-doc#get--api-v2-activities and post/poll/petition ID


import React, { Component } from 'react';

import { connect } from 'react-redux';
import Share from 'react-native-share';

import RNFetchBlob from 'rn-fetch-blob'
const fs = RNFetchBlob.fs

// import {ScrollView, Modal, TouchableOpacity} from 'react-native';
import { Spinner, Container, Header, Title, Textarea, Content, Text, Button, Icon, Left, Right, Body, Thumbnail, CardItem, Label, List, ListItem, Item, Input, Card } from 'native-base';
import { Image, View, ActivityIndicator, StyleSheet, Modal, ScrollView, TouchableOpacity, TouchableHighlight, Platform, KeyboardAvoidingView, Keyboard, TextInput, ListView, BackHandler, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
import styles, { MAX_HEIGHT, MIN_HEIGHT, optionsStyles, sliderWidth, itemWidth } from './styles';
import TimeAgo from '../../../components/TimeAgo';
import ImageLoad from '../../../components/imagePlaceholder';

import Carousel from 'react-native-snap-carousel';
import YouTube from 'react-native-youtube';
import Menu, {
    MenuContext,
    MenuProvider,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import { getComments, getChildComments, votePost,updateFeedFirstItem, getActivities2, getUsersByGroup, addComment, editComment, deleteComment, rateComment, loadActivityByEntityId, deletePost, deletePetition, changePost, changePetition, loadPollByEntityId, markAsRead } from '../../../actions';
import PLOverlayLoader from '../../../common/PLOverlayLoader';
import randomPlaceholder from '../../../utils/placeholder';
import { FloatingAction } from 'react-native-floating-action';
import {CachedImage} from "react-native-img-cache";
import _ from 'lodash';

// custom components import
import FeedFooter from '../../../components/Feed/FeedFooter';
import FeedHeader from '../../../components/Feed/FeedHeader';
import FeedCarousel from '../../../components/Feed/FeedCarousel';
import FeedDescription from '../../../components/Feed/FeedDescription';
import FeedContext from '../../../components/Feed/FeedContext';
import FeedMetaData from '../../../components/Feed/FeedMetaData';
import FeedActivity from '../../../components/Feed/FeedActivity';
import Options from '../../../components/Feed/Options';

import SuggestionBox from '../../../common/suggestionBox';
import { showToast } from '../../../utils/toast';
import ParsedText from '../../../components/Feed/FeedDescription/ParsedText';
import ParsedComment from './parsedComment';

const { youTubeAPIKey } = require('../../../PLEnv');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('../../../common/PLConstants');
const { SlideInMenu } = renderers;
const numberPerPage = 5;

class ItemDetail extends Component {
    commentToReply: Object;
    isLoadedAll: boolean;
    item: Object;
    commentsCount: number;
    nextCursor: string;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isCommentsLoading: false,
            isEditMode: props.isEditEnabled || false,
            visibleHeight: 50,
            commentText: '',
            defaultInputValue: '',
            editedCommentId: null,
            dataArray: [],
            inputDescription: '',
            placeholderTitle: '',
            sharing: false,
            addingComment: false,
            suggestionList: []
        };
        this.commentToReply = null;
        this.isLoadedAll = false;
        this.item = null;
        this.commentsCount = 0;
        this.nextCursor = null;

        this.onChangeComment = this.onChangeComment.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
        try {

            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBackPress());
        } catch (error) {
            console.log('error', error)
        }
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    }

    componentDidMount() {
        // this.addCommentInput.focus(); 
        // console.log('=xx=x=x=x=x=x=x=x=x==x')
        // console.log('propss', this.props.this.item.type, this.props.entityId);
        if (this.props.commenting) {
            setTimeout(
                () => this._onAddComment()
                , 1000);
        }
        if (this.props.commentText){
            this.setState({commentText: this.props.commentSendText })
        }
        this.loadEntity();
    }

    markAsRead(item){
        // console.log(item.zone, item.type)
        if (item.is_read) return;
        // petition or discussion or boosted post/petition is OPENED
        if (item.zone === 'prioritized'){
            // boosted post/petition
            if (item.type === 'post' || item.type === 'user-petition'){
                this.props.markAsRead(this.props.token, item.id, item.type);
            }
        }

        // discussion
        if (item.type === 'leader-news' || item.type === 'petition'){
            this.props.markAsRead(this.props.token, item.id, 'poll');
        }
    }

    onCommentInputRef = r => {
        this.addCommentInput = r;
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // Notification Handlers
    _keyboardWillShow(e) {
        var newHeight = e.endCoordinates.height + 100;
        this.setState({ visibleHeight: newHeight });
    }

    _keyboardDidHide() {
    }

    // UI Actions    
    onRef = r => {
        this.addCommentView = r;
    }


    _onAddComment(comment) {
        this.setState({ placeholderTitle: randomPlaceholder('comment') });
        this.commentToReply = comment ? comment : null;
        this.setState({addingComment: true});
        // this.addCommentView.open();
    }


    _onSendComment() {
        const { commentText, editedCommentId } = this.state;
        if (this.state.sendingComment === true) return;
        this.setState({sendingComment: true})
        if (commentText === '') {
            this.setState({sendingComment: false, addingComment: false}, () => {
                alert("There is no comment to send. Try again.");
            })            
        } else {
            if (editedCommentId !== null) {
                this.doEditComment(commentText);
            } else {
                this.doComment(commentText);
            }
        }
    }

    //Comments can be voted up or down. It's called "rating" a comment
    _onRate(comment, option) {
        // console.log('_onRate =x=x=x=x=x', comment, option);
        const { props: { profile } } = this;
        this.rate(comment, option);
    }

    _onLoadMore() {
        if (this.state.isCommentsLoading === false && this.isLoadedAll === false) {
            this.page = this.page + 1;
            this.loadNextComments();
        }
    }

    _onCommentBody(comment) {
        const { props: { entityType, entityId } } = this;
        Actions.commentDetail({ comment: comment, entityType: this.item.type, entityId: entityId });
    }

    async onShare(share, entity){
        if (!share) return;
        
        // to avoid double clicks, etc
        if (this.state.sharing) return;
        
        this.setState({sharing: true});
        showToast('Generating poster now...');
        let imgURL = entity.facebook_thumbnail //entity[type].facebook_thumbnail;
        console.log(imgURL);

        let imagePath = null
        RNFetchBlob.config({ fileCache : true }).fetch('GET', imgURL).then((resp) => {
            console.log(`the image is now dowloaded to device's storage`, resp)
            imagePath = resp.path()
            return resp.readFile('base64')
        }).then((base64Data) => {
            console.log(`here's base64 encoded image`, base64Data)
            // will set only the base64 image, will not set title or message
            let options = {
                url: `data:image/png;base64,` + base64Data,
                // default type is png
                type: 'image/png',
                message: '',
                title: ''
            };
            Share.open(options).then(response => {
                console.log('share response', response)
            }).catch(err => {
                console.log('err', err)
                this.setState({sharing: false})
            });
            this.setState({sharing: false})
            // remove the file from storage
            return fs.unlink(imagePath)
        }).catch(e => {
            console.log(e, entity, imgURL)
            if (!imgURL) {
                alert('Poster not available')
            } else {
                alert('Failed to load poster');
                // allow user to hit share again
                this.setState({sharing: false}) 
            }
        })
    }



    // API Calls
    async loadEntity() {
        // console.log(this.props.entityId, this.props.entityType);
        const { props: { token, entityId, entityType, dispatch } } = this;
        // console.log(entityId, entityType)
        this.setState({ isLoading: true });

        let type = entityType;
        // if (entityType === 'user-petition') type = 'petition';
        // if (entityType === 'post') type = 'post'

        let data = null;
        // try {
            await this.loadItem(token, type, entityId, entityType);
            this.setState({ isLoading: false, inputDescription: this.item.body });
            this.loadComments();
            this.onShare(this.props.share, this.item);
            this.markAsRead(this.item);
            
        // } catch (error) {
        //     setTimeout(() => alert(error));
        // }
    }

    async loadItem(token, type, entityId, entityType){
            // console.log('type => ', type, this.props)
            if (this.props.item){
                this.item = this.props.item
            } else {
                this.item = await loadActivityByEntityId(token, type === 'post' ? 'post' : type === 'user-petition' ? 'user-petition' : 'poll' , entityId);
            }

            if (this.props.updateFeed) {
                this.props.updateFeedFirstItem(this.item);
            }
            
            // this.item = action.data.payload[0];
            // if (type !== 'petition' && type !== 'post'){
            //     data = await loadPollByEntityId(token, entityId)
            //     this.item = {...this.item, options: data.options };
            // }

        if (!this.item){
            alert('Error ocurred loading activity.')
            Actions.pop(); 
        }
    }

    async loadComments() {
        const { props: { token, entityId, entityType, dispatch } } = this;
        this.setState({ isCommentsLoading: true });
        console.log('loading comments');
        try {
            let response = await Promise.race([
                getComments(token, !!this.item.options ? 'poll' : this.item.type, entityId),
                timeout(15000),
            ]);
            console.log('load comments response', response);
            if (response.nextCursor) {
                this.nextCursor = response.nextCursor;
                this.isLoadedAll = false;
            } else {
                this.nextCursor = null;
                this.isLoadedAll = true;
            }
            // console.log('response', response);
            this.setState({
                dataArray: response.comments,
            });
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
            this.setState({ isCommentsLoading: false });
        }
    }

    async loadNextComments() {
        const { props: { item, token, entityType, entityId, dispatch } } = this;
        if (this.nextCursor) {
            this.setState({ isCommentsLoading: true });
            try {
                let response = await Promise.race([
                    getComments(token, !!this.item.options ? 'poll' : this.item.type, entityId, this.nextCursor),
                    timeout(15000),
                ]);

                if (response.nextCursor) {
                    this.nextCursor = response.nextCursor;
                } else {
                    this.nextCursor = null;
                    this.isLoadedAll = true;
                }

                let comments = this.state.dataArray;
                comments = comments.concat(response.comments);
                this.setState({
                    dataArray: comments,
                });
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
                this.setState({ isCommentsLoading: false });
            }
        }
    }

    //GH17
    //Users should be able to create comments and reply to a comment
    async doComment(commentText) {
        const { props: { entityId, token, dispatch } } = this;
        this.setState({ isLoading: true});
        let response = await addComment(token, !!this.item.options ? 'poll' : this.item.type, entityId, commentText, (this.commentToReply != null) ? this.commentToReply.id : '0');;
        // this.addCommentView.close();
        this.setState({
            isLoading: false,
            commentText: ''
        });
        // console.log('response', response)
        if (response && response.comment_body) {
            console.log('about to load comments again.')
            let newDataArray = this.state.dataArray.map(c => c); // create copy of current state dataArray

            if (!this.commentToReply){
                newDataArray.push({...response, children: []});
                this.setState({dataArray: newDataArray})
            } else {
                this.loadComments();
            }
        }
        else {
            alert('Something went wrong');
        }
        this.setState({sendingComment: false, addingComment: false})
    }

    editComment = (comment) => {
        console.log('edit comment');
        this.setState({ editedCommentId: comment.id, defaultInputValue: comment.comment_body }, () => {
           this._onAddComment(); 
        });
    }

    resetEditComment = () => this.setState({
        defaultInputValue: '',
        editedCommentId: null,
    })

    async doEditComment(commentText) {
        this.setState({ isLoading: true });
        let response = await editComment(this.item.type, this.props.token, this.state.editedCommentId, commentText);

        // this.addCommentView.close();
        this.setState({
            isLoading: false,
        });

        // console.warn(response);
        if (response.status === 200 && response.ok) {
            this.loadComments();
            this.resetEditComment();
        } else {
            alert(response.message ? response.message : 'Something went wrong. Could not edit!');
            this.resetEditComment();
            
        }
        this.setState({sendingComment: false, addingComment: false})
        // this.menuComment && this.menuComment.close();
    }

    async deleteComment(comment) {
        let response = await deleteComment(this.item.type, this.props.token, comment.id);
        if (response.status === 204 && response.ok) {
            this.loadComments();
        } else {
            alert(response.message ? response.message : 'Something went wrong. Could not delete!');
        }
        this.menuComment && this.menuComment.close();
    }

    async rate(comment, option) {
        let originalComment = _.cloneDeep(comment);
        // console.log('=x=x=x=x=x=x', comment, option);

        // to control if a rating is being requested.
        if (this.state.isRating) {
            return;
        }

        this.setState({ isRating: true });

        const { props: { entityType, token } } = this;
        let response = await rateComment(token, this.item.type, comment.id, option);

        this.setState({ isRating: false });
        if (response && response.comment_body) {
            this.loadComments();
        } else {
            let message = response.message || response;
            setTimeout(() => alert(message), 1000);
        }
    }

    save = () => {
        const { inputDescription } = this.state;

        if (inputDescription !== '') {
            if (this.item.type === 'post') {
                this.props.changePost(this.item.id, this.item.id, inputDescription);
            }
            if (this.item.type === 'user-petition') {
                this.props.changePetition(this.item.id, this.item.id, inputDescription);
            }
            this.item.body = inputDescription;
            this.setState({ isEditMode: false });
        } else {
            alert('Description is empty.')
        }
    }

    dismiss = () => {
        this.setState({
            inputDescription: this.item.body,
            isEditMode: false,
        });
    }

    edit(item) {
        this.setState({ isEditMode: true });
        this.menu && this.menu.close();
    }

    delete(item) {
        if (item.type === 'post') {
            this.props.dispatch(deletePost(item.id, item.id));
        }
        if (item.type === 'user-petition') {
            this.props.dispatch(deletePetition(item.id, item.id));
        }

        this.onBackPress();
        // this.menu && this.menu.close();
    }

    openedAddCommentView() {
        setTimeout(() => {
            this.addCommentInput.focus();
        }, 100);
    }

    _renderHeader(item) {
        return <FeedHeader userId={this.props.userId} item={item} />
    }

    substitute(mention) {
        // console.log('SUBSTITUTING...')
        let { init, end } = this.state;
        let newContent = this.state.commentText;
        let initialLength = newContent.length;
        
        let firstPart = newContent.substr(0, init);
        let finalPart = newContent.substr(end, initialLength);
        
        let finalString = firstPart + mention + finalPart;
        try {
            this.setState({ commentText: finalString, displaySuggestionBox: false, lockSuggestionPosition: end });
        } catch (error) {
            console.log(error)            
        }
    }

    onSelectionChange(event) {
        let { start, end } = event.nativeEvent.selection;
        setTimeout(() => {
            if (start !== end) return;
            if (start === this.state.lockSuggestionPosition) return;
            let text = this.state.commentText;
            let displayMention = false;
            let i;

            for (i = start - 1; i >= 0; i--) {
                if (text.charAt(i) === ' ') break;
                if (text.charAt(i) === '@' && (i === 0 || text.charAt(i - 1) === ' ')) {
                    if (text.charAt(i + 1) && text.charAt(i + 1) !== ' ' && text.charAt(i + 2) && text.charAt(i + 2) !== ' ') {
                        displayMention = true;
                        for (let j = start - 1; text.charAt(j) && text.charAt(j) !== ' '; j++) end = j + 1;
                    } else {
                        displayMention = false;
                    }
                    break;
                }
            }
            if (displayMention) {
                let suggestionSearch = text.slice(i + 1, end);
                this.updateSuggestionList(this.props.token, suggestionSearch);
                this.setState({ displaySuggestionBox: displayMention, init: i, end: end });
            } else {
                this.setState({ suggestionList: [], displaySuggestionBox: false });
            }
        }, 100);
    }

    updateSuggestionList(token, suggestionSearch) {
        getUsersByGroup(token, this.item.group.id, suggestionSearch).then(data => {
            this.setState({ suggestionList: data.payload });
        }).catch(err => {

        });
    }
    changeContent(text) {
        this.setState({
            inputDescription: text
        });
    }
    _renderTextarea(item, state) {
        return (
            <View>
                <View style={styles.editIconsContainer}>
                    <TouchableOpacity onPress={this.save}>
                        <Icon name="md-checkmark" style={styles.editIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.dismiss}>
                        <Icon name="md-close" /* name="md-trash" */ style={styles.editIcon} />
                    </TouchableOpacity>
                </View>
                <Textarea
                    maxLength={5000}
                    placeholderTextColor="rgba(0,0,0,0.1)"
                    style={styles.textarea}
                    value={state.inputDescription}
                    onChangeText={(text) => this.changeContent(text)}
                />
            </View>
        )
    }

    onChangeComment(text){
        this.setState({commentText: text})
    }

    onCloseComment(){
        this.setState({addingComment: false, displaySuggestionBox: false, suggestionList: []})
    }


    renderAddCommentView(){
        const { props: { profile } } = this;
        let thumbnail = profile.avatar_file_name ? profile.avatar_file_name : '';
        let {value} = this.state;
        if (!this.state.addingComment){
            return null;
        }
        return (
                <Modal style={{justifyContent: 'flex-end'}} transparent onRequestClose={() => this.onCloseComment()} visible={this.state.addingComment} animationType="slide">
                    <TouchableOpacity transparent onPress={() => this.onCloseComment()} style={{flex: 1, height: '100%', justifyContent: 'flex-end'}}>
                    {
                        (this.state.displaySuggestionBox && this.state.suggestionList && this.state.suggestionList.length > 0) 
                        && <ScrollView style={{maxHeight: 40, backgroundColor: '#fff', marginBottom: 0, zIndex: 3}} keyboardShouldPersistTaps='always'>
                            <SuggestionBox horizontal substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox && this.state.suggestionList.length > 0} userList={this.state.suggestionList} />
                        </ScrollView>
                    }
                        <KeyboardAvoidingView behavior={Platform.select({android:'height', ios: 'padding'})}>
                            <CardItem style={{padding: 0, backgroundColor: '#fff'}} keyboardShouldPersistTaps="always">
                                <Left style={{height: 40, margin: 0, backgroundColor: '#fff'}} keyboardShouldPersistTaps="always">
                                    <Thumbnail small source={thumbnail ? { uri: thumbnail + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                                    <Body keyboardShouldPersistTaps="always">
                                        <Input
                                            autoFocus
                                            // onFocus={() => this.setState({commentText: 'aloha'})}
                                            placeholder={this.state.placeholderTitle}
                                            onContentSizeChange={() => {}}
                                            placeholderTextColor={styles.addCommentTitle.color}
                                            style={styles.commentInput}
                                            ref={this.onCommentInputRef}
                                            value={this.state.commentText}
                                            defaultValue={this.state.defaultInputValue}
                                            onChangeText={this.onChangeComment}
                                            onSelectionChange={(e) => this.onSelectionChange(e)}
                                            multiline
                                            numberOfLines={4}
                                            />
                                    </Body>
                                    <Right style={{ flex: 0.2 }}>
                                        <TouchableHighlight underlayColor="#fff" style={{ flexDirection: 'row', alignItems: 'center', height: '100%', padding: 8 }} onPress={() => this._onSendComment()}>
                                            <View style={{ flexDirection: 'row' }}>
                                            {
                                                this.state.sendingComment
                                                ? <ActivityIndicator size="small" color={styles.commentSendText.color} />
                                                :[<Text style={styles.commentSendText}>SEND</Text>,
                                                <Icon name="md-send" style={styles.commentSendIcon} />]
                                            }
                                            </View>
                                        </TouchableHighlight>
                                    </Right>
                                </Left>
                            </CardItem>
                        </KeyboardAvoidingView>
                    </TouchableOpacity>
                </Modal>
            
        )
    }
                
    //Adding a comment to an item
    _renderAddComment() {
        const { props: { profile } } = this;
        let thumbnail = profile.avatar_file_name ? profile.avatar_file_name : '';
        let {value} = this.state;
        return (
            <TouchableOpacity onPress={() => this._onAddComment()}>
                <CardItem keyboardShouldPersistTaps="always" style={styles.commentAddField}>
                    <Left keyboardShouldPersistTaps="always">
                        <Thumbnail small source={thumbnail ? { uri: thumbnail + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                        <Body keyboardShouldPersistTaps="always">
                            <Text numberOfLines={1} style={styles.addCommentTitle}>Add your thoughts...</Text>
                            {this.renderAddCommentView()}
                        </Body>
                        <Right />
                    </Left>
                </CardItem >
            </TouchableOpacity >
        );
    }

    //GH160
    _renderCommentsLoading() {
        if (this.state.isCommentsLoading === true) {
            return (
                <Spinner color='gray' />
            );
        } else {
            return null;
        }
    }

    async _onLoadMoreChildren(comment){
        let originalComment = this.state.dataArray.find(c => c.id === comment.id);
        let type = originalComment.type === 'post' ? 'post' : 'originalComment'
        let perPage = originalComment.nextCursor ? 2 : 4;

        let comments = await getChildComments(this.props.token, !!this.item.options ? 'poll' : this.item.type, originalComment.id, originalComment.nextCursor || 0, perPage);
        let newCommentsArray = this.state.dataArray.map(c => {
            if (c.id === comment.id){
                return {...c, children: perPage === 4 ? comments.comments : c.children.concat(comments.comments), nextCursor: comments.nextCursor}
            }
            return c;
        })
        this.setState({dataArray: newCommentsArray})
    }

    loadMoreChildren(comment){
        return (
            <View style={{marginTop: 8, marginLeft: 60 }}>
                <View style={{
                    height: 1,
                    backgroundColor: '#eee',
                    marginHorizontal: 20}} />
                <Button transparent small style={{padding: 0, backgroundColor: '#fff', padding: 0}} full onPress={() => this._onLoadMoreChildren(comment)}>
                    <Text style={{
                    fontSize: 15,
                    color: '#8694ab',
                    fontWeight: '500'}}>
                        Load More
                    </Text>
                </Button>
            </View>
        );
    }

    _renderComment(comment) {
        return (
            <View style={{marginBottom: 20}}>
                {this._renderRootComment(comment)}
                <FlatList data={comment.children} scrollEnabled={false} renderItem={({item}) => this._renderRootComment(item, true)} />
                {
                    (comment.child_count > comment.children.length) && 
                    this.loadMoreChildren(comment)
                }
            </View>
        )
    }

    _renderRootComment = (comment, isChild = false) => {
        let thumbnail = comment.author_picture ? comment.author_picture : '';
        let title = (comment.user ? comment.user.first_name : '' || '') + ' ' + (comment.user ? comment.user.last_name : '' || '');
        let rateUp = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
        let rateDown = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;
        let rateValue = comment.rate_value;

        let style: object = { paddingBottom: 0 };
        if (isChild) {
            style.marginLeft = 40;
            style.marginTop = 5;
        }

        return (
            <CardItem style={style}>
                <Left>
                    <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => this._onCommentBody(comment)}>
                            <Text style={styles.rootTitle}>{title}</Text>
                            <ParsedComment style={styles.rootDescription} item={comment} />
                            <Text note style={styles.subtitle}><TimeAgo time={new Date(comment.created_at)} /></Text>
                        </TouchableOpacity>
                        <View style={styles.commentFooterContainer}>
                            <Button iconLeft small transparent onPress={() => this._onRate(comment, 'up')}>
                                <Icon name="md-arrow-dropup" style={styles.footerIcon} />
                                <Label style={rateValue === 'up' ? styles.footerTextBlue : styles.footerText}>{rateUp ? rateUp : 0}</Label>
                            </Button>
                            <Button iconLeft small transparent onPress={() => this._onRate(comment, 'down')}>
                                <Icon active name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={rateValue === 'down' ? styles.footerTextBlue : styles.footerText}>{rateDown ? rateDown : 0}</Label>
                            </Button>
                            <Button iconLeft small transparent onPress={() => this._onAddComment(comment)}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>{comment.child_count ? comment.child_count : 0}</Label>
                            </Button>
                        </View>
                    </Body>
                    {
                        comment.is_owner && comment.user.id === this.props.userId &&
                        <Right style={{ flex: 0.1, alignSelf: 'flex-start', alignContent: 'center', alignItems: 'center', paddingVertical: 4, backgroundColor: '#fff' }}>
                            <Menu style={{ width: '100%'}} ref={ref => { this.menuComment = ref; }}>
                                <MenuTrigger style={{alignItems: 'center', width: '100%', justifyContent: 'center', backgroundColor: '#fff'}}>
                                    <Icon name="md-more" style={styles.commentMoreIcon} />
                                </MenuTrigger>
                                <MenuOptions customStyles={optionsStyles}>
                                    <MenuOption onSelect={() => this.editComment(comment)}>
                                        <View style={{flexDirection: 'row', alignItems: 'center' }} >
                                            <Icon name="md-create" style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Edit comment</Text>
                                        </View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.deleteComment(comment)}>
                                        <View style={{flexDirection: 'row', alignItems: 'center' }} >
                                            <Icon name="md-trash" style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Delete comment</Text>
                                        </View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </Right>
                    }
                </Left>
            </CardItem>
        );
    }

    _renderChildComment(comment, isChild = true) {
            let thumbnail = comment.author_picture ? comment.author_picture : '';
            let title = (comment.user ? comment.user.first_name : '' || '') + ' ' + (comment.user ? comment.user.last_name : '' || '');
            let rateUp = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
            let rateDown = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;
            let rateValue = comment.rate_value;
    
            let style: object = { paddingBottom: 0 };
            if (isChild) {
                style.marginLeft = 40;
                style.marginTop = 5;
            }
    
    
            return (
                <CardItem style={style}>
                    <Left>
                        <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                        <Body style={{ alignSelf: 'flex-start' }}>
                            <TouchableOpacity onPress={() => this._onCommentBody(comment)}>
                                <Text style={styles.rootTitle}>{title}</Text>
                                <ParsedComment style={styles.rootDescription} item={comment} />
                                <Text note style={styles.subtitle}><TimeAgo time={new Date(comment.created_at)} /></Text>
                            </TouchableOpacity>
                            <View style={styles.commentFooterContainer}>
                                <Button iconLeft small transparent onPress={() => this._onRate(comment, 'up')}>
                                    <Icon name="md-arrow-dropup" style={styles.footerIcon} />
                                    <Label style={rateValue === 'up' ? styles.footerTextBlue : styles.footerText}>{rateUp ? rateUp : 0}</Label>
                                </Button>
                                <Button iconLeft small transparent onPress={() => this._onRate(comment, 'down')}>
                                    <Icon active name="md-arrow-dropdown" style={styles.footerIcon} />
                                    <Label style={rateValue === 'down' ? styles.footerTextBlue : styles.footerText}>{rateDown ? rateDown : 0}</Label>
                                </Button>
                                <Button iconLeft small transparent onPress={() => this._onAddComment(comment)}>
                                    <Icon active name="ios-undo" style={styles.footerIcon} />
                                    <Label style={styles.footerText}>{comment.child_count ? comment.child_count : 0}</Label>
                                </Button>
                            </View>
                        </Body>
                        {
                            comment.is_owner && comment.user.id === this.props.userId &&
                            <Right style={{ flex: 0.1, alignSelf: 'flex-start', alignContent: 'center', alignItems: 'center', paddingVertical: 4, backgroundColor: '#fff' }}>
                                <Menu style={{ width: '100%'}} ref={ref => { this.menuComment = ref; }}>
                                    <MenuTrigger style={{alignItems: 'center', width: '100%', justifyContent: 'center', backgroundColor: '#fff'}}>
                                        <Icon name="md-more" style={styles.commentMoreIcon} />
                                    </MenuTrigger>
                                    <MenuOptions customStyles={optionsStyles}>
                                        <MenuOption onSelect={() => this.editComment(comment)}>
                                            <View style={{flexDirection: 'row', alignItems: 'center' }} >
                                                <Icon name="md-create" style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Edit comment</Text>
                                            </View>
                                        </MenuOption>
                                        <MenuOption onSelect={() => this.deleteComment(comment)}>
                                            <View style={{flexDirection: 'row', alignItems: 'center' }} >
                                                <Icon name="md-trash" style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Delete comment</Text>
                                            </View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </Right>
                        }
                    </Left>
                    <Right style={{ flex: 0.1, alignSelf: 'flex-start' }}>
                        <Icon name="md-more" style={styles.commentMoreIcon} />
                    </Right>
                </CardItem>
            );
        }

    _renderLoadMore() {
        if (this.state.isCommentsLoading === false && this.isLoadedAll === false && this.state.dataArray.length > 0) {
            return (
                <View style={{ marginTop: 20 }}>
                    <View style={styles.borderAllRepliesContainer} />
                    <Button transparent full onPress={() => this._onLoadMore()}>
                        <Text style={styles.allRepliesButtonText}>Load More</Text>
                    </Button>
                </View>
            );
        } else {
            return null;
        }
    }
    _renderTitle(item) {
        if (item.title) {
            return (<Text style={styles.title}>{item.title}</Text>);
        } else {
            return null;
        }
    }
    // The priority zone counter lists the count of total priority zone items in the newsfeed
    _renderZoneIcon(item) {
        if (item.zone === 'prioritized') {
            return (<Icon active name='ios-flash' style={styles.zoneIcon} />);
        } else {
            return null;
        }
    }
    renderEditableDescription(item, state) {
        return (
            <CardItem>
                <Left>
                    <View style={styles.descLeftContainer}>
                        {this._renderZoneIcon(item)}
                        <Label style={styles.commentCount}>{item.responses_count}</Label>
                    </View>
                    <Body style={styles.descBodyContainer}>
                        <View>
                            {this._renderTitle(item)}
                            {this._renderTextarea(item, state)}
                            <Text style={styles.description} numberOfLines={5}>{item.body}</Text>
                        </View>
                    </Body>
                </Left>
            </CardItem>
        );
    }

    renderAttachedImage(item){
        let imgURL = item.image;
        if (!imgURL) return;
        return (
                <CardItem>
                    <Left>
                        <Body>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.attachedImage}
                                onPress={() => { }}>
                                <View style={styles.imageContainer}>
                                    <Image 
                                    placeholderSource={require('img/empty_image.png')}
                                    source={{ uri: imgURL + '&w=500&h=500&auto=compress,q=95' }}
                                    style={styles.image} />
                                    {/* <ImageLoad
                                    /> */}
                                </View>
                            </TouchableOpacity>
                        </Body>
                    </Left>
                </CardItem>
            );
    }

    _renderPostOrUserPetitionCard(item, state) {
        return (
            <View style={{padding: 8, paddingBottom: 45}}>
                <FeedHeader userId={this.props.userId} item={item} />
                {
                    state.isEditMode
                    ? this.renderEditableDescription(item, state)
                    : <FeedDescription item={item} profile={this.props.profile} isInDetail />
                }
                <FeedMetaData item={item} />
                <View style={styles.borderContainer} />
                {this.renderAttachedImage(item)}
                <FeedFooter isInDetail item={item} profile={this.props.profile} token={this.props.token} showAnalytics />
            </View>
        );
    }
    
    _renderGroupCard(item) {
        return (
            <View style={{backgroundColor: '#fff', padding: 8, paddingBottom: 45}}>
                    <FeedHeader userId={this.props.userId} item={item} />
                    <FeedDescription item={item} profile={this.props.profile} isInDetail />
                    <FeedCarousel item={item} />
                    <Options onVote={() => this.loadEntity()} item={item} profile={this.props.profile} token={this.props.token} />
                    <FeedMetaData item={item} />
                    <View style={styles.borderContainer} />
                    <FeedFooter isInDetail item={item} profile={this.props.profile} token={this.props.token} showAnalytics />
                </View>
        );
    }

    _renderActivity(item, state) {
        switch (item.type) {
            case 'post':
            case 'user-petition':
                return this._renderPostOrUserPetitionCard(item, state);
                break;
            default:
                return this._renderGroupCard(item);
                break;
        }
    }

    onBackPress = () => {
        const { backTo } = this.props;
        Keyboard.dismiss();
        return Actions.reset('home');
        // if (backTo) {
        //     Actions.popTo(backTo);
        // } else {
        //     Actions.pop();
        // }
    }

    renderFloatingActionButton(item){
        let group = item.group;
        return (
            item.facebook_thumbnail &&
            <FloatingAction
                actions={
                    [
                        {
                            text: 'this will be overridden',
                            icon: require('../../../assets/share_icon.png'),
                            name: 'facebook',
                            position: 2,
                            color: '#55c5ff'
                        }
                    ]
                }
                onPressItem={
                    (name) => {
                        this.onShare(true, item)
                    }
                }
                buttonColor='#55c5ff'
                overlayColor='rgba(0,0,0,0)'
                floatingIcon={require('../../../assets/share_icon.png')}
                overrideWithAction
                >
            </FloatingAction>
        )
    }

    render() {
        if (this.item === null) {
            return null;
        }
        let item = this.item;
        return (

            <MenuContext customStyles={menuContextStyles}>
                <Container scrollEnabled={false} style={{ flex: 1 }}>
                    <HeaderImageScrollView
                        maxHeight={MAX_HEIGHT}
                        minHeight={MIN_HEIGHT}
                        keyboardShouldPersistTaps='always'
                        fadeOutForeground
                        renderHeader={() => {
                                return item && item.group && item.group.has_agency && item.group.banner
                                ? <CachedImage style={{flex: 1}} source={{ uri: item.group.banner }} />
                                : <Image
                                style={styles.headerImage}
                                // resizeMode='contain'
                                source={item && item.group && item.group.banner ? {uri: item.group.banner} : require('img/item_detail_header.png')}
                                // source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                                // source={{uri: 'https://lh6.googleusercontent.com/N5KgN1brOd6X-AxD0go0Ex2xOzjhPFFytLJV-JBv1d8C-X6K58bXWUcVIEoftEHGaycHkujLD4wIgK1LA_Zq=w1107-h984'}}
                                />
                        }}
                        renderFixedForeground={() => {
                            // return null;
                            return (
                            <Animatable.View
                            style={styles.navTitleView}
                            ref={(navTitleView) => { this.navTitleView = navTitleView; }}>
                                <Header style={{ backgroundColor: 'transparent' }}>
                                    <Left>
                                        <Button style={{width: '100%'}}  transparent onPress={this.onBackPress} style={{ width: 50, height: 50 }}  >
                                            <Icon active name="arrow-back" style={{ color: 'white' }} />
                                        </Button>
                                    </Left>
                                    <Body style={{ flex: 4 }}>
                                        <Title style={styles.navTitle}>{item && item.group && item.group.official_name}</Title>
                                    </Body>
                                    <Right />
                                </Header>
                            </Animatable.View>
                        )}}
                        renderForeground={() => {
                            // return null;
                            return (
                            <Left style={styles.titleContainer}>
                                <Button transparent onPress={this.onBackPress} style={{ width: 50, height: 50 }} >
                                    <Icon active name="md-arrow-back" style={{ color: 'white' }} />
                                </Button>
                                <Body style={{ marginTop: -12 }}>
                                    <TouchableOpacity onPress={() => Actions.groupprofile({id: item.group.id})} style={{alignContent: 'center', alignItems: 'center'}} >
                                        <Thumbnail size={50} source={item && item.group && item.group.avatar ? { uri: item.group.avatar + '&w=200&h=200&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                                        <Text style={styles.imageTitle} >{item && item.group && item.group.official_name}</Text>
                                    </TouchableOpacity>
                                </Body>
                            </Left>
                        )}}>
                <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="always" contentContainerStyle={{padding: 8, backgroundColor: '#fff'}} bounces={false}>
                         <TriggeringView
                            onHide={() => this.navTitleView.fadeInUp(200)}
                            onDisplay={() => this.navTitleView.fadeOut(100)}>
                        </TriggeringView>
                            {this._renderActivity(item, this.state)}
                        <View style={styles.borderContainer} />
                        {this._renderAddComment()}
                        <View style={styles.borderContainer} />
                        <FlatList
                            scrollEnabled={false}
                            data={this.state.dataArray}
                            renderItem={({item}) => this._renderComment(item)}
                            refreshing={false}
                            onRefresh={() => {}}
                        />

                        {this._renderLoadMore()}
                        {this._renderCommentsLoading()}
                </ScrollView>
                            </HeaderImageScrollView>
                </Container>
                {
                    this.renderFloatingActionButton(item)
                }
            </MenuContext>
            // <MenuProvider customStyles={menuContextStyles} keyboardShouldPersistTaps="always">
            //     <Container style={{ flex: 1 }} scrollEnabled="false" keyboardShouldPersistTaps="always">
            //         <HeaderImageScrollView
            //         keyboardShouldPersistTaps="always"
            //             maxHeight={MAX_HEIGHT}
            //             minHeight={MIN_HEIGHT}
            //             fadeOutForeground
            //             refreshControl
            //             showsVerticalScrollIndicator={false}
            //             refreshin={false}
            //             onRefresh={() => {
            //                  this.loadEntity();
            //                  this.loadComments();
            //             }}
            //             renderHeader={() => {
            //                 // return null;
            //                     return item.group.has_agency
            //                     ? <CachedImage style={{flex: 1}} source={{ uri: item.group.banner }} />
            //                     : <Image
            //                     style={styles.headerImage}
            //                     source={item.group.banner ? {uri: item.group.banner} : require('img/item_detail_header.png')}
            //                     />
            //             }}
            //             renderFixedForeground={() => {
            //                 // return null;
            //                 return (
            //                 <Animatable.View
            //                 style={styles.navTitleView}
            //                 ref={(navTitleView) => { this.navTitleView = navTitleView; }}>
            //                     <Header style={{ backgroundColor: 'transparent' }}>
            //                         <Left>
            //                             <Button style={{width: '100%'}}  transparent onPress={this.onBackPress} style={{ width: 50, height: 50 }}  >
            //                                 <Icon active name="arrow-back" style={{ color: 'white' }} />
            //                             </Button>
            //                         </Left>
            //                         <Body style={{ flex: 4 }}>
            //                             <Title style={styles.navTitle}>{item.group.official_name}</Title>
            //                         </Body>
            //                         <Right />
            //                     </Header>
            //                 </Animatable.View>
            //             )}}
            //             renderForeground={() => {
            //                 // return null;
            //                 return (
            //                 <Left style={styles.titleContainer}>
            //                     <Button transparent onPress={this.onBackPress} style={{ width: 50, height: 50 }} >
            //                         <Icon active name="md-arrow-back" style={{ color: 'white' }} />
            //                     </Button>
            //                     <Body style={{ marginTop: -12 }}>
            //                         <TouchableOpacity onPress={() => Actions.groupprofile({id: item.group.id})} style={{alignContent: 'center', alignItems: 'center'}} >
            //                             <Thumbnail size={50} source={item.group.avatar ? { uri: item.group.avatar + '&w=200&h=200&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
            //                             <Text style={styles.imageTitle} >{item.group.official_name}</Text>
            //                         </TouchableOpacity>
            //                     </Body>
            //                 </Left>
            //             )}}>
            //     <ScrollView keyboardShouldPersistTaps="always" bounces={false}>
            //             <TriggeringView
            //                 onHide={() => this.navTitleView.fadeInUp(200)}
            //                 onDisplay={() => this.navTitleView.fadeOut(100)}>
            //             </TriggeringView>
            //                 {this._renderActivity(item, this.state)}
            //             <View style={styles.borderContainer} />
            //             {this._renderAddComment()}
            //             <View style={styles.borderContainer} />
            //             <FlatList
            //                 scrollEnabled={false}
            //                 data={this.state.dataArray}
            //                 renderItem={({item}) => this._renderComment(item)}
            //                 refreshing={false}
            //                 onRefresh={() => {}}
            //             />

            //             {this._renderLoadMore()}
            //             {this._renderCommentsLoading()}
            //     </ScrollView>
            //                 </HeaderImageScrollView>
            //     </Container>
            //     {
            //         this.renderFloatingActionButton(item)
            //     }
            // </MenuProvider>
        );
    }
}

async function timeout(ms: number): Promise {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop,
};

const mapStateToProps = state => ({
    token: state.user.token,
    profile: state.user.profile,
    userId: state.user.id,
});

export default connect(mapStateToProps, {markAsRead, updateFeedFirstItem, changePost, changePetition})(ItemDetail);