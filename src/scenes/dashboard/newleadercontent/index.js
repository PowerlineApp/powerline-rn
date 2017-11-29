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
                    descriptionPlaceHolder: 'Leading a discussion requires good framing, moderation, and follow-through...',
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
                    titlePlaceholder: 'Title - Make it compelling',
                    hasDescription: true,
                    descriptionPlaceHolder: 'Ask your group members to sign and to build support faster than ever...',
                    attachments: true
                }
                break;
            case 'group_poll':
                options = {
                    headerTitle: 'New Group Poll',
                    hasTitle: true,
                    titlePlaceholder: 'Type your question here',
                    hasAnswers: true,
                    answersPlaceholder: 'Define an answer choice here',
                    addAnswersButton: 'Add answer',
                    answerType: 'poll',
                    attachments: true
                }
                break;
            case 'group_event':
                options = {
                    headerTitle: 'New Group Event',
                    hasTitle: true,
                    titlePlaceholder: 'Title - Make it clear',
                    hasDescription: true,
                    descriptionPlaceHolder: 'All group members will be able to save this to their calendar...',
                    wrapDescription: true,
                    event: true,
                    hasAnswers: true,
                    addAnswersButton: 'Add RSVP Response',
                    answersPlaceholder: 'e.g. I will be there!',
                    answerType: 'event',
                    attachments: true
                }
                break;
            case 'group_fundraiser':
                options = {
                    headerTitle: 'New Group Fundraiser',
                    hasTitle: true,
                    titlePlaceholder: 'Title - Make it short',
                    hasDescription: true,
                    wrapDescription: true,                    
                    descriptionPlaceHolder: 'Why do you need funding? What is your story? Donors will be able to pay with just a couple quick taps...',
                    hasAnswers: 'Add Answer',
                    addAnswersButton: 'Add option',
                    answersPlaceholder: 'Option description (e.g. T-Shirt)',
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

