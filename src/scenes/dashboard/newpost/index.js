// User has ability to create a new post from New Item Menu. GH14
// If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
// If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
// https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-posts

import React, { Component } from 'react';
import { TextInput, Platform } from 'react-native';
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

const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, getUsersByGroup, createPostToGroup, getPetitionConfig } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';
const POST_MAX_LENGTH = 5000;

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
            share: false
        };

        this.placeholderTitle = randomPlaceholder('post');

        this.toggleCommunity = this.toggleCommunity.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
    }

    componentDidMount() {
        // console.log('ONLOAD NEWPOST PROPS', this.props);
        this.loadSharedData(this.props.data);

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


    /**
     * // !!jesse
     * ignore this, this is some testing code XD, all the magic (that isnt fully happening is at android configs) 
     */
    async loadSharedData(data){
        // if (!data) {
        //     this.setState({showCommunity: true});
        //     return;
        // }
        console.log(data);
        if (!data){
            data = {};
        }
        // data.value = 'https://photos.app.goo.gl/3fsbP564ocy4PO402';
        // data.value = 'https://github.com/wkh237/react-native-fetch-blob';
        data.value = 'https://lh3.googleusercontent.com/qBiKINNbryqaDoURhTgtJTNZE1Xw0Xd2JNriyfVv_uwhldQ-LNc_zTufv-2AwWViks3QL3ggtT7OHSLod9LltmPinB-4qpRcR1xte1SsTT9vWWDDlRgu5NdDnOBuRp3FufP3p3BBs845xor2bWsnvFnRNDxORZUFPXhURFa5LhQnkqD6gaHs3s1fSNKQ7Lin_ul_6wntQv85XlLaQ_9Y4VHswrO5WqSjeWTKkd1uAxqrLa2vHfHrOIawjOjZ95lclccCj5X2-bxuCmWFzFzRFjTDGQnQxvYMFRANI6kdXL9nGe_HifwRLPQh0SK5kKfRH7aMel_1zts3fr3OzTYtcsfbU3Q9VEXtuD097uq8YbAhsMTTMPoesZUjQYit4GBAhsRbpCEaB62oFgKWkd9MNerDwyROOv5BAbk5trRFelWHqxyk5iK35crJAhbZSaHLT1GebIl5u9S_I69KA_K2zWb6xoK6sPwNFAeTBAQcnazYdW4BdEYcbJZpLyIf_a3feRGPzQOhaUOxv8zNZcXQTNGL4SKPbk61w7kB5uAzVyUHKQhQsgWb_7HsbaPuY81Ozg4MhVjig4LS_NZdX0EjdjOoaZYCsf44l5z2VXO62cyBjBEje_d2SX97ziusUJ9bmz0uAGJMPUGBo2iAk2ihMrZeTIog9sxOvn0=s250-no';
        let dirs = RNFetchBlob.fs.dirs
        console.log(dirs);
        
        let path2 = '/powerline/shared/' + new Date();
        let res = await RNFetchBlob.fetch('GET', data.value);
        console.log(res);

        return;



        let blob = await res.blob();
        let path = await res.path()
        console.log('path', path, 'blob', blob);
        
        let r = await fs.readFile(path, "base64");
        // await fs.writeFile('/oi', r, )
        try {
            
            let img = await ImagePicker.openCropper({
                path: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path()
                // width: 300,
                // height: 300
            })
            console.log(img);
            console.log('file readen: ', r);
        } catch (error) {
            
            console.log('error', error)
        }        
            // console.log(mime)

            // let path = resp.path();
            // fs.scanFile([{path: resp.path(), mime: 'image/png'}])
            
            
            
            // .then((r) => {
            //     console.log('scanned', r);
            // }).catch(e => {
            //     console.log('hehe. faio');
            //     this.setState({content: data ? data.value : ''});
            //     this.setState({showCommunity: true})
            // })

            // fs.readFile('file://' + path, "base64").then(r => {
            //     console.log('r', r);
            // })

            // the image is now dowloaded to device's storage
            // console.log(resp.rawResp());
            // console.log('resp content type => ', resp.respInfo.headers['content-type'])
            // console.log(resp.info())
            // imagePath = resp.path()
            // console.log(imagePath)
            // // resp.readFile('base64').then(b64 => {

            // //     // if ()
            // //     console.log('b64 data', b64)
            // // })

            // // return fs.unlink(imagePath)
            // return ImagePicker.openCropper({
            //     path: Platform.OS === 'android' ? 'file://' + resp.path() : resp.path()
            // }).then(image => {
            //     console.log(image);
            //     // return resp.readFile('base64')
            //     // }).then((base64Data) => {
            //         // console.log('seems to have loaded the b64... ', base64Data);
                    
            //         // here's base64 encoded image
            //         // let b64 = `data:image/png;base64,` + base64Data;
            //         // type = 'image/png'; 
            //         this.setState({showCommunity: true})
                    
            //         // return fs.unlink(imagePath)

            // }).catch(e => {
            //     console.log(e)
            // });
        // }).catch(e => {
        //     // alert('Failed to load image');
        //     console.log('Failed to load image... maybe it isnt a image? ');
        //     this.setState({content: data ? data.value : ''});
        //     this.setState({showCommunity: true})
            
        //     console.log(e);
        //     // this.setState({sharing: false}) 
        // })

    }


    toggleCommunity() {
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
        if (this.state.selectedGroupIndex == -1) {
            alert('Please select Group.');
            return;
        } else if (this.state.content == "" || this.state.content.trim() == '') {
            alert("Please type post content");
            return;
        }

        groupId = this.state.grouplist[this.state.selectedGroupIndex].id;

        createPostToGroup(token, groupId, this.state.content, this.state.image)
            .then(data => {
                showToast('Post Successful!');
                Actions.itemDetail({ entityId: data.id, entityType: 'post', backTo: 'home', share: this.state.share });
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
    isSelected(social) {
        return this.state.share
        // return false;
    }

    // changes the selection if user will share or not
    setSelected(bool) {
        this.setState({ share: bool })
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
                        <Button transparent onPress={() => Actions.pop()} style={{ width: 50, height: 50 }}  >
                            <Icon active name='arrow-back' style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>New Post</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.createPost()}>
                            <Label style={{ color: 'white' }}>Send</Label>
                        </Button>
                    </Right>
                </Header>
                <ScrollView scrollEnabled={!this.state.showCommunity}>
                    <View style={styles.main_content}>
                        <List>
                            <ListItem style={styles.community_container} onPress={() => this.toggleCommunity()}>
                                <View style={styles.avatar_container}>
                                    <View style={styles.avatar_wrapper}>
                                        <Thumbnail square style={styles.avatar_img} source={{ uri: this.state.profile.avatar_file_name + '&w=50&h=50&auto=compress,format,q=95' }} />
                                    </View>
                                    <View style={styles.avatar_subfix} />
                                </View>
                                <Body style={styles.community_text_container}>
                                    <Text style={{ color: 'white' }}>
                                        {this.state.selectedGroupIndex == -1 ? 'Select a community' : this.state.grouplist[this.state.selectedGroupIndex].official_name}
                                    </Text>
                                </Body>
                                <Right style={styles.communicty_icon_container}>
                                    <Icon name='md-create' style={{ color: 'white' }} />
                                </Right>
                            </ListItem>
                        </List>

                        {
                            this.state.displaySuggestionBox && this.state.suggestionList.length > 0
                                ? <ScrollView style={{ position: 'absolute', top: 20, zIndex: 3 }}>
                                    <SuggestionBox substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                                </ScrollView>
                                : <ScrollView />
                        }

                        <ScrollView style={{ marginTop: 0 }}>
                            <TextInput
                                maxLength={POST_MAX_LENGTH}
                                onSelectionChange={this.onSelectionChange}
                                placeholderTextColor='rgba(0,0,0,0.1)'
                                style={styles.textarea}
                                multiline
                                placeholder={this.placeholderTitle}
                                value={this.state.content}
                                onChangeText={(text) => this.changeContent(text)}
                            />
                        </ScrollView>
                        <Button transparent style={{ marginBottom: 8, height: 60 }} onPress={this.attachImage}>
                            {
                                this.state.image ?
                                    <View style={{ flexDirection: 'row', width: 100, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={{ uri: `data:image/png;base64,${this.state.image}` }} resizeMode="cover" style={{ width: 90, height: 50 }} />
                                        <View style={styles.deleteIconContainer}>
                                            <Icon name="md-close-circle" style={styles.deleteIcon} />
                                        </View>
                                    </View>
                                    :
                                    <Image source={require("img/upload_image.png")} resizeMode="contain" style={{ width: 100, height: 60, tintColor: 'gray' }} />
                            }
                        </Button>
                        <ShareFloatingAction
                            onPress={() => this.setSelected(!this.state.share)}
                            isSelected={() => this.isSelected()}
                        />

                        {/* <SuggestionBox substitute={(mention) => this.substitute(mention)} displaySuggestionBox={this.state.displaySuggestionBox} userList={this.state.suggestionList} />
                        <Textarea
                            maxLength={POST_MAX_LENGTH}
                            autoFocus
                            onSelectionChange={this.onSelectionChange}
                            placeholderTextColor='rgba(0,0,0,0.1)'
                            style={styles.textarea}
                            placeholder={this.placeholderTitle}
                            value={this.state.content}
                            onChangeText={(text) => this.changeContent(text)}
                        /> */}

                        {
                            this.state.showCommunity &&
                            <CommunityView
                                grouplist={this.state.grouplist}
                                onPress={this.selectGroupList.bind(this)}
                            />
                        }
                    </View>
                </ScrollView>
                <Footer style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10 }}>
                    {this.state.posts_remaining
                        ? <Label style={{ color: 'white', fontSize: 10 }}>
                            You have <Label style={{ fontWeight: 'bold' }}>{this.state.posts_remaining}</Label> posts left in this group
                    </Label>
                        : <Label />
                    }
                    {/* Related: GH 151 */}
                    <Label style={{ color: 'white' }}>
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
