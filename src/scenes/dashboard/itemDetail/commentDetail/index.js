//This looks like the View Replies module. Item Detail Screen shows all root comments. If a root comment has multiple children replies, user has option to View More. Tapping View More should open this screen.
//GH18, GH17

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner, Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Thumbnail, CardItem, Label, List, ListItem, Item, Input } from 'native-base';
import { Image, ActivityIndicator, Modal, TouchableHighlight, View, StyleSheet, FlatList, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TextInput, ListView, RefreshControl } from 'react-native';
import { Actions } from 'react-native-router-flux';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
import styles, { MAX_HEIGHT, MIN_HEIGHT, optionsStyles, sliderWidth, itemWidth } from './styles';
import TimeAgo from '../../../../components/TimeAgo';
import ImageLoad from '../../../../components/imagePlaceholder';

import Carousel from 'react-native-snap-carousel';
import YouTube from 'react-native-youtube';
import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import PLOverlayLoader from '../../../../common/PLOverlayLoader';
import randomPlaceholder from '../../../../utils/placeholder';


import { getChildComments, addComment, rateComment } from '../../../../actions';
import SuggestionBox from '../../../../common/suggestionBox';
import ParsedComment from '../parsedComment';


const { SlideInMenu } = renderers;
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('../../../../common/PLConstants');

class CommentDetail extends Component {

    isLoadedAll: boolean;
    nextCursor: string;
    rootComment: Object;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isCommentsLoading: false,
            isRefreshing: false,
            visibleHeight: 50,
            commentText: '',
            dataArray: [],
        };
        this.isLoadedAll = false;
        this.nextCursor = null;
        this.rootComment = null;
        //Jesse adds to bring random placeholder to Reply screen
        this.placeholderTitle = randomPlaceholder('replie');
    }

    componentWillMount() {
        console.log('props', this.props);
        const { props: { comment } } = this;
        this.rootComment = comment;

        this.loadComments();
    }

    // API Handlers

    async loadComments(all) {
        const { props: { token, entityType, dispatch } } = this;
        this.setState({ isRefreshing: true });
        try {
            let response = await Promise.race([
                getChildComments(token, entityType === 'post' ? 'post' : entityType === 'user-petition' ? 'user-petition' : 'poll', this.rootComment.id, 0, all ? 100 : 10),
                timeout(15000),
            ]);
            console.log(response)
            if (response.nextCursor) {
                this.nextCursor = response.nextCursor;
            } else {
                this.nextCursor = null;
                this.isLoadedAll = true;
            }

            this.setState({
                dataArray: response.comments,
            });
        } catch (e) {
            console.log(e)
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
    }

    async loadNextComments() {
        const { props: { token, comment, entityType, dispatch } } = this;
        this.setState({ isLoading: true });
        try {
            let response = await Promise.race([
                getChildComments(token, entityType === 'post' ? 'post' : entityType === 'user-petition' ? 'user-petition' : 'poll', comment.id, this.nextCursor),
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
            this.setState({ isLoading: false });
        }
    }

    async doComment(commentText) {
        const { props: { entityId, entityType, token, dispatch } } = this;
        const type = entityType === 'post' ? 'post' : entityType === 'user-petition' ? 'user-petition' : 'poll';
        if (this.state.sendindComment) return;
        this.setState({ sendindComment: true });
        try {
            let response = await addComment(token, type, entityId, commentText, (this.rootComment != null) ? this.rootComment.id : '0');
            this.setState({
                sendindComment: false,
                commentText: ''
            });
            // this.addCommentView.close();
            if (response && response.comment_body) {
                this.setState({ dataArray: [] });
                this.loadComments(true);
            }
            else {
                alert('Something went wrong');
            }
        } catch (error) {
            this.setState({sendindComment: false, commentText: ''})
            alert('Something went wrong');
        }
    }

    //User can rate comment up or down
    async rate(comment, option) {
        // console.log('=x=x=x=x=x=', rate, option);
        this.setState({ isLoading: true });

        const { props: { entityType, token } } = this;
        var response;
        response = await rateComment(token, entityType, comment.id, option);
        if (response && response.comment_body) {
            if (response.id === this.rootComment.id) {
                this.rootComment.rate_count = response.rates_count;
                this.rootComment.rate_sum = response.rate_sum;
                this.rootComment.created_at = response.created_at;
            } else {
                var dataArrayClone = this.state.dataArray;
                const index = this.getIndex(comment);
                if (index !== -1) {
                    let commentToReplace = dataArrayClone[index];
                    commentToReplace.rate_count = response.rates_count;
                    commentToReplace.rate_sum = response.rate_sum;
                    commentToReplace.created_at = response.created_at;
                    dataArrayClone[index] = commentToReplace;
                }
                this.setState({
                    dataArray: dataArrayClone,
                });
            }
        } else {
            let message = response.message || response;
            setTimeout(() => alert(message), 1000);
        }
        this.setState({ isLoading: false });
    }


    _renderRootComment(comment) {
        var thumbnail: string = comment.author_picture ? comment.author_picture : '';
        var title: string = (comment.user && comment.user.first_name) + ' ' + (comment.user && comment.user.last_name || '');
        var rateUp: number = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
        var rateDown: number = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;

        return (
            <CardItem style={styles.rootContainer}>
                <Left>
                    <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail+'&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body style={{ alignSelf: 'flex-start' }}>
                        <Text style={styles.rootTitle}>{title}</Text>
                        <ParsedComment style={styles.rootDescription} item={comment} />

                        <Text note style={styles.subtitle}><TimeAgo time={comment.created_at} /></Text>
                        <View style={styles.commentFooterContainer}>
                            <Button iconLeft small transparent onPress={() => this._onRate(comment, 'up')}>
                                <Icon name="md-arrow-dropup" style={styles.footerIcon} />
                                <Label style={styles.footerText}>{rateUp ? rateUp : 0}</Label>
                            </Button>
                            <Button iconLeft small transparent onPress={() => this._onRate(comment, 'down')}>
                                <Icon active name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>{rateDown ? rateDown : 0}</Label>
                            </Button>
                            <Button iconLeft small transparent onPress={() => this._onAddComment(comment)}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>{comment.child_count ? comment.child_count : 0}</Label>
                            </Button>
                        </View>
                    </Body>
                    <Right style={{ flex: 0.1, alignSelf: 'flex-start' }}>
                        <Icon name="md-more" style={styles.commentMoreIcon} />
                    </Right>
                </Left>
            </CardItem>
        );
    }

    _renderChildComment(comment) {

        var thumbnail: string = comment.author_picture ? comment.author_picture : '';
        var title: string = (comment.user && comment.user.first_name) + ' ' + (comment.user && comment.user.last_name || '');
        var rateUp: number = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
        var rateDown: number = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;

        return (
            <CardItem style={styles.childCommentContainer}>
                <Left>
                    <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail+'&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => this._onCommentBody(comment)}>
                            <Text style={styles.childTitle}>{title}</Text>
                            <Text style={styles.childDescription} numberOfLines={5}>{comment.comment_body}</Text>
                            <Text note style={styles.subtitle}><TimeAgo time={new Date(comment.created_at)} /></Text>
                        </TouchableOpacity>
                        <View style={styles.commentFooterContainer}>
                            <Button iconLeft small transparent onPress={() => this._onRate(comment, 'up')}>
                                <Icon name="md-arrow-dropup" style={styles.footerIcon} />
                                <Label style={styles.footerText}>{rateUp ? rateUp : 0}</Label>
                            </Button>
                            <Button iconLeft small transparent onPress={() => this._onRate(comment, 'down')}>
                                <Icon active name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>{rateDown ? rateDown : 0}</Label>
                            </Button>
                            <Button iconLeft small transparent onPress={() => this._onAddComment(comment)}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>{comment.child_count ? comment.child_count : 0}</Label>
                            </Button>
                        </View>
                    </Body>
                    <Right style={{ flex: 0.1, alignSelf: 'flex-start' }}>
                        <Icon name="md-more" style={styles.commentMoreIcon} />
                    </Right>
                </Left>
            </CardItem>
        );
    }

    _renderCommentsLoading() {
        if (this.state.isCommentsLoading === true) {
            return (
                <Spinner color='gray' />
            );
        } else {
            return null;
        }
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
                console.log('false');
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

    onCloseComment(){
        this.setState({addingComment: false})
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
                        (this.state.displaySuggestionBox && this.state.suggestionList.length > 0) 
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
                                            placeholder={this.state.placeholderTitle}
                                            onContentSizeChange={() => {}}

                                            style={styles.commentInput}
                                            ref={this.onCommentInputRef}
                                            value={this.state.commentText}
                                            defaultValue={this.state.defaultInputValue}
                                            onChangeText={(commentText) => this.setState({commentText})}
                                            onSelectionChange={(e) => this.onSelectionChange(e)}
                                            multiline
                                            numberOfLines={4}
                                            />
                                    </Body>
                                    <Right style={{ flex: 0.2 }}>
                                        <TouchableHighlight underlayColor="#fff" style={{ flexDirection: 'row', alignItems: 'center', height: '100%', padding: 8 }} onPress={() => this._onSendComment()}>
                                            <View style={{ flexDirection: 'row' }}>
                                            {
                                                this.state.sendindComment
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


    // Rendering methods
    render() {
        // if (!this.item) return null;
        return (
            <MenuContext customStyles={menuContextStyles}>
                <PLOverlayLoader visible={this.state.isLoading} marginTop={200} logo />
                <Container style={styles.container}>
                    <Header style={styles.header}>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                                <Icon active name="arrow-back" style={{ color: 'white' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: 'white' }}>All Replies</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }>
                        {this._renderRootComment(this.rootComment)}
                        <FlatList data={this.state.dataArray} renderItem={({item}) => this._renderChildComment(item) } />
                        {this._renderLoadMore()}
                        {this._renderCommentsLoading()}
                        {this._renderAddComment()}
                    </Content>
                </Container>
            </MenuContext >
        );
    }

    // Actions methods
    _onLoadMore() {
        if (this.state.isCommentsLoading === false && this.isLoadedAll === false) {

            this.loadNextComments();
        }
    }

    _onAddComment(comment) {
        this.setState({ placeholderTitle: randomPlaceholder('comment') });
        this.commentToReply = comment ? comment : null;
        this.setState({addingComment: true});
        // this.addCommentView.open();
    }

    _onSendComment() {
        if (this.state.commentText === '') {
            alert("There is no comment to send. Try again.");
        } else {
            this.doComment(this.state.commentText);
        }
    }

    _onCommentBody(comment) {
        this.rootComment = comment;
        
        this.loadComments();
    }

    _onRate(comment, option) {
        // console.log('=x=x=x=x=x=x=', comment, option);
        const { props: { profile } } = this;
        this.rate(comment, option);
    }

    _onRefresh() {
        this.loadComments();
    }

    // Private methods
    onRef = r => {
        this.addCommentView = r;
    }

    onCommentInputRef = r => {
        this.addCommentInput = r;
    }

    openedAddCommentView() {
        // setTimeout(() => {
        //     this.addCommentInput.focus();
        // }, 100);
    }

    getIndex(comment) {
        for (var index = 0; index < this.state.dataArray.length; index++) {
            var element = this.state.dataArray[index];
            if (element.id === comment.id) {
                return index;
            }
        }
        return -1;
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
});

export default connect(mapStateToProps)(CommentDetail);