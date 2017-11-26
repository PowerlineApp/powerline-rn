import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Content,
    Text,
    Button,
    Label,
    Icon,
    Right,
    Left,
    Thumbnail,
    List,
    ListItem,
    Body,
    View,
} from 'native-base';
import { joinGroup, unJoinGroup } from 'PLActions';
const PLColors = require('PLColors');
import styles from './styles';

class SearchGroups extends Component{

    goToProfile(group){
        Actions.groupprofile(group);
    }

    join(group){
        console.log('group', group);
        if(group.fill_fields_required || group.membership_control === 'passcode' || group.membership_control === 'approval' && !group.joined && !group.user_role) {
            Actions.groupJoin({data: group});
        } else {
            Alert.alert('Confirmation', 'Are you Sure?', [
                {text: "Ok", onPress: () => this.doJoin(group.id)}, 
                {text: "Cancel", onPress: () => console.log('Cancel pressed'), style: 'cancel'}
            ]);
        }
    }
    
    doJoin(id){
        var { token } = this.props;
        joinGroup(token, id).then(data => {
            if(data.join_status == 'active'){
                Actions.myGroups();
            }
        })
        .catch(err => {
    
        });
    }

    unjoin(group){        
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
                        var { token } = this.props;
                        unJoinGroup(token, group.id).then(data => {
                            this.forceUpdate();
                        })
                        .catch(err => {

                        });
                    }
                }
            ],
            {cancelable: false}
        );        
    }
    
    render(){
        return (
            <Container style={styles.container}>
                <Content>
                    <List style={{backgroundColor: 'white', marginLeft: 17,marginRight: 17}}>
                        {
                            this.props.groups.map((group, index) => {
                                return (
                                    <ListItem style={styles.listItem} key={index} onPress={() => this.goToProfile(group)}>
                                        {
                                            group.avatar_file_path?
                                                <Thumbnail square source={{uri: group.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}} />:
                                            <View style={{width: 56, height: 56}} />
                                        }
                                        <Body>
                                            <Text style={styles.text1}>{group.official_name}</Text>
                                        </Body>
                                        <Right>
                                            <Button transparent>
                                                {   group.joined 
                                                    ? <Icon active name='add-circle' style={{color: '#802000'}} onPress={() => this.unjoin(group)} />
                                                    : <Icon active name='add-circle' style={{color: '#11c1f3'}} onPress={() => this.join(group)} />
                                                }
                                            </Button>
                                        </Right>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Content>
            </Container>
        );
    }
}

const  mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(SearchGroups);