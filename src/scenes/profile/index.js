//This looks like it's actually the Newsfeed tab (GH13) and the User Profile screen (GH44) combined. Each item in the newsfeed is referred to as the Standard Item Container. 
//The backend call for this scene will be driven primarily by https://api-dev.powerli.ne/api-doc#get--api-v2-activities
//The default view is "All" feed, but a specific group may be called for group Feed (GH45), Friends Feed (GH51), a specific user's feed (GH44)
//Group Feed will look very different depending if in Feed View or Conversation View. 

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
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
    Spinner, 
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
import { loadUserProfileById, resetActivities, votePost, loadActivitiesByUserId, getFollowingUser, unFollowings, putFollowings } from 'PLActions';
import TimeAgo from 'react-native-timeago';
import ImageLoad from 'react-native-image-placeholder';
import YouTube from 'react-native-youtube';
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
const { youTubeAPIKey } = require('PLEnv');
import {
    TouchableWithoutFeedback,
    Alert
} from 'react-native';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

class Profile extends Component{
    static propTypes = {
        token: React.PropTypes.string
    };

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

    componentWillMount(){
        
    }

    //This is for upvoting/downvoting a post. Needs attention GH128
    async vote(item, option) {
        let response = await votePost(this.props.token, item.entity.id, option);
        if (response.code) {
            let code = response.code;
            switch (code) {
                case 400:
                    alert('User already answered to this post.');
                    break;
                case 200:
                    break;
                default:
                    alert('Something went wrong');
                    break;
            }
        }
        else {
            alert('Something went wrong');
        }
    }

    //When an item includes a YouTube attachment or when a YouTube link is included in the body of the item
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

    _renderTailLoading() {
        if (this.state.isLoadingTail === true) {
            return (
                <Spinner color='gray' />
            );
        } else {
            return null;
        }
    }

    //This is the count of priority zone content GH33
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
                    source={{ uri: entry.imageSrc+'&w=50&h=50&auto=compress,format,q=95' }}
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

    //If an item has multiple attachments (leader content) it could be multiple videos or pictures, displayed as carousel, three items max
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

    _renderHeader(item) {
        var thumbnail: string = '';
        var title: string = '';

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
            <CardItem>
                <Left>
                    <Thumbnail small source={thumbnail ? { uri: thumbnail+'&w=50&h=50&auto=compress,format,q=95' } : require("img/blank_person.png")} defaultSource={require("img/blank_person.png")} />
                    <Body>
                        <Text style={styles.title}>{title}</Text>
                        <Text note style={styles.subtitle}>{item.group.official_name} � <TimeAgo time={item.sent_at} hideAgo={true} /></Text>
                    </Body>
                    <Right style={{ flex: 0.2 }}>
                        {/* Dropdown menu for Standard Item Container... Should be same as Item Detail Screen */}
                        <Menu>
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
                            </MenuOptions>
                        </Menu>
                    </Right>
                </Left>
            </CardItem>
        );
    }

    //The footer will be different for the Standard Item Container depending on the type of item it is:
    //Post = Upvote, Downvote, Reply
    //Petition = Sign, Reply... for user petitions and group petitions
    //Group Poll (aka question) = Answer, Reply
    //Group Fundraiser (aka payment_request)= Donate, Reply
    //Group Discussion (leader_news) = Reply
    //Group Event (leader_event) = RSVP, Reply
    //If we are viewing the item in Item Detail Screen, an added button Analytics appears for Posts.
    _renderFooter(item) {
        switch (item.entity.type) {
            case 'post':
                return (
                    <CardItem footer style={{ height: 35 }}>
                        <Left style={{ justifyContent: 'flex-end' }}>
                            <Button iconLeft transparent style={styles.footerButton} onPress={() => this.vote(item, 'upvote')}>
                                <Icon name="md-arrow-dropup" style={styles.footerIcon} />
                                <Label style={styles.footerText}>Upvote {item.rate_up ? item.rate_up : 0}</Label>
                            </Button>
                            <Button iconLeft transparent style={styles.footerButton} onPress={() => this.vote(item, 'downvote')}>
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

    //If the item is a 'priority zone' item, it should display the zone icon. If not, it does not.
    //The responses count appears below the avatar. It counts total engagement with the post (votes + comments)
    _renderDescription(item) {
        return (
            <CardItem>
                <Left>
                    <View style={styles.descLeftContainer}>
                        {this._renderZoneIcon(item)}
                        <Label style={styles.commentCount}>{item.responses_count}</Label>
                    </View>
                    <Body style={styles.descBodyContainer}>
                        {this._renderTitle(item)}
                        <Text style={styles.description} numberOfLines={5}>{item.description}</Text>
                    </Body>
                </Left>
            </CardItem>
        );
    }

    //This isn't working currently. It is designed to give user preview of any embedded URL in the item. 
    //GH13
    _renderMetadata(item) {
        if (item.metadata && item.metadata.image) {
            return (
                <CardItem>
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
                                        source={{ uri: item.metadata.image+'&w=50&h=50&auto=compress,format,q=95' }}
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

    // It would appear that the below is the User Profile Screen GH44
    render(){
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container style={styles.container}> 
                    {this.state.user?      
                    <View style={{backgroundColor: PLColors.main}}>
                        <View>                            
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon active name="arrow-back" style={{color: 'white'}}/>
                            </Button>                           
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
                            switch (item.entity.type) {
                                case 'post':
                                case 'user-petition':
                                    return this.postOrUserPetitionCard(item);
                                default:
                                    return this.groupCard(item);
                            }
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
});

export default connect(mapStateToProps)(Profile);