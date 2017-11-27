import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Label as NSLabel, Button, Spinner } from 'native-base';
import { View, Text, Alert } from 'react-native';
import { exportReports } from 'PLActions';
import { Actions } from 'react-native-router-flux';
import { Label, Level, Input, PopupLabel } from '../components';
import { groupGetSubscriptions, groupUpdateSubscriptions, groupGetCards } from 'PLActions';
import moment from 'moment';

import styles from '../styles';

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
  componentDidMount() {
    const { group, getCards } = this.props;
    this.props.getSubscription(group.id)
    this.props.getCards(group.id);
  }
  selectSubscription = (level) => {
    console.log(level)
    Alert.alert(
      `Update subscription to ${level}`,
      `Are you sure?`,
      [
        {text: 'No', onPress: () => console.log('canceled')},
        {text: 'Yes', onPress: () => this.props.updateSubscription(this.props.group.id, level.toLowerCase())}      
      ]
    );
  }

  render() {
    console.log('subscription level props', this.props);
    let hasCard = this.props.cards && this.props.cards.length > 0;
    // if (this.props.subscription && this.props.subcription.code > 400) {
    //   return (
    //     <Label>You do not have permission to see this content</Label>
    //   )
    // }
    return (
      <View>
        {(this.props.subscription && this.props.subscription.package_type)
           ? <Label>{`Current Account: ${this.props.subscription.package_type.charAt(0).toUpperCase() + this.props.subscription.package_type.slice(1)}`}</Label>
          : <Spinner />
        }
        {
          subscriptionOptions.map((level, index) => (
            <Level
              isSelected={level.name === "Free"}
              name={level.name}
              price={level.price}
              title={level.title}
              audience={level.audience}
              size={level.size}
              onPress={() => this.selectSubscription(level.name)}
            />
          ))
        }
        {
          hasCard
          ? 
          <View>
            <Text style={styles.cardTitle}>
            Your default card will be charged again on {moment(this.props.subscription.next_payment_at).format('MMMM Do YYYY')}
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
})
const mapActions = (dispatch) => ({
  getCards: (id) => dispatch(groupGetCards(id)),
  getSubscription: (id) => dispatch(groupGetSubscriptions(id)),
  updateSubscription: (id, type) => dispatch(groupUpdateSubscriptions(id, type))
})


export default connect(mapState, mapActions)(SubscriptionLevel);