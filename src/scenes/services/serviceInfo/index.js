import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import _ from "lodash";
import PropTypes from "prop-types";
import {
  Text,
  Button,
  Input,
  Icon,
  Textarea,
  DatePicker
} from "native-base";
import { Actions } from "react-native-router-flux";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { setService } from "../../../actions/services";
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
          isDateTimePickerVisible: false,
          price: 0,
        };
    }

    componentDidMount() {
        let props = this.props;
        this.setState({
            price: props.service.price,
            memo: props.service.memo,
            reservation_date: (props.service.reservation_details && props.service.reservation_details.indexOf(' | ') > -1) ? moment(props.service.reservation_details.split(' | ')[0]).format('YYYY-MM-DD hh:mm:ss A') : moment().format('YYYY-MM-DD hh:mm:ss A'),
            reservation_number: (props.service.reservation_details && props.service.reservation_details.indexOf(' | ') > -1) ? parseInt(props.service.reservation_details.split(' | ')[1]) : 1
        });
    }

     componentWillReceiveProps(nextProps) {
      console.log("componentWillReceiveProps at serviceInfo", nextProps);
      if (nextProps.service && nextProps.service !== this.state.service) {
        this.setState({
            service: nextProps.service
        });
      }
    }

    

    onContinue = async () => {
        const {memo, reservation_date, reservation_number: persons} = this.state
        const date = moment(reservation_date).format('YYYY-MM-DD HH:mm:ss')
        const newService = {
            memo,
            reservation: {
                date, persons
            }
        }
        this.props.onContinue(newService)
    }
    onClose = () => {
        this.props.onClose();
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
    
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({reservation_date: moment(date).format('YYYY-MM-DD hh:mm:ss A')});
        this._hideDateTimePicker();
    };

    changeMemo = (memo) => {
        this.setState({ memo });
    }

    changePrice = (price) => {
        this.setState({ price });
    }

    addReserVationNumber = () => {
        this.setState(p => ({reservation_number: p.reservation_number >= 10 ? p.reservation_number : (p.reservation_number + 1)}))
    }
    subReserVationNumber = () => {
        this.setState(p => ({reservation_number: p.reservation_number <= 1 ? p.reservation_number : (p.reservation_number - 1)}))
    }
    reservationButton = ({type}) => {
        const name = type === 'add' ? 'ios-add' : 'ios-remove'
        const action = type === 'add' ? this.addReserVationNumber : this.subReserVationNumber
        return (
            <TouchableOpacity onPress={action}>
                <View style={styles.reservationIconContainer}>
                    <Icon
                        name={name}
                        style={styles.reservationIcon}
                        />
                </View>
            </TouchableOpacity>
        )
    }
    renderReservationItem = () => {
        return (
            <View style={styles.numberOfPeopleContainer}>
                <View>
                    <Text style={styles.reservationLabel}>
                        People
                    </Text>
                </View>
                <View style={styles.reservationInputContainer}>
                    <this.reservationButton type='subtract' />
                    <Text>{this.state.reservation_number.toString()}</Text>
                    <this.reservationButton type='add' />
                </View>
            </View>
        )
    }

    renderLabel = ({label, value, type }) => {
        return (
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>
                    {label}
                </Text>
                <Text style={type === 'money' ? styles.priceText : styles.labelValue}> 
                    {value}
                </Text>
            </View>
        )
    }

    render() {
        const { service } = this.props;
        const { price, surcharge, third_party_name } = this.props.service
        let {reservation_date} = this.state
        return (
            <ScrollView>
                <View style={styles.overlay}>
                    <View style={styles.infoView}>
                        <View style={styles.titleItem}>
                            <Text style={styles.serviceTitle}>{service.title}</Text>
                        </View>
                        <View style={styles.item}>
                            {
                                service.is_ride ? (<Textarea
                                    style={{height: 0}}
                                    placeholder={this.props.service.memo_placeholder}
                                    value={this.state.price}
                                    editable={this.props.editable}
                                    selectTextOnFocus={this.props.editable}
                                    onChangeText={(text) => this.changePrice(text)}
                                />) : <this.renderLabel label='Price' type='money' value={`$${price}`} />
                            }
                        </View>
                        <View style={styles.item}>
                            <this.renderLabel label='Surcharge' type='money' value={`$${surcharge}`} />
                        </View>
                        {third_party_name ? <View style={styles.item}>
                            <this.renderLabel label='By' value={this.props.service.third_party_name} />
                        </View> : null}
                        <View style={styles.textAreaItem}>
                            <Text style={[styles.labelText, {marginTop: 4}]}>
                                Leave a note
                            </Text>
                            <Textarea
                                style={styles.memoArea}
                                placeholder={this.props.service.memo_placeholder}
                                value={this.state.memo}
                                editable={this.props.editable}
                                selectTextOnFocus={this.props.editable}
                                onChangeText={(text) => this.changeMemo(text)}
                            />
                        </View>
                        {
                            
                            <View style={styles.item}>
                                <Text style={[styles.labelText, {marginTop: 4, marginBottom: 4}]}>
                                    Reservation
                                </Text>
                                <View style={styles.reservationPanel}>
                                    <View style={styles.reservationItem}>
                                        <View style={{flex: 1}}>
                                            <Text style={styles.reservationLabel}>
                                                Date/Time
                                            </Text>
                                        </View>
                                        <Button
                                            transparent
                                            onPress={this.props.editable ? this._showDateTimePicker : () => {}}
                                            style={styles.dateButton}>
                                            <Text style={styles.dateText}>
                                                {moment(reservation_date).format('MMMM Do, hh:mm')}
                                            </Text>
                                        </Button>
                                    </View>
                                    {this.renderReservationItem()}
                                </View>
                            </View>
                        }
                        <View style={styles.buttonPanel}>
                            <Button
                                full
                                onPress={this.onContinue}
                            >
                                <Text>Request</Text>
                            </Button>
                            <TouchableOpacity
                                style={{ marginTop: 10 }}
                                onPress={this.onClose}
                            >
                                <Text style={{ color: 'red' }}>Close</Text>
                            </TouchableOpacity>
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
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
  return {
    userDetails: state.user,
  };
}

function bindActions(dispatch) {
  return {
    setService: (token, serviceId, service) => dispatch(setService(token, serviceId, service))
  };
}

export default connect(
  mapStateToProps,
  bindActions,
)(ServiceInfo);