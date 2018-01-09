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
} from 'PLActions';

import styles from '../styles';

class FeedHeader extends Component {
    redirect(item, options, scene = 'itemDetail') {
        let type;
        if (item.poll) {
            type = item.entity.type;
        } else if (item.post) {
            type = 'post';
        } else if (item.user_petition) {
            type = 'petition';
        }
        // if (scene === 'itemDetail'){
        //     Actions
        // }
        Actions[scene]({ entityType: type, entityId: item.entity.id, ...options });
    }

    subscribe(item) {
        console.log(item.entity.type);
        this.props.dispatch(subscribeNotification(this.props.token, item.entity.id, item.id, item.entity.type));
        this.menu && this.menu.close();
    }

    unsubscribe(item) {
        this.props.dispatch(unsubscribeNotification(this.props.token, item.entity.id, item.id, item.entity.type));
        this.menu && this.menu.close();        
    }

    edit(item) {
        this.menu && this.menu.close();
        this.redirect(item, { isEditEnabled: true });
    }

    boost(item) {
        this.props.dispatch(boostPost(item.entity.type, item.entity.id, item.group.id, item.id));
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
                options: ['1 hour', '8 hours', '24 hours'],
                title: 'MUTE NOTIFICATIONS FOR THIS USER'
            },

            buttonIndex => {
                var hours = 1;
                if (buttonIndex == 1) {
                    hours = 8;
                } else if (buttonIndex == 2) {
                    hours = 24;
                }

                var newDate = new Date((new Date()).getTime() + 1000 * 60 * 60 * hours);
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
        if (item.entity.type === 'post') {
            this.props.dispatch(deletePost(item.entity.id, item.id));
        }
        if (item.entity.type === 'user-petition') {
            this.props.dispatch(deletePetition(item.entity.id, item.id));
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
            let type = item.entity.type;
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

        sharePost(this.props.token, item.type === 'post', item.entity.id, cb);

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
            this.props.dispatch(markAsSpam(this.props.token, item.entity.id, item.entity.type));
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
        Actions.groupprofile({ id: item.group.id });
    }

    isGroupOwnerOrManager(item) {
        return item.group.user_role === 'manager' || item.group.user_role === 'owner';
    }

    isSubscribed(item) {
        let type = item.entity.type;
        if (type === 'user-petition') {
            type = 'user_petition';
        }
        if (item[type] !== undefined) {
            return item[type].is_subscribed;
        }

        return false;
    }

    render() {
        const { item } = this.props;
        let thumbnail = '';
        let title = '';
        const isBoosted = item.zone === 'prioritized';
        const isAuthor = item.user.id === this.props.userId;
        const canUnfollow = item.user.follow_status === 'active';
        const canFollow = item.user.follow_status === null;
        let canInviteUpvoters = false;
        let canSpam = false;

        // console.log(this.props, isAuthor, item.user.id, this.props.userId, item.user.id === this.props.userId);

        switch (item.entity.type) {
        case 'post':
        case 'user-petition':
            thumbnail = item.owner.avatar_file_path ? item.owner.avatar_file_path : '';
            title = item.user.full_name;//item.owner ? item.owner.first_name : '' + ' ' + item.owner ? item.owner.last_name : '';
            canInviteUpvoters = isBoosted;
            canSpam = true;
            break;
        default:
            thumbnail = item.group.avatar_file_path ? item.group.avatar_file_path : '';
            title = item.user.full_name;
            break;
        }
//Header
        return (
            <CardItem style={{ paddingBottom: 0, paddingLeft:5}}>
                <Left>
                    <TouchableHighlight onPress={() => this.onPressThumbnail(item)} underlayColor={'#fff'}>
                        <View>
                            <Thumbnail small
                                source={thumbnail ? { uri: thumbnail + '&w=150&h=150&auto=compress,format,q=95' } : require("img/blank_person.png")}
                                defaultSource={require("img/blank_person.png")}
                            />
                        </View>
                    </TouchableHighlight>
                    <Body>
                        <Text style={styles.title} onPress={() => this.onPressAuthor(item)}>{title}</Text>
                        <Text note style={styles.subtitle} onPress={() => this.onPressGroup(item)}>{item.group.official_name} • <TimeAgo time={item.sent_at} hideAgo /></Text>
                    </Body>
                    <Right style={{ flex: 0.08 }}>
                        <Menu style={{ width: '100%'}} ref={(ref) => { this.menu = ref; }}>
                            <MenuTrigger>
                                <Icon name='md-more' style={styles.dropDownIcon} />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                {
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
                            </MenuOptions>
                        </Menu>
                    </Right>
                </Left>
            </CardItem>
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

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(FeedHeader);
