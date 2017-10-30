import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Left, Text, Body, CardItem, View} from 'native-base';
import ImageLoad from 'react-native-image-placeholder';
import styles from '../styles';

class FeedMetaData extends Component {
    render () {
        let {item} = this.props;
        // console.log('================ metadata', item);
        // This isn't working currently. It is designed to give user preview of any embedded URL in the item.
        // GH13
        if (item.metadata && item.metadata.image) {
            return (
                <CardItem>
                    <Left>
                        <View style={styles.descLeftContainer} />
                        <Body>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.metaContainer}
                                onPress={() => { }}>
                                <View style={styles.imageContainer}>
                                    <ImageLoad
                                        placeholderSource={require('img/empty_image.png')}
                                        source={{ uri: item.metadata.image + '&w=400&h=400&auto=compress,format,q=95' }}
                                        style={styles.image}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.title} numberOfLines={2}>{item.metadata.title}</Text>
                                    <Text style={styles.description} numberOfLines={2}>{item.metadata.description}</Text>
                                </View>
                            </TouchableOpacity>
                        </Body>
                    </Left>
                </CardItem>
            );
        } else {
            return null;
        }
    }
}

export default FeedMetaData;
