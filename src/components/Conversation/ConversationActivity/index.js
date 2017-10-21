import React, {Component} from 'react';
import {View} from 'react-native';
import styles from '../styles';
import TimeAgo from 'react-native-timeago';
import {Card, Text, Label, Left, Body, Right, ListItem, Thumbnail, Icon, Button} from 'native-base';

class ConversationActivity extends Component {
    render () {
        let {item, token, profile} = this.props; 

        return (
            <ListItem avatar key={item.index} style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 15}}>
                <Left>
                    <Thumbnail small source={{uri: item.user.avatar_file_name+'&w=200&h=200&auto=compress,format,q=95'}}/>
                </Left>
                <Body style={{borderBottomWidth: 0}}>
                    <Text style={styles.title}>{item.user.full_name}</Text>
                    <Text note style={styles.mainDescription}>{item.description}</Text>
                </Body>
                <Right style={{borderBottomWidth: 0}}>
                    <Text style={styles.itemTime}><TimeAgo time={item.sent_at}/></Text>
                    <Button transparent small onPress={() => this.vote(item, 'upvote')}>
                        <Icon name="md-arrow-dropup" style={item.upvotes_count!=0? styles.footerIconBlue : styles.footerIcon}/>
                        <Label style={item.upvotes_count!=0? styles.footerTextBlue : styles.footerText}>{item.upvotes_count ? item.upvotes_count : 0}</Label>
                    </Button>
                </Right>
            </ListItem>
        );
    }
}

export default ConversationActivity;
