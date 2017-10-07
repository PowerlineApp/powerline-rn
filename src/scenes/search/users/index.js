import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Alert,
    TouchableOpacity
} from 'react-native';

import {
    List,
    ListItem,
    Text,
    Content,
    Left,
    Body,
    Thumbnail,
    Right,
    Icon,
    Container,
    View
} from 'native-base';
import { Actions } from 'react-native-router-flux';
const PLColors = require('PLColors');
import styles from './styles';
import { putFollowings } from 'PLActions';

class SearchUsers extends Component{
    constructor(props){
        super(props);
    }

    follow(index){
        var { token } = this.props;
        putFollowings(token, this.props.users[index].id)
        .then(() => {
            this.props.onRemove(index);
        })
        .catch(err => {
            
        });
    }

    goToProfile(id){
        Actions.profile({id: id});
    }

    render(){
        return (
            <Container style={styles.container}>
            <Content>
                <List>
                    {
                        this.props.users.map((user, index) => {
                            return (
                                <ListItem avatar key={index} onPress={() => this.goToProfile(user.id)}>
                                    <Left>
                                        {user.avatar_file_name?
                                        <Thumbnail source={{uri: user.avatar_file_name}}/>:
                                        <Thumbnail source={require("img/blank_person.png")}/>
                                        }
                                    </Left>
                                    <Body>
                                        <Text>{user.username}</Text>
                                        <Text note>{user.full_name}</Text>
                                    </Body>
                                    <Right style={styles.itemRightContainer}>
                                            <TouchableOpacity onPress={() => this.follow(index)}>
                                                <View style={styles.buttonContainer}>                                    
                                                    <Icon name="ios-person" style={styles.activeIconLarge}/>                                                
                                                    <Icon name="add-circle" style={styles.activeIconSmall}/>
                                                </View>
                                            </TouchableOpacity>
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

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(SearchUsers);