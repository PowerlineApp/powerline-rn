// User has ability to create a new post from New Item Menu. GH14
// If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
// If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
// https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-posts

import React, { Component } from 'react';
import {TextInput, Keyboard, Platform, KeyboardAvoidingView, Modal, Alert} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import RNFetchBlob from 'react-native-fetch-blob'
const fs = RNFetchBlob.fs

import Answers from './answers';
import Event from './event';

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

class NewPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCommunity: true,
            profile: {},
            grouplist: [],
            selectedGroupIndex: -1,
            content: '',
            title: '',
            contentRemaining: '0',
            displaySuggestionBox: false,
            image: null,
            videoModal: false,
            videoURL: '',
            attachments: []
        };

        this.placeholderTitle = randomPlaceholder('post');

        this.toggleCommunity = this.toggleCommunity.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
    }

    componentDidMount() {
        
        let { token, group } = this.props;
        console.log(token);
        loadUserData(token).then(data => {
            this.setState({
                profile: data
            });
        }).catch(err => {
            
        });
        // console.log('group ==> ', group)
        
        getGroups(token).then(ret => {
            let showCommunity = true, selectedGroupIndex = -1;
            if (group && group !== 'all'){
                showCommunity = false,
                selectedGroupIndex = ret.payload.map(grouObj => grouObj.id).indexOf(group);
            }
            this.setState({
                grouplist: ret.payload,//.filter(group => group.user_role === 'owner' || group.user_role === 'manager'),
                showCommunity, selectedGroupIndex
            });
        }).catch(err => {
            
        });



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
        if (this.titleRef && this.state.title === ''){
            this.titleRef.focus()
        } else if (this.descriptionRef && this.state.content === '') {
            this.descriptionRef.focus()
        }

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

    preCreateContent() {
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
        Alert.alert(
            'Are you sure?',
            'This will send a push notification to all group members immediately.',
            [
              {text: 'Yes', onPress: () => this.createContent()},
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            ],
            { cancelable: false }
          )
    
    }
    prepareGroupDiscussionToServer(){
        let {state} = this;
        
        
    }
    prepareGroupAnnouncementToServer(){
        let {state} = this;
    
    }
    prepareGroupPetitionToServer(){
        let {state} = this;
    
    }
    prepareGroupPollToServer(){
        let {state} = this;
    
    }
    prepareGroupEventToServer(){
        let {state} = this;
    
    }
    prepareGroupFundraiserToServer(){
        let {state} = this;
    
    }
    createContent(){
        let {token, type} = this.props;
        let body;
        switch(type){
            case 'group_discussion':
                body = this.prepareGroupDiscussionToServer(); // title, content
            case 'group_announcement':
                body = this.prepareGroupAnnouncementToServer();// content
            case 'group_petition':
                body = this.prepareGroupPetitionToServer(); // title, content
            case 'group_poll':
                body = this.prepareGroupPollToServer(); // title (question subject), options
            case 'group_event':
                body = this.prepareGroupEventToServer(); // title, content, date, options
            case 'group_fundraiser':
                body = this.prepareGroupFundraiserToServer(); // not treted yet
        
        }



        // createPostToGroup(token, groupId, this.state.content, this.state.image)
        //     .then(data => {
        //         showToast('Post Successful!');
        //         if (this.state.sharing) this.props.onPost();
        //         else Actions.itemDetail({ entityId: data.id, entityType: 'post', backTo: 'home', share: this.state.share });
        //     })
        //     .catch(err => {
        //     });
    }

    changeTitle(text) {
        this.setState({
            title: text
        });
    }
    changeContent(text) {
        this.setState({
            content: text
        });
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

    openVideoAttachment() {
        if (this.state.attachments.length >= 3) {
            showToast('Max number of attachments is 3');
            return;
        }        
        this.setState({videoModal: true})
    }

    addVideoAttachment() {
        let {attachments, videoURL} = this.state;
        attachments.push({type: 'video', value: videoURL})
        this.setState({attachments, videoModal: false, videoURL: ''})
    }


    attachImage = () => {
        if (this.state.attachments.length >= 3) {
            showToast('Max number of attachments is 3');
            return;
        }

        ActionSheet.show({
            options: ["Take photo", "Choose from gallery"],
            title: "Attach image"
        }, buttonIndex => {
            if (buttonIndex == 0) {
                ImagePicker.openCamera({
                    cropping: true,
                    includeBase64: true
                }).then(image => {
                    let {attachments} = this.state;
                    attachments.push({type: 'img', value: image.data})
                    this.setState({attachments})
                }).catch(v => alert(JSON.stringify(v)));
            }

            if (buttonIndex == 1) {
                ImagePicker.openPicker({
                    cropping: true,
                    includeBase64: true
                }).then(image => {
                    // console.log(image);
                    let {attachments} = this.state;
                    attachments.push({type: 'img', value: image.data})
                    this.setState({attachments})
                });
            }
        });
    }

    removeAttachment(key){
        let {attachments} = this.state;
        attachments = attachments.filter((item, index) => index !== key)
        this.setState({attachments})
    }
    

    getYoutubeURL (url) {
        let {imgLoaded} = this.state;
        let ID = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
            ID = url[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
        } else {
            ID = url;
        }
        return 'http://img.youtube.com/vi/' + ID + '/mqdefault.jpg';
    }

    getYoutubeThumbnail (url) {
        let {imgLoaded} = this.state;
        let imgURL = this.getYoutubeURL(url);
        return <Image source={{url: imgURL}} key={url} resizeMode="cover" style={{ height: imgLoaded ? 180 : 1 }}
                onLoad={(e) => this.setState({imgLoaded: true})}
                onError={(e) => this.setState({imgLoaded: false})} />;
    }

    setEventDate(init, end){
        this.setState({eventInit: init, eventEnd: end});
    }

    renderAttachments(){
        if (this.state.showCommunity){
            return <View style={{height: 70, backgroundColor: 'rgba(0,0,0,0.4)'}} />;
        }
        if (!this.props.options.attachments){
            return <View />
        }
        let height = 40; 
        let width = 50;

        let {attachments} = this.state;
        console.log('ohaio')
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {
                attachments.map((attachment, index) => {
                        console.log(attachment);
                        if (attachment.type === 'img'){
                            return (
                                <View style={{ flexDirection: 'row', margin: 8, width: width, height: height, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={{ uri: `data:image/png;base64,${attachment.value}` }} resizeMode="cover" style={{ width: width, height: height }} />
                                <Button transparent style={styles.deleteIconButtonContainer} onPress={() => this.removeAttachment(index)}>
                                <View style={styles.deleteIconContainer}>
                                    <Icon name="md-close-circle" style={styles.deleteIcon} />
                                </View>
                            </Button>
                            </View>
                            )
                        }
                        return (
                            <View style={{ flexDirection: 'row', margin: 8, width: width, height: height, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={{url: this.getYoutubeURL(attachment.value)}} resizeMode="cover" style={{ width: width, height: height }} />
                                    <Button transparent style={styles.deleteIconButtonContainer} onPress={() => this.removeAttachment(index)}>
                                        <View style={styles.deleteIconContainer}>
                                            <Icon name="md-close-circle" style={styles.deleteIcon} />
                                        </View>
                                    </Button>
                                </View>
                    )
                })
            }
            <Button transparent style={{ margin: 8, height: height }} onPress={this.attachImage}>  
                <Image source={require("img/upload_image.png")} resizeMode="contain" style={{ width: width, height: height, tintColor: 'gray' }} />
            </Button>
            <Button transparent style={{ margin: 8, height: height }} onPress={() => this.openVideoAttachment()}>
                <Image source={require("img/youtube_link.png")} resizeMode="contain" style={{ width: width, height: height, tintColor: 'gray' }} />
            </Button>
        </View>)
    }

    render() {
        let {
            headerTitle,
            hasTitle,
            titlePlaceholder,
            hasDescription,
            wrapDescription,
            event,
            hasAnswers,
            addAnswersButton,
            answersPlaceholder,
            attachments,
            descriptionPlaceHolder
        } = this.props.options;
        console.log('props', this.props);
        return (
            <Container style={styles.container}>
                <Modal visible={this.state.videoModal} transparent>
                    <View style={{flexDirection: 'column', alignSelf: 'center', width: '100%' ,borderRadius: 8, margin: 16, marginTop: 250, backgroundColor: '#ccc', padding: 16, paddingRight: 8, paddingLeft: 8}}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                placeholder='Paste your video URL here'
                                style={styles.input_text}
                                autoCorrect={false}
                                value={this.state.videoURL}
                                onChangeText={(text) => this.setState({videoURL : text})}
                                underlineColorAndroid={'transparent'}
                            />
                            <Button onPress={() => this.addVideoAttachment()}>
                                <Text>Ok</Text>
                            </Button>
                        </View>
                            {this.getYoutubeThumbnail(this.state.videoURL)}
                    </View>
                </Modal>
                <Header style={styles.header}>
                    <View style={{alignSelf: 'flex-start'}}>
                        {
                            this.state.sharing
                            ? null
                            : <Button transparent onPress={() => Actions.pop()} style={{ width: 50, height: 50, paddingLeft: 0 }}  >
                                <Icon active name='arrow-back' style={{ color: 'white' }} />
                            </Button>
                        }
                    </View>
                    <Body>
                        <Title style={{ color: 'white' }}>{headerTitle}</Title>
                    </Body>
                    <View style={{alignSelf: 'flex-end'}}>
                        <Button transparent onPress={() => this.preCreateContent()}>
                            <Label style={{ color: 'white' }}>Send</Label>
                        </Button>
                    </View>
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
                <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.main_content} >
                    {
                        this.state.displaySuggestionBox && this.state.suggestionList.length > 0
                        ? <ScrollView style={{position: 'absolute', top: 20, zIndex: 3}} keyboardShouldPersistTaps="always"  >
                            <SuggestionBox substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                        </ScrollView>
                        : <ScrollView />
                    }
                    <ScrollView style={{margin: 16}}  >
                        {
                            hasTitle &&
                            <TextInput
                                placeholder={titlePlaceholder}
                                ref={(r) => this.titleRef = r}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                style={styles.input_text}
                                autoCorrect={false}
                                value={this.state.title}
                                onChangeText={(text) => this.changeTitle(text)}
                                underlineColorAndroid={'transparent'}
                            />
                        }
                        {
                            hasDescription &&
                            <TextInput
                                maxLength={10000}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                ref={(r) => this.descriptionRef = r}
                                onSelectionChange={this.onSelectionChange}
                                placeholderTextColor='rgba(0,0,0,0.1)'
                                style={wrapDescription ? styles.wrappedTextarea : styles.textarea}
                                multiline
                                placeholder={descriptionPlaceHolder}
                                value={this.state.content}
                                onChangeText={(text) => this.changeContent(text)}
                            />
                        }
                        {
                            event &&
                            <Event setEventDate={(init, end) => this.setEventDate(init, end)} />
                        }
                        {
                            hasAnswers &&
                            <Answers
                                setAnswer={(answers) => this.setState({answers: answers})}
                                addAnswersButton={addAnswersButton}
                                answersPlaceholder={answersPlaceholder}
                            />
                        }
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
                            this.renderAttachments()   
                        }
                        {
                    <Footer style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10 }}>
                        {
                            this.state.contentRemaining
                            ? <Label style={{ color: 'white', fontSize: 10 }}>
                                You have <Label style={{ fontWeight: 'bold' }}>{this.state.contentRemaining}</Label> group content left in this group
                            </Label>
                            :<Label />
                        }
                        {/* <Label style={{ color: 'white' }}>
                            {(5000 - this.state.content.length)}
                        </Label> */}
                    </Footer>
                        }
                </KeyboardAvoidingView>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(NewPost);
