import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Textarea, Content, Text, Button, Icon, Left, Right, Body, Thumbnail, CardItem, Label, Spinner, List, ListItem, Item, Input } from 'native-base';
import { Image, View, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TextInput, ListView } from 'react-native';
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
import { getComments, votePost, addComment, rateComment, loadActivityByEntityId, deletePost, deletePetition, changePost, changePetition } from 'PLActions';
import PLOverlayLoader from 'PLOverlayLoader';

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
            dataArray: [],
            dataSource: ds,
            inputDescription: '',
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

        this.loadEntity();
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

    onCommentInputRef = r => {
        this.addCommentInput = r;
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

    _onVote(item, option) {
        const { props: { profile } } = this;
        if (profile.id === item.user.id) {
            alert("Unable to vote because you're the owner of the comment.")
        } else {
            this.vote(item, option);
        }
    }

    _onRate(comment, option) {
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
        const { props: { token, entityId, entityType, dispatch } } = this;

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

    async vote(item, option) {
        const { props: { profile, token } } = this;

        if (profile.id === item.user.id) {
            return;
        }
        if (item.post.votes && item.post.votes[0]) {
            return;
        }

        var response;

        this.setState({ isLoading: true });

        switch (item.entity.type) {
            case 'post':
                response = await votePost(this.props.token, item.entity.id, option);
                break;
            default:
                return;
                break;
        }

        if (response.user) {
            loadActivityByEntityId(token, item.entity.type, item.entity.id).then(data => {
                if (data.payload && data.payload[0]) {
                    this.item = data.payload[0];
                    this.setState({
                        isLoading: false,
                    });
                }
            }).catch(err => {
                this.setState({
                    isLoading: false,
                });
            });
        }
        else {
            this.setState({
                isLoading: false,
            });
            let message = 'Something went wrong to vote';
            if (response.errors.errors.length) {
                message = response.errors.errors[0];
            }
            setTimeout(() => alert(message), 1000);
        }
    }

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

    async rate(comment, option) {
        this.setState({ isLoading: true });

        const { props: { entityType, token } } = this;
        var response;
        response = await rateComment(token, entityType, comment.id, option);
        // console.error(response);
        this.setState({ isLoading: false });

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

    // Private Functions    
    youtubeGetID(url) {
        var ID = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
            ID = url[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
        }
        else {
            ID = url;
        }
        return ID;
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

    // Redering Functions
    _renderZoneIcon(item) {
        if (item.zone === 'prioritized') {
            return (<Icon active name="ios-flash" style={styles.zoneIcon} />);
        } else {
            return null;
        }
    }

    _renderContext(entry) {
        if (entry.type === "image") {
            return (
                <ImageLoad
                    placeholderSource={require('img/empty_image.png')}
                    source={{ uri: entry.imageSrc }}
                    style={styles.image}
                />
            );
        }
        else if (entry.type === "video") {
            var url = entry.text.toString();
            var videoid = this.youtubeGetID(url);
            if (Platform.OS === 'ios') {
                return (
                    <YouTube
                        ref={(component) => {
                            this._youTubeRef = component;
                        }}
                        apiKey={youTubeAPIKey}
                        videoId={videoid}
                        controls={1}
                        style={styles.player}
                    />
                );
            } else {
                return (
                    <WebView
                        style={styles.player}
                        javaScriptEnabled={true}
                        source={{ uri: `https://www.youtube.com/embed/${videoid}?rel=0&autoplay=0&showinfo=0&controls=0` }}
                    />
                );
            }
        }
        else {
            return null;
        }
    }

    _renderCarousel(item) {
        if (item.poll) {
            const slides = item.poll.educational_context.map((entry, index) => {
                return (
                    <TouchableOpacity
                        key={`entry-${index}`}
                        activeOpacity={0.7}
                        style={styles.slideInnerContainer}
                    >
                        <View style={[styles.imageContainer, (index + 1) % 2 === 0 ? styles.imageContainerEven : {}]}>
                            {this._renderContext(entry)}
                            <View style={[styles.radiusMask, (index + 1) % 2 === 0 ? styles.radiusMaskEven : {}]} />
                        </View>
                    </TouchableOpacity>
                );
            });

            return (
                <CardItem cardBody>
                    <Carousel
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        enableMomentum={true}
                        autoplay={false}
                        autoplayDelay={500}
                        autoplayInterval={2500}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContainer}
                        showsHorizontalScrollIndicator={false}
                        snapOnAndroid={true}
                        removeClippedSubviews={false}
                    >
                        {slides}
                    </Carousel>
                </CardItem>
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

    _renderPostFooter(item) {
        if (item.zone === 'expired') {
            return (
                <CardItem footer style={{ height: 35 }}>
                    <Left style={{ justifyContent: 'flex-start' }}>
                        <Button iconLeft transparent style={styles.footerButton}>
                            <Icon active name="ios-undo" style={styles.footerIcon} />
                            <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                        </Button>
                    </Left>
                </CardItem>
            );
        } else {
            if (item.post.votes && item.post.votes[0]) {
                let vote = item.post.votes[0];
                var isVotedUp = false;
                var isVotedDown = false;
                if (vote.option === 1) {
                    isVotedUp = true;
                }
                else if (vote.option === 2) {
                    isVotedDown = true;
                }
            }
            return (
                <CardItem footer style={{ height: 35 }}>
                    <Left style={{ justifyContent: 'space-between' }}>
                        <Button iconLeft transparent style={styles.footerButton} onPress={() => this.vote(item, 'upvote')}>
                            <Icon name="md-arrow-dropup" style={isVotedUp ? styles.footerIconBlue : styles.footerIcon} />
                            <Label style={isVotedUp ? styles.footerTextBlue : styles.footerText}>Upvote {item.upvotes_count ? item.upvotes_count : 0}</Label>
                        </Button>
                        <Button iconLeft transparent style={styles.footerButton} onPress={() => this.vote(item, 'downvote')}>
                            <Icon active name="md-arrow-dropdown" style={isVotedDown ? styles.footerIconBlue : styles.footerIcon} />
                            <Label style={isVotedDown ? styles.footerTextBlue : styles.footerText}>Downvote {item.downvotes_count ? item.downvotes_count : 0}</Label>
                        </Button>
                        <Button iconLeft transparent style={styles.footerButton}>
                            <Icon active name="ios-undo" style={styles.footerIcon} />
                            <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                        </Button>
                    </Left>
                </CardItem>
            );
        }
    }

    _renderHeader(item) {
        var thumbnail: string = '';
        var title: string = '';
        let isBoosted: boolean = false;
        const isOwner: boolean = item.owner.id === this.props.userId;

        switch (item.entity.type) {
            case 'post' || 'user-petition':
                thumbnail = item.owner.avatar_file_path ? item.owner.avatar_file_path : '';
                title = item.owner.first_name + ' ' + item.owner.last_name;
                break;
            default:
                thumbnail = item.group.avatar_file_path ? item.group.avatar_file_path : '';
                title = item.user.full_name;
                break;
        }
        return (
            <CardItem style={{ paddingBottom: 0 }}>
                <Left>
                    <Thumbnail small source={thumbnail ? { uri: thumbnail } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body>
                        <Text style={styles.title}>{title}</Text>
                        <Text note style={styles.subtitle}>{item.group.official_name} • <TimeAgo time={item.sent_at} hideAgo={true} /></Text>
                    </Body>
                    <Right style={{ flex: 0.2 }}>
                        <Menu ref={(ref) => { this.menu = ref; }}>
                            <MenuTrigger>
                                <Icon name="ios-arrow-down" style={styles.dropDownIcon} />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption>
                                    <Button iconLeft transparent dark>
                                        <Icon name="logo-rss" style={styles.menuIcon} />
                                        <Text style={styles.menuText}>Subscribe to this Post</Text>
                                    </Button>
                                </MenuOption>
                                <MenuOption>
                                    <Button iconLeft transparent dark>
                                        <Icon name="ios-heart" style={styles.menuIcon} />
                                        <Text style={styles.menuText}>Add to Favorites</Text>
                                    </Button>
                                </MenuOption>
                                <MenuOption>
                                    <Button iconLeft transparent dark>
                                        <Icon name="md-person-add" style={styles.menuIcon} />
                                        <Text style={styles.menuText}>Add to Contact</Text>
                                    </Button>
                                </MenuOption>
                                {
                                    isOwner && !isBoosted &&
                                    <MenuOption onSelect={() => this.edit(item)}>
                                        <Button iconLeft transparent dark onPress={() => this.edit(item)}>
                                            <Icon name="md-create" style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Edit Post</Text>
                                        </Button>
                                    </MenuOption>
                                }
                                {
                                    isOwner &&
                                    <MenuOption onSelect={() => this.delete(item)}>
                                        <Button iconLeft transparent dark onPress={() => this.delete(item)}>
                                            <Icon name="md-trash" style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Delete Post</Text>
                                        </Button>
                                    </MenuOption>
                                }
                            </MenuOptions>
                        </Menu>
                    </Right>
                </Left>
            </CardItem>
        );
    }

    _renderFooter(item) {
        switch (item.entity.type) {
            case 'post':
                return this._renderPostFooter(item);
                break;
            case 'petition':
            case 'user-petition':
                return (
                    <CardItem footer style={{ height: 35 }}>
                        <Left style={{ justifyContent: 'flex-end' }}>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Sign</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                            </Button>
                        </Left>
                    </CardItem>
                );
                break;
            case 'question':
                return (
                    <CardItem footer style={{ height: 35 }}>
                        <Left style={{ justifyContent: 'flex-end' }}>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Answer</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                            </Button>
                        </Left>
                    </CardItem>
                );
                break;
            case 'payment-request':
                return (
                    <CardItem footer style={{ height: 35 }}>
                        <Left style={{ justifyContent: 'flex-end' }}>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Pay</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                            </Button>
                        </Left>
                    </CardItem>
                );
                break;
            case 'leader-event':
                return (
                    <CardItem footer style={{ height: 35 }}>
                        <Left style={{ justifyContent: 'flex-end' }}>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>RSVP</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                            </Button>
                        </Left>
                    </CardItem>
                );
                break;
            case 'leader-news':
                return (
                    <CardItem footer style={{ height: 35 }}>
                        <Left style={{ justifyContent: 'flex-end' }}>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Discuss</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                            </Button>
                        </Left>
                    </CardItem>
                );
                break;
            default:
                return (
                    <CardItem footer style={{ height: 35 }}>
                        <Left style={{ justifyContent: 'flex-end' }}>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon name="md-arrow-dropup" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Upvote {item.rate_up ? item.rate_up : 0}</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon active name="md-arrow-dropdown" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Downvote {item.rate_up ? item.rate_down : 0}</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton}>
                                <Icon active name="ios-undo" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Reply {item.comments_count ? item.comments_count : 0}</Label>
                            </Button>
                        </Left>
                    </CardItem>
                );
                break;
        }
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
                    onChangeText={inputDescription => this.setState({ inputDescription })}
                />
            </View>
        )
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

    _renderMetadata(item) {
        if (item.metadata && item.metadata.image) {
            return (
                <CardItem style={{ paddingTop: 0 }}>
                    <Left>
                        <View style={styles.descLeftContainer} />
                        <Body>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.metaContainer}
                                onPress={() => { alert(`You've clicked metadata`); }}>
                                <View style={styles.imageContainer}>
                                    <ImageLoad
                                        placeholderSource={require('img/empty_image.png')}
                                        source={{ uri: item.metadata.image }}
                                        style={styles.image}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.title} numberOfLines={2}>{item.metadata.title}</Text>
                                    <Text style={styles.description} numberOfLines={2}>{item.metadata.description}</Text>
                                </View>
                            </TouchableOpacity>
                        </Body>
                    </Left>
                </CardItem>
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
            <TouchableOpacity onPress={() => this._onAddComment()}>
                <CardItem>
                    <Left>
                        <Thumbnail small source={thumbnail ? { uri: thumbnail } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                        <Body>
                            <Text style={styles.addCommentTitle}>Add Comment...</Text>
                            <Menu renderer={SlideInMenu} ref={this.onRef} onOpen={() => { this.openedAddCommentView() }}>
                                <MenuTrigger />
                                <MenuOptions optionsContainerStyle={{
                                    backgroundColor: 'white',
                                    width: WINDOW_WIDTH,
                                    // height: this.state.visibleHeight,
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
                        </Body>
                        <Right />
                    </Left>
                </CardItem >
            </TouchableOpacity >
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

    _renderComment(comment) {
        if (comment.children) {
            if (comment.children.length === 0) {
                return this._renderRootComment(comment);
            } else if (comment.children.length === 1) {
                return (
                    <View>
                        {this._renderRootComment(comment)}
                        {this._renderChildComment(comment.children[0])}
                    </View>
                );
            } else if (comment.children.length === 2) {
                return (
                    <View>
                        {this._renderRootComment(comment)}
                        {this._renderChildComment(comment.children[0])}
                        {this._renderChildComment(comment.children[1])}
                    </View>
                );
            }
        }
        else {
            return this._renderRootComment(comment);
        }
    }

    _renderRootComment(comment) {
        var thumbnail: string = comment.author_picture ? comment.author_picture : '';
        var title: string = (comment.user.first_name || '') + ' ' + (comment.user.last_name || '');
        var rateUp: number = (comment.rate_count || 0) / 2 + comment.rate_sum / 2;
        var rateDown: number = (comment.rate_count || 0) / 2 - comment.rate_sum / 2;

        return (
            <CardItem style={{ paddingBottom: 0 }}>
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
                            <Button iconLeft small transparent onPress={() => this._onAddComment(comment)} >
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

    _renderPostOrUserPetitionCard(item, state) {
        return (
            <View>
                {this._renderDescription(item, state)}
                {this._renderMetadata(item)}
                <View style={styles.borderContainer} />
                {this._renderFooter(item)}
            </View>
        );
    }

    _renderGroupCard(item) {
        return (
            <Card>
                {this._renderDescription(item)}
                {this._renderCarousel(item)}
                <View style={styles.borderContainer} />
                {this._renderFooter(item)}
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
                                        <Button transparent onPress={this.onBackPress}>
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
                                <Button transparent onPress={this.onBackPress}>
                                    <Icon active name="md-arrow-back" style={{ color: 'white' }} />
                                </Button>
                                <Body style={{ marginTop: -12 }}>
                                    <Thumbnail size={50} source={item.group.avatar_file_path ? { uri: item.group.avatar_file_path } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
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