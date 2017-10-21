import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {CardItem, Left, Body, Thumbnail} from 'native-base';

import {Actions} from 'react-native-router-flux';
import styles from '../styles';

const limit = 50;

class FeedCommentPreview extends Component {
    limitString (text) {
        if (text.length > limit) {
            text = text.slice(0, limit) + '...';
        }

        return text;
    }

    redirect (item, options) {
        let type;
        if (item.poll) {
            type = 'poll';
        } else if (item.post) {
            type = 'post';
        } else if (item.petition) {
            type = 'petition';
        }
        Actions.itemDetail({entityType: type, entityId: item.entity.id, ...options});
    }

    render () {
        let {item} = this.props;
        let previewData = null;
        // console.log(item);
        if (item.entity.type === 'question') {
            console.log(item);
        }
        if (item.poll) {
            previewData = item.poll;
        } else if (item.post) {
            previewData = item.post;
        } else if (item.user_petition) {
            previewData = item.user_petition;
        }
        let comment = previewData.comments[0];
        if (!comment) { return <View />; }
        return (
            <TouchableOpacity onPress={() => this.redirect(item)} >
                <CardItem style={styles.commentPreviewContainer} >
                    <Left>
                        <View>
                            <Thumbnail small
                                source={comment.author_picture ? { uri: comment.author_picture + '&w=50&h=50&auto=compress,format,q=95' } : require("img/blank_person.png")}
                                defaultSource={require("img/blank_person.png")}
                            />
                        </View>
                        <Body>
                            <Text style={styles.title} >{comment.user.full_name}</Text>
                            <Text>{this.limitString(comment.comment_body)}</Text>
                        </Body>
                    </Left>
                </CardItem>
            </TouchableOpacity>
        );
    }
}

export default FeedCommentPreview;
