import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Content, Text, List, ListItem, Left, Body, Right,Thumbnail, Button, Icon} from 'native-base';
import {
    TouchableOpacity,
    View
} from 'react-native';
import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
var TimeAgo = require('react-native-timeago');

const PLColors = require('PLColors');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
var { getActivities } = require('PLActions');
import ContentPlaceholder from '../../../components/ContentPlaceholder';

import styles from './styles';

class Notifications extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            notifications: [],
            page: 1,
            items: 10,
            totalItems: 36
        };

        var { token } = this.props;
        getActivities(token).then(res => {
            console.log(res);
            this.setState({
                notifications: res.payload,
                page: res.page,
                totalItems: res.totalItems
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    showText(text){
        if(text){
            var misPText = text.substring(3, text.length - 4);
            var index1 = misPText.indexOf("<strong>");
            var preText = misPText.substring(0, index1);
            var index2 = misPText.indexOf("</strong>");
            var strongText = misPText.substring(index1 + 8 , index2);
            var subText = misPText.substring(index2 + 9, misPText.length);
            return (
                <Text style={styles.text1}>
                    {preText}
                    <Text style={styles.text3}>
                        {strongText}
                    </Text>
                    {subText}
                </Text>
            );
        }else{
            return (
                <Text style={styles.text1}/>
            )
        }
    }

    render() {
        return (
            <ContentPlaceholder
                empty={this.state.notifications.length === 0}
                title="Seems quiet a bit quiet in here. Are you following anyone?"
            >
                <List style={{backgroundColor: 'white'}}>
                    {
                        this.state.notifications.map((value, index)=> {
                            if(value.type == 'comment-mentioned' || value.type == 'post-mentioned' || value.type == 'own-post-commented' || value.type == 'follow-request' || value.type == 'join-to-group-approved')
                            return (
                                <ListItem avatar key={index} style={styles.listItem}>
                                    {value.target.image?
                                    <Left>
                                        <Thumbnail small source={{ uri: value.target.image }} />
                                    </Left>:null
                                    }
                                    <Body style={styles.listItemBody}>
                                        {this.showText(value.html_message)}
                                        {
                                            value.type == 'comment-mentioned' || value.type == 'post-mentioned'?
                                            <Text note style={styles.text2}>                                                    
                                                <Icon name="chatboxes" style={styles.icon}/> <TimeAgo time={value.created_at} />
                                            </Text>:
                                            value.type == 'own-post-commented'?
                                            <Text note style={styles.text2}>                                                   
                                                <Icon name="podium" style={styles.icon}/> <TimeAgo time={value.created_at} />
                                            </Text>:
                                            value.type == 'follow-request'?
                                            <Text note style={styles.text2}>
                                                <Icon name="contact" style={styles.icon}/> <TimeAgo time={value.created_at} />
                                            </Text>:
                                            <Text note style={styles.text2}>
                                                <Icon name="people" style={styles.icon}/> <TimeAgo time={value.created_at} />
                                            </Text>
                                        }
                                    </Body>
                                    {value.type == 'follow-request'?
                                    <Right style={styles.listItemRight}>
                                        <View style={{width: 23, height: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 0.6, borderColor: 'green'}}>
                                            <Icon name="checkmark" style={{color: 'green'}}/>
                                        </View>
                                    </Right>
                                    :null}
                                </ListItem>
                            );                            
                        })
                    }
                </List>
            </ContentPlaceholder>
        );
    }

}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(Notifications);