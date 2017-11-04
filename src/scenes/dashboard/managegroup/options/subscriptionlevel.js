import React, { PureComponent, PropTypes } from 'react';
import { Label as NSLabel, Button } from 'native-base';
import { View, Text } from 'react-native';
import { exportReports } from 'PLActions';

import { Label, Level, Input, PopupLabel } from '../components';
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

class SubscriptionLevel extends PureComponent {
  static propTypes = {
    group: PropTypes.shape({
      subscriptionLevel: PropTypes.string,
      //
      owner: PropTypes.string,
      official_name: PropTypes.string,
      official_description: PropTypes.string,
      official_address: PropTypes.string,
      official_city: PropTypes.string,
      official_state: PropTypes.string,
      official_type: PropTypes.string,
      acronym: PropTypes.string,
    }),
  };

  selectSubscription = (level) => {
    ALERT(level);
  }

  render() {
    LOG(this.props.group)
    const { subscriptionLevel } = this.props.group;
    return (
      <View>
        <Label>{`Current Account: ${subscriptionLevel}`}</Label>
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
        <Button block style={styles.submitButtonContainer}>
          <NSLabel style={styles.submitButtonText}>Add Payment Card</NSLabel>
        </Button>
      </View>
    );
  }
}

export default SubscriptionLevel;