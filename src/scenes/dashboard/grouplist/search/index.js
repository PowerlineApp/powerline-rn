//This is the Add Group / Group Search screen. It allows a user to search for a group that s/he is not already joined to
//If user is not in PTA group, user searches for PTA group here and can join. 
//Joining a group initiates the Group Join process (GH48, GH59, GH60)
//User tries to join group, group may ask for passcode or other information, user provides, system validates, and group permissions alert displays
//Group permissions alert makes it clear what user is about to share with group owner. Acceptance is required to join the group


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Content,
    Container,
    Item,
    Input,
    Text,
    Label,
    Header,
    Body,
    Left,
    Right,
    Button,
    Icon,
    Title,
    List,
    ListItem,
    Thumbnail
} from 'native-base';
import {
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import styles from './styles';
import { getGroupsBySort, searchGroup, joinGroup } from '../../../../actions';
const PLColors = require('../../../../common/PLColors');

class GroupSearch extends Component{
    constructor(props){
        super(props);

        this.state = {
            popularGroups: [],
            newGroups: [],
            text: "",
            searchResults: []
        };

        this.join = this.join.bind(this);
    }

    componentWillMount(){
        var { token } = this.props;

        //A list of popular groups is displayed to the user on the Add Group page
        getGroupsBySort(token, 'popular').then(data => {
            this.setState({
                popularGroups: data
            });
        })
        .catch(err => {

        });

        getGroupsBySort(token, 'new').then(data => {
            this.setState({
                newGroups: data
            });
        })
        .catch(err => {

        });
    }

    onChangeText(text){
        this.setState({
            text: text
        });

        if(text != ''){        
            var { token } = this.props;
            searchGroup(token, text).then(data => {
                this.setState({
                    searchResults: data.payload
                });
            })
            .catch(err => {

            });
        }
    }

    onCreate(){
        Actions.createGroup();
    }

    goToProfile = (group) => {
        Actions.groupprofile(group);
    }

    // join(group){
    //     Actions.groupprofile(group);
    // }
    join(group){
        if(group.fill_fields_required || group.membership_control === 'passcode' || group.membership_control === 'approval' && !group.joined && !group.user_role) {
            Actions.groupprofile({data: group});
        } else {
            Alert.alert('Confirmation', `Are you sure you wish to join ${group.official_name}?`, [
                {text: "Ok", onPress: () => this.doJoin(group.id)}, 
                {text: "Cancel", onPress: () => console.log('Cancel pressed'), style: 'cancel'}
            ]);
        }
    }
    
    doJoin(id){
        var { token } = this.props;
        if (this.state.joiningGroup) return;
        this.setState({joiningGroup: true});
        joinGroup(token, id).then(data => {
            this.setState({joiningGroup: false});
            if(data.join_status == 'active'){
                Actions.myGroups();
            }
        })
        .catch(err => {
            this.setState({joiningGroup: false});
    
        });
    }

    render(){
        const { newGroups, popularGroups } = this.state;
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent style={{width: '100%'}}  onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                            <Icon active name='arrow-back' style={{color: 'white'}} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{color: '#fff'}}>Group Search</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.onCreate()}>
                            <Label style={{color: 'white'}}>Create</Label>
                        </Button>
                    </Right>
                </Header>
                <Item style={styles.searchBar}>
                    <Input style={styles.searchInput} placeholder='Search for Groups' value={this.state.text} onChangeText={(text) => this.onChangeText(text)} />
                    <Icon active name='search' style={styles.searchIcon} />
                </Item>
                <Content padder>
                    <List style={{backgroundColor: 'white'}}>
                        {popularGroups.length > 0 && this.state.text == '' ?
                            <ListItem itemHeader style={styles.itemHeaderStyle}>
                                <Text style={styles.itemHeaderText}>Popular Groups</Text>
                            </ListItem> : null}
                        {this.state.text == '' ?
                            <View>
                                {
                                    popularGroups && popularGroups.length > 0 && popularGroups.map((group, index) => {
                                        return (
                                            <ListItem style={styles.listItem} key={index} onPress={() => this.goToProfile(group)}>
                                                {
                                                    group.avatar_file_path ?
                                                        <Thumbnail square source={{uri: group.avatar_file_path+'&w=150&h=150&auto=compress,format,q=95'}} />:
                                                        <View style={{width: 56, height: 56}} />
                                                }
                                                <Body>
                                                    <Text style={styles.text1}>{group.official_name}</Text>
                                                </Body>
                                                {!group.joined ?
                                                    <Right>
                                                        <Icon name='add-circle' style={styles.joinBtn} onPress={() => this.join(group)} />
                                                    </Right> : null}
                                            </ListItem>
                                        );
                                    })
                                }
                            </View> : null}
                        {newGroups.length > 0 && this.state.text == '' ?
                            <ListItem itemHeader style={styles.itemHeaderStyle}>
                                <Text style={styles.itemHeaderText}>New Groups</Text>
                            </ListItem> : null}
                        {this.state.text == '' ?
                            <View>
                                {
                                   newGroups && newGroups.length > 0 && newGroups.map((group, index) => {
                                       return (
                                           <ListItem style={styles.listItem} key={index} onPress={() => this.goToProfile(group)}>
                                               {
                                                    group.avatar_file_path ?
                                                        <Thumbnail square source={{uri: group.avatar_file_path+'&w=150&h=150&auto=compress,format,q=95'}} />:
                                                        <View style={{width: 56, height: 56}} />
                                                }
                                               <Body>
                                                   <Text style={styles.text1}>{group.official_name}</Text>
                                               </Body>
                                               {!group.joined ?
                                                   <Right>
                                                       <Icon name='add-circle' style={styles.joinBtn} onPress={() => this.join(group)} />
                                                   </Right> : null}
                                           </ListItem>
                                       );
                                   })
                                }
                            </View> : null}
                        {this.state.text != '' ?
                            <ListItem itemHeader style={styles.itemHeaderStyle}>
                                <Text style={styles.itemHeaderText}>Results</Text>
                            </ListItem> : null}
                        {
                            this.state.searchResults && this.state.searchResults.length > 0 ?
                                <View>
                                    {
                                    this.state.searchResults.map((group, index) => {
                                        return (
                                            <ListItem style={styles.listItem} key={index} onPress={() => this.goToProfile(group)}>
                                                {
                                                    group.avatar_file_path ?
                                                        <Thumbnail square source={{uri: group.avatar_file_path+'&w=150&h=150&auto=compress,format,q=95'}} />:
                                                        <View style={{width: 56, height: 56}} />
                                                }
                                                <Body>
                                                    <Text style={styles.text1}>{group.official_name}</Text>
                                                </Body>
                                                {!group.joined ?
                                                    <Right>
                                                        <Icon name='add-circle' style={styles.joinBtn} onPress={() => this.join(group)} />
                                                    </Right> : null
                                                }
                                            </ListItem>
                                        );
                                    })
                                }
                                </View> : null
                        }
                        {this.state.text != '' && this.state.searchResults && this.state.searchResults.length == 0 ?
                            <ListItem style={styles.listItem}>
                                <Label style={{color: 'black'}}>No results were found.</Label>
                            </ListItem> : null}                        
                    </List>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(GroupSearch);