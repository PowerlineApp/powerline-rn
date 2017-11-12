import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Header, Left, Right, Label, Text, Button, Icon, Title, Body, Footer, Textarea, View, List, ListItem, Thumbnail, Toast} from 'native-base';

const PLColors = require('PLColors');
import styles from './styles';
import { Dimensions, ScrollView, TextInput, FlatList } from 'react-native';
import { showToast } from 'PLToast';

const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, getUsersByGroup, createPostToGroup, getPetitionConfig } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';
const POST_MAX_LENGTH = 5000;

import DefaultLeaderContent from './defaultLeaderContent';

class NewLeaderContent extends Component{
    render(){
        console.log('!!!!!!!!!!!!!!!!!!!!!')
        let options = {};
        switch(this.props.contentType){
            case 'group_discussion':
                options = {
                    headerTitle: 'New Group Discussion',
                    hasDescription: true,
                    descriptionPlaceHolder: 'Description Placeholder',
                    attachments: true
                }
                break;
            case 'group_announcement':
                options = {
                    headerTitle: 'New Group Announcement',
                    hasDescription: true,
                    descriptionPlaceHolder: 'Description Placeholder',
                }
                break;
            case 'group_petition':
                options = {
                    headerTitle: 'New Group Petition',
                    hasTitle: true,
                    titlePlaceholder: 'Group Petition Title',
                    hasDescription: true,
                    descriptionPlaceHolder: 'Description Placeholder',
                    attachments: true
                }
                break;
            case 'group_poll':
                options = {
                    headerTitle: 'New Group Poll',
                    hasTitle: true,
                    titlePlaceholder: 'Type question here',
                    hasAnswers: true,
                    answersPlaceholder: 'Type answer here',
                    addAnswersButton: 'Add answer',
                    answerType: 'poll',
                    attachments: true
                }
                break;
            case 'group_event':
                options = {
                    headerTitle: 'New Group Event',
                    hasTitle: true,
                    titlePlaceholder: 'Event title',
                    hasDescription: true,
                    descriptionPlaceHolder: 'Description Placeholder',
                    wrapDescription: true,
                    event: true,
                    hasAnswers: true,
                    addAnswersButton: 'Add RSVP Response',
                    answersPlaceholder: 'Type answer here',
                    answerType: 'event',
                    attachments: true
                }
                break;
            case 'group_fundraiser':
                options = {
                    headerTitle: 'New Group Fundraiser',
                    hasTitle: true,
                    titlePlaceholder: 'Fundraiser title',
                    hasDescription: true,
                    wrapDescription: true,                    
                    descriptionPlaceHolder: 'Type your description here',
                    hasAnswers: 'Add Answer',
                    addAnswersButton: 'Add option',
                    answersPlaceholder: 'Option description',
                    answerType: 'donation',
                    attachments: true
                }
                break;
            default:
        }
        // console.log('options', options)
        return <DefaultLeaderContent token={this.props.token} group={this.props.group} options={options} type={this.props.contentType} />
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(NewLeaderContent);

