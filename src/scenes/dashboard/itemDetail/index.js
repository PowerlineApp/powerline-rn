//This is the Item Detail Screen. It appears when a user opens an item from the newsfeed.
//Currently it only supports posts and petitions, but it will need to be expnded to support polls, fundraisers, events, and discussions
//GH19, GH20, GH21, GH22, GH23, GH24, GH25, GH26, GH27
//Should probably use https://api-dev.powerli.ne/api-doc#get--api-v2-activities and post/poll/petition ID


import React, { Component } from 'react';
import { connect } from 'react-redux';
import {ScrollView} from 'react-native';
import { Container, Header, Title, Textarea, Content, Text, Button, Icon, Left, Right, Body, Thumbnail, CardItem, Label, List, ListItem, Item, Input } from 'native-base';
import { Image, View, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TextInput, ListView } from 'react-native';
import { Actions } from 'react-native-router-flux';
// import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
import styles, { MAX_HEIGHT, MIN_HEIGHT, optionsStyles, sliderWidth, itemWidth } from './styles';
// import TimeAgo from 'react-native-timeago';
// import ImageLoad from 'react-native-image-placeholder';
import Carousel from 'react-native-snap-carousel';
import YouTube from 'react-native-youtube';
import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import { getComments, votePost, getUsersByGroup, addComment, editComment, deleteComment, rateComment, loadActivityByEntityId, deletePost, deletePetition, changePost, changePetition } from 'PLActions';
import PLOverlayLoader from 'PLOverlayLoader';
import randomPlaceholder from '../../../utils/placeholder';
import _ from 'lodash';
import PLLoader from 'PLLoader';


// custom components import
import FeedFooter from '../../../components/Feed/FeedFooter';
import FeedHeader from '../../../components/Feed/FeedHeader';
import FeedCarousel from '../../../components/Feed/FeedCarousel';
import FeedDescription from '../../../components/Feed/FeedDescription';
import FeedContext from '../../../components/Feed/FeedContext';
import FeedMetaData from '../../../components/Feed/FeedMetaData';
import FeedActivity from '../../../components/Feed/FeedActivity';

import SuggestionBox from '../../../common/suggestionBox';


const { youTubeAPIKey } = require('PLEnv');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
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
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            isLoading: false,
            isCommentsLoading: false,
            isEditMode: props.isEditEnabled || false,
            visibleHeight: 50,
            commentText: '',
            defaultInputValue: '',
            editedCommentId: null,
            dataArray: [],
            dataSource: ds,
            inputDescription: '',
            placeholderTitle: '',
        };
        this.commentToReply = null;
        this.isLoadedAll = false;
        this.item = null;
        this.commentsCount = 0;
        this.nextCursor = null;
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        
    }
    
    componentDidMount(){
        // this.addCommentInput.focus(); 
        // console.log('=xx=x=x=x=x=x=x=x=x==x')
        // console.log('propss', this.props.entityType, this.props.entityId);
        if (this.props.commenting){
            // console.log('commenting...')
            setTimeout(
                () => this._onAddComment()
                , 1000);
            }   
        this.loadEntity();
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
        this.addCommentView.open();
    }

    _onSendComment() {
        const { commentText, editedCommentId } = this.state;

        if (commentText === '') {
            alert("There is no comment to send. Try again.");
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
        Actions.commentDetail({ comment: comment, entityType: entityType, entityId: entityId });
    }

    // API Calls
    async loadEntity() {
        // console.log(this.props.entityId, this.props.entityType);
        const { props: { token, entityId, entityType, dispatch } } = this;
        // console.log(entityId, entityType)
        this.setState({ isLoading: true });
        loadActivityByEntityId(token, entityType, entityId).then(data => {
            if (data.payload && data.payload[0]) {
                this.item = data.payload[0];
                this.setState({ isLoading: false, inputDescription: this.item.description });
                this.loadComments();
            }
        }).catch(e => {
            this.setState({ isLoading: false });
            const message = e.message || e;
            setTimeout(() => alert(message), 1000);
        });
    }

    async loadComments() {
        const { props: { token, entityId, entityType, dispatch } } = this;
        this.setState({ isCommentsLoading: true });
        try {
            let response = await Promise.race([
                getComments(token, entityType, entityId),
                timeout(15000),
            ]);
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
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataArray),
        });
    }

    async loadNextComments() {
        const { props: { item, token, entityType, entityId, dispatch } } = this;
        if (this.nextCursor) {
            this.setState({ isCommentsLoading: true });
            try {
                let response = await Promise.race([
                    getComments(token, entityType, entityId, this.nextCursor),
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
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataArray),
        });
    }

    //GH17
    //Users should be able to create comments and reply to a comment
    async doComment(commentText) {
        const { props: { entityId, entityType, token, dispatch } } = this;
        this.setState({ isLoading: true });
        let response = await addComment(token, entityType, entityId, commentText, (this.commentToReply != null) ? this.commentToReply.id : '0');;
        this.addCommentView.close();
        this.setState({
            isLoading: false,
        });
        if (response && response.comment_body) {
            this.setState({ dataArray: [] });
            loadActivityByEntityId(token, entityType, entityId).then(data => {
                if (data.payload && data.payload[0]) {
                    this.item = data.payload[0];
                    this.loadComments();
                }
            }).catch(err => {
                this.loadComments();
            });
        }
        else {
            alert('Something went wrong');
        }
    }

    editComment = (comment) => {
        this.setState({ editedCommentId: comment.id, defaultInputValue: comment.comment_body });
        this.addCommentView && this.addCommentView.open();
    }

    resetEditComment = () => this.setState({
        defaultInputValue: '',
        editedCommentId: null,
    })

    async doEditComment(commentText) {
        this.setState({ isLoading: true });
        let response = await editComment(this.item.entity.type, this.props.token, this.state.editedCommentId, commentText);

        this.addCommentView.close();
        this.setState({
            isLoading: false,
        });

        // console.warn(response);
        if (response.status === 200 && response.ok) {
            this.loadComments();
            this.resetEditComment();
        } else {
            alert(response.message ? response.message : 'Something went wrong to edit');
            this.resetEditComment();
        }
        this.menuComment && this.menuComment.close();
    }

    async deleteComment(comment) {
        let response = await deleteComment(this.item.entity.type, this.props.token, comment.id);
        if (response.status === 204 && response.ok) {
            this.loadComments();
        } else {
            alert(response.message ? response.message : 'Something went wrong to delete');
        }
        this.menuComment && this.menuComment.close();
    }

    async rate(comment, option) {
        let originalComment = _.cloneDeep(comment);
        // console.log('=x=x=x=x=x=x', comment, option);

        // to control if a rating is being requested.
        if (this.state.isRating){
            return;
        }

        this.setState({ isRating: true });

        const { props: { entityType, token } } = this;
        let response = await rateComment(token, entityType, comment.id, option);

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
            if (this.item.entity.type === 'post') {
                this.props.dispatch(changePost(this.item.entity.id, this.item.id, inputDescription));
            }
            if (this.item.entity.type === 'user-petition') {
                this.props.dispatch(changePetition(this.item.entity.id, this.item.id, inputDescription));
            }
            this.item.description = inputDescription;
            this.setState({ isEditMode: false });
        } else {
            alert('Description is empty.')
        }
    }

    dismiss = () => {
        this.setState({
            inputDescription: this.item.description,
            isEditMode: false,
        });
    }
    
    edit(item) {
        this.setState({ isEditMode: true });
        this.menu && this.menu.close();
    }

    delete(item) {
        if (item.entity.type === 'post') {
            this.props.dispatch(deletePost(item.entity.id, item.id));
        }
        if (item.entity.type === 'user-petition') {
            this.props.dispatch(deletePetition(item.entity.id, item.id));
        }

        this.onBackPress();
        this.menu && this.menu.close();
    }

    openedAddCommentView() {
        setTimeout(() => {
            this.addCommentInput.focus();
        }, 100);
    }

    _renderHeader(item) {
        return <FeedHeader item={item} />
    }

    substitute (mention) {
        let {init, end} = this.state;
        let newContent = this.state.commentText;
        let initialLength = newContent.length;

        let firstPart = newContent.substr(0, init);
        let finalPart = newContent.substr(end, initialLength);

        let finalString = firstPart + mention + finalPart;

        this.setState({commentText: finalString, displaySuggestionBox: false, lockSuggestionPosition: end});
    }

    onSelectionChange (event) {
        let {start, end} = event.nativeEvent.selection;
        // let userRole = this.state.grouplist[this.state.selectedGroupIndex].user_role;
        setTimeout(() => {
            if (start !== end) return;
            if (start === this.state.lockSuggestionPosition) return;
            let text = this.state.commentText;
            let displayMention = false;
            let i;

            for (i = start - 1; i >= 0; i--) {
                if (text.charAt(i) === ' ') break;
                if (text.charAt(i) === '@' && (i === 0 || text.charAt(i - 1) === ' ')) {
                    // if (text.slice(i, i + 9) === "@everyone" && userRole === 'owner' && userRole === 'manager') {
                    //     alert("Are you sure you want to alert everyone in the group?");
                    //     break;
                    // }
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
                this.setState({displaySuggestionBox: displayMention, init: i, end: end});
            } else {
                // console.log('false');
                this.setState({suggestionList: [], displaySuggestionBox: false});
            }
        }, 100);
    }

    updateSuggestionList (token, suggestionSearch) {
        // this.setState({suggestionList: []});
        // console.log(this.item);
        getUsersByGroup(token, this.item.group.id, suggestionSearch).then(data => {
            this.setState({suggestionList: data.payload});
        }).catch(err => {

        });
    }
    changeContent (text) {
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
                    maxLength={300}
                    placeholderTextColor="rgba(0,0,0,0.1)"
                    style={styles.textarea}
                    value={state.inputDescription}
                    onChangeText={(text) => this.changeContent(text)}
                />
            </View>
        )
    }

    //Above looks like duplicative of newsfeed / user profile

    //Adding a comment to an item
    _renderAddComment() {
        const { props: { profile } } = this;
        var thumbnail: string = '';
        thumbnail = profile.avatar_file_name ? profile.avatar_file_name : '';
        
        return (
            <TouchableOpacity onPress={() => this._onAddComment()}>
                <CardItem>
                    <Left>
                        <Thumbnail small source={thumbnail ? { uri: thumbnail+'&w=50&h=50&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                        <Body>
                            <Text style={styles.addCommentTitle}>Add Comment...</Text>
                            <Menu
                                renderer={SlideInMenu}
                                ref={this.onRef}
                                onBackdropPress={this.resetEditComment}
                            >
                                <MenuTrigger />
                                <MenuOptions optionsContainerStyle={{
                                    backgroundColor: 'white',
                                    width: WINDOW_WIDTH,
                                    // height: this.state.visibleHeight,
                                    // this needs adjustment for android / ios - doesnt work well for android with the suggestionbox
                                    minHeight: Platform.OS ==='android' ? 50 :  WINDOW_HEIGHT/2 + 50
                                }}>
                                        <ScrollView keyboardShoulPersisTaps>
                                        <SuggestionBox substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                                        </ScrollView>
                                        <CardItem>
                                            <Left>
                                            <Thumbnail small source={thumbnail ? { uri: thumbnail+'&w=50&h=50&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                                            <Body>
                                                <TextInput
                                                    autoFocus
                                                    keyboardShoulPersisTaps
                                                    style={styles.commentInput}
                                                    ref={this.onCommentInputRef}                                                    placeholder={this.state.placeholderTitle}
                                                    defaultValue={this.state.defaultInputValue}
                                                    onChangeText={commentText => this.setState({ commentText })}
                                                    onSelectionChange={(e) => this.onSelectionChange(e)}
                                                    multiline
                                                    numberOfLines={3}
                                                />
                                            </Body>
                                            <Right style={{ flex: 0.3 }}>
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this._onSendComment()}>
                                                    <Text style={styles.commentSendText}>SEND</Text>
                                                    <Icon name="md-send" style={styles.commentSendIcon} />
                                                </TouchableOpacity>
                                            </Right>
                                        </Left>
                                    </CardItem>

                                </MenuOptions>
                            </Menu>
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
                <PLLoader position="bottom" />
            );
        } else {
            return null;
        }
    }

    _renderComment(comment) {
        // console.log('_renderComment', comment)
        if (comment.children) {
            if (comment.children.length === 0) {
                return this._renderRootComment(comment);
            } else if (comment.children.length === 1) {
                return (
                    <View>
                        {this._renderRootComment(comment)}
                        {this._renderRootComment(comment.children[0], true)}
                    </View>
                );
            } else if (comment.children.length === 2) {
                return (
                    <View>
                        {this._renderRootComment(comment)}
                        {this._renderRootComment(comment.children[0], true)}
                        {this._renderRootComment(comment.children[1], true)}
                    </View>
                );
            }
        }
        else {
            return this._renderRootComment(comment);
        }
    }

    _renderRootComment = (comment, isChild = false) => {
        var thumbnail: string = comment.author_picture ? comment.author_picture : '';
        let title: string = (comment.user ? comment.user.first_name : '' || '') + ' ' + (comment.user ? comment.user.last_name : '' || '');        
        var rateUp: number = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
        var rateDown: number = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;
        let rateValue = comment.rate_value;

        const style: object = { paddingBottom: 0 };
        if (isChild) {
            style.marginLeft = 40;
            style.marginTop = 5;
        }
    
        return (
            <CardItem style={style}>
                <Left>
                    <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail+'&w=50&h=50&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => this._onCommentBody(comment)}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description} numberOfLines={5}>{comment.comment_body}</Text>
                            {/* <Text note style={styles.subtitle}><TimeAgo time={comment.created_at} /></Text> */}
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
                        <Right style={{ flex: 0.1, alignSelf: 'flex-start' }}>
                            <Menu ref={ref => { this.menuComment = ref; }}>
                                <MenuTrigger>
                                    <Icon name="md-more" style={styles.commentMoreIcon} />
                                </MenuTrigger>
                                <MenuOptions customStyles={optionsStyles}>
                                    <MenuOption onSelect={() => this.editComment(comment)}>
                                        <Button iconLeft transparent dark onPress={() => this.editComment(comment)}>
                                            <Icon name="md-create" style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Edit comment</Text>
                                        </Button>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.deleteComment(comment)}>
                                        <Button iconLeft transparent dark onPress={() => this.deleteComment(comment)}>
                                            <Icon name="md-trash" style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Delete comment</Text>
                                        </Button>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </Right>
                    }
                </Left>
            </CardItem>
        );
    }

    // _renderChildComment(comment) {
    //     var thumbnail: string = comment.author_picture ? comment.author_picture : '';
    //     var title: string = comment.user.first_name + ' ' + comment.user.last_name;
    //     var rateUp: number = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
    //     var rateDown: number = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;

    //     return (
    //         <CardItem style={{ paddingBottom: 0, marginLeft: 40, marginTop: 5 }}>
    //             <Left>
    //                 <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
    //                 <Body style={{ alignSelf: 'flex-start' }}>
    //                     <TouchableOpacity onPress={() => this._onCommentBody(comment)}>
    //                         <Text style={styles.title}>{title}</Text>
    //                         <Text style={styles.description} numberOfLines={5}>{comment.comment_body}</Text>
    //                         <Text note style={styles.subtitle}><TimeAgo time={comment.created_at} /></Text>
    //                     </TouchableOpacity>
    //                     <View style={styles.commentFooterContainer}>
    //                         <Button iconLeft small transparent onPress={() => this._onRate(comment, 'up')}>
    //                             <Icon name="md-arrow-dropup" style={styles.footerIcon} />
    //                             <Label style={styles.footerText}>{rateUp ? rateUp : 0}</Label>
    //                         </Button>
    //                         <Button iconLeft small transparent onPress={() => this._onRate(comment, 'down')}>
    //                             <Icon active name="md-arrow-dropdown" style={styles.footerIcon} />
    //                             <Label style={styles.footerText}>{rateDown ? rateDown : 0}</Label>
    //                         </Button>
    //                         <Button iconLeft small transparent onPress={() => this._onAddComment(comment)} >
    //                             <Icon active name="ios-undo" style={styles.footerIcon} />
    //                             <Label style={styles.footerText}>{comment.child_count ? comment.child_count : 0}</Label>
    //                         </Button>
    //                     </View>
    //                 </Body>
    //                 <Right style={{ flex: 0.1, alignSelf: 'flex-start' }}>
    //                     <Icon name="md-more" style={styles.commentMoreIcon} />
    //                 </Right>
    //             </Left>
    //         </CardItem>
    //     );
    // }

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
    _renderTitle (item) {
        if (item.title) {
            return (<Text style={styles.title}>{item.title}</Text>);
        } else {
            return null;
        }
    }
    // The priority zone counter lists the count of total priority zone items in the newsfeed
    _renderZoneIcon (item) {
        if (item.zone === 'prioritized') {
            return (<Icon active name='ios-flash' style={styles.zoneIcon} />);
        } else {
            return null;
        }
    }
    _renderDescription(item, state) {
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
                            {
                                state.isEditMode
                                ?
                                    this._renderTextarea(item, state)
                                :
                                    <Text style={styles.description} numberOfLines={5}>{item.description}</Text>
                            }
                        </View>
                    </Body>
                </Left>
            </CardItem>
        );
    }

    _renderPostOrUserPetitionCard(item, state) {
        return (
            <View>
                {this._renderDescription(item, state)}
                <FeedMetaData item={item} />
                <View style={styles.borderContainer} />
                <FeedFooter item={item} profile={this.props.profile} token={this.props.token} />
            </View>
        );
    }

    _renderGroupCard(item) {
        return (
            <Card>
                <FeedDescription item={item} />
                <FeedCarousel item={item} />
                <View style={styles.borderContainer} />
                <FeedFooter item={item} profile={this.props.profile} token={this.props.token} />
            </Card>
        );
    }

    _renderActivity(item, state) {
        switch (item.entity.type) {
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

        if (backTo) {
            Actions.popTo(backTo);
        } else {
            Actions.pop();
        }
    }

    render() {
        // console.log(this.item);
        // console.log(this.refs);
        if (this.item === null) {
            return (
                <PLOverlayLoader visible={this.state.isLoading} logo />
            );
        }
        let item = this.item;
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container style={{ flex: 1 }}>
                    <HeaderImageScrollView
                        maxHeight={MAX_HEIGHT}
                        minHeight={MIN_HEIGHT}
                        fadeOutForeground
                        renderHeader={() => (
                            //Eventually this should show the Group Banner GH19
                            //https://github.com/PowerlineApp/powerline-mobile/issues/596
                            <Image
                                style={styles.headerImage}
                                source={require('img/item_detail_header.png')}
                            />
                        )}
                        renderFixedForeground={() => (
                            <Animatable.View
                                style={styles.navTitleView}
                                ref={(navTitleView) => { this.navTitleView = navTitleView; }}>
                                <Header style={{ backgroundColor: 'transparent' }}>
                                    <Left>
                                        <Button transparent onPress={this.onBackPress} style={{width: 50, height: 50 }}  >
                                            <Icon active name="arrow-back" style={{ color: 'white' }} />
                                        </Button>
                                    </Left>
                                    <Body style={{ flex: 4 }}>
                                        <Title style={styles.navTitle}>{item.group.official_name}</Title>
                                    </Body>
                                    <Right />
                                </Header>
                            </Animatable.View>
                        )}
                        renderForeground={() => (
                            <Left style={styles.titleContainer}>
                                <Button transparent onPress={this.onBackPress} style={{width: 50, height: 50 }} >
                                    <Icon active name="md-arrow-back" style={{ color: 'white' }} />
                                </Button>
                                <Body style={{ marginTop: -12 }}>
                                    <Thumbnail size={50} source={item.group.avatar_file_path ? { uri: item.group.avatar_file_path+'&w=200&h=200&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                                    <Text style={styles.imageTitle}>{item.group.official_name}</Text>
                                </Body>
                            </Left>
                        )}>
                        <TriggeringView
                            onHide={() => this.navTitleView.fadeInUp(200)}
                            onDisplay={() => this.navTitleView.fadeOut(100)}>
                            {this._renderHeader(item)}
                        </TriggeringView>
                        {this._renderActivity(item, this.state)}
                        <View style={styles.borderContainer} />
                        {this._renderAddComment()}
                        <View style={styles.borderContainer} />
                        <ListView
                            dataSource={this.state.dataSource} renderRow={(comment) =>
                                this._renderComment(comment)
                            } />
                        {this._renderLoadMore()}
                        {this._renderCommentsLoading()}
                        <View style={{ height: 50 }} />
                        <PLOverlayLoader visible={this.state.isLoading} logo />
                    </HeaderImageScrollView>
                </Container>
            </MenuContext>
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

export default connect(mapStateToProps)(ItemDetail);