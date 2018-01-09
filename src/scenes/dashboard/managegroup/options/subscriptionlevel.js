import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Label as NSLabel, Button, Spinner } from 'native-base';
import { View, Text, Alert, TextInput } from 'react-native';
import { exportReports } from 'PLActions';
import { Actions } from 'react-native-router-flux';
import { Label, Level, Input, PopupLabel } from '../components';
import { groupGetSubscriptions, groupUpdateSubscriptions, groupGetCards } from 'PLActions';
import moment from 'moment';

import styles from '../styles';
import { showToast } from '../../../../utils/toast';

const subscriptionOptions = [{
    price: 0,
    name: "Free",
    title: "Get Started",
    audience: "Unlimited",
    size: "Unlimited",
}, {
    name: "Silver",
    price: 19,
    title: "For Controls",
    audience: "Not Business",
    size: "Under 1k users",
}, {
    name: "Gold",
    price: 39,
    title: "Get Growth",
    audience: "Unlimited",
    size: "Under 5k users",
}, {
    name: "Platinum",
    price: 125,
    title: "For Insights",
    audience: "Not Business",
    size: "Unlimited",
}];

class SubscriptionLevel extends Component {
    constructor(){
        super();
        this.state={
            nextLevel: null,
            referral: ''
        };
    }
    componentDidMount() {
        const { group, getCards } = this.props;
        this.props.getSubscription(group.id);
        this.props.getCards(group.id);
    }

    onSuccess(){
        showToast('Subscription updated');
        this.setState({loading: false});
    }
    onFail(r){
        alert("Something went wrong while updating your subscription. Try again later." + r.message);
        this.setState({loading: false});
    }

    saveSubscription(){
        this.setState({loading: true});
        let level = this.state.nextLevel;
        let referral = this.state.referral;
        console.log(level);
        Alert.alert(
        `Update subscription to ${level}`,
        `Are you sure?`,
            [{text: 'No', onPress: () => this.setState({loading: false})},
            {text: 'Yes', onPress: () => this.props.updateSubscription(this.props.group.id, level.toLowerCase(), referral, {onSuccess: () => this.onSuccess(), onFail: (e) => this.onFail(e)})}]
      );
    }

    selectSubscription (level, hasCard) {
        if (!hasCard){
            alert('Please add a payment method before selecting a subscription');
            return;
        }
        this.setState({nextLevel: level});
    }

    render() {
        console.log('subscription level props', this.props);
        let hasCard = this.props.cards && this.props.cards.length > 0;

        console.log('~>', this.props);
        return (
            <View>
                {
                  (this.props.subscription && this.props.subscription.package_type)
                ? <Label>{`Current Account: ${this.props.subscription.package_type.charAt(0).toUpperCase() + this.props.subscription.package_type.slice(1)}`}</Label>
                : <Spinner />
                }
                {
                  subscriptionOptions.map((level, index) => (
                      <Level
                          isSelected={level.name.toUpperCase() === (this.state.nextLevel || (this.props.subscription && this.props.subscription.package_type) || '').toUpperCase()}
                          name={level.name}
                          price={level.price}
                          title={`${level.title} - ${level.name}`}
                          audience={level.audience}
                          size={level.size}
                          onPress={() => this.selectSubscription(level.name, hasCard)}
                    />
                  ))
                }
                {
                  (this.state.nextLevel && this.state.nextLevel.toUpperCase() !== (this.props.subscription && this.props.subscription.package_type).toUpperCase()) &&
                  <View>
                      <TextInput style={styles.referral} value={this.state.referral} placeholder='Enter referral/coupon' placeholderTextColor='#ddd' onChange={(v) => this.setState({referral: v})} />
                      {
                          this.state.loading
                          ? <Spinner color={'#000066'} />
                          : <Button block style={styles.submitButtonContainer} onPress={() => this.saveSubscription()}>
                              <NSLabel style={styles.submitButtonText}>{'Save Subscription'}</NSLabel>
                          </Button>
                      }
                      
                  </View>
                }
                {
                  hasCard
                  ? <View>
                      <Text style={styles.cardTitle}>
                          {this.props.subscription && this.props.subscription.next_payment_at ? `Your default card will be charged again on ${moment(this.props.subscription.next_payment_at).format('MMMM Do YYYY')}.` : ''}
                      </Text>
                  </View>
                  : <Label>This group has no associated payment method yet.</Label>
                }
                <Button block style={styles.submitButtonContainer} onPress={() => Actions.groupAddCardScene({group: this.props.group})}>
                    <NSLabel style={styles.submitButtonText}>{hasCard ? 'Manage Payment Methods' : 'Add a Payment Method'}</NSLabel>
                </Button>
            </View>
        );
    }
}

const mapState = (state) => ({
    cards: state.groupManagement.creditCards,
    loadingCards: state.groupManagement.loadingCards,
    subscription: state.groupManagement.subscription
});
const mapActions = (dispatch) => ({
    getCards: (id) => dispatch(groupGetCards(id)),
    getSubscription: (id) => dispatch(groupGetSubscriptions(id)),
    updateSubscription: (id, type, referral, cb) => dispatch(groupUpdateSubscriptions(id, type, referral, cb))
});


export default connect(mapState, mapActions)(SubscriptionLevel);