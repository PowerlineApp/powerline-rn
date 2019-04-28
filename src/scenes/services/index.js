import React, { Component } from "react";
import { View, Platform, SectionList, AsyncStorage, Modal, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Title,
  Left,
  Right,
  Body,
  Input,
  Spinner
} from "native-base";
/*import {
  updateUserProfileAsync
} from "../../actions/settings";*/
import { Actions } from "react-native-router-flux";
import ServiceInfo from "./serviceInfo";
import styles from "./styles";
import { setService } from "../../actions/services";
import { listServices, offerService, removeService } from "../../actions/services";
import commonColor from "../../configs/commonColor";
import {loadUserCards} from 'PLActions';

class Services extends Component {
  constructor() {
    super();

    this.state = {
      services: [],
      groupingOption: 'category',
      serviceOfferConfirmVisible: false,
      selectedService: null,
      signupCode: '',
      serviceRemoveConfirmVisible: false,
      serviceOfferTryAgainVisible: false,
      errorAlertVisible: false,
      isFetching: true,
      serviceInfoEditable: true,
    }
  }
  componentDidMount() {
    this.loadServices();
  }
  loadServices = () => {
    listServices(this.props.userDetails.token)
    .then(r => {
      this.setState({
        services: r.data,
        isFetching: false
      });
    });
  }
  getSectionsData = () => {
    let sections = [];
    if (this.state.groupingOption === 'category') {
      this.state.services.map((service) => {
        let sectionIndex = sections.map((section) => section.id).indexOf(service.category.id);
        if (sectionIndex == -1) {
          let newSection = {};
          newSection.id = service.category.id;
          newSection.title = service.category.title;
          newSection.data = [service];
          sections.push(newSection);
        }
        else {
          sections[sectionIndex].data.push(service);
        }
      });
    }
    else {
      this.state.services.map((service) => {
        let sectionIndex = sections.map((section) => section.id).indexOf(service.group_id);
        if (sectionIndex == -1) {
          let newSection = {};
          newSection.id = service.group_id;
          newSection.title = service.group_name;
          newSection.data = [service];
          sections.push(newSection);
        }
        else {
          sections[sectionIndex].data.push(service);
        }
      });
    }
    return sections;
  }
  onSelectItem = (item) => {
    this.setState({selectedService: item});
    if (!this.isServiceProvided(item.id)) {
      this.setState({serviceOfferConfirmVisible: true});
    }
    else {
      this.setState({serviceRemoveConfirmVisible: true});
    }
  }
  isServiceProvided(serviceId) {
    const { userDetails } = this.props;
    return userDetails && userDetails.serviceIds && userDetails.serviceIds.indexOf(serviceId) > -1;
  }
  offerService() {
    this.setState({isFetching: true});
    offerService(this.state.selectedService.id, this.state.signupCode, this.props.userDetails.token)
    .then(
      res => {
        let serviceIds = this.props.userDetails.serviceIds;
        let index = serviceIds.indexOf(this.state.selectedService.id);
        //if (index === -1) this.props.updateUserProfileAsync({serviceIds: this.props.userDetails.serviceIds.push(this.state.selectedService.id)});
        let newServices = this.state.services;
        newServices.forEach((service) => {
          if (service.id == this.state.selectedService.id) {
            service.is_provider = true;
          }
        });
        this.setState({
          services: newServices,
          selectedService: null,
          isFetching: false
        });
      },
      err => {
        this.setState({
          serviceOfferTryAgainVisible: true,
          isFetching: false
        });
      }
    )
    .catch(e => {
      this.setState({
        selectedService: null,
        errorAlertVisible: true,
        isFetching: false
      });
    });
    this.setState({signupCode: ''});
  }
  removeService() {
    this.setState({isFetching: true});
    removeService(this.state.selectedService.id, this.props.userDetails.token)
    .then(
      res => {
        let serviceIds = this.props.userDetails.serviceIds;
        let index = serviceIds.indexOf(this.state.selectedService.id);
        if (index !== -1) serviceIds.splice(index, 1);
        //this.props.updateUserProfileAsync({serviceIds: serviceIds});
        let newServices = this.state.services;
        newServices.forEach((service) => {
          if (service.id == this.state.selectedService.id) {
            service.is_provider = false;
          }
        });
        this.setState({
          services: newServices,
          selectedService: null,
          isFetching: false
        });
      },
      err => {
        this.setState({
          selectedService: null,
          errorAlertVisible: true,
          isFetching: false
        });
      }
    )
    .catch(e => {
      this.setState({
        selectedService: null,
        errorAlertVisible: true,
        isFetching: false
      });
    });
    this.setState({signupCode: ''});
  }
  renderIcon = (serviceId) => {
    return (
      <Icon
        name={'ios-arrow-forward'}
        style={{
          ...styles.textColor,
          color: "#1b557a",
          fontWeight: "bold",
          fontSize: 22
        }}
      />
    );
  }
  renderItem = ({ item, index, section }) => {
    return (
      <ListItem
        style={styles.listcustom}
        onPress={() => {this.onSelectItem(item)}}
      >
        <View style={styles.listContainer}>
          <View style={styles.lextText}>
            <Text style={styles.textColor}>{item.title}</Text>
          </View>

          <View style={styles.rightText}>
          {this.renderIcon(item.id)}
          </View>
        </View>
      </ListItem>
    );
  };
  closeModal = () => {
    this.setState({ serviceOfferConfirmVisible: false });

  }


  choosePaymentType = () => {
    return new Promise((resolve, reject) => {
        Alert.alert('Choose payment form', 'This service accepts payments in cash or credit card', [
            {text: 'Cash', onPress: () => resolve('cash')},
            {text: 'Credit Card', onPress: () => resolve('cc')}
        ], {cancelable: false})
    })
  }

  showConfirmation = (service, serviceInfo, paymentType, cards) => {
    let text = ''
      text = `You'll be charged $${service.price} for this service.
            \n Payment type: ${paymentType === 'cc' ? `Credit Card, ${cards[0].brand} - ${cards[0].last4}` : 'Cash'}
            \n Reservation: ${serviceInfo.reservation_details}
            `
    return new Promise((resolve, reject) => {
      Alert.alert(service.title, text, [
        {text: 'Confirm', onPress: () => this.finishRequest(service, serviceInfo, paymentType)},
        {text: 'Cancel', onPress: () => {}}
    ], {cancelable: false})
    })
  }

  certifyUserHasCreditCard = () => {
      return new Promise(async (resolve, reject) => {
          const cards = await loadUserCards(this.props.userDetails.token)
          if (!cards.length) {
              await this.setState({showLoadingModal: false})
              Actions.userAddCardScene({
                  onSuccess: () => {
                      Actions.pop(); Alert.alert('Saved!', 'Your default payment method is now setup. Please try again.');
                      resolve(this.certifyUserHasCreditCard())
                  },
                  onFail: () => {
                      Actions.pop(); Alert.alert('Something went wrong', 'Something went wrong while updating your payment method. Please try again.');
                      reject()
                  }
              });
          } else {
            resolve(cards)
          }
      })
  }

  onContinue = async (serviceInfo) => {
    // const finalJson =
    const service = this.state.selectedService
    await this.setState({serviceOfferConfirmVisible: false, showLoadingModal: true})
    let paymentType
    let cards
    if (service.type === 'simple') { // simple type... just continue
    } else {
        if (service.type === 'payment') {
            paymentType = 'none'
            if (service.payment_type === 'both') { // ask if money or cc
                paymentType = await this.choosePaymentType()
            } else {
                paymentType = service.payment_type
            }
            if (paymentType === 'cc') {  // check if user has a cc setup
              try {
                cards = await this.certifyUserHasCreditCard()
              } catch (error) { // something went wrong certifying user card... abort
                return 
              }
            }
        } else if (service.type === 'butler') { // will not handle yet
        }
    }
    this.showConfirmation(service, serviceInfo, paymentType, cards)
  }

  onBack = () => {
    this.props.navigation.goBack();
  };


  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header
          androidStatusBarColor={commonColor.statusBarLight}
          iosBarStyle="dark-content"
          style={Platform.OS === "ios" ? styles.iosHeader : styles.aHeader}
        >
          <Left>
            <Button
              transparent
              onPress={() => this.onBack()}
              style={{ width: 200, height: 50 }}
            >
              <Icon active name="arrow-back" style={{ color: "#6A6AD5" }} />
            </Button>
          </Left>
          <Body>
            <Title
              style={
                Platform.OS === "ios"
                  ? styles.iosHeaderTitle
                  : styles.aHeaderTitle
              }
            >
              Choose Services
            </Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => {
                if (this.state.groupingOption === 'category') {
                  this.setState({groupingOption: 'group'});
                }
                else {
                  this.setState({groupingOption: 'category'});
                }
              }}
            >
              <Icon name='ios-options' style={{ fontSize: 28, color: commonColor.brandPrimary }}/>
            </Button>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#f2f4f6" }}>
          <SectionList
            sections={this.getSectionsData()}
            renderItem={this.renderItem}
            renderSectionHeader={({section: {title}}) => (
              <Text style={styles.headerTitle}>{title}</Text>
            )}
            extraData={this.props.userDetails}
            style={{ borderTopWidth: 2, borderTopColor: "#ddd" }}
          />
        </Content>

        {
          this.state.selectedService &&
          <Modal visible={this.state.serviceOfferConfirmVisible} transparent>
            <ServiceInfo
              onContinue={this.onContinue}
              editable={this.state.serviceInfoEditable}
              service={this.state.selectedService}
              onClose={this.closeModal} />
          </Modal>
        }
        {
          this.state.selectedService &&
          <Modal visible={this.state.serviceOfferTryAgainVisible} transparent>
            <View style={styles.overlay}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    serviceOfferTryAgainVisible: false,
                    signupCode: ''
                  });
                }}
                style={styles.overlayTouch}
              >
              </TouchableOpacity>
              <View style={styles.serviceOfferTryAgain}>
                <View style={styles.serviceOfferTryAgainContent}>
                  <Text style={styles.serviceOfferTryAgainText}>
                    Your code was not correct. Try again.
                  </Text>
                  <Text style={styles.serviceOfferTryAgainTitle}>
                    {this.state.selectedService.title}
                  </Text>
                  <Input value={this.state.signupCode} onChangeText={(text) => {this.setState({signupCode: text})}} placeholder='Enter your signup code here' style={styles.serviceConfirmInput}/>
                </View>

              </View>
            </View>
          </Modal>
        }
        {
          this.state.selectedService &&
          <Modal visible={this.state.serviceRemoveConfirmVisible} transparent>
            <View style={styles.overlay}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({serviceRemoveConfirmVisible: false});
                }}
                style={styles.overlayTouch}
              >
              </TouchableOpacity>
              <View style={styles.serviceRemoveConfirm}>
                <View style={styles.serviceConfirmContent}>
                  <Text style={styles.serviceConfirmText}>
                    No longer offer the following service?
                  </Text>
                  <Text style={styles.serviceConfirmTitle}>
                    {this.state.selectedService.title}
                  </Text>
                </View>
                <View style={styles.buttonPanel}>
                  <Button
                    full
                    onPress={() => {
                      this.setState({serviceRemoveConfirmVisible: false});
                      this.removeService();
                    }}
                  >
                    <Text>
                      OK
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        }
        <Modal visible={this.state.errorAlertVisible} transparent>
          <View style={styles.overlay}>
            <View style={styles.errorAlert}>
              <Text style={styles.errorAlertText}>
                The precess was not performed. Please try again later.
              </Text>
              <View style={styles.buttonPanel}>
                <Button
                  full
                  onPress={() => {
                    this.setState({errorAlertVisible: false});
                  }}
                >
                  <Text>
                    OK
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={this.state.isFetching} transparent>
          <View style={styles.overlay}>
            <View style={styles.spinnerContainer}>
              <Spinner/>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    // updateUserProfileAsync: userDetails =>
    //   dispatch(updateUserProfileAsync(userDetails, null, false))
    //listServices: token => dispatch(listServices(token)),
    //setService: service => dispatch(setService(service)),
  };
}

function mapStateToProps(state) {
  return {
    userDetails: state.user,
    profileUpdating: state.user.profileUpdating
  };
}

export default connect(mapStateToProps)(Services);
