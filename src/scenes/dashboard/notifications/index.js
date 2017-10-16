//This is the Notifications Feed Tab
//It is loaded primarily from the API https://api-dev.powerli.ne/api-doc#get--api-v2-user-social-activities
//Social Activity Feed "You" tab on backend is the same thing as Notifications Feed on frontend

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Content, Text, List, ListItem, Left, Body, Right,Thumbnail, Button, Icon} from 'native-base';
import {
    TouchableOpacity,
    View,
    Alert,
    RefreshControl
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
var { getActivities, unFollowers, acceptFollowers, putSocialActivity, getInvites, joinGroup,getGroupDetails } = require('PLActions');

import ContentPlaceholder from '../../../components/ContentPlaceholder';
import styles from './styles';

class Notifications extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            invites: [],
            refreshing: false
        };             
    }

    componentWillMount(){
        this.onRefresh();
    }

    loadActivities(){
        var { token, dispatch } = this.props;

        dispatch({type: 'RESET_NOTIFICATION'});
        getActivities(token).then(res => {
            console.log(res);
            dispatch({type: 'LOAD_NOTIFICATION', data: res});
            this.setState({
                refreshing: false
            });
        })
        .catch(err => {
            console.log(err);
        });

        getInvites(token)
        .then(data => {
            this.setState({
                invites: data.payload
            })
        })
        .catch(err => {

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
//When a user gets a follow request from another user
    acceptFollower(target, index, notifiId){
        var { token, dispatch } = this.props;

        Alert.alert("Confirm", "Do you want to approve " + target.full_name + " ?", [
            {
                text: 'Cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    acceptFollowers(token, target.id)
                    .then((ret) => {                        
                        //mark
                        putSocialActivity(token, notifiId, true)
                        .then(data => {
                            var notiDATA = JSON.parse(JSON.stringify(this.props.notifications));
                            dispatch({type: 'RESET_NOTIFICATION'});         
                            notiDATA[index].ignore = true;
                            dispatch({type: 'CHANGE_NOTIFICATION', data: notiDATA});                  
                        })
                        .catch(err => {

                        });
                    })
                    .catch(err => {

                    });
                }
            }            
        ]);
    }

    unFollowers(target, index, notifiId){
        var { token, dispatch } = this.props;

        Alert.alert("Confirm", "Do you want to stop " + target.full_name + " from following you ?", [
            {
                text: 'Cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    unFollowers(token, target.id)
                    .then((ret) => {                        
                        //mark
                        putSocialActivity(token, notifiId, true)
                        .then(data => {
                            var notiDATA = JSON.parse(JSON.stringify(this.props.notifications));
                            dispatch({type: 'RESET_NOTIFICATION'});  
                            notiDATA[index].ignore = true;       
                            dispatch({type: 'CHANGE_NOTIFICATION', data: notiDATA});
                        })
                        .catch(err => {

                        });
                    })
                    .catch(err => {

                    });
                }
            }            
        ]);
    }
//When user is invited to join a group.
    approveInvite(groupId, index){
        var { token } = this.props;
        getGroupDetails(token, groupId)
        .then(data => {

        })
        .catch(err => {

        });
        
        joinGroup(token, groupId)
        .then(data => {
            this.state.invites.slice(index, 1);
            this.setState({
                invites: this.state.invites
            });
        })
        .catch(err => {

        });
    }

    rejectInvite(groupId, index){
        
    }

    onRefresh(){
        this.setState({
            refreshing: true
        });
        this.loadActivities();
    }
 
   // There are three general types of activities that show up in the Notifications Feed. A social activity update (e.g someone mentioned you in a comment), a Social Follow Request (User A wants to follow you), and a Group Join invite (You were invited to Save the Whales)
    render() {
        return (
            <ContentPlaceholder
                empty={
                    !this.state.refreshing && 
                    this.props.notifications.length === 0
                }
                title="Seems quiet a bit quiet in here. Are you following anyone?"
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
            >
                <List style={{backgroundColor: 'white'}}>
                    {
                        this.state.invites.map((value, index) => {
                            return (
                                <ListItem avatar key={index} style={styles.listItem}>
                                    <Left>
                                        {value.avatar_file_path?
                                        <Thumbnail small source={{uri: value.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}}/>:
                                        <Thumbnail small source={require('img/blank_person.png')}/>
                                        }
                                    </Left>
                                    <Body style={styles.listItemBody}>
                                        <Text style={styles.text1}>You were invited you a group: <Text style={styles.text3}>{value.official_name}</Text></Text>
                                        <Text note style={styles.text2}>
                                            <Icon name="people" style={styles.icon}/> <TimeAgo time={value.created_at} />
                                        </Text>
                                    </Body>
                                    <Right style={styles.inviteRightItem}>
                                        <Button small block style={styles.inviteRightBtn1} onPress={() => this.approveInvite(value.id, index)}>
                                            <Text style={styles.inviteRightBtnText1}>JOIN</Text>
                                        </Button>
                                        <Button small block style={styles.inviteRightBtn2} onPress={() => this.rejectInvite(value.id, index)}>
                                            <Text style={styles.inviteRightBtnText2}>IGNORE</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                            );
                        })
                    }
                    {
                        this.props.notifications.map((value, index)=> {
                            if(value.type == 'comment-mentioned' || value.type == 'post-mentioned' || value.type == 'own-post-commented' || value.type == 'follow-request')
                            return (
                                <ListItem avatar key={index} style={styles.listItem}>
                                    {value.target.image?
                                    <Left>
                                        <Thumbnail small source={{ uri: value.target.image+'&w=50&h=50&auto=compress,format,q=95' }} />
                                    </Left>:
                                    <Left>
                                        <Thumbnail small source={require('img/blank_person.png')} />
                                    </Left>
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
                                    {value.type == 'follow-request' && value.ignore == null?
                                    <Right style={styles.listItemRight}>
                                        <TouchableOpacity onPress={() => this.acceptFollower(value.target, index, value.id)}>
                                            <Icon name="checkmark" style={styles.acceptIcon}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.unFollowers(value.target, index, value.id)}>
                                            <Icon name="close" style={styles.rejectIcon}/>
                                        </TouchableOpacity>
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
    token: state.user.token,
    notifications: state.notifications.payload
});

export default connect(mapStateToProps)(Notifications);