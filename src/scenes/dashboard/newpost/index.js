// User has ability to create a new post from New Item Menu. GH14
// If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
// If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
// https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-posts

import React, { Component } from 'react';
import { TextInput, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

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
    Input,
    Toast
} from 'native-base';
const PLColors = require('PLColors');
import SuggestionBox from '../../../common/suggestionBox';
import ShareFloatingAction from '../../../components/ShareFloatingAction';
import styles from './styles';
import {
    Dimensions,
    ScrollView,
    Image,
    Animated
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { showToast } from 'PLToast';
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');


const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, getUsersByGroup, createPostToGroup, getPetitionConfig } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';
// import { setTimeout } from 'timers';
const POST_MAX_LENGTH = 5000;
import {Mixpanel} from 'PLEnv';

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

        this.paddingInput = new Animated.Value(0);

        this.placeholderTitle = randomPlaceholder('post');

        this.toggleCommunity = this.toggleCommunity.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
    
    }

    componentDidMount() {
        // console.log('ONLOAD NEWPOST PROPS', this.props);
        
        var { token, group } = this.props;
        loadUserData(token).then(data => {
            this.setState({
                profile: data
            });
        }).catch(err => {
            
        });
        
        getGroups(token).then(ret => {
            console.log('~=> ', group);
            let showCommunity = true, selectedGroupIndex = -1;
            if (group && group !== 'all'){
                showCommunity = false;
                selectedGroupIndex = ret.payload.map(grouObj => grouObj.id).indexOf(group);
            }
            this.setState({
                grouplist: ret.payload,
                showCommunity, selectedGroupIndex
            });

        }).catch(err => {
            
        });
        this.loadSharedData(this.props.data);
        // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardDidShow(e));
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardDidHide(e));
    }

    componentWillUnmount () {
        // this.keyboardDidShowListener.remove();
        // this.keyboardDidHideListener.remove();
    }



    async loadSharedData(data){
        if (!data) {
            this.setState({showCommunity: true});
            return;
        }
        if (data.type.split('/')[0] !== 'image' && data.type !== 'jpeg' && data.type !== 'png' && data.type !== 'jpg') {
            this.setState({showCommunity: true, content: data.value});
            return;
        }
        this.setState({content : JSON.stringify(data)});
        fs.readFile(data.value, "base64").then(r => {
            this.setState({image: r, content: '', showCommunity: true});
        }).catch(e => {
            showToast('Error ocurred reading file.');
            this.setState({showCommunity: true});
        });
    }


    toggleCommunity() {
        Keyboard.dismiss();
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

        this.postInputRef.focus();
        if (index === -1) return;

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
        // if (this.state.posts_remaining <= 0){
        //     alert('You do not have any posts left in this group');
        //     return;
        // }
        if (this.state.sending) return;
        this.setState({sending: true});
        
        
        if (this.state.selectedGroupIndex == -1) {
            this.state.sharing ? showToast('Please select Group.')
            : alert('Please select Group.');
            this.setState({sending: false});
            return;
        } else if (this.state.content == "" || this.state.content.trim() == '') {
            this.state.sharing ? showToast('Please type post content.')
            : alert("Please type post content");
            this.setState({sending: false});
            return;
        }

        groupId = this.state.grouplist[this.state.selectedGroupIndex].id;

        createPostToGroup(token, groupId, this.state.content, this.state.image)
            .then(data => {
                showToast('Post Successful!');
                this.refs.animatedView.fadeInDownBig(1000);
                setTimeout(() => {
                    Actions.itemDetail({ item: data, entityId: data.id, entityType: 'post', backTo: 'home', share: this.state.share });
                }, 200);
            })
            .catch(err => {
                this.setState({sending: false});
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
        return this.state.share;
        // return false;
    }

    // changes the selection if user will share or not
    setShareSelected(bool){
        this.setState({share : bool});
        if (bool){
            showToast('Create post to share');
        } else {
            showToast('Canceling poster creation');
        }
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

    attachImage () {
        if (this.state.image) {
            this.setState({ image: null });
        } else {
            ActionSheet.show({
                options: ["Take photo", "Choose from gallery", "Cancel"],
                title: "Attach image"
            }, buttonIndex => {
                if (buttonIndex == 0 || buttonIndex == '0') {
                    ImagePicker.openCamera({
                        cropping: true,
                        height: 1280,
                        width: 1280,
                        includeBase64: true
                    }).then(image => {
                        this.setState({ image: image.data });
                    }).catch(v => alert(JSON.stringify(v)));
                }
                
                if (buttonIndex == 1 || buttonIndex == '1') {
                    ImagePicker.openPicker({
                        cropping: true,
                        height: 1280,
                        width: 1280,
                        includeBase64: true
                    }).then(image => {
                        console.log(image);
                        
                        this.setState({ image: image.data });
                    });
                }
            });
        }
    }

    renderAttachments(){
        let height = 30;
        let width = 40;

        return (
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <View>
                    <Button transparent style={{ height: height }} onPress={() => this.attachImage()}>
                        {
                        this.state.image 
                        ? <View style={{ flexDirection: 'row', width: width, height: height, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={{ uri: `data:image/png;base64,${this.state.image}` }} resizeMode='cover' style={{ width: width, height: height }} />
                            <View style={styles.deleteIconContainer}>
                                <Icon name='md-close-circle' style={styles.deleteIcon} />
                            </View>
                        </View>
                    : <View style={{ height: height, width: width }} >
                        <Image source={require("img/upload_image.png")} resizeMode='cover' style={{ width: width, height: height, tintColor: 'gray' }} />
                    </View>
                }
                    </Button>
                </View>
                <View>
                    <Button transparent style={{ height: width }} onPress={() => this.setShareSelected(!this.state.share)}>
                        <View style={{ flexDirection: 'row', backgroundColor: this.state.share ? '#71c9f1' : '#ccc', borderRadius: width/2, width: width, height: width, alignItems: 'center', justifyContent: 'center' }} >
                            <Image resizeMode='contain' style={{width: height, height: height, margin: 8}} source={require('../../../assets/share_icon.png')} />
                        </View>
                    </Button>
                </View>
            </View>);
    }
    
    render() {
        console.log(this.state.displaySuggestionBox, this.state.suggestionList);
        return (
            <Animatable.View style={{flexDirection: 'row'}} animation={'fadeInUpBig'} duration={800} ref='animatedView'  >
                <Container style={styles.container}>
                    <Header style={styles.header}>
                        <Left>
                            {
                            this.state.sharing
                            ? null
                            : <Button transparent onPress={() => {Keyboard.dismiss(); Actions.pop();}} style={{ width: 50, height: 50 }}  >
                                <Icon active name='arrow-back' style={{ color: 'white' }} />
                            </Button>
                        }
                        </Left>
                        <Body>
                            <Title style={{ color: 'white' }}>New Post</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => { this.createPost(); Mixpanel.track("Sent Post"); }}>
                                {
                                    this.state.sending 
                                    ? <ActivityIndicator color={'#fff'} animating={this.state.sending} /> 
                                    : <Label style={{ color: 'white' }}>Send</Label>
                                }
                            </Button>
                        </Right>
                    </Header>
                    <List>
                        <ListItem style={styles.community_container} onPress={() => this.toggleCommunity()}>
                            <View style={styles.avatar_container}>
                                <View style={styles.avatar_wrapper}>
                                    <Thumbnail square style={styles.avatar_img} source={{ uri: this.state.profile.avatar_file_name + '&w=150&h=150&auto=compress,format,q=95' }} />
                                </View>
                                <View style={styles.avatar_subfix} />
                            </View>
                            <Body style={styles.community_text_container}>
                                <Text style={styles.community_text}>
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
                    <ScrollView onLayout={(e) => this.setState({contentHeight: e.nativeEvent.layout.height})} scrollEnabled={false} keyboardShouldPersistTaps={'handled'} style={styles.main_content} >
                        {/* <S style={styles.main_content}> */}
                        <View style={{flex: 1, height: '100%', backgroundColor: '#fff'}}  >
                            <ScrollView style={{flex: 1, height: '100%'}}>
                                <TextInput
                                    maxLength={POST_MAX_LENGTH}
                                    ref={(r) => this.postInputRef = r}
                                    onSelectionChange={this.onSelectionChange}
                                    placeholderTextColor='rgba(0,0,0,0.1)'
                                    style={styles.textarea(this.state.contentHeight || 200)}
                                    multiline
                                    keyboardType={'default'}
                                    scrollEnabled={false}
                                    placeholder={this.placeholderTitle}
                                    value={this.state.content}
                                    onChangeText={(text) => this.changeContent(text)}
                                />
                            </ScrollView>
                        </View>
                        {
                            this.state.showCommunity &&
                            <CommunityView
                                grouplist={this.state.grouplist}
                                onPress={(i) => this.selectGroupList(i)}
                                onCancel={() => this.selectGroupList(this.state.selectedGroupIndex)}
                            />
                        }
                        
                    </ScrollView>
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={Platform.select({android: 20, ios: 0})}
                        behavior={Platform.select({android:'padding', ios: 'padding'})}>
                        {
                            this.renderAttachments()
                        }
                        <Footer style={{ maxHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10 }}>
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
                            {
                                this.state.displaySuggestionBox && this.state.suggestionList.length > 0
                                ? <ScrollView style={{ height: 40, bottom: 0, backgroundColor: '#fff', position: 'absolute', zIndex: 3}} keyboardShouldPersistTaps='always'>
                                    {/* <KeyboardAvoidingView behavior='padding' style={{flex: 1}}> */}
                                    {/* <Animated.View style={{marginBottom: 0}}> */}
                                    <SuggestionBox horizontal substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                                    {/* </Animated.View> */}
                                    {/* </KeyboardAvoidingView> */}
                                </ScrollView>
                                : <ScrollView style={{ position: 'absolute', zIndex: 3}} />
                            }
                        </Footer>
                    </KeyboardAvoidingView>
                </Container>
            </Animatable.View >
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(NewPost);
