// User has ability to create a new post from New Item Menu. GH14
// If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
// If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
// https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-posts

import React, { Component } from 'react';
import {TextInput, Keyboard, Platform, KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import RNFetchBlob from 'react-native-fetch-blob'
const fs = RNFetchBlob.fs

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
    ActionSheet,
    Toast
} from 'native-base';
const PLColors = require('PLColors');
import SuggestionBox from '../../../common/suggestionBox';
import ShareFloatingAction from '../../../components/ShareFloatingAction';
import styles from './styles';
import {
    Dimensions,
    ScrollView,
    Image
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { showToast } from 'PLToast';
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');


const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, getUsersByGroup, createPostToGroup, getPetitionConfig } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';
const POST_MAX_LENGTH = 5000;
var { MixpanelToken } = require('../../../PLEnv');
var Mixpanel = require('react-native-mixpanel');



class NewPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCommunity: false,
            profile: {},
            grouplist: [],
            selectedGroupIndex: -1,
            content: '',
            posts_remaining: null,
            displaySuggestionBox: false,
            suggestionSearch: '',
            groupUsers: [],
            image: null,
            share: false,
            sharing: !!props.data
        };

        this.placeholderTitle = randomPlaceholder('post');

        this.toggleCommunity = this.toggleCommunity.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
    }

    componentDidMount() {
        // console.log('ONLOAD NEWPOST PROPS', this.props);
        
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
        this.loadSharedData(this.props.data);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide);
    }

    componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
        this.setState({keyboard: false})
    }

    _keyboardDidHide () {
        this.setState({keyboard: true})
    }

    async loadSharedData(data){
        if (!data) {
            this.setState({showCommunity: true});
            return;
        }
        if (data.type.split('/')[0] !== 'image' && data.type !== 'jpeg' && data.type !== 'png' && data.type !== 'jpg') {
            this.setState({showCommunity: true, content: data.value})
            return;
        }
        this.setState({content : JSON.stringify(data)})
        fs.readFile(data.value, "base64").then(r => {
            this.setState({image: r, content: '', showCommunity: true});
        }).catch(e => {
            showToast('Error ocurred reading file.');
            this.setState({showCommunity: true})
        })
    }


    toggleCommunity() {
        Keyboard.dismiss()
        this.setState({
            showCommunity: !this.state.showCommunity
        });
    }

    // If user is looking at "all" newsfeed, then user will be prompted to select group to post to.
    selectGroupList(index) {
        this.setState({
            selectedGroupIndex: index,
            showCommunity: false
        });
        this.postInputRef.focus()

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

    createPost() {
        var { token } = this.props;
        var groupId = null;
        if (this.state.posts_remaining <= 0){
            alert('You do not have any posts left in this group');
            return;
        }


        if (this.state.selectedGroupIndex == -1) {
            this.state.sharing ? showToast('Please select Group.')
            : alert('Please select Group.');
            return;
        } else if (this.state.content == "" || this.state.content.trim() == '') {
            this.state.sharing ? showToast('Please type post content.')
            : alert("Please type post content");
            return;
        }

        groupId = this.state.grouplist[this.state.selectedGroupIndex].id;

        createPostToGroup(token, groupId, this.state.content, this.state.image)
            .then(data => {
                showToast('Post Successful!');
                if (this.state.sharing) this.props.onPost();
                else Actions.itemDetail({ entityId: data.id, entityType: 'post', backTo: 'home', share: this.state.share });
            })
            .catch(err => {
            });
    }

    changeContent(text) {
        if (text.length <= POST_MAX_LENGTH) {
            this.setState({
                content: text
            });
        }
    }

    substitute(mention) {
        let { init, end } = this.state;
        let newContent = this.state.content;
        let initialLength = newContent.length;

        let firstPart = newContent.substr(0, init);
        let finalPart = newContent.substr(end, initialLength);

        let finalString = firstPart + mention + finalPart;

        this.setState({ content: finalString, displaySuggestionBox: false, lockSuggestionPosition: end });
    }

    // tells us if user will share or not
    isShareSelected(social){
        return this.state.share
        // return false;
    }

    // changes the selection if user will share or not
    setShareSelected(bool){
        this.setState({share : bool})
    }

    onSelectionChange(event) {
        let { start, end } = event.nativeEvent.selection;
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
                this.setState({ displaySuggestionBox: displayMention, init: i, end: end });
            } else {
                this.setState({ suggestionList: [], displaySuggestionBox: false });
            }
        }, 100);
    }

    updateSuggestionList(token, suggestionSearch) {
        this.setState({ suggestionList: [] });
        getUsersByGroup(token, this.state.grouplist[this.state.selectedGroupIndex].id, suggestionSearch).then(data => {
            this.setState({ suggestionList: data.payload });
        }).catch(err => {

        });
    }

    attachImage = () => {
        if (this.state.image) {
            this.setState({ image: null });
        } else {
            ActionSheet.show({
                options: ["Take photo", "Choose from gallery"],
                title: "Attach image"
            }, buttonIndex => {
                if (buttonIndex == 0) {
                    ImagePicker.openCamera({
                        cropping: true,
                        includeBase64: true
                    }).then(image => {
                        this.setState({ image: image.data });
                    }).catch(v => alert(JSON.stringify(v)));
                }

                if (buttonIndex == 1) {
                    ImagePicker.openPicker({
                        cropping: true,
                        includeBase64: true
                    }).then(image => {
                        console.log(image);
                        
                        this.setState({ image: image.data });
                    });
                }
            });
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        {
                            this.state.sharing
                            ? null
                            : <Button transparent onPress={() => Actions.pop()} style={{ width: 50, height: 50 }}  >
                                <Icon active name='arrow-back' style={{ color: 'white' }} />
                            </Button>
                        }
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>New Post</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => { this.createPost(); Mixpanel.track("Sent Post"); }}>
                            <Label style={{ color: 'white' }}>Send</Label>
                        </Button>
                    </Right>
                </Header>
                        <List>
                            <ListItem style={styles.community_container} onPress={() => this.toggleCommunity()}>
                                <View style={styles.avatar_container}>
                                    <View style={styles.avatar_wrapper}>
                                        <Thumbnail square style={styles.avatar_img} source={{ uri: this.state.profile.avatar_file_name + '&w=50&h=50&auto=compress,format,q=95' }} />
                                    </View>
                                    <View style={styles.avatar_subfix} />
                                </View>
                            <Body style={styles.community_text_container}>
                                <Text style={{color: 'white'}}>
                                    {this.state.selectedGroupIndex == -1 ? 'Select a community' : this.state.grouplist[this.state.selectedGroupIndex].official_name}
                                </Text>
                            </Body>
                            <Right style={styles.communicty_icon_container}>
                            {
                                this.state.sharing 
                                ? <Text style={{color: '#fff'}}>{'[+]'}</Text>
                                : <Icon name='md-create' style={{ color: 'white' }} />
                            }
                        </Right>
                        </ListItem>
                    </List>
                <ScrollView scrollEnabled={false} keyboardShouldPersistTaps={'handled'} style={styles.main_content} >
                    {/* <S style={styles.main_content}> */}

                    {
                        this.state.displaySuggestionBox && this.state.suggestionList.length > 0
                        ? <ScrollView style={{position: 'absolute', top: 20, zIndex: 3}} keyboardShouldPersistTaps="always"  >
                            <SuggestionBox substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                        </ScrollView>
                        : <ScrollView />
                    }

                    <ScrollView style={{marginTop: 0}}  >
                        <TextInput
                            maxLength={POST_MAX_LENGTH}
                            ref={(r) => this.postInputRef = r}
                            onSelectionChange={this.onSelectionChange}
                            placeholderTextColor='rgba(0,0,0,0.1)'
                            style={styles.textarea}
                            multiline
                            placeholder={this.placeholderTitle}
                            value={this.state.content}
                            onChangeText={(text) => this.changeContent(text)}
                        />
                    </ScrollView>
                        {
                            this.state.showCommunity &&
                            <CommunityView
                                grouplist={this.state.grouplist}
                                onPress={this.selectGroupList.bind(this)}
                            />
                        }
                </ScrollView>
                <KeyboardAvoidingView behavior={Platform.select({android:'height', ios: 'padding'})}>
                        {
                            this.state.showCommunity
                            ? <View style={{height: 70, backgroundColor: 'rgba(0,0,0,0.4)'}} />
                            :
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button transparent style={{ marginBottom: 10, height: 60 }} onPress={this.attachImage}>
                                {
                                    this.state.image ?
                                    <View style={{ flexDirection: 'row', width: 90, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={{ uri: `data:image/png;base64,${this.state.image}` }} resizeMode="cover" style={{ width: 90, height: 50 }} />
                                            <View style={styles.deleteIconContainer}>
                                                <Icon name="md-close-circle" style={styles.deleteIcon} />
                                            </View>
                                        </View>
                                        :
                                        <Image source={require("img/upload_image.png")} resizeMode="contain" style={{ width: 90, height: 50, tintColor: 'gray' }} />
                                }
                                </Button>
                                <Button transparent style={{ marginBottom: 10, height: 60 }} onPress={() => this.setShareSelected(!this.state.share)}>
                                    <View style={{ flexDirection: 'row', backgroundColor: this.state.share ? '#71c9f1' : '#ccc', borderRadius: 30, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }} >
                                        <Image resizeMode="cover" style={{width: 35, height: 35}} source={require('../../../assets/share_icon.png')} />
                                    </View>
                                </Button>
                        </View>
                        }
                    <Footer style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10 }}>
                        {
                            this.state.posts_remaining
                            ? <Label style={{ color: 'white', fontSize: 10 }}>
                                You have <Label style={{ fontWeight: 'bold' }}>{this.state.posts_remaining}</Label> posts left in this group
                            </Label>
                            :<Label />
                        }
                        {/* Related: GH 151 */}
                        <Label style={{ color: 'white' }}>
                            {(POST_MAX_LENGTH - this.state.content.length)}
                        </Label>
                    </Footer>
                </KeyboardAvoidingView>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

Mixpanel.sharedInstanceWithToken(MixpanelToken);
export default connect(mapStateToProps)(NewPost);
