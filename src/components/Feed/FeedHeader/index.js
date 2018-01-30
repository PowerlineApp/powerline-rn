import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { TouchableHighlight, View, Image } from 'react-native';

import { Text, Button, ActionSheet, Icon, Left, Right, Body, Thumbnail, CardItem } from 'native-base';
import TimeAgo from 'react-native-timeago';
import Menu, {
    MenuTrigger,
    MenuOptions,
    MenuOption
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

    subscribe(item) {
        console.log(item.type);
        this.props.dispatch(subscribeNotification(this.props.token, item.id, item.id, item.type === 'post' ? 'post' : item.type === 'user-petition' ? 'user-petition' : 'poll'));
        this.menu && this.menu.close();
    }

    unsubscribe(item) {
        this.props.dispatch(unsubscribeNotification(this.props.token, item.id, item.id, item.type === 'post' ? 'post' : item.type === 'user-petition' ? 'user-petition' : 'poll'));
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

        editFollowers(token, item.owner.id, false, newDate)
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
                editFollowers(token, item.owner.id, false, newDate)
                    .then(data => {
                        console.warn(JSON);
                    })
                    .catch(err => {

                    });
            }
        );
        this.menu && this.menu.close();
    }

    delete(item) {
        if (item.type === 'post') {
            this.props.dispatch(deletePost(item.id, item.id));
        }
        if (item.type === 'user-petition') {
            this.props.dispatch(deletePetition(item.id, item.id));
        }

        this.menu && this.menu.close();
    }

    followAuthor(item) {
        console.log('follow', item);
        this.props.dispatch(putFollowings(this.props.token, item.owner.id, item.id));
        this.menu && this.menu.close();
    }

    unfollowAuthor(item) {
        this.props.dispatch(unFollowings(this.props.token, item.owner.id, item.id)); 
        this.menu && this.menu.close();
    }

    notify(item, cb) {
        let isUpvoted = false;
        console.log('notify => ', item);
        if (item.upvotes_count > 0 || item.responses_count > 0) {
            let type = item.type;
            if (type === 'user-petition') {
                type = 'user_petition';
            }

            let option = 'votes';
            let id = 'option';
            if (item.poll) {
                option = 'answers';
            }

            if (item.user_petition) {
                option = 'signatures';
                id = 'option_id';
            }

            if (
                item[type] &&
                item[type][option] &&
                item[type][option].length > 0 &&
                item[type][option][0][id] === 1
            ) {
                isUpvoted = true;
            }
            
        }
        
        if (!isUpvoted) {
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
            this.props.dispatch(markAsSpam(this.props.token, item.id, item.type));
        });
        this.menu && this.menu.close();        
    }

    onPressThumbnail(item) {
        console.log('just pressed thumbnail');
        Actions.profile({ id: item.owner.id });
    }

    onPressAuthor(item) {
        console.log('just pressed author');
        Actions.profile({ id: item.user.id });
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
        blockUser(token, item.owner.id).then(r => {
            console.log('user blocked', r);
            showToast('User blocked');
        }).catch(e => {
            console.log('blocking user failed.', e);
            showToast('Blocking user failed.');
        });
    }

    render() {
        const { item } = this.props;
        let thumbnail = '';
        let title = '';
        const isBoosted = item.zone === 'prioritized';
        const isAuthor = Number(item.user && item.user.id) === Number(this.props.userId);
        const canUnfollow = item.user.follow_status === 'active';
        const canFollow = item.user.follow_status === null;
        let canInviteUpvoters = false;
        let canSpam = false;
        let canBlock = !isAuthor;
        let canSubscribe = item.type === 'user-petition' || item.type === 'post';
        // console.log(this.props, isAuthor, item.user.id, this.props.userId, item.user.id === this.props.userId);
        console.log('=============================');
        console.log('item.user', item, item.user && item.user.id, this.props.userId);//, item.owner, item.id);
        console.log('=============================');
        switch (item.type) {
        case 'post':
        case 'user-petition':
            thumbnail = item.user.avatar || '';
            title = item.user.first_name + ' ' +  item.user.last_name;//item.owner ? item.owner.first_name : '' + ' ' + item.owner ? item.owner.last_name : '';
            canInviteUpvoters = isBoosted;
            canSpam = true;
            break;
        default:
            thumbnail = item.group && item.group.avatar ? item.group.avatar : '';
            title = item.user.first_name +' ' +item.user.last_name;//item.owner ? item.owner.first_name : '' + ' ' + item.owner ? item.owner.last_name : '';
            break;
        }
//Header
        return (
            <View style={{flexDirection: 'row', paddingBottom: 0, paddingLeft:5, flex: 1}}>
                <Left style={{flexDirection: 'row', backgroundColor: '#fff', padding: 0}}>
                    <TouchableHighlight onPress={() => this.onPressThumbnail(item)} underlayColor={'#fff'}>
                        <View>
                            <Thumbnail small
                                source={thumbnail ? { uri: thumbnail + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")}
                                defaultSource={require("img/blank_person.png")}
                            />
                        </View>
                    </TouchableHighlight>
                    <Body style={{alignItems: 'flex-start', marginLeft: 16}}>
                        <Text style={styles.title} onPress={() => this.onPressAuthor(item)}>{title}</Text>
                        <Text note style={styles.subtitle} onPress={() => this.onPressGroup(item)}>{item.group && item.group.official_name} • <TimeAgo time={item.created_at} hideAgo /></Text>
                    </Body>
                    <Right style={{ flex: 0.15, backgroundColor: '#fff', paddingVertical: 4, height: '100%', margin: 0, padding: 0}}>
                        <Menu style={{ width: '100%'}} ref={(ref) => { this.menu = ref; }}>
                            <MenuTrigger style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name='md-more' style={styles.dropDownIcon} />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                {
                                    canSubscribe && (

                                    !this.isSubscribed(item)
                                    ?
                                        <MenuOption onSelect={() => this.subscribe(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.subscribe(item)}>
                                                <Icon name='md-notifications' style={styles.menuIcon} />
                                                <Text style={styles.menuText}>Subscribe to Notifications</Text>
                                            </Button>
                                        </MenuOption>
                                    :
                                        <MenuOption onSelect={() => this.unsubscribe(item)}>
                                            <Button iconLeft transparent dark onPress={() => this.unsubscribe(item)}>
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
                                <MenuOption onSelect={() => this.notify(item)}>
                                    <Button iconLeft transparent dark onPress={() => this.notify(item)}>
                                        <Icon name='md-share' style={styles.menuIcon} />
                                        <Text style={styles.menuText}>Share this post directly to followers</Text>
                                    </Button>
                                </MenuOption>
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
                                    canFollow &&
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
    userId: state.user.profile.id,
});

export default connect(mapStateToProps)(FeedHeader);
