import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  BackHandler
} from "react-native";
import _ from "lodash";
import PropTypes from "prop-types";
import {
  Text,
  Button,
  Input,
  Textarea,
  DatePicker
} from "native-base";
import { Actions } from "react-native-router-flux";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
//import { setService } from "../../../actions/rider/home";
import styles from "./styles";
import commonColor from "../../../../native-base-theme/variables/commonColor";

const deviceHeight = Dimensions.get("window").height;

class ServiceInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
          memo: '',
          reservation_date: moment().format('YYYY-MM-DD hh:mm:ss A'),
          reservation_number: 1,
          editable: props.editable,
          isDateTimePickerVisible: false
        };
    }

    componentDidMount() {
        let props = this.props;
        this.setState({
            memo: props.service.memo_placeholder,
            reservation_date: (props.service.reservation_details && props.service.reservation_details.indexOf(' | ') > -1) ? moment(props.service.reservation_details.split(' | ')[0]).format('YYYY-MM-DD hh:mm:ss A') : moment().format('YYYY-MM-DD hh:mm:ss A'),
            reservation_number: (props.service.reservation_details && props.service.reservation_details.indexOf(' | ') > -1) ? parseInt(props.service.reservation_details.split(' | ')[1]) : 1
        });
    }

    onContinue = () => {
        let newService = this.props.service;
        if (newService) {
            newService.memo = this.state.memo;
            newService.reservation_details = `${moment(this.state.reservation_date).format('YYYY-MM-DD HH:mm:ss.SSS')} | ${this.state.reservation_number}`;
            //this.props.setService(newService);
        }
        this.props.onContinue();
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
    
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        this.setState({reservation_date: moment(date).format('YYYY-MM-DD hh:mm:ss A')});
        this._hideDateTimePicker();
    };

    render() {
        const { service } = this.props;
        console.log('selected service---------', service);
        const popupHeight = service && service.is_reservation ? 440 : 310;
        const popupTop = (deviceHeight - popupHeight) / 2;
        return (
            <View style={styles.overlay}>
                <View style={[styles.infoView, {height: popupHeight, top: popupTop}]}>
                    <View style={styles.titleItem}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>{this.props.service.title}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>Price: {this.props.service.price}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>Surcharge: {this.props.service.surcharge}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>By: {this.props.service.third_party_name === null ? '' : this.props.service.third_party_name}</Text>
                    </View>
                    <View style={styles.textAreaItem}>
                        <Textarea
                            style={styles.memoArea}
                            placeholder={this.props.service.memo_placeholder}
                            value={this.state.memo}
                            editable={this.props.editable}
                            selectTextOnFocus={this.props.editable}
                        />
                    </View>
                    {
                        
                        <View style={styles.item}>
                            <Text>Reservation</Text>
                            <View style={styles.reservationPanel}>
                                <View style={styles.reservationItem}>
                                    <Text>
                                        Date/Time:
                                    </Text>
                                    <Button
                                        transparent
                                        onPress={this.props.editable ? this._showDateTimePicker : () => {}}
                                        style={styles.dateButton}
                                    >
                                        <Text style={styles.dateText}>
                                            {this.state.reservation_date.toString()}
                                        </Text>
                                    </Button>
                                </View>
                                <View style={styles.reservationItem}>
                                    <Text>
                                        Number of people:
                                    </Text>
                                    <View style={styles.numberSpinner}>
                                        {
                                            this.props.editable ?
                                            <Button
                                                iconLeft
                                                transparent
                                                style={styles.numberSpinnerButton}
                                                onPress={() => {
                                                    if (this.state.reservation_number > 1) {
                                                        this.setState({reservation_number: this.state.reservation_number - 1});
                                                    }
                                                }}
                                            >
                                                <Text>-</Text>
                                            </Button>
                                            :
                                            false
                                        }
                                        <Input
                                            textAlign={'center'}
                                            value={this.state.reservation_number.toString()}
                                            style={styles.numberSpinnerInput}
                                        />
                                        {
                                            this.props.editable ?
                                            <Button
                                                iconLeft
                                                transparent
                                                style={styles.numberSpinnerButton}
                                                onPress={()=>{
                                                    if (this.state.reservation_number < 10) {
                                                        this.setState({reservation_number: this.state.reservation_number + 1});
                                                    }
                                                }}
                                            >
                                                <Text>+</Text>
                                            </Button>
                                            :
                                            false
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    <View style={styles.buttonPanel}>
                        <Button
                            full
                            onPress={this.onContinue}
                        >
                            <Text>Continue</Text>
                        </Button>
                    </View>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    mode='datetime'
                    date={new Date(this.state.reservation_date)}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear + 1, new Date().getMonth, new Date().getDate)}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
  return {
    service: state.service
  };
}

function bindActions(dispatch) {
  return {
    setService: service => dispatch(setService(service))
  };
}

export default connect(
  //mapStateToProps,
)(ServiceInfo);