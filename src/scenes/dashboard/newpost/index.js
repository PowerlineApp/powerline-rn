// User has ability to create a new post from New Item Menu. GH14
// If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
// If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
// https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-posts

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Label,
    Text,
    Button,
    Icon,
    Title,
    Body,
    Footer,
    Textarea,
    View,
    List,
    ListItem,
    Thumbnail,
    Toast
} from 'native-base';
const PLColors = require('PLColors');
import SuggestionBox from '../../../common/suggestionBox';
import styles from './styles';
import {
    Dimensions,
    ScrollView
} from 'react-native';
import { showToast } from 'PLToast';

const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, getUsersByGroup, createPostToGroup, getPetitionConfig } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';

const POST_MAX_LENGTH = 5000;

class NewPost extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showCommunity: true,
            profile: {},
            grouplist: [],
            selectedGroupIndex: -1,
            content: this.props.data ? this.props.data.value : "",
            posts_remaining: null,
            displaySuggestionBox: false,
            suggestionSearch: '',
            groupUsers: []
        };

        this.placeholderTitle = randomPlaceholder('post');

        this.toggleCommunity = this.toggleCommunity.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
    }

    componentDidMount () {
        var { token } = this.props;
        loadUserData(token).then(data => {
            this.setState({
                profile: data
            });
        }).catch(err => {

        });

        getGroups(token).then(ret => {
            this.setState({
                grouplist: ret.payload
            });
        }).catch(err => {

        });
    }

    toggleCommunity () {
        this.setState({
            showCommunity: !this.state.showCommunity
        });
    }

    // If user is looking at "all" newsfeed, then user will be prompted to select group to post to.
    selectGroupList (index) {
        this.setState({
            selectedGroupIndex: index,
            showCommunity: false
        });

        var { token } = this.props;

        getPetitionConfig(token, this.state.grouplist[index].id)
        .then(data => {
            this.setState({
                posts_remaining: data.posts_remaining
            });
        })
        .catch(err => {

        });
    }

    createPost () {
        var { token } = this.props;
        var groupId = null;
        if (this.state.selectedGroupIndex == -1) {
            alert('Please select Group.');
            return;
        } else if (this.state.content == "" || this.state.content.trim() == '') {
            alert("Please type post content");
            return;
        }

        groupId = this.state.grouplist[this.state.selectedGroupIndex].id;

        createPostToGroup(token, groupId, this.state.content)
        .then(data => {
            showToast('Post Successful!');
            Actions.itemDetail({ entityId: data.id, entityType: 'post', backTo: 'home' });
        })
        .catch(err => {

        });
    }

    changeContent (text) {
        if (text.length <= POST_MAX_LENGTH) {
            this.setState({
                content: text
            });
        }
    }

    substitute (mention) {
        let {init, end} = this.state;
        let newContent = this.state.content;
        let initialLength = newContent.length;

        let firstPart = newContent.substr(0, init);
        let finalPart = newContent.substr(end, initialLength);

        let finalString = firstPart + mention + finalPart;

        this.setState({content: finalString, displaySuggestionBox: false, lockSuggestionPosition: end});
    }

    onSelectionChange (event) {
        let {start, end} = event.nativeEvent.selection;
        let userRole = this.state.grouplist[this.state.selectedGroupIndex].user_role;
        setTimeout(() => {
            if (start !== end) return;
            if (start === this.state.lockSuggestionPosition) return;
            let text = this.state.content;
            // for loop to find the first @ sign as a valid mention (without a space before, with at least two digits)
            let displayMention = false;
            let i;

            for (i = start - 1; i >= 0; i--) {
                if (text.charAt(i) === ' ') break;
                if (text.charAt(i) === '@' && (i === 0 || text.charAt(i - 1) === ' ')) {
                    if (text.slice(i, i + 9) === "@everyone" && userRole === 'owner' && userRole === 'manager') {
                        alert("Are you sure you want to alert everyone in the group?");
                        break;
                    }
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
                this.setState({suggestionList: [], displaySuggestionBox: false});
            }
        }, 100);
    }

    updateSuggestionList (token, suggestionSearch) {
        this.setState({suggestionList: []});
        getUsersByGroup(token, this.state.grouplist[this.state.selectedGroupIndex].id, suggestionSearch).then(data => {
            this.setState({suggestionList: data.payload});
        }).catch(err => {

        });
    }

    render () {
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon active name='arrow-back' style={{color: 'white'}} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>New Post</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.createPost()}>
                            <Label style={{color: 'white'}}>Send</Label>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List>
                        <ListItem style={styles.community_container} onPress={() => this.toggleCommunity()}>
                            <View style={styles.avatar_container}>
                                <View style={styles.avatar_wrapper}>
                                    <Thumbnail square style={styles.avatar_img} source={{uri: this.state.profile.avatar_file_name + '&w=50&h=50&auto=compress,format,q=95'}} />
                                </View>
                                <View style={styles.avatar_subfix} />
                            </View>
                            <Body style={styles.community_text_container}>
                                <Text style={{color: 'white'}}>
                                    {this.state.selectedGroupIndex == -1 ? 'Select a community' : this.state.grouplist[this.state.selectedGroupIndex].official_name}
                                </Text>
                            </Body>
                            <Right style={styles.communicty_icon_container}>
                                <Icon name='md-create' style={{color: 'white'}} />
                            </Right>
                        </ListItem>
                    </List>
                    <ScrollView style={styles.main_content}>
                        <SuggestionBox substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                        <Textarea
                            maxLength={POST_MAX_LENGTH}
                            onSelectionChange={this.onSelectionChange}
                            placeholderTextColor='rgba(0,0,0,0.1)'
                            style={styles.textarea}
                            placeholder={this.placeholderTitle}
                            value={this.state.content}
                            onChangeText={(text) => this.changeContent(text)}
                        />
                        {this.state.showCommunity
                            ? <View style={styles.community_list_container}>
                                <View style={styles.community_list_back} />
                                <ScrollView style={{flex: 1}}>
                                    <List style={{width: 250}}>
                                        { this.state.grouplist.map((item, index) => {
                                            return (
                                                <ListItem key={index} onPress={() => this.selectGroupList(index)}>
                                                    { item.avatar_file_path
                                                        ? <Thumbnail square style={{ width: 15, height: 15 }} source={{ uri: item.avatar_file_path + '&w=50&h=50&auto=compress,format,q=95'}} />
                                                        : <View style={{width: 15, height: 15}} />
                                                    }
                                                    <Body>
                                                        <Text style={{color: 'white', fontSize: 12}}>{item.official_name}</Text>
                                                    </Body>
                                                    <Right>
                                                        <Icon name='ios-arrow-dropright' style={{color: 'white'}} />
                                                    </Right>
                                                </ListItem>
                                            );
                                        })
                                    }
                                    </List>
                                </ScrollView>
                            </View> : null}
                    </ScrollView>
                </Content>
                <Footer style={{alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10}}>
                    {this.state.posts_remaining
                        ? <Label style={{color: 'white', fontSize: 10}}>
                        You have <Label style={{fontWeight: 'bold'}}>{this.state.posts_remaining}</Label> posts left in this group
                    </Label>
                    : <Label />
                    }
                    {/* Related: GH 151 */}
                    <Label style={{color: 'white'}}>
                        {
                          (POST_MAX_LENGTH - this.state.content.length)
                        }
                    </Label>
                </Footer>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(NewPost);
