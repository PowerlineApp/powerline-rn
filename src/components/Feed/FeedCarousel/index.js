import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from '../styles';
import {CardItem} from 'native-base';
import FeedContext from '../FeedContext';

class FeedCarousel extends Component {

    _renderContext (entry) {
        return <FeedContext entry={entry} />;
    }
    _renderItem ({item, index}) {
        return (
            <TouchableOpacity
                key={`entry-${index}`}
                activeOpacity={0.7}
                style={styles.slideInnerContainer}
            >
                <View style={[styles.imageContainer, (index + 1) % 2 === 0 ? styles.imageContainerEven : {}]}>
                    <FeedContext entry={item} />
                    <View style={[styles.radiusMask, (index + 1) % 2 === 0 ? styles.radiusMaskEven : {}]} />
                </View>
            </TouchableOpacity>
        );   
    }

    render () {
        // If an item has multiple attachments (leader content) it could be multiple videos or pictures, displayed as carousel, three items max

        let {item} = this.props;

        if (item.poll) {
            // const slides = item.poll.educational_context.map((entry, index) => {
            //     return (
            //         <TouchableOpacity
            //             key={`entry-${index}`}
            //             activeOpacity={0.7}
            //             style={styles.slideInnerContainer}
            //         >
            //             <View style={[styles.imageContainer, (index + 1) % 2 === 0 ? styles.imageContainerEven : {}]}>
            //                 {this._renderContext(entry)}
            //                 <View style={[styles.radiusMask, (index + 1) % 2 === 0 ? styles.radiusMaskEven : {}]} />
            //             </View>
            //         </TouchableOpacity>
            //     );
            // });
            if (item.poll.educational_context.length < 1){ return null;}
            // return null;
            // console.log('=>', slides);
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
                        data={item.poll.educational_context}
                        renderItem={this._renderItem}
                    />
                </CardItem>
            );
        } else {
            return null;
        }
    }
}
export default FeedCarousel;
