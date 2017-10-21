//This is the Group Membership List Screen accessible via the Group Profile Screen
//https://api-dev.powerli.ne/api-doc#get--api-v2-groups-{id}-users


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Content,
    Container,
    Item,
    Input,
    Text,
    Header,
    Left,
    Body,
    Icon,
    Title,
    Button,
    Thumbnail,
    List,
    ListItem,
    Label,
    Toast
} from 'native-base';
import {
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import styles from './styles';

const PLColors = require('PLColors');
import { getGroupMembers, followAllMembers } from 'PLActions';

class GroupMembers extends Component{
    constructor(props){
        super(props);

        this.state = {
            members: []
        };

        var { token, id } = this.props;
        getGroupMembers(token, id).then(data => {
            this.setState({
                members: data.payload
            });
        })
        .catch(err => {

        });
    }

    goToProfile(id){
        Actions.profile({id: id});
    }

    followAllBtn(){
        var { token, id} = this.props;
        // Need to add the number of users to the alert message
        Alert.alert(
            'Follow All',
            'Do you want to want to follow all users in this group?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {

                    }
                },
                {
                    text: 'OK',
                    onPress: () => {                        
                        followAllMembers(token, id).then(data => {
                            Toast.show({
                                text: "Follow all request sent!", 
                                position: "bottom",
                                duration: 5000
                            });
                        })
                        .catch(err => {

                        });
                    }
                }
            ]
        );
    }

    render(){
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                            <Icon active name="arrow-back" style={{color: 'white'}}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Group Members</Title>
                    </Body>
                </Header>
                <Content padder>
                    <List style={{marginTop: 17}}>
                        <ListItem style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 17}}>
                            {this.props.avatar_file_path?
                            <Thumbnail style={styles.avatar} square source={{uri: this.props.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}}/>:
                            <View style={styles.avatar}/>
                            }
                            <Body>
                                <Text style={{color: PLColors.main}}>{this.props.official_name}</Text>
                                <Button block style={styles.followBtn} onPress={this.followAllBtn.bind(this)}>
                                    <Label style={{color: 'white'}}>Follow All</Label>
                                </Button>
                            </Body>
                        </ListItem>
                        <ListItem style={{height: 25}}>
                            <Text></Text>
                        </ListItem>
                        {
                            this.state.members.map((user, index) => {
                                return (
                                    <ListItem key={index} style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 17}} onPress={() => this.goToProfile(user.id)}>
                                        <Thumbnail square source={{uri: user.avatar_file_name+'&w=50&h=50&auto=compress,format,q=95'}}/>
                                        <Body>
                                            <Text>{user.username}</Text>
                                            <Text note>{user.first_name} {user.last_name}</Text>
                                        </Body>
                                    </ListItem>
                                )
                            })
                        }                        
                    </List>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(GroupMembers);