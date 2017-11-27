// User has ability to create a new post from New Item Menu. GH14
// If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
// If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
// https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-posts

import React, { Component } from 'react';
import {TextInput, Keyboard, Platform, KeyboardAvoidingView, Modal, Alert} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

import Answers from './answers';
import Event from './event';
import CrowdfundingSwitch from './crowdfundingSwitch';
import FundraiserBlocker from './fundraiserBlocker';

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
import { loadUserData, getGroups, getUsersByGroup, createPostToGroup, getPetitionConfig, createPoll, createAnnouncement, sendAttachment, groupBankAccounts, publishPoll, publishAnnouncement } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';

class NewLeaderContent extends Component {
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
            attachments: [],
            options: [],
            init: {
                date: null,
                time: null
            },
            end: {
                date: null,
                time: null
            },
            crowdfunding: {
                is_crowdfunding: false
            }
        };

        this.placeholderTitle = randomPlaceholder('post');

        this.toggleCommunity = this.toggleCommunity.bind(this);
    }

    componentDidMount() {
        
        let { token, group, type } = this.props;
        loadUserData(token).then(data => {
            this.setState({
                profile: data
            });
        }).catch(err => {
            
        });
        // console.log('group ==> ', group)
        
        getGroups(token).then(ret => {
            console.log('ret => ', ret);
            let showCommunity = true, selectedGroupIndex = -1;
            if (group && group !== 'all'){
                showCommunity = false;
                selectedGroupIndex = ret.payload.map(grouObj => grouObj.id).indexOf(group);
                this.updateBankInfo(token, ret.payload[selectedGroupIndex].id, type);
            }
            this.setState({
                grouplist: ret.payload.filter(group => group.user_role === 'owner' || group.user_role === 'manager'),
                showCommunity, selectedGroupIndex
            });
        }).catch(err => {
            
        });
    }

    updateBankInfo(token, groupId, type){
        if (type !== 'group_fundraiser') return;
        this.setState({enableSend: false});
        groupBankAccounts(token, groupId).then(r => {
            r.json().then(r => {
                console.log('BANK ACCOUNTS:', r);
                if (!r || r.length === 0){
                    this.setState({blockFundraiser: true});
                    Alert.alert('This group does not have an Bank Account setup yet',
                        "It seems that your group doesn't have any bank account registered. Please add a bank account to your group or ask the group owner to do so.",
                        [
                            {text: 'Cancel', onPress: () => Actions.pop(), style: 'cancel'},
                            {text: 'OK', onPress: () => {Actions.pop(); setTimeout(() => {Actions.groupprofile({id: groupId});}, 500);}},
                        ],
                          {cancelable: false}
                    );

                } else {
                    this.setState({enableSend: true});
                }
            });
        }).catch(e => {
            alert('Something went wrong. Group account data could not be loaded. Try again later.');
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
        if (this.titleRef && this.state.title === ''){
            this.titleRef.focus();
        } else if (this.descriptionRef && this.state.content === '') {
            this.descriptionRef.focus();
        }
        
        let { token, type } = this.props;
        this.updateBankInfo(token, this.state.grouplist[index].id, type);

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
        let groupId = null;

        if (this.state.selectedGroupIndex == -1) {
            this.state.sharing ? showToast('Please select Group.')
            : alert('Please select Group.');
            return;
        }
        
        let group = this.state.grouplist[this.state.selectedGroupIndex];
        // re-check if user has bank account set up
        this.updateBankInfo(this.props.token, group.id, this.props.type);
        groupId = group.id;
        Alert.alert(
            'Are you sure?',
            `Are you sure you want to send this ${this.props.options.headerTitle} to all ${group.total_members} group members?`,
            [
              {text: "Yes, I'm sure", onPress: () => this.createContent()},
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            ],
            { cancelable: false }
          );
    }

    prepareGroupAnnouncementToServer(){
        let {state} = this;
        let {content} = state;
        if (content)
            return {content};
        if (!content){
            alert("Please provide a content for your announcement!"); // ok
            return false;
        }

    }
    prepareGroupDiscussionToServer(){
        let {state} = this;
        let type = 'news';
        let subject = state.content;
        if (type && subject)
            return {type, subject};
        if (!subject){
            alert("Please provide a content for your discussion!"); // ok
            return false;            
        }
    }
    prepareGroupPetitionToServer(){
        let {state} = this;
        let type = 'petition';
        let petition_title = state.title;
        let petition_body = state.content;
        let subject = state.content;

        if (type && petition_title && petition_body && subject)
            return {type, petition_title, petition_body, subject}; // subject??? - ok

        if (!petition_title){
            alert("Please create a title for your petition");
            return false;
        }
        if (!petition_body){
            alert("Whoops! Looks like you forgot to write your petition down!");
            return false;
        }
    }

    prepareGroupPollToServer(){
        let {state} = this;
        let type = 'group';
        let subject = state.title; // ??? title ?
        let options = state.options;

        options.map(opt => {
            if (!opt.value){
                alert('Please provide only valid options');
                return false;
            }
        });
        
        if (type && subject && options.length > 0)
            return {type, subject, options};
        if (!subject){
            alert('Please provide a question for your poll!');
            return false;
        }
        
        if (options.length <= 0){
            alert("You need to add at least one option for your poll!");
            return false;
        }
        
    }
    
    prepareGroupEventToServer(){
        console.log(this.state);
        let {state} = this;
        let type = 'event';
        let title = state.title;
        let subject = state.content;
        let {options} = state;
        let initDate = state.init.date;
        let initTime = state.init.time;
        let endDate = state.end.date;
        let endTime = state.end.time;
        // console.log(initDate, initTime, endDate, endTime)
        options.map(opt => {
            if (!opt.value){
                alert('Please provide only valid response options');
                return false;
            }
        });

        let started_at = moment(initDate).startOf('day').add(moment(initTime).hour(), 'hour').add(moment(initTime).minutes(), 'minutes').format('YYYY-MM-DD HH:mm:ssZZ').split(' ').join('T');
        let finished_at = moment(endDate).startOf('day').add(moment(endTime).hour(), 'hour').add(moment(endTime).minutes(), 'minutes').format('YYYY-MM-DD HH:mm:ssZZ').split(' ').join('T');

        // console.log(title !== '' && options.length > 0 && initDate !== null && initTime !== null && endDate !== null && endTime !== null)
        if (title !== '' && subject !== '' && options.length > 0 && initDate !== null && initTime !== null && endDate !== null && endTime !== null)
            return {title, subject, started_at, finished_at, type, options}; // ok
        
        if (!title){
            alert("Please create a title for your event");            
            return false;
        }
        if (!subject){
            alert("Please create a content for your event");            
            return false;
        }
        if (options.length < 1){
            alert('Please insert at least one RSPV answer');
            return false;
        }
        if (!initDate){
            alert('Please select a day for the start of event');
            return false;
        }
        if (!initTime){
            alert('Please select an hour for the start of event');
            return false;
        }
        if (!endDate){
            alert('Please select a day for the end of event');
            return false;
        }
        if (!endTime){
            alert('Please select an hour for the end of event');
            return false;
        }


    }
    prepareGroupFundraiserToServer(){
        let {state: {title, crowdfunding, content, options}} = this;
        if (crowdfunding.is_crowdfunding){
            if (!crowdfunding.goal){
                alert('Please select a goal for your crowdfunding.');
                return false;
            }
            if (!crowdfunding.deadline){
                alert('Please use a valid deadline for your crowdfunding.');
                return false;
            }
        }
        let valid = false;

        options = options.map((opt, i) => {
            console.log(opt);
            if (!opt.value || (!opt.amount && !opt.is_user_amount)){
                alert('Please provide only valid options');
                valid = false;
            }

            if (opt.is_user_amount){
                valid = true;
            }

            valid = true;
            return {value: (opt.value), payment_amount: opt.amount, is_user_amount: !!opt.is_user_amount};
        });

        if (!valid){
            return false;
        }

        if (!title){
            alert('Please provide a title for your ' + crowdfunding.is_crowdfunding ? 'crowdfunding' : 'fundraiser');
            return false;
        }
        
        if (!content){
            alert('Please provide a content for your ' + crowdfunding.is_crowdfunding ? 'crowdfunding' : 'fundraiser');
            return false;    
        }
        if (options.length <= 0){
            alert('Please provide at least one option for your ' + crowdfunding.is_crowdfunding ? 'crowdfunding' : 'fundraiser');
            return false;    
        }

        return (
        {
            title, subject: content, options,
            is_crowdfunding: crowdfunding.is_crowdfunding,
            crowdfunding_goal_amount: crowdfunding.is_crowdfunding ? crowdfunding.goal : null,
            crowdfunding_deadline: crowdfunding.is_crowdfunding ? crowdfunding.deadline : null,
            type: 'payment_request'
        }
        );
    }

    async sendAttachmentsAndPublish(obj, attachments){
        let {token} = this.props;
        for (let attachment of attachments){
            try {
                await sendAttachment(token, obj.id, attachment);
            } catch (error) {
                console.log('error attaching: ', attachment, ' of ', attachments, 'for ', obj);
            }
        }
        return this.publish(obj);
    }

    async publish(obj){
        let {token, type} = this.props;
        let result;
        if (type === 'group_announcement'){
            result = await publishAnnouncement(token, obj.id);
        } else {
            result = await  publishPoll(token, obj.id);
        }

        return result.json();

    }

    createContent(){
        
        // if (this.state.blockFundraiser || !this.state.enableSend) return;
        let {token, type} = this.props;
        let groupId = this.state.grouplist[this.state.selectedGroupIndex].id;
        let {attachments} = this.state;
        let body;
        switch(type){
        case 'group_discussion':
            body = this.prepareGroupDiscussionToServer(); // title, content
            break;
        case 'group_announcement':
            body = this.prepareGroupAnnouncementToServer();// content
            break;
        case 'group_petition':
            body = this.prepareGroupPetitionToServer(); // title, content
            break;
        case 'group_poll':
            body = this.prepareGroupPollToServer(); // title (question subject), options
            break;
        case 'group_event':
            body = this.prepareGroupEventToServer(); // title, content, date, options
            break;
        case 'group_fundraiser':
            body = this.prepareGroupFundraiserToServer(); // not treted yet
            break;
        }
        console.log(body);
        if (body){
            let req;
            // console.log('going to post! :D');
            if (type === 'group_announcement'){
                req = createAnnouncement(token, groupId, body);
            } else {
                req = createPoll(token, groupId, body);
            }

            req.then(resp => {
                resp.json().then(r => {
                    console.warn(r);
                    this.sendAttachmentsAndPublish(r, attachments).then((r) => {
                        console.log('published: ', r);
                        Actions.itemDetail({entityType: 'poll', entityId: r.id});
                    }).catch(e => {
                        console.log('failure', e);
                    });
                });
            }).catch(e => {
                // alert(e);
                console.warn(JSON.parse(e));
            });

        }
    }

    changeTitle(text) {
        this.setState({ title: text });
    }

    changeContent(text) {
        this.setState({ content: text });
    }

    openVideoAttachment() {
        if (this.state.attachments.length >= 3) {
            showToast('Max number of attachments is 3');
            return;
        }        
        this.setState({videoModal: true});
    }

    addVideoAttachment() {
        let {attachments, videoURL} = this.state;
        attachments.push({type: 'video', content: videoURL});
        this.setState({attachments, videoModal: false, videoURL: ''});
    }

    attachImage () {
        if (this.state.attachments.length >= 3) {
            showToast('Max number of attachments is 3');
            return;
        }

        ActionSheet.show({
            options: ["Take photo", "Choose from gallery", "Cancel"],
            title: "Attach image"
        }, buttonIndex => {
            console.log('------------', buttonIndex);
            switch(buttonIndex){
            case 0:
            case '0':
                ImagePicker.openCamera({
                    cropping: true,
                    includeBase64: true
                }).then(image => {
                    let {attachments} = this.state;
                    attachments.push({type: 'image', content: image.data});
                    this.setState({attachments});
                }).catch(v => alert(JSON.stringify(v)));
            case 1:
            case '1':
                ImagePicker.openPicker({
                    cropping: true,
                    includeBase64: true
                }).then(image => {
                    // console.log(image);
                    let {attachments} = this.state;
                    attachments.push({type: 'image', content: image.data});
                    this.setState({attachments});
                });
            default:
                () => {}; // do nothing - action canceled
            }
        });
    }

    removeAttachment(key){
        let {attachments} = this.state;
        attachments = attachments.filter((item, index) => index !== key);
        this.setState({attachments});
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
        return <Image source={{url: imgURL}} key={url} resizeMode='cover' style={{ height: imgLoaded ? 180 : 1 }}
            onLoad={(e) => this.setState({imgLoaded: true})}
            onError={(e) => this.setState({imgLoaded: false})} />;
    }

    setEventDate(init, end){
        this.setState({init, end});
    }

    renderAttachments(){
        if (!this.props.options.attachments){
            return <View />;
        }
        let height = 30;
        let width = 40;

        let {attachments} = this.state;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                {
                attachments.map((attachment, index) => {
                        // console.log(attachment);
                    if (attachment.type === 'image'){
                        return (
                            <View style={{ flexDirection: 'row', margin: 4, width: width, height: height, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={{ uri: `data:image/png;base64,${attachment.content}` }} resizeMode='cover' style={{ width: width, height: height }} />
                                <Button transparent style={styles.deleteIconButtonContainer} onPress={() => this.removeAttachment(index)}>
                                    <View style={styles.deleteIconContainer}>
                                        <Icon name='md-close-circle' style={styles.deleteIcon} />
                                    </View>
                                </Button>
                            </View>
                        );
                    }
                    return (
                        <View style={{ flexDirection: 'row', margin: 4, width: width, height: height, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={{url: this.getYoutubeURL(attachment.content)}} resizeMode='cover' style={{ width: width, height: height }} />
                            <Button transparent style={styles.deleteIconButtonContainer} onPress={() => this.removeAttachment(index)}>
                                <View style={styles.deleteIconContainer}>
                                    <Icon name='md-close-circle' style={styles.deleteIcon} />
                                </View>
                            </Button>
                        </View>);
                })
            }
                {
                attachments.length < 3
                ? [
                    <Button transparent style={{ margin: 4, height: height }} onPress={() => this.attachImage()}>  
                        <Image source={require("img/upload_image.png")} resizeMode='contain' style={{ width: width, height: height, tintColor: 'gray' }} />
                    </Button>,
                    <Button transparent style={{ margin: 4, height: height }} onPress={() => this.openVideoAttachment()}>
                        <Image source={require("img/youtube_link.png")} resizeMode='contain' style={{ width: width, height: height, tintColor: 'gray' }} />
                    </Button>
                ]
                : null
            }
            </View>);
    }

    render() {
        let { 
            options: {
                headerTitle,
                hasTitle,
                titlePlaceholder,
                hasDescription,
                wrapDescription,
                event,
                hasAnswers,
                addAnswersButton,
                answersPlaceholder,
                answerType,
                attachments,
                descriptionPlaceHolder}
            } = this.props;
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
                {
                    /* this.state.blockFundraiser && !this.state.showCommunity &&
                    // <FundraiserBlocker group={this.state.grouplist[this.state.selectedGroupIndex]} visible={this.state.blockFundraiser && !this.state.showCommunity} /> */
                }
                <Header style={styles.header}>
                    <View style={{alignSelf: 'flex-start'}}>
                        <Button transparent onPress={() => Actions.pop()} style={{ width: 50, height: 50, paddingLeft: 0 }}  >
                            <Icon active name='arrow-back' style={{ color: 'white' }} />
                        </Button>
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
                    <ScrollView style={{margin: 16}}  >
                        <Content>
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
                                // underlineColorAndroid={'transparent'}
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
                            this.props.type === 'group_fundraiser' &&
                            <CrowdfundingSwitch updateCrowdfundingInfo={(data) => this.setState({crowdfunding: data})} />
                        }
                            {
                            event &&
                            <Event setEventDate={(init, end) => this.setEventDate(init, end)} />
                        }
                            {
                            hasAnswers &&
                            <Answers
                                setAnswer={(options) => this.setState({options})}
                                addAnswersButton={addAnswersButton}
                                answersPlaceholder={answersPlaceholder}
                                answerType={answerType}
                            />
                        }
                        </Content>
                    </ScrollView>
                    {
                            this.state.showCommunity &&
                            <CommunityView
                                grouplist={this.state.grouplist}
                                onPress={(i) => this.selectGroupList(i)}
                            />
                        }
                </ScrollView>
                <KeyboardAvoidingView behavior={Platform.select({android:'height', ios: 'padding'})}>
                    {
                        this.renderAttachments()   
                    }
                </KeyboardAvoidingView>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(NewLeaderContent);
