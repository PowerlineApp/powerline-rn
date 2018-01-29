import React, {Component} from 'react';
import {View, ScrollView, Text, KeyboardAvoidingView, Platform, Modal} from 'react-native';
import PLAddCard from '../../../common/PLAddCard';
import {Actions} from 'react-native-router-flux';
import { userAddCard } from 'PLActions';
import PLColors from 'PLColors';
import { connect } from 'react-redux';

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
    Input,
    Button,
    Icon,
  } from 'native-base';

class UserAddCards extends Component {
    onSave(token) {
        const data = {source: token.tokenId};
        userAddCard(this.props.token, data);
        if (this.props.onSuccess){
            this.props.onSuccess();
        }
    }

    render(){
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button style={{width: '100%'}}  transparent onPress={() => Actions.pop()}>
                            <Icon active name='arrow-back' style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>Add Card</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={{padding: 5}}>
                    <PLAddCard onSave={(token) => this.onSave(token)} />
                </Content>
            </Container>
        );
    }
  }

  
const styles = {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1,
    },
    header: {
        backgroundColor: PLColors.main,
    }
};
export default connect(state => ({
    token: state.user.token,
}))(UserAddCards);