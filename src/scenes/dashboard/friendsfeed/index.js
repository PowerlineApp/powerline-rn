// This is the Friends Feed tab which combines two concepts 1) the newsfeed with specific settings for only showing items by followed users, and 2) A shortcut to the My Influences screen
// See: https://api-dev.powerli.ne/api-doc#get--api-v2-activities followed and non-followed
// GH51

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Content,
    Text,
    Grid,
    Col,
    Label,
    Button,
    View
} from 'native-base';
import styles from './styles';
import FriendActivity from './activities';

//There are two tabs 1) The feed itself, and 2) a tab that is actually a shortcut to the My Influences screen
class Friendsfeed extends Component{
    static propTypes = {
        token: React.PropTypes.string
    }

    constructor(props){
        super(props);
    }

    onInfluence(){
         Actions.myInfluences();
    }

    render(){
        return (
            <Container style={styles.container}>
                <View style={{height: 45}}>
                <Grid>
                    <Col>
                        <Button block style={styles.activeBtn}>
                            <Label style={styles.btnText}>Posts by Friends</Label>
                        </Button>
                    </Col>
                    <Col>
                        <Button block style={styles.btn} onPress={() => this.onInfluence()}>
                            <Label style={styles.btnText}>Manage Followers</Label>
                        </Button>
                    </Col>
                </Grid>
                </View>
                <FriendActivity/>
            </Container>
        );
    }
}

export default connect()(Friendsfeed);