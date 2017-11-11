import React, { Component } from 'react';
import { View } from 'react-native';
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
    Item,
    List,
    ListItem,
    Input,
    Button,
    Icon,
    Form,
    Text
} from 'native-base';
import { Actions } from 'react-native-router-flux'
import styles from './styles'
import Stripe from 'tipsi-stripe'
import PLBankAccount from '../../../../../common/PLBankAccount'
class GroupBankAccount extends Component {

    onSave(token, params) {
        console.log('onSave', {token, params})
    }
    render() {
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon active name="arrow-back" style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>Bank Account</Title>
                    </Body>
                </Header>
                <Content padder >
                    <PLBankAccount onSave={this.onSave} />        
                </Content>
            </Container>
        )
    }
}

export default GroupBankAccount
