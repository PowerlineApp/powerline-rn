import React, {Component} from 'react';
import {View, ScrollView, Text, KeyboardAvoidingView, Platform, Modal} from 'react-native';
import {Actions} from 'react-native-router-flux';
import moment from 'moment';
import PLAddCard from '../../../common/PLAddCard';
import { answerPoll, loadUserCards, userAddCard, answerPollPut } from 'PLActions';
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
    Spinner
  } from 'native-base';

import Option from './option';

const fundraiserThanksMessage = (amount, date) => (`Thank you! A receipt has been sent to your e-mail address on file confirming that you paid ${amount} on ${date}.`);
const crowdfundingThanksMessage = (amount, deadline, goal) => (`Thanks for your pledge. You will be charged $${amount} on ${dealine} if  this campaign reaches ${goal} in pledges and a receipt will be e-mailed at that time.`);

class Options extends Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            options: props.item.poll.options.map(opt => ({...opt, checked: props.item.entity.type !== 'crowdfunding-payment-request' && props.item.answers[0] && props.item.answers[0].option.id === opt.id})),
            checked: null
        };
    }

    alertMessage(){
        let message;
        let item = this.props.item;
        if (item.crowdfunding_deadline) {
            message = crowdfundingThanksMessage(this.state.amount, item.crowdfunding_deadline, item.crowfunding_goal_amount);
        } else {
            message = fundraiserThanksMessage(this.state.amount, moment().format('MMMM Do YYYY') );
        }

        alert(message);
    }

    verifyCardAndSendAnswer(){
        let {token, item} = this.props;
        loadUserCards(this.props.token).then(r => {
            let shouldAddCard =  !r.length >= 1;
            if (!shouldAddCard){
                if (item.answers[0]){
                    this.changeAnswer(token, item.entity.id , this.state.options[this.state.checked].id, item.poll.is_user_amount ? this.state.amount : null ).then(r => {
                        this.alertMessage();
                        this.setState({voting: false});
                    }).catch(e => {
                        alert('error :' + e.message);
                        console.warn('error: ', e);
                    });
                } else {
                    this.sendAnswer(token, item.entity.id , this.state.options[this.state.checked].id, item.poll.is_user_amount ? this.state.amount : null ).then(r => {
                        this.alertMessage();
                        this.setState({voting: false});
                    }).catch(e => {
                        alert('error :' + e.message);
                        console.warn('error: ', e);
                    });
                    this.props.onVote();                    
                }
            } else {
                alert("You don't have any credit cards setup yet, please add your card info to proceed with payment");
                this.setState({voting: false});
                Actions.userAddCardScene({onSuccess: () => {Actions.pop(); alert('Your default payment method is now setup. Please try again.');}});
            }
        });
    }

    setChecked(index, amount) {
        console.log(index, amount);
        if (this.state.voting) return;
        let {options} = this.state;
        let {token, item} = this.props;
        options = options.map((opt, i) => ({...opt, checked: i === index }));

        this.setState({options, checked: index, amount});
        if (this.props.item.entity.type !== 'crowdfunding-payment-request'){
            this.props.item.answers[0]
            ? this.changeAnswer(token, item.entity.id, options[index].id).then(r => {
                this.setState({voting: false});
            })
            : this.sendAnswer(token, item.entity.id, options[index].id).then(r => {
                this.setState({voting: false});
            });
            this.props.onVote();
        }
    }

    sendAnswer(token, id, answerId, answerAmount){
        console.log('sending another answer...');
        this.setState({voting: true});
        return answerPoll(token, id , answerId, answerAmount);
    }
    
    changeAnswer(token, id, answerId, answerAmount) {
        console.log('changing answer...');
        this.setState({voting: true});
        return answerPollPut(token, id, answerId, answerAmount);
    }

    sendPayment(){
        this.setState({voting: true});
        console.log('THIS => ', this);
        this.verifyCardAndSendAnswer();
    }

    renderPaymentButton(){
        return this.state.amount ?
            this.state.voting 
            ? <Spinner color='blue' />
            : <Button block style={styles.submitButtonContainer} onPress={() => this.sendPayment()} >
                <Label style={{color: 'white'}}>{`Pay $${this.state.amount} now `}</Label>
            </Button>
            
        : null;
    }

    alreadyDonatedText(item){
        if (item.entity.type === 'crowdfunding-payment-request' && this.props.item.answers[0]) {
            return (
                <Text style={styles.alreadyDonatedText}>{"You've already donated to this fundraiser. \nFeel free to donate again"}</Text>
            );
        }
    }
    crowdfundingInfo(item){
        if (item.entity.type === 'crowdfunding-payment-request') {
            return (
                item.poll.is_crowdfunding_completed
                ? <Text>Woohoo! this is a completed crowdfunding :) </Text>
                : item.expired 
                ? <Text>Unfortunately this crowdfunding is expired</Text>
                : <Text>This crowdfunding will end at {moment(item.poll.crowdfunding_deadline).format('DD/MM/YY hh:mm')} and the objective is ${item.poll.crowdfunding_goal_amount}</Text>
            );
        }
    }

    renderPastInfo(){
        return <Text>You cannot vote on this expired content</Text>;
    }


    render(){
        let {item} = this.props;
        let {options} = this.state;
        console.log(this.state);

        return (
            <View style={styles.optionsContainer}>
                {
                    this.crowdfundingInfo(item)
                }
                {
                    !item.expired
                    ? options.map((opt, i) => {
                        console.log(opt);
                        return <Option type={item.entity.type} opt={opt} onCheck={(value) => this.setChecked(i, value)} />;
                    })
                    : this.renderPastInfo(item)
                }
                {this.alreadyDonatedText(item)}
                {
                    item.entity.type === 'crowdfunding-payment-request'
                    ? this.renderPaymentButton()
                    : null
                }
            </View>
        );
    }
}

const styles= {
    optionsContainer: {
        justifyContent: 'flex-start'
    },
    alreadyDonatedText: {
        fontSize: 10
    }
};


export default Options;