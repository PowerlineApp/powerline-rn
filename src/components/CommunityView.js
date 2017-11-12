import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Label,
    Text,
    Button,
    Icon,
    Title,
    Body,
    Footer,
    Textarea,
    View,
    List,
    ListItem,
    Thumbnail,
    Toast
} from 'native-base';
import {
    Dimensions,
    Platform,
    StyleSheet,
    ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

class CommunityView extends PureComponent {
    render () {
        const {
            light,
            grouplist,
            onPress
        } = this.props;
        
        return (
            <View style={styles.community_list_container}>
                <View style={{
                    ...styles.community_list_back,
                    backgroundColor: light ? 'transparent': 'black',
                    opacity: light ? 1 : 0.4,
                }} />
                <ScrollView style={{flex: 1}}>
                    <List style={{width: 250}}>
                        { grouplist.map((item, index) => {
                            return (
                                <ListItem key={index} onPress={() => onPress(index)}>
                                    { item.avatar_file_path
                                        ? <Thumbnail square style={styles.thumbnail} source={{ uri: item.avatar_file_path + '&w=50&h=50&auto=compress,format,q=95'}} />
                                        : <View style={styles.thumbnail} />
                                    }
                                    <Body>
                                        <Text style={{ fontSize: 12, color: light ? 'gray' : 'white' }}>{item.official_name}</Text>
                                    </Body>
                                    <Right>
                                        <Icon name='ios-arrow-dropright' style={{ color: light ? 'gray' : 'white' }} />
                                    </Right>
                                </ListItem>
                            );
                        })
                    }
                    </List>
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    community_list_container: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: '100%',
        zIndex: 10,
        paddingLeft: (width - 250)/ 2,
        paddingTop: 40,
    },

    community_list_back: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    },

    thumbnail: { width: 15, height: 15 },
};

export default CommunityView;
