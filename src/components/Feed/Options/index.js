import React, {Component} from 'react';
import { connect } from 'react-redux';

import {View, ScrollView, Text, KeyboardAvoidingView, Platform, Modal, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import moment from 'moment';
import PLAddCard from '../../../common/PLAddCard';
import { answerPoll, loadUserCards, userAddCard, answerPollPut, markAsRead } from 'PLActions';
import {presentNewCalendarEventDialog} from 'react-native-add-calendar-event';
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

const fundraiserThanksMessage = (amount, date) => (`Thank you! Your $${amount} payment was successful. A receipt has been sent to your e-mail address.`);
const crowdfundingThanksMessage = (amount, deadline, goal) => (`Thanks for your pledge. You will be charged $${amount} on ${deadline} if  this campaign reaches ${goal} in pledges and a receipt will be e-mailed at that time.`);

class Options extends Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            options: props.item && props.item.options && props.item.options.map(opt => ({...opt, checked: props.item.type !== 'crowdfunding-payment-request' && props.item.type !== 'payment-request' && props.item.answer && props.item.answer.option === opt.id})),
            checked: null
        };
    }

    alertMessage(){
        let message;
        let item = this.props.item;
        console.log(item.crowdfunding_deadline);
        if (item.crowdfunding_deadline) {
            message = crowdfundingThanksMessage(this.state.amount, item.crowdfunding_deadline, item.crowdfunding_goal_amount);
        } else {
            message = fundraiserThanksMessage(this.state.amount, moment().format('MMMM Do YYYY') );
        }

        Alert.alert('Thank you!', message);
    }

    verifyCardAndSendAnswer(){
        let {token, item} = this.props;
        loadUserCards(this.props.token).then(r => {
            console.log('CARDS => ', r);
            let shouldAddCard =  !r.length >= 1 && Number(this.state.amount) !== 0;
            if (!shouldAddCard){
                this.sendAnswer(token, item.id , this.state.options[this.state.checked].id, this.state.options[this.state.checked].is_user_amount ? this.state.amount : null ).then(r => {
                    this.alertMessage();
                    this.setState({voting: false});
                }).catch(e => {
                    console.log(e);
                    alert('error :' + e.message);
                    console.warn('error: ', e);
                });
                this.props.onVote();                    
            } else {
                alert("You don't have any credit cards setup yet, please add your card info to proceed with payment");
                this.setState({voting: false});
                Actions.userAddCardScene({onSuccess: () => {Actions.pop(); Alert.alert('Saved!', 'Your default payment method is now setup. Please try again.');}});
            }
        });
    }

    markAsRead(item){
        // poll/fundraiser/event is ANSWERED - marked as read
        if (item.read) return;
        this.props.markAsRead(this.props.token, item.id, (item.type === 'post' || item.type === 'user-petition') ? item.type : 'poll');
    }



    setChecked(index, amount) {
        // console.log(index, amount);
        if (this.state.voting) return;
        let {options} = this.state;
        let {token, item} = this.props;
        options = options && options.map((opt, i) => ({...opt, checked: i === index }));

        this.setState({options, checked: index, amount});
        if (this.props.item.type !== 'crowdfunding-payment-request' && this.props.item.type !== 'payment-request' ){
            this.sendAnswer(token, item.id, options[index].id).then(r => {
                this.setState({voting: false});
            });
            this.props.onVote();
        }

        if (item.type === 'leader-event'){
            let eventConfig = {
                title: item.title,	
                startDate: moment(item.started_at).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                endDate: moment(item.finished_at).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                notes: item.body
            };
            // console.log(eventConfig);
            presentNewCalendarEventDialog(eventConfig).then(eventId => {
                if (eventId){
                    // id of event he might have created.
                    // console.log(eventId);
                } else {
                    //dissmissed - mixpanel here?
                }
            }).catch(e => {
                console.log('error => ', e);
            });
        }
    }

    async sendAnswer(token, id, answerId, answerAmount){
        // console.log('sending another answer...', token, id, answerId, answerAmount);
        this.setState({voting: true});
        this.markAsRead(this.props.item);
        let r = await answerPoll(token, id , answerId, answerAmount);
        
        // console.log('res => ', r);
        return new Promise((resolve, reject) => 
            r.status == 200 ? resolve(r) : reject(r)
        );
        // return answerPoll(token, id , answerId, answerAmount).then(r );
    }

    sendPayment(){
        this.setState({voting: true});
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
        console.log('donation----------', item);
        if (item.type === 'crowdfunding-payment-request' && this.props.item.answer) {
            return (
                <Text style={styles.alreadyDonatedText}>{`You've already donated to this crowdfunding. \nYou can change your donation option before the deadline.`}</Text>
            );
        }
        if (item.type === 'payment-request' && this.props.item.answer) {
            return (
                <Text style={styles.alreadyDonatedText}>{`You've already donated to this fundraiser. \nFeel free to donate again`}</Text>
            );
        }
        
    }
    crowdfundingInfo(item){
        if (item.type === 'crowdfunding-payment-request') {
            return (
                item.is_crowdfunding_completed
                ? <Text style={styles.crowdfundingInfo} >This crowdfunding has achieved its goal</Text>
                : item.expired 
                ? <Text style={styles.crowdfundingInfo} >Unfortunately this crowdfunding is expired</Text>
                : <Text style={styles.crowdfundingInfo} >This crowdfunding will end at {moment(item.crowdfunding_deadline).format('DD/MM/YY hh:mm')} and the objective is ${item.crowdfunding_goal_amount}</Text>
            );
        }
    }

    renderPastInfo(){
        let entity = item.crowdfunding_deadline ? 'crowdfunding' : 'fundraiser';
        return <Text style={styles.expired} >This {entity} has already expired.</Text>;
    }


    render(){
        let {item} = this.props;
        let {options} = this.state;
        console.log(options);
        return (
            <View style={styles.optionsContainer}>
                {
                    this.crowdfundingInfo(item)
                }
                {
                    options && options.map((opt, i) => {
                        return <Option key={i} type={item.type} opt={opt} onCheck={(value) => this.setChecked(i, value)} />;
                    })
                }
                {this.alreadyDonatedText(item)}
                {
                    (item.type === 'crowdfunding-payment-request' || item.type === 'payment-request' )
                    ? this.renderPaymentButton()
                    : null
                }
            </View>
        );
    }
}

const styles = {
    optionsContainer: {
        justifyContent: 'flex-start'
    },
    alreadyDonatedText: {
        fontSize: 10,
        color: '#a8a8a8',
        fontWeight: '500'
    },
    crowdfundingInfo: {
        fontSize: 11,
        fontWeight: '500',
        color: '#a5a5a5',
        maxWidth: '80%'
    },
    expired: {
        fontSize: 11,
        fontWeight: '500',
        color: 'b9b9b9'
    }
};


export default connect(() => ({}), {markAsRead})(Options);