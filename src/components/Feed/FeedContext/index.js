import React, {Component} from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { WebView, Platform, Image } from 'react-native';
import YouTube from 'react-native-youtube';
import styles from '../styles';
import { youTubeAPIKey } from 'PLEnv';

class FeedContext extends Component {
    // If a YouTube video is attached to content or if YouTube link is included in body of item
    youtubeGetID (url) {
        var ID = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
            ID = url[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
        } else {
            ID = url;
        }
        return ID;
    }

    render () {
        let {entry} = this.props;

        if (entry.type === "image") {
            // console.warn(entry.imageSrc);
            return (
                <Image
                    placeholderSource={require('img/empty_image.png')}
                    source={{ uri: entry.image + '&w=300&h=300&auto=compress,format,q=95' }}
                    style={styles.image}
                    />
            );
        } else if (entry.type === "video") {
            var url = entry.text.toString();
            var videoid = this.youtubeGetID(url);
            if (Platform.OS === 'ios') {
                return (
                    <YouTube
                        ref={(component) => {
                            this._youTubeRef = component;
                        }}
                        apiKey={youTubeAPIKey}
                        videoId={videoid}
                        controls={1}
                        style={styles.player}
                    />
                );
            } else {
                return (
                    <WebView
                        style={styles.player}
                        javaScriptEnabled
                        source={{ uri: `https://www.youtube.com/embed/${videoid}?rel=0&autoplay=0&showinfo=0&controls=0` }}
                    />
                );
            }
        } else {
            return null;
        }
    }
}

export default FeedContext;
