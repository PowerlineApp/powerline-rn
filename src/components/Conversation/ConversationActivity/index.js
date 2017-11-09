import React, {Component} from 'react';
import {View} from 'react-native';
import styles from '../styles';
import TimeAgo from 'react-native-timeago';
import {Card, Text, Label, Left, Body, Right, ListItem, Thumbnail, Icon, Button} from 'native-base';
import {Actions} from 'react-native-router-flux';

class ConversationActivity extends Component {

    redirect(item, options, scene = 'itemDetail') {
        let type;
        if (item.poll) {
            type = 'poll';
        } else if (item.post) {
            type = 'post';
        } else if (item.user_petition) {
            type = 'user-petition';
        }
        Actions[scene]({ entityType: type, entityId: item.entity.id, ...options });
    }


    render () {
        let {item, token, profile} = this.props; 

        return (
            <ListItem onPress={() => this.redirect(item)} avatar key={item.index} style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 15}}>
                <Left>
                    <Thumbnail small source={{uri: item.user.avatar_file_name+'&w=200&h=200&auto=compress,format,q=95'}}/>
                </Left>
                <Body style={{borderBottomWidth: 0}}>
                    <Text style={styles.title}>{item.user.full_name}</Text>
                    <Text note style={styles.mainDescription}>{item.description}</Text>
                </Body>
                <Right style={{borderBottomWidth: 0}}>
                    <Text style={styles.itemTime}><TimeAgo time={item.sent_at}/></Text>
                    {/* 
                        // it seems that for now, conversationView wont have any buttons... 
                    <Button transparent small>
                        <Icon name="md-arrow-dropup" style={item.upvotes_count!=0? styles.footerIconBlue : styles.footerIcon}/>
                        <Label style={item.upvotes_count!=0? styles.footerTextBlue : styles.footerText}>{item.upvotes_count ? item.upvotes_count : 0}</Label>
                    </Button> */}
                </Right>
            </ListItem>
        );
    }
}

export default ConversationActivity;
