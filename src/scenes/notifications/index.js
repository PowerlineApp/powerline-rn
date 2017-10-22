//This is the Notifications Feed Tab
//It is loaded primarily from the API https://api-dev.powerli.ne/api-doc#get--api-v2-user-social-activities
//Social Activity Feed "You" tab on backend is the same thing as Notifications Feed on frontend

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Content, Text, List, ListItem, Left, Body, Right,Thumbnail, Button, Icon} from 'native-base';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

const PLColors = require('PLColors');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
var { getActivities } = require('PLActions');
var TimeAgo = require('react-native-timeago');
import {
    TouchableOpacity,
    View
} from 'react-native';
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
            return text.replace(/<\/?[^>]+(>|$)/g, "");
        }else{
            return "";
        }
    }

    // There are three general types of activities that show up in the Notifications Feed. A social activity update (e.g someone mentioned you in a comment), a Social Follow Request (User A wants to follow you), and a Group Join invite (You were invited to Save the Whales)
    render() {
        WARN(JSON.stringify(this.state.notifications))
        return (
            <Content>
                <List style={{backgroundColor: 'white'}}>
                    {
                        this.state.notifications.map((value, index)=> {
                            if(value.type == 'comment-mentioned' || value.type == 'own-post-voted' || value.type == 'post-mentioned'){
                                return (                                    
                                    <ListItem avatar key={index}>
                                        <Left>
                                            <Thumbnail source={{ uri: value.target.image+'&w=50&h=50&auto=compress,format,q=95' }} />
                                        </Left>
                                        <Body>
                                            <Text style={{color: PLColors.main}}>{this.showText(value.html_message)}</Text>
                                            {
                                              value.type == 'comment-mentioned' || value.type == 'post-mentioned'?
                                              <Text note style={{color: PLColors.lightText}}>                                                    
                                                    <Icon name="chatboxes" style={styles.icon}/> <TimeAgo time={value.created_at} />
                                              </Text>:
                                              <Text note style={{color: PLColors.lightText}}>                                                   
                                                    <Icon name="podium" style={styles.icon}/> <TimeAgo time={value.created_at} />
                                              </Text>
                                            }
                                        </Body>
                                    </ListItem>
                                );
                            }else if(value.type == 'follow-request'){
                                return (
                                    <ListItem avatar key={index} style={{height: 130}}>
                                        <Body style={{height: 130}}>
                                            <Text style={{color: PLColors.main}}>{this.showText(value.html_message)}</Text>
                                            <Text note style={{color: PLColors.lightText}}><Icon name="contact" style={styles.icon}/> <TimeAgo time={value.created_at} /></Text>
                                        </Body>
                                        <Right>
                                            <TouchableOpacity>
                                                <Text style={styles.defaultButton}>Approve</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Text style={styles.defaultButton}>Follow</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Text style={styles.defaultButton}>Ignore</Text>
                                            </TouchableOpacity>
                                        </Right>
                                    </ListItem>
                                );
                            }else if(value.type == 'join-to-group-approved'){
                                return (
                                    <ListItem avatar key={index} style={{height: 95}}>
                                        <Body style={{height: 95}}>
                                            <Text style={{color: PLColors.main}}>{this.showText(value.html_message)}</Text>
                                            <Text note style={{color: PLColors.lightText}}><Icon name="people" style={styles.icon}/> <TimeAgo time={value.created_at} /></Text>
                                        </Body>
                                        <Right>
                                            <TouchableOpacity>
                                                <Text style={styles.defaultButton}>Join</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Text style={styles.defaultButton}>Ignore</Text>
                                            </TouchableOpacity>
                                        </Right>
                                    </ListItem>
                                );
                            }
                        })
                    }
                </List>
            </Content>
        );
    }

}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(Notifications);