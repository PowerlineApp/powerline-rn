import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, PanResponder, AlertIOS } from 'react-native';
import { Card } from 'native-base';

import { showToast } from 'PLToast';

import GestureCard, { directions } from '../../GestureCard';
import FeedDescription from '../FeedDescription';
import FeedHeader from '../FeedHeader';
import FeedMetaData from '../FeedMetaData';
import FeedFooter from '../FeedFooter';
import FeedCarousel from '../FeedCarousel';
import FeedCommentPreview from '../FeedCommentPreview';

import styles from '../styles';

class FeedActivity extends Component {
    onSwipeRight(item, gestureState) {
        if (item.entity.type === 'post' && item.zone !== 'expired') {
            this.footer.vote(item, 'upvote');
        }

        if (item.entity.type === 'user-petition') {
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
        return (
            <GestureCard
                onSwipeRight={(state) => this.onSwipeRight(item, state)}
                onLongPress={(state) => this.onLongPress(item, state)}
                config={{
                    velocityThreshold: 0.3,
                    directionalOffsetThreshold: 80,
                    longPressDelay: 2000
                }}
            >
                <FeedHeader ref={ref => { this.header = ref; }} item={item} token={this.props.token} userId={this.props.profile.id} />
                <FeedDescription item={item} profile={this.props.profile} />
                <FeedMetaData item={item} />
                <View style={styles.borderContainer} />
                <FeedFooter ref={ref => { this.footer = ref; }} item={item} profile={this.props.profile} token={this.props.token} showAnalytics={this.props.showAnalytics} />
                <FeedCommentPreview item={item} />
            </GestureCard>
        );
    }

    _renderGroupCard(item) {
        return (
            <Card>
                <FeedHeader item={item} token={this.props.token} />
                <FeedDescription item={item} profile={this.props.profile} />
                <FeedCarousel item={item} />
                <View style={styles.borderContainer} />
                <FeedFooter item={item} profile={this.props.profile} token={this.props.token} showAnalytics={this.props.showAnalytics} />
                <FeedCommentPreview item={item} />
            </Card>
        );
    }

    render() {
        let { item, displayCommentPreview } = this.props;

        switch (item.entity.type) {
            case 'post':
            case 'user-petition':
                return this._renderPostOrPetition(item, displayCommentPreview);
            default:
                return this._renderGroupCard(item, displayCommentPreview);
        }
    }
}

export default FeedActivity;
