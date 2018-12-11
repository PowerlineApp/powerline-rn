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
import { listServices, offerService, removeService } from "../../actions/services";
import commonColor from "../../configs/commonColor";

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
    //console.log('service props----', this.props);
    listServices(this.props.userDetails.token)
    .then(r => {
      console.log('service props-------------', r);
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
    console.log(sections);
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
    iconName = this.isServiceProvided(serviceId) ? "ios-remove-circle" : "ios-add-circle";
    return (
      <Icon
        name={iconName}
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

  continueServiceProcess = () => {
    this.setState({serviceInfoVisible: false});
    if (this.props.service.third_party_name != null) {
      this.setState({thirdPartyAlertVisible: true});
    }
  }

  render() {
    console.log(this.props.userDetails);
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header
          androidStatusBarColor={commonColor.statusBarLight}
          iosBarStyle="dark-content"
          style={Platform.OS === "ios" ? styles.iosHeader : styles.aHeader}
        >
          <Left />
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
        <Button
          full
          disabled={
            this.props.userDetails && this.props.userDetails.serviceIds && this.props.userDetails.serviceIds.length == 0
          }
          style={styles.buttonContinue}
          onPress={() => Actions.pop()}
        >
          <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
            Continue
          </Text>
        </Button>
        {
          this.state.selectedService &&
          <Modal visible={this.state.serviceOfferConfirmVisible} transparent>
            <ServiceInfo onContinue={this.continueServiceProcess} editable={this.state.serviceInfoEditable}/>
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
                <View style={styles.buttonPanel}>
                  <Button
                    full
                    onPress={() => {
                      if (this.state.selectedService.is_signup_protected && this.state.signupCode.length == 0) {
                        Alert.alert("Please input signup code");
                        return;
                      }
                      this.setState({serviceOfferTryAgainVisible: false});
                      this.offerService();
                    }}
                  >
                    <Text>
                      Continue
                    </Text>
                  </Button>
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

// function bindActions(dispatch) {
//   return {
//     // updateUserProfileAsync: userDetails =>
//     //   dispatch(updateUserProfileAsync(userDetails, null, false))
//     listServices: token => dispatch(listServices(token)),
//   };
// }

function mapStateToProps(state) {
  return {
    userDetails: state.user,
    profileUpdating: state.user.profileUpdating
  };
}

export default connect(mapStateToProps)(Services);
