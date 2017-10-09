//User has ability to create a new user petition from New Item Menu. GH15
//If user is on "All" feed and tries to create new item, user must choose which group the item will be posted to.
//If user is already looking at a specific group (e.g. USA group) in newsfeed tab (e.g. not "all"), app will assume new post is for that group.
//https://api-dev.powerli.ne/api-doc#post--api-v2.2-groups-{group}-user-petitions

import React, { Component } from 'react';
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
    Input
} from 'native-base';
const PLColors = require('PLColors');
import styles from './styles';
import {
    Dimensions,
    ScrollView,
    TextInput
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, createPetition, getPetitionConfig } from 'PLActions';

class NewPetition extends Component{
    constructor(props){
        super(props);

        this.state = {
            showCommunity: true,
            profile: {},
            grouplist: [],
            selectedGroupIndex: -1,
            title: "",
            content: "",
            petition_remaining: null
        };
    }

    componentDidMount(){
        var { token } = this.props;
        loadUserData(token).then(data => {
            this.setState({
                profile: data
            });
        })
        .catch(err => {

        });

        getGroups(token).then(ret => {
            this.setState({
                grouplist: ret.payload
            });
        })
        .catch(err => {

        });
    }

    toggleCommunity(){
        this.setState({
           showCommunity: ! this.state.showCommunity 
        });
    }

    selectGroupList(index){
        this.setState({
            selectedGroupIndex: index,
            showCommunity: false
        });

        var { token } = this.props;

        getPetitionConfig(token, this.state.grouplist[index].id)
        .then(data => {
            this.setState({
                petition_remaining: data.petitions_remaining
            });
        })
        .catch(err => {

        });
    }

    createPetition(){
        if(this.state.selectedGroupIndex == -1){
            alert('Please select Group.');
            return;
        }else if(this.state.title == '' || this.state.title.trim() == ''){
            alert("Please type petition title.");
            return;
        }else if(this.state.content == '' || this.state.content.trim() == ''){
            alert("Please type petition message.")
        }

        var  { token } = this.props;
        createPetition(token, this.state.grouplist[this.state.selectedGroupIndex].id, this.state.title, this.state.content)
        .then(data => {
            //alert('Petition successfully created!');
            Actions.itemDetail({ entityId: data.id, entityType: 'user-petition' });
        })
        .catch(err => {

        });
    }

    changeContent(text){
        if(text.length <= 2500){
            this.setState({
                content: text
            });
        }
    }

    changeTitle(text){
        this.setState({
            title: text
        });
    }

    render(){
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon active name="arrow-back" style={{color: 'white'}}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>New Petition</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.createPetition()}>
                            <Label style={{color: 'white'}}>Send</Label>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List>
                        <ListItem style={styles.community_container} onPress={() => this.toggleCommunity()}>
                            <View style={styles.avatar_container}>
                                <View style={styles.avatar_wrapper}>
                                    <Thumbnail square style={styles.avatar_img} source={{uri: this.state.profile.avatar_file_name}}/>
                                </View>
                                <View style={styles.avatar_subfix}></View>
                            </View>  
                            <Body style={styles.community_text_container}>
                                <Text style={{color: 'white'}}>
                                    {this.state.selectedGroupIndex == -1? 'Select a community': this.state.grouplist[this.state.selectedGroupIndex].official_name}
                                </Text>
                            </Body>  
                            <Right style={styles.community_icon_container}>
                                <Icon name="md-create" style={{color: 'white'}}/>
                            </Right>                       
                        </ListItem>
                    </List>
                    <View style={styles.main_content}>
                        <View style={{padding: 10}}>
                            <TextInput
                                placeholder="Type Title here"
                                style={styles.input_text}
                                autoCorrect={false}
                                value={this.state.title}
                                onChangeText={(text) => this.changeTitle(text)}
                                underlineColorAndroid={'transparent'}
                            />                        
                            <Textarea placeholderTextColor="rgba(0,0,0,0.1)" style={styles.textarea} placeholder="Start by telling a story. Then, close with a call for action or change." value={this.state.content} onChangeText={(text) => this.changeContent(text)}/>
                        </View>
                        {this.state.showCommunity?
                        <View style={styles.community_list_container}>
                            <View style={styles.community_list_back}></View>
                            <ScrollView style={{flex: 1}}>
                                <List style={{width: 250}}>
                                    {
                                        this.state.grouplist.map((item, index) => {
                                            return (
                                                <ListItem key={index} onPress={() => this.selectGroupList(index)}>
                                                    {item.avatar_file_path?
                                                    <Thumbnail square style={{width: 15, height: 15}} source={{uri: item.avatar_file_path}}/>:
                                                    <View style={{width: 15, height: 15}}/>}
                                                    <Body>
                                                        <Text style={{color: 'white', fontSize: 12}}>{item.official_name}</Text>
                                                    </Body>
                                                    <Right>
                                                        <Icon name="ios-arrow-dropright" style={{color: 'white'}}/>
                                                    </Right>
                                                </ListItem>
                                            );
                                        })
                                    }
                                </List>
                            </ScrollView>
                        </View>: null
                        }
                    </View>
                </Content>
                <Footer style={{alignItems: 'center', justifyContent: 'space-between', backgroundColor: PLColors.main, paddingLeft: 10, paddingRight: 10}}>
                    {this.state.petition_remaining?
                    <Label style={{color: 'white', fontSize: 10}}>
                        You have <Label style={{fontWeight: 'bold'}}>{this.state.petition_remaining}</Label> petitions left in this group
                    </Label>:
                    <Label></Label>
                    }
                    <Label style={{color: 'white'}}>
                        {
                            (2500 - this.state.content.length)
                        }
                    </Label>
                </Footer>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(NewPetition);