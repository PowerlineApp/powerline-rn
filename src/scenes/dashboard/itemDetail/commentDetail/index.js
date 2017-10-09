//This looks like the View Replies module. Item Detail Screen shows all root comments. If a root comment has multiple children replies, user has option to View More. Tapping View More should open this screen.
//GH18, GH17

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Thumbnail, CardItem, Label, Spinner, List, ListItem, Item, Input } from 'native-base';
import { Image, View, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TextInput, ListView, RefreshControl } from 'react-native';
import { Actions } from 'react-native-router-flux';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
import styles, { MAX_HEIGHT, MIN_HEIGHT, optionsStyles, sliderWidth, itemWidth } from './styles';
import TimeAgo from 'react-native-timeago';
import ImageLoad from 'react-native-image-placeholder';
import Carousel from 'react-native-snap-carousel';
import YouTube from 'react-native-youtube';
import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import { getChildComments, addComment, rateComment } from 'PLActions';

const { SlideInMenu } = renderers;
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');

class CommentDetail extends Component {

    isLoadedAll: boolean;
    nextCursor: string;
    rootComment: Object;

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            isLoading: false,
            isCommentsLoading: false,
            isRefreshing: false,
            visibleHeight: 50,
            commentText: '',
            dataArray: [],
            dataSource: ds,
        };
        this.isLoadedAll = false;
        this.nextCursor = null;
        this.rootComment = null;
    }

    componentWillMount() {
        const { props: { comment } } = this;
        this.rootComment = comment;

        this.loadComments();
    }

    // API Handlers

    async loadComments() {
        const { props: { token, entityType, dispatch } } = this;
        this.setState({ isRefreshing: true });
        try {
            let response = await Promise.race([
                getChildComments(token, entityType, this.rootComment.id),
                timeout(15000),
            ]);
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

    async loadNextComments() {
        const { props: { token, comment, entityType, dispatch } } = this;
        this.setState({ isCommentsLoading: true });
        try {
            let response = await Promise.race([
                getChildComments(token, entityType, comment.id, this.nextCursor),
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
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataArray),
        });
    }

    async doComment(commentText) {
        const { props: { entityId, entityType, token, dispatch } } = this;
        this.setState({ isLoading: true });
        let response = await addComment(token, entityType, entityId, commentText, (this.commentToReply != null) ? this.commentToReply.id : '0');;
        this.setState({
            isLoading: false,
        });
        this.addCommentView.close();
        if (response && response.comment_body) {
            this.setState({ dataArray: [] });
            this.loadComments();
        }
        else {
            alert('Something went wrong');
        }
    }

    //User can rate comment up or down
    async rate(comment, option) {
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

    // Rendering methods
    render() {
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container style={styles.container}>
                    <Header style={styles.header}>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
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
                        <ListView
                            dataSource={this.state.dataSource} renderRow={(comment) =>
                                this._renderChildComment(comment)
                            } />
                        {this._renderLoadMore()}
                        {this._renderCommentsLoading()}
                        {this._renderAddComment()}
                        <OrientationLoadingOverlay visible={this.state.isLoading} />
                    </Content>
                </Container>
            </MenuContext >
        );
    }

    _renderRootComment(comment) {
        var thumbnail: string = comment.author_picture ? comment.author_picture : '';
        var title: string = (comment.user.first_name || '') + ' ' + (comment.user.last_name || '');
        var rateUp: number = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
        var rateDown: number = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;

        return (
            <CardItem style={styles.rootContainer}>
                <Left>
                    <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body style={{ alignSelf: 'flex-start' }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description} numberOfLines={5}>{comment.comment_body}</Text>
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
        var title: string = comment.user.first_name + ' ' + comment.user.last_name;
        var rateUp: number = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
        var rateDown: number = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;

        return (
            <CardItem style={{ paddingBottom: 0, marginLeft: 40, marginTop: 5 }}>
                <Left>
                    <Thumbnail small style={{ alignSelf: 'flex-start' }} source={thumbnail ? { uri: thumbnail } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => this._onCommentBody(comment)}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description} numberOfLines={5}>{comment.comment_body}</Text>
                            <Text note style={styles.subtitle}><TimeAgo time={comment.created_at} /></Text>
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

    _renderAddComment() {
        const { props: { profile } } = this;
        var thumbnail: string = '';
        thumbnail = profile.avatar_file_name ? profile.avatar_file_name : '';

        return (
            <Menu renderer={SlideInMenu} ref={this.onRef} onOpen={() => { this.openedAddCommentView() }}>
                <MenuTrigger />
                <MenuOptions optionsContainerStyle={{
                    backgroundColor: 'white',
                    width: WINDOW_WIDTH,
                    height: WINDOW_HEIGHT / 2 + 50,
                }}>
                    <CardItem>
                        <Left>
                            <Thumbnail small source={thumbnail ? { uri: thumbnail } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                            <Body>
                                <TextInput style={styles.commentInput} ref={this.onCommentInputRef} placeholder="Comment..." onChangeText={commentText => this.setState({ commentText })} />
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
        );
    }

    // Actions methods
    _onLoadMore() {
        if (this.state.isCommentsLoading === false && this.isLoadedAll === false) {

            this.loadNextComments();
        }
    }

    _onAddComment(comment) {
        this.commentToReply = comment ? comment : null;
        this.addCommentView.open();
    }

    _onSendComment() {
        if (this.state.commentText === '') {
            alert("Please input comment text");
        } else {
            this.doComment(this.state.commentText);
        }
    }

    _onCommentBody(comment) {
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.rootComment = comment;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([]),
        });
        this.loadComments();
    }

    _onRate(comment, option) {
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
        setTimeout(() => {
            this.addCommentInput.focus();
        }, 100);
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