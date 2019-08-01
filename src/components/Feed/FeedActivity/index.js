import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, PanResponder, AlertIOS } from 'react-native';
import { Card } from 'native-base';

import { showToast } from '../../../utils/toast';

import FeedDescription from '../FeedDescription';
import FeedHeader from '../FeedHeader';
import FeedMetaData from '../FeedMetaData';
import FeedFooter from '../FeedFooter';
import FeedCarousel from '../FeedCarousel';
import FeedCommentPreview from '../FeedCommentPreview';

import styles from '../styles';
import {CardItem} from 'native-base';

class FeedActivity extends Component {

    onSwipeRight(item, gestureState) {
        if (item.type === 'post' && item.zone !== 'expired') {
            this.footer.vote(item, 'upvote');
        }

        if (item.type === 'user-petition') {
            let isSigned = false;
            if (
                item && item.user_petition &&
                item.user_petition.signatures && item.user_petition.signatures[0]
            ) {
                let vote = item.user_petition.signatures[0];
                if (vote.option_id === 1) {
                    isSigned = true;
                }
            }
            this.footer.sign(item, isSigned, () => showToast('Signed'));
        }
    }

    onLongPress(item, gestureState) {
        this.header.notify(item, () => showToast('Shared'));
    }

    _renderPostOrPetition(item) {
        // console.log(this.props.profile);
        return (
        [<Card key='mainCard' style={styles.container}>
            <FeedHeader 
                ref={ref => { this.header = ref; }}
                item={item}
                token={this.props.token}
                userId={this.props.profile && this.props.profile.id} 
                   />
            <FeedDescription item={item} profile={this.props.profile} />
            <FeedMetaData item={item} />
            <View style={styles.borderContainer} />
            <FeedFooter ref={ref => { this.footer = ref; }} item={item} profile={this.props.profile} token={this.props.token} showAnalytics={this.props.showAnalytics} />
        </Card>,
            <FeedCommentPreview key='commentPreview' item={item} />
        ]
        );
    }

    _renderGroupCard(item) {
        // console.log('Feed activity render group card', item);
        return (
            
        [<Card key='mainCard' style={styles.container}>
            <FeedHeader item={item} token={this.props.token} />
            <FeedDescription item={item} profile={this.props.profile} />
            <FeedCarousel item={item} />
            <View style={styles.borderContainer} />
            <FeedFooter item={item} profile={this.props.profile} token={this.props.token} showAnalytics={this.props.showAnalytics} />
        </Card>,
            <FeedCommentPreview key='commentPreview' item={item} />]
        );
    }

    render() {
        // return <View style={{margin: 20, padding: 8, backgroundColor: '#f0f'}} />;
        let { item, displayCommentPreview } = this.props;
        if (!item.user) return null;
        switch (item.type) {
        case 'post':
        case 'user-petition':
            return this._renderPostOrPetition(item, displayCommentPreview);
        default:
            // return null;
            return this._renderGroupCard(item, displayCommentPreview);
        }
    }
}

export default FeedActivity;
