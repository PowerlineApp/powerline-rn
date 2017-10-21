import React, {Component} from 'react';
import {View} from 'react-native';
import styles from '../styles';
import {Card} from 'native-base';

import ConversasionDescription from '../ConversasionDescription';
import ConversasionHeader from '../ConversasionHeader';
import ConversasionMetaData from '../ConversasionMetaData';
import ConversasionFooter from '../ConversasionFooter';
import ConversasionCarousel from '../ConversasionCarousel';

class ConversasionActivity extends Component {
    _renderPostOrUserPetitionCard (item) {
        return (
            <Card>
                <ConversasionHeader item={item} />
                <ConversasionDescription item={item} />
                <ConversasionMetaData item={item} />
                <View style={styles.borderContainer} />
                <ConversasionFooter item={item} profile={this.props.profile} token={this.props.token} />
            </Card>
        );
    }

    _renderGroupCard (item) {
        return (
            <Card>
                <ConversasionDescription item={item} />
                <ConversasionCarousel item={item} />
                <View style={styles.borderContainer} />
                <ConversasionFooter item={item} profile={this.props.profile} token={this.props.token} />
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

export default ConversasionActivity;
