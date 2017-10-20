//I am not sure why this is here. This should not be re-written. The Friends Feed should reference the main newsfeed and provide different parameters to API request
// See: https://api-dev.powerli.ne/api-doc#get--api-v2-activities followed and non-followed
// GH51

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, ListItem, Thumbnail, List, Card, CardItem, Label } from 'native-base';
import { ListView, View, RefreshControl, TouchableOpacity, Image, WebView, Platform, Share } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { loadActivities, resetActivities, editFollowers, loadActivityByEntityId } from 'PLActions';
import styles, { sliderWidth, itemWidth } from './styles';
import TimeAgo from 'react-native-timeago';
import ImageLoad from 'react-native-image-placeholder';
import YouTube from 'react-native-youtube';
import PLOverlayLoader from 'PLOverlayLoader';
import PLLoader from 'PLLoader';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

// custom components imports
import FeedActivity from '../../../../components/Feed/FeedActivity';

const PLColors = require('PLColors');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
const { youTubeAPIKey } = require('PLEnv');

class FriendActivity extends Component {

    static propTypes = {
        token: React.PropTypes.string,
    }

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            isRefreshing: false,
            isLoadingTail: false,
            isLoading: false,
            dataArray: [],
            dataSource: ds,
        };
    }

    componentWillMount() {
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataArray: nextProps.payload,
        });
    }

    subscribe(item) {
        Share.share({
            message: item.description,
            title: ""
        });
    }

    async loadInitialActivities() {
        this.setState({ isRefreshing: true });
        const { props: { token, dispatch } } = this;
        try {
            await Promise.race([
                dispatch(loadActivities(token)),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            }
            else {
                alert('Timed out. Please check internet connection');
            }
            return;
        } finally {
            this.setState({ isRefreshing: false });
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataArray),
        });
    }

    async loadNextActivities() {
        this.setState({ isLoadingTail: true });
        const { props: { token, page, dispatch } } = this;
        try {
            await Promise.race([
                dispatch(loadActivities(token, page)),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            }
            else {
                alert('Timed out. Please check internet connection');
            }
            return;
        } finally {
            this.setState({ isLoadingTail: false });
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataArray),
        });
    }

    _onRefresh() {
        this.props.dispatch(resetActivities());
        this.loadInitialActivities();
    }

    _onEndReached() {
        const { props: { page, count } } = this;
        if (this.state.isLoadingTail === false && count > 0) {
            this.loadNextActivities();
        }
    }

    // Feed common components
    
    _renderHeader(item) {
        return <FeedHeader item={item} />
    }

    _renderTailLoading() {
        if (this.state.isLoadingTail === true) {
            return (
                <PLLoader position="bottom" />
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <Content
                refreshControl={Platform.OS === 'android' &&
                    <RefreshControl
                        refreshing={false}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
                onScroll={(e) => {
                    var height = e.nativeEvent.contentSize.height;
                    var offset = e.nativeEvent.contentOffset.y;
                    if ((WINDOW_HEIGHT + offset) >= height && offset > 0) {
                        this._onEndReached();
                    }

                    if (Platform.OS === 'ios' && offset < -3) {
                        this._onRefresh();
                    }
                }}>
                {this.state.isRefreshing && <PLLoader position="bottom" />}
                <ListView dataSource={this.state.dataSource} renderRow={item => {
                    return <FeedActivity item={item} token={this.props.token} profile={this.props.profile}/>
                }}
                />
                <PLOverlayLoader visible={this.state.isLoading} logo />
                {this._renderTailLoading()}
            </Content >
        );
    }
}

const optionsStyles = {
    optionsContainer: {
        backgroundColor: '#fafafa',
        paddingLeft: 5,
        width: WINDOW_WIDTH,
    },
};

async function timeout(ms: number): Promise {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

const mapStateToProps = state => ({
    token: state.user.token,
    page: state.activities.page,
    totalItems: state.activities.totalItems,
    payload: state.activities.payload,
    count: state.activities.count,
    profile: state.user.profile,
});

export default connect(mapStateToProps)(FriendActivity);