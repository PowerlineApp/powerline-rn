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
        let type = item.entity.type;
        if (item.post) {
            type = 'post';
        } else if (item.user_petition) {
            type = 'user-petition';
        }
        Actions.itemDetail({entityType: type, entityId: item.entity.id, ...options});
    }

    render () {
        let {item} = this.props;
        let previewData = null;
        // console.log(item);

        if (item.poll) {
            previewData = item.poll;
        } else if (item.post) {
            previewData = item.post;
        } else if (item.user_petition) {
            previewData = item.user_petition;
        }
        let comment = previewData.comments[0];
        if (!comment) { return  null; }
        // console.log('comment preview:', comment.user.full_name,' - ', comment.comment_body,' - ', item.title, item.description)
        return (
            <TouchableOpacity onPress={() => this.redirect(item)} >
                <CardItem style={styles.commentPreviewContainer} >
                    <Left>
                        <View>
                            <Thumbnail small
                                source={comment.author_picture ? { uri: comment.author_picture + '&w=75&h=75&auto=compress,format,q=95' } : require("img/blank_person.png")}
                                defaultSource={require("img/blank_person.png")}
                            />
                        </View>
                        <Body>
                            <Text style={styles.commentTitle} >{comment.user.full_name}</Text>
                            <Text style={styles.commentPreviewText} >{this.limitString(comment.comment_body)}</Text>
                        </Body>
                    </Left>
                </CardItem>
            </TouchableOpacity>
        );
    }
}

export default FeedCommentPreview;
