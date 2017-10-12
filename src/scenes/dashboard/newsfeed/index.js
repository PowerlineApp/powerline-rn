
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, Spinner, ListItem, Thumbnail, List, Card, CardItem, Label, Footer } from 'native-base';
import { ListView, View, RefreshControl, TouchableOpacity, Image, WebView, Platform, Share } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { loadActivities, resetActivities, votePost, editFollowers, loadActivityByEntityId, createPostToGroup, deletePost, deletePetition } from 'PLActions';
import styles, { sliderWidth, itemWidth } from './styles';
import TimeAgo from 'react-native-timeago';
import ImageLoad from 'react-native-image-placeholder';
import YouTube from 'react-native-youtube';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import ContentPlaceholder from '../../../components/ContentPlaceholder';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';


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

    subscribe(item) {
        Share.share({
            message: item.description,
            title: ""
        });
    }

    mute(item) {
        var { token, dispatch } = this.props;
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
                editFollowers(token, item.owner.id, false, newDate)
                    .then(data => {

                    })
                    .catch(err => {

                    });
            }
        );
    }

    edit(item) {
        Actions.itemDetail({
            entityId: item.entity.id,
            entityType: item.entity.type,
            isEditEnabled: true,
        });
        this.menu && this.menu.close();
    }
    
    delete(item) {
        if (item.entity.type === 'post') {
            this.props.dispatch(deletePost(item.entity.id, item.id));
        }
        if (item.entity.type === 'user-petition') {
            this.props.dispatch(deletePetition(item.entity.id, item.id));
        }

        this.menu && this.menu.close();
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

    getIndex(item) {
        for (var index = 0; index < this.state.dataArray.length; index++) {
            var element = this.state.dataArray[index];
            if (element.id === item.id) {
                return index;
            }
        }
        return -1;
    }

    async vote(item, option) {
        const { props: { profile } } = this;
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
            const index = this.getIndex(item);
            var dataArrayClone = this.state.dataArray;
            var activityToReplace = dataArrayClone[index];

            loadActivityByEntityId(this.props.token, activityToReplace.entity.type, activityToReplace.entity.id).then(data => {
                if (data.payload && data.payload[0]) {
                    activityToReplace = data.payload[0];
                    dataArrayClone[index] = activityToReplace;
                    this.setState({
                        dataArray: dataArrayClone,
                    });
                }
            }).catch(err => {
            });
        }
        else {
            let message = 'Something went wrong to vote';
            if (response.errors.errors.length) {
                message = response.errors.errors[0];
            }
            setTimeout(() => alert(message), 1000);
        }

        this.setState({
            isLoading: false,
        });
    }

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

    goItemDetail(entityId, entityType) {
        Actions.itemDetail({ entityId: entityId, entityType: entityType });
    }

    _renderTailLoading() {
        if (this.state.isLoadingTail === true) {
            return (
                <Spinner color='gray' />
            );
        } else {
            return null;
        }
    }

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
                isBoosted = item.zone === 'prioritized';
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
                                    <Button iconLeft transparent dark onPress={() => this.subscribe(item)}>
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

    _renderDescription(item) {
        return (
            <CardItem>
                <Left>
                    <View style={styles.descLeftContainer}>
                        {this._renderZoneIcon(item)}
                        <Label style={styles.commentCount}>{item.responses_count}</Label>
                    </View>
                    <Body style={styles.descBodyContainer}>
                        <TouchableOpacity onPress={() => this.goItemDetail(item.entity.id, item.entity.type)}>
                            {this._renderTitle(item)}
                            <Text style={styles.description} numberOfLines={5}>{item.description}</Text>
                        </TouchableOpacity>
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

    postOrUserPetitionCard(item) {
        return (
            <Card>
                {this._renderHeader(item)}
                {this._renderDescription(item)}
                {this._renderMetadata(item)}
                <View style={styles.borderContainer} />
                {this._renderFooter(item)}
            </Card>
        );
    }

    groupCard(item) {
        return (
            <Card>
                {this._renderHeader(item)}
                {this._renderDescription(item)}
                {this._renderCarousel(item)}
                <View style={styles.borderContainer} />
                {this._renderFooter(item)}
            </Card>
        );
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
                <Container>
                <View style={styles.groupHeaderContainer}>
                    {this.state.showAvatar && this.props.savedGroup && this.props.savedGroup.groupAvatar != '' && this.props.savedGroup.groupAvatar != null ?
                        <Thumbnail square source={{ uri: this.props.savedGroup.groupAvatar }} style={styles.groupAvatar} /> : null}
                    <Text style={styles.groupName}>{this.props.savedGroup.groupName}</Text>
                </View>
                <ContentPlaceholder
                    empty={!this.state.isRefreshing && !this.state.isLoading && this.state.dataArray.length === 0}
                    title="The world belongs to those who speak up! Be the first to create a post!"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
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
                        }else{
                            this.setState({
                                showAvatar: true
                            });
                        }
                    }}
                >
                    <View style={{flex: 1, height:(this.state.showAvatar && this.props.groupAvatar != '' && this.props.groupAvatar != null? (height - 364):( height -  308)), justifyContent: 'flex-end'}}>
                    <List>
                        {this.state.dataArray.map((activity, index) => {
                            return (
                                <ListItem avatar key={index} style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 15}}>
                                    <Left>
                                        <Thumbnail small source={{uri: activity.user.avatar_file_name}}/>
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text style={styles.title}>{activity.user.full_name}</Text>
                                        <Text note style={styles.subtitle}>{activity.description}</Text>
                                    </Body>
                                    <Right style={{borderBottomWidth: 0}}>
                                        <Text style={styles.activityTime}><TimeAgo time={activity.sent_at}/></Text>
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
                        <Thumbnail small source={{uri: this.props.profile.avatar_file_name}}/>
                        <Input style={styles.CFooterItemInput} value={this.state.text} onChangeText={(text) => this.onChangeText(text)}/>
                        <Button transparent style={styles.sendBtn} onPress={() => this.onCreatePost()}>
                            <Text>SEND</Text>
                            <Icon name="md-send"/>
                        </Button>
                    </Item>
                </Footer>
                </Container>
            );
        }else{
            return (
                <Container>
                {
                    this.props.savedGroup && this.props.savedGroup.group != 'all' &&
                    <View style={styles.groupHeaderContainer}>
                        {this.state.showAvatar && this.props.savedGroup.groupAvatar != '' && this.props.savedGroup.groupAvatar != null ?
                            <Thumbnail square source={{ uri: this.props.savedGroup.groupAvatar }} style={styles.groupAvatar} /> : null}
                        <Text style={styles.groupName}>{this.props.savedGroup.groupName}</Text>
                    </View>
                }
                <ContentPlaceholder
                    empty={!this.state.isRefreshing && !this.state.isLoading && this.state.dataArray.length === 0}
                    title="The world belongs to those who speak up! Be the first to create a post!"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
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
                    }}
                >
                    <ListView dataSource={this.state.dataSource} renderRow={item => {
                        switch (item.entity.type) {
                            case 'post':
                            case 'user-petition':
                                return this.postOrUserPetitionCard(item);
                                break;
                            default:
                                return this.groupCard(item);
                                break;
                        }
                    }}
                    />
                    <OrientationLoadingOverlay visible={this.state.isLoading} />
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