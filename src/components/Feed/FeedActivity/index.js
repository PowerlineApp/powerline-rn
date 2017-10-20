import React, {Component} from 'react';
import {View} from 'react-native';
import styles from '../styles';
import {Card} from 'native-base';

import FeedDescription from '../FeedDescription';
import FeedHeader from '../FeedHeader';
import FeedMetaData from '../FeedMetaData';
import FeedFooter from '../FeedFooter';
import FeedCarousel from '../FeedCarousel';

class FeedActivity extends Component {
    _renderPostOrUserPetitionCard (item) {
        return (
            <Card>
                <FeedHeader item={item} />
                <FeedDescription item={item} />
                <FeedMetaData item={item} />
                <View style={styles.borderContainer} />
                <FeedFooter item={item} profile={this.props.profile} token={this.props.token} />
            </Card>
        );
    }

    _renderGroupCard (item) {
        return (
            <Card>
                <FeedHeader item={item} />
                <FeedDescription item={item} />
                <FeedCarousel item={item} />
                <View style={styles.borderContainer} />
                <FeedFooter item={item} profile={this.props.profile} token={this.props.token} />
            </Card>
        );
    }

    render () {
        let {item} = this.props;

        switch (item.entity.type) {
        case 'post':
        case 'user-petition':
            return this._renderPostOrUserPetitionCard(item);
        default:
            return this._renderGroupCard(item);
        }
    }
}

export default FeedActivity;
