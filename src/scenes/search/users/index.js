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
    Container
} from 'native-base';
import { Actions } from 'react-native-router-flux';
const PLColors = require('PLColors');
import styles from './styles';

class SearchUsers extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Container style={styles.container}>
            <Content>
                <List>
                    {
                        this.props.users.map((user, index) => {
                            return (
                                <ListItem avatar key={index}>
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