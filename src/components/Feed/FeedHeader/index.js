import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { TouchableHighlight, TouchableOpacity, View, Image } from 'react-native';

import { Text, Button, ActionSheet, Icon, Left, Right, Body, Thumbnail, CardItem } from 'native-base';
import TimeAgo from 'react-native-timeago';
import Menu, {
    MenuTrigger,
    MenuOptions,
    MenuOption,
    MenuProvider
} from 'react-native-popup-menu';
import { showAlertOkCancel, showAlertYesNo } from 'PLAlert';
import { showToast } from 'PLToast';

import { WINDOW_WIDTH } from 'PLConstants';
import {
    deletePost,
    deletePetition,
    boostPost,
    sharePost,
    unFollowings,
    putFollowings,
    editFollowers,
    getFollowingUser,
    subscribeNotification,
    unsubscribeNotification,
    markAsSpam,
    blockUser,
    unblockUser,
    getBlockedUsers
} from 'PLActions';
import moment from 'moment';

import styles from '../styles';

class FeedHeader extends Component {
    redirect(item, options, scene = 'itemDetail') {
        let type;
        if (item.poll) {
            type = item.type;
        } else if (item.post) {
            type = 'post';
        } else if (item.user_petition) {
            type = 'petition';
        }
        // if (scene === 'itemDetail'){
        //     Actions
        // }
        Actions[scene]({ entityType: item.type, entityId: item.id, ...options });
    }

    async subscribe(item) {
        console.log(item.type);
        this.menu && this.menu.close();
        this.props.subscribeNotification(this.props.token, item.id, item.id, item.type === 'post' ? 'post' : item.type === 'user-petition' ? 'user-petition' : 'poll');
        // console.log('action =>', action);
        // this.props.dispatch(action);
    }

    unsubscribe(item, token) {
        this.props.unsubscribeNotification(token, item.id, item.id, item.type === 'post' ? 'post' : item.type === 'user-petition' ? 'user-petition' : 'poll');
        this.menu && this.menu.close();        
    }

    edit(item) {
        this.menu && this.menu.close();
        this.redirect(item, { isEditEnabled: true });
    }

    boost(item) {
        this.props.dispatch(boostPost(item.type, item.id, item.group && item.group.id, item.id));
        this.menu && this.menu.close();
    }

    unmute(item) {
        var { token, dispatch } = this.props;

        editFollowers(token, item.user.id, false, newDate)
            .then(data => {

            })
            .catch(err => {

            });
    }

    mute(item) {
        var { token, dispatch } = this.props;
        ActionSheet.show(
            {
                options: ['1 hour', '8 hours', '24 hours', 'Cancel'],
                title: "Mute user's notifications"
            },

            buttonIndex => {
                var hours = 1;
                if (buttonIndex == 1) {
                    hours = 8;
                } else if (buttonIndex == 2) {
                    hours = 24;
                }
                if (buttonIndex === 3) return;

                var newDate = new Date((new Date()).getTime() + 1000 * 60 * 60 * hours).toISOString();
                editFollowers(token, item.user.id, false, newDate)
                    .then(data => {
                        console.warn(JSON);
                    })
                    .catch(err => {
                        console.log(err);

                    });
            }
        );
        this.menu && this.menu.close();
    }

    delete(item) {
        if (item.type === 'post') {
            this.props.deletePost(item.id, item.id);
        }
        if (item.type === 'user-petition') {
            this.props.deletePetition(item.id, item.id);
        }

        this.menu && this.menu.close();
    }

    followAuthor(item) {
        console.log('follow', item);
        this.props.dispatch(putFollowings(this.props.token, item.user.id, item.id));
        this.menu && this.menu.close();
    }

    unfollowAuthor(item) {
        this.props.dispatch(unFollowings(this.props.token, item.user.id, item.id)); 
        this.menu && this.menu.close();
    }

    notify(item, cb) {
        let isUpvoted = item.vote && item.vote.option === 'upvote';
        let isSigned = item.signature && item.signature;
        
        if (!isUpvoted && !isSigned) {
            alert(item.type === 'post' ? 'User can share only a post he has upvoted.' : 'User can share only a petition he has signed.');
            return;
        }

        sharePost(this.props.token, item.type === 'post', item.id, cb);

        this.menu && this.menu.close();
    }

    //BUG: This should be inviting the upvoters from the post. groupInvite not correct.
    inviteUpvoters(item) {
        showAlertOkCancel('Are you sure you want to invite all of the upvoters of your post to this group? You can only do this once per boosted post!', () => {
            this.redirect(item, null, 'groupInvite');
        });

        this.menu && this.menu.close();        
    }

    spam(item) {
        showAlertOkCancel('Are you sure you want to report this item? Group leaders can only remove items that have been reported by multiple users.', () => {
            markAsSpam(this.props.token, item.id, item.type);
        });
        this.menu && this.menu.close();        
    }

    onPressThumbnail(item) {
        console.log('just pressed thumbnail');
        Actions.profile({ id: item.user.id });
    }

    onPressAuthor(item) {
        console.log('just pressed author');
        if(item && item.user) {
            Actions.profile({ id: item.user.id });
        }
    }

    onPressGroup(item) {
        console.log('just pressed group', item);
        Actions.groupprofile({ id: item.group && item.group.id });
    }

    isGroupOwnerOrManager(item) {
        return (item.group && item.group.user_role === 'manager') || (item.group && item.group.user_role === 'owner');
    }

    isSubscribed(item) {
        return item.is_subscribed;
    }

    block(item){
        let {token} = this.props;
        blockUser(token, item.user.id).then(r => {
            console.log('user blocked', r);
            showToast('User blocked');
        }).catch(e => {
            console.log('blocking user failed.', e);
            showToast('Blocking user failed.');
        });
        this.menu && this.menu.close();        
    }
    _renderZoneIcon(item) {
        if (item.zone === 'prioritized') {
            return (<View style={{
                position: 'absolute',
                flex: 1,
                // width: 50,
                // height: 50,
                // backgroundColor: '#00f',
                position: 'absolute',
                zIndex: 5,
                alignSelf: 'center',
                marginLeft: 20,
                bottom: -8
            }}>
                <Icon key='priotity_zone_icon' active name='ios-flash' style={styles.zoneIcon} />
            </View>);
        } else {
            return null;
        }
    }

    render() {
        // return null;
        const { item } = this.props;
        // console.log('oneSignal', item);
        let thumbnail = '';
        let title = '';
        const isBoosted = item.zone === 'prioritized';
        const isAuthor = Number(item.user && item.user.id) === Number(this.props.userId);
        // console.log('=x=x=x=x=x=x=x=x=', item, item.user);
        const canUnfollow = item.user && item.user.follow_status === 'active';
        const canFollow = item.user && item.user.follow_status === null;
        let canInviteUpvoters = false;
        let canSpam = false;
        let canBlock = !isAuthor;
        let canSubscribe = (item.type === 'user-petition' || item.type === 'post');
        const user = item && item.user;
        const first_name = user && user.first_name;
        const last_name = user && user.last_name;
        const is_verified = user && user.is_verified;

        switch (item.type) {
        case 'post':
        case 'user-petition':
            thumbnail = item.user.avatar || '';
            title = first_name + ' ' +  last_name;//item.user ? item.user.first_name : '' + ' ' + item.user ? item.user.last_name : '';
            canInviteUpvoters = isBoosted;
            canSpam = true;
            break;
        default:
            thumbnail = item.group && item.group.avatar ? item.group.avatar : '';
            title = first_name +' ' + last_name;//item.user ? item.user.first_name : '' + ' ' + item.user ? item.user.last_name : '';
            break;
        }
        return (
            <View style={{flexDirection: 'row', paddingBottom: 0, paddingLeft:0, flex: 1, overflow: 'visible'}}>
                {this._renderZoneIcon(item)}
                <Left style={{flexDirection: 'row', backgroundColor: '#fff', padding: 0, backgroundColor:'#fff', overflow: 'visible',}}>
                    <TouchableOpacity style={{backgroundColor: '#fff', overflow: 'visible',}} onPress={() => this.onPressThumbnail(item)} underlayColor={'#fff'}>
                        <View style={{overflow: 'visible',}}>
                            {
                                <View style={{overflow: 'visible',backgroundColor:'#fff', alignItems: 'center', overflow: 'visible', justifyContent: 'center', width: 50, height: 50, backgroundColor: '#fff'}}>
                                    {!is_verified && (item.type === 'post' || item.type === 'user-petition') &&
                                    <Image
                                        style={{width: 60, height: 60}}
                                        resizeMode='cover'
                                        source={require("img/outline_8.png")}
                                            />}
                                    <Thumbnail small
                                        defaultSource={require("img/blank_person.png")}
                                        style={{position: 'absolute', alignSelf: 'center'}}
                                        source={thumbnail ? { uri: thumbnail + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")}
                                    />
                                </View>
                                }
                        </View>
                    </TouchableOpacity>
                    <Body style={{alignItems: 'flex-start', marginLeft: 12}}>
                        <Text style={styles.title} onPress={() => this.onPressAuthor(item)}>{title}</Text>
                        <Text adjustsFontSizeToFit numberOfLines={1} note style={styles.subtitle} onPress={() => this.onPressGroup(item)}>{item.group && item.group.official_name}{` • `}
                            {
                                moment(item.created_at).fromNow().replace(' minutes', ' m').replace('a minute', '1 m').replace('a few seconds', '5 s').replace(' seconds', 's').replace(' ago', '')
                            }
                        </Text>
                    </Body>
                    <Right style={{ flex: 0.15, backgroundColor: '#fff', paddingVertical: 4, height: '100%', margin: 0, padding: 0}}>
                        <MenuProvider>
                            <Menu style={{ width: '100%'}} ref={(ref) => { this.menu = ref; }}>
                                <MenuTrigger style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon name='md-more' style={styles.dropDownIcon} />
                                </MenuTrigger>
                                <MenuOptions customStyles={optionsStyles}>
                                    {
                                        canSubscribe && (
                                        !this.props.item.is_subscribed
                                        ?
                                            <MenuOption onSelect={() => this.subscribe(item)}>
                                                <Button iconLeft transparent dark onPress={() => this.subscribe(item)}>
                                                    <Icon name='md-notifications' style={styles.menuIcon} />
                                                    <Text style={styles.menuText}>Subscribe to Notifications</Text>
                                                </Button>
                                            </MenuOption>
                                        :
                                            <MenuOption onSelect={() => this.unsubscribe(item, this.props.token)}>
                                                <Button iconLeft transparent dark onPress={() => this.unsubscribe(item, this.props.token)}>
                                                    <Icon name='md-notifications-off' style={styles.menuIcon} />
                                                    <Text style={styles.menuText}>Unsubscribe to Notifications</Text>
                                                </Button>
                                            </MenuOption>
                                        )

                                    }
                                    {
                                        !isAuthor && canUnfollow &&
                                        <MenuOption onSelect={() => this.mute(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.mute(item)}>
                                                <Icon name='md-volume-off' style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Mute Notifications from this User</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        (item.type === 'post' || item.type === 'user-petition') && <MenuOption onSelect={() => this.notify(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.notify(item)}>
                                                <Icon name='md-share' style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Share this post directly to followers</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        canInviteUpvoters &&
                                        <MenuOption onSelect={() => this.inviteUpvoters(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.inviteUpvoters(item)}>
                                                <Image source={require("img/invite_upvoters.png")} style={[styles.upvotersIcon]} />
                                                <Text style={styles.menuText}>Invite Upvoters to a Group</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        !isAuthor && canFollow &&
                                        <MenuOption onSelect={() => this.followAuthor(this.props.item)}>
                                            <Button iconLeft transparent dark onPress={() => this.followAuthor(this.props.item)}>
                                                <View style={styles.buttonContainer}>
                                                    <Icon name='ios-person' style={styles.activeIconLarge} />
                                                    <Icon name='ios-add-circle-outline' style={styles.activeIconSmall} />
                                                </View>
                                                <Text style={styles.menuText}>Follow this person</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        canUnfollow &&
                                        <MenuOption onSelect={() => this.unfollowAuthor(this.props.item)}>
                                            <Button iconLeft transparent dark onPress={() => this.unfollowAuthor(this.props.item)}>
                                                <View style={styles.buttonContainer}>
                                                    <Icon name='ios-person' style={styles.activeIconLarge} />
                                                    <Icon name='ios-remove-circle-outline' style={styles.activeIconSmall} />
                                                </View>
                                                <Text style={styles.menuText}>Unfollow this person</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        this.isGroupOwnerOrManager(item) && !isBoosted &&
                                        <MenuOption onSelect={() => this.boost(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.boost(item)}>
                                                <Icon name='md-flash' style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Boost Post</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        isAuthor && !isBoosted &&
                                        <MenuOption onSelect={() => this.edit(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.edit(item)}>
                                                <Icon name='md-create' style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Edit Post</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        isAuthor && !isBoosted &&
                                        <MenuOption onSelect={() => this.delete(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.delete(item)}>
                                                <Icon name='md-trash' style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Delete Post</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        canSpam &&
                                        <MenuOption onSelect={() => this.spam(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.spam(item)}>
                                                <Image source={require("img/spam.png")} style={styles.upvotersIcon} />
                                                <Text style={styles.menuText}>Report As Spam</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                    {
                                        !isAuthor && <MenuOption onSelect={() => this.block(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.block(item)}>
                                                <Icon name='ios-close-circle-outline' style={styles.menuIcon} />
                                                {/* <Image source={require("img/spam.png")} style={styles.upvotersIcon} /> */}
                                                <Text style={styles.menuText}>Block User</Text>
                                            </Button>
                                        </MenuOption>
                                    }
                                </MenuOptions>
                            </Menu>
                        </MenuProvider>
                    </Right>
                </Left>
            </View>
        );
    }
}

const optionsStyles = {
    optionsContainer: {
        backgroundColor: '#55c5ff',
        paddingLeft: 5,
        width: WINDOW_WIDTH
    }
};

const mapStateToProps = (state) => ({
    blokedUsers: state.user.blockedList,
    userId: (state.user.profile || {id: null}).id,
    token: state.user.token,
    is_verified: state.user.profile.is_verified
});

export default connect(mapStateToProps, {subscribeNotification, unsubscribeNotification, deletePost, deletePetition})(FeedHeader);
