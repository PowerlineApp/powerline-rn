import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Content,
    Header,
    Body,
    Title,
    Left,
    Right,
    Label,
    Thumbnail,
    List,
    ListItem,
    Button,
    Icon,
    Text
} from 'native-base';
import styles from './styles';
const PLColors = require('PLColors');

class ManageGroup extends Component{
    static propTypes = {
        token: React.PropTypes.string
    };

    constructor(props){
        super(props);
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
                        <Title style={{ color: 'white' }}>Manage Group</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Text> </Text>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List style={styles.list}>
                        <ListItem style={styles.groupHeaderContainer}>
                            {this.props.group.avatar_file_path?
                            <Thumbnail style={styles.avatar} square source={{uri: this.props.group.avatar_file_path}}/>:
                            <View style={styles.avatar}/>
                            }
                            <Body>
                                <Text style={{color: PLColors.main}}>
                                    {this.props.group.official_name}
                                </Text>
                            </Body>
                        </ListItem>
                        <ListItem style={{height: 30}}/>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Profile Setup</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Subscription Level</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Funraiser Setup</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Membership Control</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Group Permissions</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Manage Group Members</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Group Sections/Sub-Groups</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Invites</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Reports</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-down"/>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}

export default connect()(ManageGroup);