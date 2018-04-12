import React from "react";
import {
  Alert,
  FlatList,
  TouchableHighlight,
  View,
  Image,
  Text,
  TouchableOpacity
} from "react-native";
import { MenuContext } from "react-native-popup-menu";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  Header,
  Left,
  Right,
  Title,
  Body,
  Button,
  Icon,
  Item,
  Input
} from "native-base";

import {
  loadUserCards,
  userRemoveCard,
  userAddCard
} from "../../../actions/users";

import styles from "./styles";

const PLACEHOLDER_SOURCE = [
  {
    key: 0,
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    date: "January 2nd, 2018",
    name: "Christian"
  },
  {
    key: 1,
    avatar: "https://randomuser.me/api/portraits/men/27.jpg",
    date: "January 21st, 2018",
    name: "Robert"
  },
  {
    key: 2,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    date: "Feburary 3rd, 2018",
    name: "Thomas"
  },
  {
    key: 3,
    avatar: "https://randomuser.me/api/portraits/men/59.jpg",
    date: "March 7th, 2018",
    name: "Elliot"
  },
  { key: 4, add: true }
];

class UserCards extends React.Component {
  state = { cards: [] };

  componentDidMount = () => {
    this.loadCards();
  };

  loadCards = () => {
    loadUserCards(this.props.token)
      .then(data => {
        this.setState({ cards: data }, () => {
          console.warn("Cards:", this.state.cards);
        });
      })
      .catch(err => {
        Actions.pop();
      });
  };

  deleteCard = card => {
    userRemoveCard(this.props.token, card.id)
      .then(() => {
        const cards = this.state.cards.filter(c => c.id != card.id);
        this.setState({ cards });
      })
      .catch(err => {
        console.error("Error:", err);
        Alert.alert(
          "Oops",
          "There was an error removing your card, please try again later."
        );
      });
  };

  render() {
    return (
      <MenuContext>
        <Header searchBar rounded style={styles.header}>
          <Left
            style={{
              flex: 0.1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button style={{ width: "100%" }} transparent onPress={Actions.pop}>
              <Icon active name="arrow-back" style={{ color: "white" }} />
            </Button>
          </Left>
          <Body>
            <Title>Manage Cards</Title>
          </Body>
        </Header>
        <Text style={styles.description}>
          Your payment information is securely stored for your convenience with
          Stripe, our industry-grade PCI-compliant payment processor. You may
          remove your card at any time.
        </Text>
        <FlatList
          data={this.state.cards.concat({ key: "add", add: true })}
          renderItem={({ item }) => {
            if (item.add) {
              return (
                <View
                  style={{
                    marginVertical: 20,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Actions.userAddCardScene({
                        onSuccess: data => {
                          Actions.pop();
                          const { id, cards } = data;
                          this.setState({ cards });
                          alert("You've successfully added a new card");
                        }
                      });
                    }}
                  >
                    <Text style={styles.itemLabel}>Add a new card</Text>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <View style={styles.item}>
                  <Icon style={styles.cardIcon} name="ios-card" color="black" />
                  <View style={styles.itemInfoContainer}>
                    <Text style={[styles.numberGroup, styles.mask]}>····</Text>
                    <Text style={[styles.numberGroup, styles.mask]}>····</Text>
                    <Text style={[styles.numberGroup, styles.mask]}>····</Text>
                    <Text style={styles.numberGroup}>{item.last4}</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.deleteCard(item)}>
                    <Icon
                      style={styles.deleteIcon}
                      name="md-close-circle"
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              );
            }
          }}
        />
      </MenuContext>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  token: user.token
});

export default connect(mapStateToProps)(UserCards);
