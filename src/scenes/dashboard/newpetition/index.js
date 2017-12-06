// User has ability to create a new user petition from New Item Menu. GH15
// If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
// If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
// https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-user-petitions

import React, { Component } from 'react';
import {TextInput, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator} from 'react-native';

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
    Input,
    ActionSheet
} from 'native-base';
const PLColors = require('PLColors');
import ImagePicker from 'react-native-image-crop-picker';

import styles from './styles';
import SuggestionBox from '../../../common/suggestionBox';
import ShareFloatingAction from '../../../components/ShareFloatingAction';

import {
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, getUsersByGroup, createPetition, getPetitionConfig } from 'PLActions';
import { showToast } from 'PLToast';

const PETITION_MAX_LENGTH = 7000;
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';

class NewPetition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCommunity: true,
            profile: {},
            grouplist: [],
            selectedGroupIndex: -1,
            title: "",
            content: "",
            petition_remaining: null,
            mentionEntry: null,
            suggestionSearch: '',
            groupUsers: [],
            image: null,
            share: false
        };

        this.placeholderTitle = randomPlaceholder('petition');
        this.onSelectionChange = this.onSelectionChange.bind(this);
    }

    componentDidMount() {
        var { token, group } = this.props;
        loadUserData(token).then(data => {
            this.setState({
                profile: data
            });
        })
            .catch(err => {

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
    }

    toggleCommunity() {
        Keyboard.dismiss();        
        this.setState({
            showCommunity: !this.state.showCommunity
        });
    }

    onPetitionTitleRef (r) {
        this.petitionTitleRef = r;
    }

    selectGroupList(index) {
        this.setState({
            selectedGroupIndex: index,
            showCommunity: false
        });

        var { token } = this.props;

        getPetitionConfig(token, this.state.grouplist[index].id)
            .then(data => {
                this.setState({
                    petition_remaining: data.petitions_remaining
                });
                this.petitionTitleRef.focus();                
            })
            .catch(err => {

            });
    }

    createPetition() {
        if (this.state.sending) return;
        this.setState({sending: true});
        if (this.state.petition_remaining <= 0){
            alert('You do not have any petition left in this group');
            this.setState({sending: false});
            return;
        }
        
        if (this.state.selectedGroupIndex == -1) {
            alert('Where do you want to post this? Select a group');
            this.setState({sending: false});
            return;
        } else if (this.state.title == '' || this.state.title.trim() == '') {
            alert("Please create a title for your petition");
            this.setState({sending: false});
            return;
        } else if (this.state.content == '' || this.state.content.trim() == '') {
            alert("Whoops! Looks like you forgot to write your petition down!");
            this.setState({sending: false});
            return;
        }
        
        var { token } = this.props;
        createPetition(token, this.state.grouplist[this.state.selectedGroupIndex].id, this.state.title, this.state.content, this.state.image)
        .then(data => {
            showToast('Petition Successful!');
            Actions.itemDetail({ type:'replace', entityId: data.id, entityType: 'user-petition', backTo: 'home', share: this.state.share });
        })
        .catch(err => {
            this.setState({sending: false});
        });
    }

    changeContent(text) {
        if (text.length <= PETITION_MAX_LENGTH) {
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

    changeTitle(text) {
        this.setState({
            title: text
        });
    }

    attachImage () {
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
                        height: '1280',
                        width: '1280',
                        includeBase64: true

                    }).then(image => {
                        this.setState({ image: image.data });
                    });
                }

                if (buttonIndex == 1) {
                    ImagePicker.openPicker({
                        cropping: true,
                        height: '1280',
                        width: '1280',
                        includeBase64: true
                    }).then(image => {
                        this.setState({ image: image.data });
                    });
                }
            });
        }
    }

    isSelected(social) {
        return this.state.share;
        // return false;
    }

    // changes the selection if user will share or not
    setShareSelected(bool) {
        this.setState({ share: bool });
        if (bool){
            showToast('Create poster to share');
        } else {
            showToast('Canceling poster creation');
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

    render () {
        return (
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
                        <Title style={{ color: 'white' }}>New Petition</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.createPetition()}>
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
                <ScrollView onLayout={(e) => this.setState({contentHeight: e.nativeEvent.layout.height})} scrollEnabled={false} keyboardShouldPersistTaps={'handled'} style={styles.main_content} >
                    {
                    this.state.displaySuggestionBox && this.state.suggestionList.length > 0
                    ? <ScrollView style={{position: 'absolute', top: 20, zIndex: 3}} keyboardShouldPersistTaps='always'  >
                        <SuggestionBox substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                    </ScrollView>
                    : <ScrollView />
                }
                    <View style={{flex: 1, height: '100%'}}  >
                        <ScrollView style={{flex: 1, height: '100%'}}>
                            <TextInput
                                placeholder='Give a title to your petition here'
                                ref={(r) => this.onPetitionTitleRef(r)}
                                style={styles.input_text}
                                autoCorrect={false}
                                value={this.state.title}
                                onChangeText={(text) => this.changeTitle(text)}
                                underlineColorAndroid={'transparent'}
                            />
                            <TextInput
                                maxLength={PETITION_MAX_LENGTH}
                                onSelectionChange={this.onSelectionChange}
                                placeholderTextColor='rgba(0,0,0,0.1)'
                                style={styles.textarea(this.state.contentHeight - 40)}
                                multiline
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
                        />
                    }
                </ScrollView>
                <KeyboardAvoidingView behavior={Platform.select({android:'height', ios: 'padding'})}>
                    {
                        this.renderAttachments()
                    }
                    <Footer style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10 }}>
                        {
                        this.state.petition_remaining
                        ? <Label style={{ color: 'white', fontSize: 10 }}>
                            You have <Label style={{ fontWeight: 'bold' }}>{this.state.petition_remaining}</Label> petitions left in this group
                        </Label>
                        :<Label />
                    }
                        {/* Related: GH 151 */}
                        <Label style={{ color: 'white' }}>
                            {(PETITION_MAX_LENGTH - this.state.content.length)}
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

export default connect(mapStateToProps)(NewPetition);
