import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    AsyncStorage,
    Platform,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux'
import { CachedImage } from 'react-native-img-cache';
import AppIntroSlider from 'react-native-app-intro-slider';

const { width, height } = Dimensions.get('window');
const isIphoneX = Platform.OS === 'ios'
  && !Platform.isPad
  && !Platform.isTVOS
  && (height === 812 || width === 812);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#55C5FF',
        flex: 1,
        position: 'relative',
        justifyContent: 'flex-end'
    },
    image: {
        width,
        height,
    },
    bottomContainer: {
        marginBottom: 5,
        flexDirection: 'row'
    },
    skipContainer: {
        flex: 1,
        alignItems: 'flex-start'
    },
    nextContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    nextBtn: {
        color: 'white',
        backgroundColor: 'transparent',
        marginRight: 10
    },
    skitBtn: {
        color: 'white',
        backgroundColor: 'transparent',
        marginLeft: 10
    },
    buttonStyle: {
        height: width / 4,
        width: width / 3.5,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    paginationStyle: {
        height: width / 4,
        position: 'absolute',
        bottom: (isIphoneX ? 34 : 0),
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
    },
    buttonTextStyle: {
        fontSize: 22,
    },
});

type Screen = {
    id: number,
    position: number,
    source: { uri: string },
}

type Props = {
    screens?: Array<Screen>,
}

type State = {
    screens: Array<Screen>,
    maxPos: number,
    ready: boolean,
}

class TourScene extends React.Component<Props, State> {
    static defaultProps = {
        screens: []
    };

    state = {
        screens: this.props.screens,
        maxPos: this.props.screens.length - 1,
        ready: this.props.screens.length > 0,
    };

    componentDidMount() {
        if (!this.state.ready) {
            AsyncStorage.getItem('onboarding')
              .then(res => {
                  if (res) {
                      return JSON.parse(res)
                        .map(screen => {
                            return { ...screen, source: { uri: screen.image }};
                        });
                  } else {
                      throw new Error('Onboarding screens are not found.');
                  }
              })
              .catch(() => {
                  return [
                      { id: 1, position: 1, source: require('../../assets/1.png')},
                      { id: 2, position: 2, source: require('../../assets/2.png')},
                      { id: 3, position: 3, source: require('../../assets/3.png')},
                      { id: 4, position: 4, source: require('../../assets/4.png')},
                      { id: 5, position: 5, source: require('../../assets/5.png')},
                      { id: 6, position: 6, source: require('../../assets/6.png')},
                  ];
              })
              .then(screens => {
                  this.setState({
                      screens,
                      maxPos: screens.length - 1,
                      ready: true,
                  });
              })
        }
    }

    onSkip = () => {
        Actions.reset('home');
    };

    renderItem = (item) => {
        return (
          <CachedImage
            source={item.source}
            resizeMode={Image.resizeMode.contain}
            style={styles.image}
          />
        );
    };

    render() {
        if (!this.state.ready){
            return <View style={styles.container} />
        }

        return (
          <AppIntroSlider
            renderItem={this.renderItem}
            doneLabel="Let's Go"
            onDone={this.onSkip}
            onSkip={this.onSkip}
            showSkipButton
            slides={this.state.screens}
            buttonStyle={styles.buttonStyle}
            paginationStyle={styles.paginationStyle}
            buttonTextStyle={styles.buttonTextStyle}
          />
        );
    }
}

export default TourScene;
