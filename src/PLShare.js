import React, { Component } from 'react';
import { TextInput, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator, TouchableHighlight} from 'react-native';
// import { Actions } from 'react-native-router-flux';
// import * as Animatable from 'react-native-animatable';
import ShareExtension from 'react-native-share-extension';
import { RNSKBucket } from 'react-native-swiss-knife';


import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

import {
    Root,
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
import PLColors from './common/PLColors';
import SuggestionBox from './common/suggestionBox';
// import ShareFloatingAction from './components/ShareFloatingAction';
import styles from './scenes/dashboard/newpost/styles';
import {
    Dimensions,
    ScrollView,
    Image
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

// import Toast from 'react-native-root-toast';

// const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');

// const { width, height } = Dimensions.get('window');


import { createPostToGroup, getPetitionConfig } from './actions/posts';
import { loadUserData } from './actions/users';

import { getGroups } from './actions/groups';

import randomPlaceholder from './utils/placeholder';
import CommunityView from './components/CommunityView';
const POST_MAX_LENGTH = 5000;

class Share extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCommunity: false,
            toastVisible: false,
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
        this.showToast = this.showToast.bind(this);
        // this.placeholderTitle = randomPlaceholder('post');

        // this.toggleCommunity = this.toggleCommunity.bind(this);
        // this.onSelectionChange = this.onSelectionChange.bind(this);
    } 
    componentDidMount (){
        const myGroup = 'group.ne.powerline.share';
        this.setState({content: 'getting data'});
        
        ShareExtension.data().then(({type, value}) => {
            fs.readFile(value, "base64").then(r => {
                this.setState({image: r, content: ''});
            }).catch(e => {
                this.showToast('Error ocurred reading file.');
            });
        });
        RNSKBucket.get('token', myGroup).then(value => {
            this.setState({token: value, content: value});
            this.loadGroups(value);
        });
    }

    loadGroups (token) {
        getGroups(token).then(ret => {
            let showCommunity = true;
            let selectedGroupIndex = -1;
            this.setState({
                // content: JSON.stringify(ret)
                grouplist: ret.payload,
                showCommunity,
                selectedGroupIndex
            });
        }).catch(err => {
            this.showToast('Error when loading groups Trying again in 15 seconds.');
            setTimeout(() => {
                this.loadGroups(token);
            }, 15000);
        });
    }

    // componentDidMount() {
    //     // console.log('ONLOAD NEWPOST PROPS', this.props);
        
    //     // var { token, group } = this.props;
    //     // loadUserData(token).then(data => {
    //     //     this.setState({
    //     //         profile: data
    //     //     });

    //     // }).catch(err => {
            
    //     // });
        // }



    toggleCommunity() {
        Keyboard.dismiss();
        this.setState({
            showCommunity: !this.state.showCommunity
        });
    }

    // // If user is looking at "all" newsfeed, then user will be prompted to select group to post to.
    selectGroupList(index) {
        this.setState({
            selectedGroupIndex: index,
            showCommunity: false
        });
        this.postInputRef.focus();

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
        let { token } = this.state;
        let groupId = null;
        if (this.state.posts_remaining <= 0){
            this.showToast('You do not have any posts left in this group');
            return;
        }
        if (this.state.sending) return;
        this.setState({sending: true});
        
        
        if (this.state.selectedGroupIndex == -1) {
            this.showToast('Please select Group.');
            this.setState({sending: false});
            return;
        } else if (this.state.content == "" || this.state.content.trim() == '') {
            this.showToast("Please type post content");
            this.setState({sending: false});
            return;
        }

        groupId = this.state.grouplist[this.state.selectedGroupIndex].id;

        createPostToGroup(token, groupId, this.state.content, this.state.image)
            .then(data => {
                this.showToast('Post Successful!');
                // this.refs.animatedView.fadeInDownBig(1000);
                setTimeout(() => {
                    ShareExtension.close();
                }, 2500);
                // setTimeout(() => {
                //     if (this.state.sharing) this.props.onPost();
                //     else Actions.itemDetail({ type:'replace' , entityId: data.id, entityType: 'post', backTo: 'home', share: this.state.share });
                // }, 200);
            })
            .catch(err => {
                this.setState({sending: false});
                this.showToast(err.message);
            });
    }

    changeContent(text) {
        if (text.length <= POST_MAX_LENGTH) {
            this.setState({
                content: text
            });
        }
    }

    renderAttachments(){
        let height = 30;
        let width = 40;

        return (
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <View>
                    <Button transparent style={{ height: height }} onPress={() => {}}>
                        {
                        this.state.image 
                        ? <View style={{ flexDirection: 'row', width: width, height: height, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={{ uri: `data:image/png;base64,${this.state.image}` }} resizeMode='cover' style={{ width: width, height: height }} />
                        </View>
                    : <View style={{ height: height, width: width }} >
                        <Image source={require("img/upload_image.png")} resizeMode='cover' style={{ width: width, height: height, tintColor: 'gray' }} />
                    </View>
                }
                    </Button>
                </View>
                <View />
            </View>);
    }

    showToast (text) {
        Toast.show({
            text,
            position: 'bottom',
            duration: 2500
        });
    }
    
    render() {
        // console.log(this.state.displaySuggestionBox, this.state.suggestionList);
        let groupTitle = this.state.selectedGroupIndex == -1 
                            ? 'Select a community' 
                            : (this.state.grouplist[this.state.selectedGroupIndex] || {official_name: ''}).official_name;
        return (
            <Root>
                <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
                    {/* <Toast 
                    position={50}
                    visible
                    shadow
                    animation
                    hideOnPress
                    delay={0}
                >
                    {this.state.toastMessage}
                hello
                </Toast> */}
                    <Container style={styles.container}>
                        <Header style={styles.header}>
                            <Left>
                                <Button transparent onPress={() => {Keyboard.dismiss(); ShareExtension.close(); }} style={{ width: 50, height: 50 }}>
                                    <Icon active name='arrow-back' style={{ color: 'white' }} />
                                </Button>
                            </Left> 
                            <Body>
                                <Title style={{ color: 'white' }}>New Post</Title>
                            </Body>
                            <Right>
                                <Button transparent onPress={() => { this.createPost(); }}>
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
                                        {groupTitle}
                                    </Text>
                                </Body>
                                <Right style={styles.communicty_icon_container}>
                                    <Icon name='md-create' style={{ color: 'white' }} />
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
                        // keyboardVerticalOffset={32}
                            behavior={Platform.select({android:'padding', ios: 'padding'})}>
                            {
                            this.renderAttachments()
                        }
                            <Footer style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10 }}>
                                {
                            this.state.posts_remaining
                            ? <Label style={{ color: 'white', fontSize: 10 }}>
                                You have <Label style={{ fontWeight: 'bold' }}>{this.state.posts_remaining}</Label> posts left in this group
                            </Label>
                            :<Label />
                        }
                                <Label style={{ color: 'white' }}>
                                    {(POST_MAX_LENGTH - this.state.content.length)}
                                </Label>
                            </Footer>
                        </KeyboardAvoidingView>
                    </Container>
                </View>
            </Root>
            
        );
    }
    // render () {
    //     return (
    //         <View style={{width: '100%', height: '100%', flex: 1, backgroundColor: 'rgba(120, 120, 120, 0.5)'}} />
    //     );
    // }
}

module.exports = Share;

