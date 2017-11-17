import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Label as NSLabel, Button } from 'native-base';
import { View, Text, Alert, Spinner } from 'react-native';
import { exportReports } from 'PLActions';
import { Actions } from 'react-native-router-flux';
import { Label, Level, Input, PopupLabel } from '../components';
import { groupGetSubscriptions, groupUpdateSubscriptions } from 'PLActions'
import styles from '../styles';

const subscriptionOptions = [{
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
    this.props.getSubscription(this.props.group.id)
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
    console.log(this.props);
    return null;
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
        <Label>This group has no associated payment card.</Label>
        <Button block style={styles.submitButtonContainer} onPress={() => Actions.groupAddCardScene({group: this.props.group})}>
          <NSLabel style={styles.submitButtonText}>Manage Payment Methods</NSLabel>
        </Button>
      </View>
    );
  }
}

const mapState = (state) => ({
  subscription: state.groupManagement.subscription
})
const mapActions = (dispatch) => ({
  getSubscription: (id) => dispatch(groupGetSubscriptions(id)),
  updateSubscription: (id, type) => dispatch(groupUpdateSubscriptions(id, type))
})
export default connect(mapState, mapActions)(SubscriptionLevel);