import React, { Component } from 'react';
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
    View
} from 'native-base';

const PLColors = require('PLColors');
import styles from './styles';

class SearchGroups extends Component{

    render(){
        return (
            <Container style={styles.container}>
                <Content>
                    <List style={{backgroundColor: 'white', marginLeft: 17,marginRight: 17}}>
                        {
                            this.props.groups.map((group, index) => {
                                return (
                                    <ListItem style={styles.listItem} key={index}>
                                        {
                                            group.avatar_file_path?
                                            <Thumbnail square source={{uri: group.avatar_file_path}}/>:
                                            <View style={{width: 56, height: 56}}/>
                                        }
                                        <Body>
                                            <Text style={styles.text1}>{group.official_name}</Text>
                                        </Body>
                                        <Right>
                                            <Button transparent>
                                                <Icon active name="add-circle" style={{color: '#11c1f3'}}/>
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