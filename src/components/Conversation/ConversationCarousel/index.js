import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from '../styles';
import {CardItem} from 'native-base';
import ConversasionContext from '../ConversasionContext';

class ConversasionCarousel extends Component {
    _renderContext (entry) {
        return <ConversasionContext entry={entry} />;
    }

    render () {
        // If an item has multiple attachments (leader content) it could be multiple videos or pictures, displayed as carousel, three items max

        let {item} = this.props;

        if (item.poll) {
            const slides = item.poll.educational_context.map((entry, index) => {
                return (
                    <TouchableOpacity
                        key={`entry-${index}`}
                        activeOpacity={0.7}
                        style={styles.slideInnerContainer}
                    >
                        <View style={[styles.imageContainer, (index + 1) % 2 === 0 ? styles.imageContainerEven : {}]}>
                            {this._renderContext(entry)}
                            <View style={[styles.radiusMask, (index + 1) % 2 === 0 ? styles.radiusMaskEven : {}]} />
                        </View>
                    </TouchableOpacity>
                );
            });

            return (
                <CardItem cardBody>
                    <Carousel
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        enableMomentum
                        autoplay={false}
                        autoplayDelay={500}
                        autoplayInterval={2500}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContainer}
                        showsHorizontalScrollIndicator={false}
                        snapOnAndroid
                        removeClippedSubviews={false}
                    >
                        {slides}
                    </Carousel>
                </CardItem>
            );
        } else {
            return null;
        }
    }
}
export default ConversasionCarousel;
