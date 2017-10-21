import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {TouchableHighlight, View} from 'react-native';

import { Text, Button, Icon, Left, Right, Body, Thumbnail, CardItem } from 'native-base';
// import TimeAgo from 'react-native-timeago';
import Menu, {
    MenuTrigger,
    MenuOptions,
    MenuOption
} from 'react-native-popup-menu';

import { WINDOW_WIDTH } from 'PLConstants';
import { deletePost, deletePetition } from 'PLActions';

import styles from '../styles';

class FeedHeader extends Component {
    edit (item) {
        Actions.itemDetail({
            entityId: item.entity.id,
            entityType: item.entity.type,
            isEditEnabled: true
        });
        this.menu && this.menu.close();
    }

    delete (item) {
        if (item.entity.type === 'post') {
            this.props.dispatch(deletePost(item.entity.id, item.id));
        }
        if (item.entity.type === 'user-petition') {
            this.props.dispatch(deletePetition(item.entity.id, item.id));
        }

        this.menu && this.menu.close();
    }

    onPressThumbnail (item) {
        console.log('just pressed thumbnail');
        Actions.profile({id: item.owner.id});
    }

    onPressAuthor (item) {
        console.log('just pressed author');
        Actions.profile({id: item.owner.id});
    }

    onPressGroup (item) {
        console.log('just pressed group', item);
        Actions.groupprofile({id: item.group.id});
    }

    render () {
        let thumbnail = '';
        let title = '';
        let isBoosted = false;
        const isOwner = this.props.item.owner.id === this.props.userId;

        switch (this.props.item.entity.type) {
        case 'post' || 'user-petition':
            thumbnail = this.props.item.owner.avatar_file_path ? this.props.item.owner.avatar_file_path : '';
            title = this.props.item.owner ? this.props.item.owner.first_name : '' + ' ' + this.props.item.owner ? this.props.item.owner.last_name : '';
            break;
        default:
            thumbnail = this.props.item.group.avatar_file_path ? this.props.item.group.avatar_file_path : '';
            title = this.props.item.user.full_name;
            break;
        }
        return (
            <CardItem style={{ paddingBottom: 0 }}>
                <Left>
                    <TouchableHighlight onPress={() => this.onPressThumbnail(this.props.item)} underlayColor={'#fff'}>
                        <View>
                            <Thumbnail small
                                source={thumbnail ? { uri: thumbnail + '&w=50&h=50&auto=compress,format,q=95' } : require("img/blank_person.png")}
                                defaultSource={require("img/blank_person.png")}
                            />
                        </View>
                    </TouchableHighlight>
                    <Body>
                        <Text style={styles.title} onPress={() => this.onPressAuthor(this.props.item)} >{title}</Text>
                        <Text note style={styles.subtitle} onPress={() => this.onPressGroup(this.props.item)} >{this.props.item.group.official_name} • {/*<TimeAgo time={this.props.item.sent_at} hideAgo />*/}</Text>
                    </Body>
                    <Right style={{ flex: 0.2 }}>
                        <Menu ref={(ref) => { this.menu = ref; }}>
                            <MenuTrigger>
                                <Icon name='ios-arrow-down' style={styles.dropDownIcon} />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption>
                                    <Button iconLeft transparent dark>
                                        <Icon name='logo-rss' style={styles.menuIcon} />
                                        <Text style={styles.menuText}>Subscribe to this Post</Text>
                                    </Button>
                                </MenuOption>
                                <MenuOption>
                                    <Button iconLeft transparent dark>
                                        <Icon name='ios-heart' style={styles.menuIcon} />
                                        <Text style={styles.menuText}>Add to Favorites</Text>
                                    </Button>
                                </MenuOption>
                                <MenuOption>
                                    <Button iconLeft transparent dark>
                                        <Icon name='md-person-add' style={styles.menuIcon} />
                                        <Text style={styles.menuText}>Add to Contact</Text>
                                    </Button>
                                </MenuOption>
                                {
                                    isOwner && !isBoosted &&
                                    <MenuOption onSelect={() => this.edit(this.props.item)}>
                                        <Button iconLeft transparent dark onPress={() => this.edit(this.props.item)}>
                                            <Icon name='md-create' style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Edit Post</Text>
                                        </Button>
                                    </MenuOption>
                                }
                                {
                                    isOwner &&
                                    <MenuOption onSelect={() => this.delete(this.props.item)}>
                                        <Button iconLeft transparent dark onPress={() => this.delete(this.props.item)}>
                                            <Icon name='md-trash' style={styles.menuIcon} />
                                            <Text style={styles.menuText}>Delete Post</Text>
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
        backgroundColor: '#fafafa',
        paddingLeft: 5,
        width: WINDOW_WIDTH
    }
};

export default connect(state => ({
    userId: state.user.id
}))(FeedHeader);
