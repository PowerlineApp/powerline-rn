import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
    Container,
    Content,
    Header,
    Body,
    Title,
    Card,
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
    Spinner,
    Text
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import Stripe from 'tipsi-stripe';
import { connect } from 'react-redux';
import PLAddCard from '../../../../../common/PLAddCard';
import { groupCreateCard, groupGetCards, groupDeleteCard } from 'PLActions';
class GroupAddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false
        };
        this.onSave = this.onSave.bind(this);
        this.renderCardListOrForm = this.renderCardListOrForm.bind(this);
        this.renderCardList = this.renderCardList.bind(this);
        this.showForm = this.showForm.bind(this);
    }
    
    componentDidMount() {
        const { group, getCards } = this.props;
        this.props.getCards(group.id);
    }

    onSave(token) {
        const data = {source: token.tokenId};
        const {group: {id}} = this.props;
        this.props.createCard(id, data);
        this.setState({showForm: false});
    }

    renderCardList() {
        return (
            <List>
                {this.props.cards.map(card => {
                    console.log(card.id);
                    return (
                        <Card style={{margin: 5, padding: 10}}>
                            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                                <View style={{ justifyContent: 'space-between'}}>
                                    <View style={{margin: 10}}>
                                        <Text style={{color: 'grey', fontSize: 14}}>Brand</Text>
                                        <Text style={{fontSize: 18}}>{card.brand}</Text>
                                    </View>
                                    <View style={{margin: 10}}>
                                        <Text style={{color: 'grey', fontSize: 14}}>Last 4 digits</Text>
                                        <Text style={{fontSize: 18}}>{card.last4}</Text>
                                    </View>
                                </View>
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => this.props.deleteCard(this.props.group.id, card.id)}>
                                        <Icon name='trash' />
                                        <Text>Delete Card</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    );
                })}
            </List>
        );
    }

    renderCardListOrForm() {
        if(!this.props.loadingCards) {
            if(!this.state.showForm && this.props.cards && this.props.cards.length >= 1) {
                return this.renderCardList();
            } else {
                return (
                    <PLAddCard onSave={this.onSave} />
                );
            }
        }else {
            return (
                <Spinner color='blue' />
            );
        }
    }

    showForm() {
        if(this.state.showForm) {
            this.setState({
                showForm: false
            });
        } else {
            this.setState({
                showForm: true
            });
        }
    }
    render() {
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
                    {this.props.cards && this.props.cards.length >= 1
                        ? <Right>
                            <TouchableOpacity onPress={() => this.showForm()}>
                                <Icon name='plus' size={30} color='#ffffff' />
                            </TouchableOpacity>
                        </Right>
                        : <Right />
                    }
                </Header>
                <Content style={{padding: 5}}>
                    {this.renderCardListOrForm()}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    cards: state.groupManagement.creditCards,
    loadingCards: state.groupManagement.loadingCards
});

const mapDispatchToProps = (dispatch) => ({
    createCard: (id, data) => dispatch(groupCreateCard(id, data)),
    getCards: (id) => dispatch(groupGetCards(id)),
    deleteCard: (id, cardId) => dispatch(groupDeleteCard(id, cardId))
});


export default connect(mapStateToProps, mapDispatchToProps)(GroupAddCard);
