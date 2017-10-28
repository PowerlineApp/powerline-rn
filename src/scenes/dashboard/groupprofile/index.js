//This is the Group Profile Screen. Accessible by viewing tapping any group avatar or title anywhere it appears in the app, including My Groups, Standard Item Container, and Group Search
//GH 46

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Content,
    Container,
    Item,
    Input,
    Title,
    Button,
    Header,
    Body,
    Left,
    Right,
    Label,
    Icon,
    List,
    ListItem,
    Thumbnail,
    Text
} from 'native-base';
import {
    View,
    RefreshControl,
    Alert
} from 'react-native';
import styles  from './styles';
const PLColors = require('PLColors');
import { getGroupDetails, inviteAllFollowers, getFollowers, unJoinGroup, getGroupPermissions } from 'PLActions';

class GroupProfile extends Component{
    static propTypes = {
        token: React.PropTypes.string
    };
// The user will be asked to share the information with group owner upon joining the group
//GH59
    permissionsLabels = {
      "permissions_name":"Name",
      "permissions_address":"Street Address",
      "permissions_city":"City",
      "permissions_state":"State",
      "permissions_country":"Country",
      "permissions_zip_code":"Zip Code",
      "permissions_email":"Email",
      "permissions_phone":"Phone Number",
      "permissions_responses":"Responses"
    };

    constructor(props){
        super(props);

        this.state = {
            permissions: [],
            data: null,
            refreshing: false,
            refresh: false
        };        

        this.unjoin = this.unjoin.bind(this);
        this.join = this.join.bind(this);
    }

    componentWillMount(){
        this._onRefresh();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.shouldRefresh) {
            this.loadGroup()
        }
    }
    loadGroup(){
        if(this.props.required_permissions){
            this.props.required_permissions.map((value, index) => {
                this.state.permissions.push(this.permissionsLabels[value]);
            });
        }else{
            this.state.permissions = [];
        }

        var { token, id } = this.props;
        console.log('ioddd', id);
        getGroupDetails(token, id).then(data => {
            this.setState({
                data: data,
                refreshing: false
            })
        })
        .catch(err => {

        });

        //GH59
        getGroupPermissions(token, id).then(data => {
            if(data.required_permissions){
                data.required_permissions.map((value, index) => {
                    this.state.permissions.push(this.permissionsLabels[value]);
                });
                this.setState({
                    refresh: true
                });
            }
        }).catch(err => {

        });
    }

    _onRefresh(){
        this.setState({
            refreshing: true
        });        
        this.loadGroup();
    }

    goToGroupMembers(){
        Actions.groupmembers(this.state.data);
    }

    //This provides a user to invite all of their followers to a particular group. 
    //This will eventually be changed to allow a user to choose 1 or more users to invite to a group instead of all
    invite(){
        Alert.alert(
            'Confirm',
            'Are you sure you want to invite all of your followers to join this group?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {

                    }
                },
                {
                    text: 'OK',
                    onPress: () => {
                        var  { token } = this.props;
                        getFollowers(token, 1, 10).then(data => {
                            var users = [];
                            for (var i = 0; i < data.payload.length; i++){
                                users.push(data.payload[i].username);
                            }

                            inviteAllFollowers(token, this.state.data.id, users).then(data => {
                                alert("Invites sent!");
                            })
                            .catch(err => {
                                alert("Cannot send invites at this time. Try again later.");
                            });
                        })
                        .catch(err => {

                        });
                    }
                }
            ],
            {cancelable: false}
        );
    }

    unjoin(){        
        Alert.alert(
            'Are you Sure',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => {

                    }
                },
                {
                    text: 'OK',
                    onPress: () => {
                        var { token, id } = this.props;
                        unJoinGroup(token, id).then(data => {
                            this.state.data.joined = false;
                            this.state.data.total_member = this.state.data.total_member - 1;
                            this.setState({
                                refreshing: false
                            });
                        })
                        .catch(err => {

                        });
                    }
                }
            ],
            {cancelable: false}
        );        
    }

    doJoin() {
        console.log('confirmed')
    }

    join(){
        if(this.state.data.fill_fields_required || this.state.data.membership_control === 'passcode' || this.state.data.membership_control === 'approval') {
            Actions.groupJoin({data: this.state.data})
        } else {
            Alert.alert('Confirmation', 'Are you Sure?', [
                {text: "Ok", onPress: () => this.doJoin()},
                {text: "Cancel", onPress: () => console.log('Cancel pressed'), style: 'cancel'}
            ])
        }
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
                        <Title>Group Profile</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.invite()}>
                            <Label style={{color: 'white'}}>Invite</Label>
                        </Button>
                    </Right>
                </Header>
                <Content 
                    padder
                    refreshControl={
                                <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                    >
                    {this.state.data?
                    <List style={{marginLeft: 17, marginTop: 17}}>
                        <ListItem style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 17}}>
                            {this.state.data.avatar_file_path?
                            <Thumbnail style={styles.avatar} square source={{uri: this.state.data.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}}/>:
                            <View style={styles.avatar}/>
                            }
                            <Body>
                                <Text style={{color: PLColors.main}}>{this.state.data.official_name}</Text>
                                {this.state.data.joined?
                                <Button block style={styles.unjoinBtn} onPress={() => this.unjoin()}>
                                    <Label style={{color: 'white'}}>Unjoin</Label>
                                </Button>:
                                <Button block style={styles.joinBtn} onPress={() => this.join()}>
                                    <Label style={{color: 'white'}}>Join</Label>
                                </Button>                                
                                }                                
                            </Body>
                        </ListItem>
                        {this.state.data.official_description?
                        <ListItem style={styles.listItem}>
                            <Text style={styles.groupDescription}>{this.state.data.official_description}</Text>
                        </ListItem>:null}
                        {this.state.data.joined?
                        <ListItem style={{borderBottomWidth: 0}}>
                            <Body>
                                <Button block style={{backgroundColor: PLColors.main}}>
                                    <Label style={{color: 'white'}}>Manage</Label>
                                </Button>
                            </Body>
                        </ListItem>:
                        <ListItem style={{borderBottomWidth: 0, height: 40}}>
                            <Text> </Text>
                        </ListItem>}
                        {this.state.data.acronym?
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text style={styles.listItemTextField}>Acronym</Text>
                                <Text style={styles.listItemValueField}>{this.state.data.acronym}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.data.membership_control?
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text style={styles.listItemTextField}>Membership</Text>
                                <Text style={styles.listItemValueField}>{this.state.data.membership_control}</Text>
                            </Body>
                        </ListItem>:null}
                        {this.state.data.manager_phone?
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text style={styles.listItemTextField}>Phone Number</Text>
                                <Text style={styles.listItemValueField}>{this.state.data.manager_phone}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.data.official_state || this.state.data.official_city || this.state.data.official_address?
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text style={styles.listItemTextField}>Location</Text>
                                <Text style={styles.listItemValueField}>{this.state.data.official_address} {this.state.data.official_city},{this.state.data.official_state}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.data.total_members?
                        <ListItem style={styles.listItem} onPress={() => this.goToGroupMembers()}>
                            <Body>
                                <Text style={styles.listItemTextField}>Total Members</Text>
                                <Text style={styles.listItemValueField}>{this.state.data.total_members}</Text>
                            </Body>
                        </ListItem>: null}
                        {this.state.permissions.length > 0?
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text style={styles.listItemTextField}>Permissions</Text>
                                <Text style={styles.listItemValueField}>
                                    {
                                        this.state.permissions.join(',')
                                    }
                                </Text>
                            </Body>
                        </ListItem>: null}
                    </List> : null}                  
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupProfile);