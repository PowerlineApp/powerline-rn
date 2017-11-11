import React, { Component,  } from 'react';
import { View, StyleSheet } from 'react-native';
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
    Item,
    List,
    ListItem,
    Input,
    Button,
    Icon,
    Form,
    Text,
    Picker
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment'
import PLColors from 'PLColors'
import DatePicker from 'react-native-datepicker'
import { Actions } from 'react-native-router-flux'
import Stripe from 'tipsi-stripe'

class PLBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountNumber: '',
            countryCode: 'us',
            currency: 'usd',
            routingNumber: '',
            accountHolderName: `${props.user.first_name} ${props.user.last_name}`,
            accountHolderType: 'individual',
            accountNumberValidated: false,
            routingNumberValidated: false,
            accountNumberErrorMessage: null,
            routingNumberErrorMessage: null,
            stripeError: false,
            saveError: false,
            bankSaved: false,
            token: null,
            dob: null,
            address_line1: '',
            address_line2: '',
            city: '',
            business_name: '',
            tokenLoading: null,
            accountNickname: ''
        }
        this.inputChanged = this.inputChanged.bind(this)
        this.validateFields = this.validateFields.bind(this)
        this.generateToken = this.generateToken.bind(this)
        this.buildObject = this.buildObject.bind(this)
        this.save = this.save.bind(this)
    } 

    inputChanged(key, prop) {
        this.setState(state => {
            state[key] = prop;
            return state;
        })

        if(this.checkNumber(this.state.accountNumber) && this.state.accountNumber.length > 3) {
            this.setState({accountNumberValidated: true})
        } else {
            this.setState({accountNumberValidated: false})
        }
        
        if(this.checkNumber(this.state.routingNumber) && this.state.routingNumber.length === 9) {
            this.setState({routingNumberValidated: true})
        } else {
            this.setState({routingNumberValidated: false})
        }
    }

    checkNumber(number) {
        console.log(/^\d+$/.test(number))
        return /^\d+$/.test(number);
    }

    validateFields() {
        const { routingNumber, accountNumber } = this.state;
        if(!this.checkNumber(this.state.accountNumber) && this.state.accountNumber.length >= 3) {
            this.setState({accountNumberValidated: false})
            this.setState({accountNumberErrorMessage: 'Invalid Account Number'})
            return false;
        }

        if(!this.checkNumber(this.state.routingNumber) && this.state.routingNumber.length !== 9) {
            this.setState({
                routingNumberValidated: false,
                routingNumberErrorMessage: 'Routing Number must have 9 digits'
            })
            return false;
        }

        return true;
    }

    generateToken({accountNumber, accountHolderName, currency, routingNumber, countryCode, accountHolderType, accountNickname}) {
        this.setState({tokenLoading: true})
        const params = {accountNumber, accountHolderName, currency, routingNumber, countryCode, accountHolderType, metadata: {Label: accountNickname}}
        if(this.validateFields()) {
            Stripe.createTokenWithBankAccount(params)
                .then(token => {
                    console.log(token)
                    if(token.tokenId) {
                        this.setState({token: token.tokenId, bankSaved: true, tokenLoading: false})
                    } else {
                        this.setState({tokenLoading: false, stripeError: 'Something Wrong Happened'})
                    }
                })
                .catch(error => {
                    this.setState({stripeError: error, tokenLoading: false})
                })
        } else {
            this.setState({saveError: true, tokenLoading: false})
        }
    }

    save(params) {
        console.log(params)
        const backendData = this.buildObject(params)
    }

    buildObject(params) {
        console.log(params)
    }

    _renderAditionalForm() {
        return (
            <Form>
                { this.state.accountHolderType === 'company' 
                ?   <View style={{marginVertical: 5}}>
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Business Name</Text> 
                        <Item rounded>
                            <Input placeholder='Business Name' onChangeText={text => this.inputChanged('business_name', text)}/>
                        </Item>
                    </View>
                : null
                }
                <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Date of Birth</Text> 
                <View style={{borderColor: 'grey', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25, height: 50}}>
                    <DatePicker 
                        showIcon={false}
                        mode='date'
                        value={this.state.dob}
                        customStyles={{dateInput: {borderWidth: 0, marginLeft: -50}, placeholderText: {color: 'grey', fontSize: 17, marginLeft: 20}}}
                        onDateChange={date => this.inputChanged('dob', date)}
                    />
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Address Line 1</Text> 
                    <Item rounded>
                        <Input placeholder='Address Line 1' onChangeText={text => this.inputChanged('address_line1', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Address Line 2</Text> 
                    <Item rounded>
                        <Input placeholder='Address Line 2' onChangeText={text => this.inputChanged('address_line2', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>City</Text> 
                    <Item rounded>
                        <Input placeholder='City' onChangeText={text => this.inputChanged('city', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>State</Text> 
                    <Item rounded>
                        <Input placeholder='State' onChangeText={text => this.inputChanged('state', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Postal Code</Text> 
                    <Item rounded>
                        <Input placeholder='Postal Code' onChangeText={text => this.inputChanged('postal_code', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Tax ID</Text> 
                    <Item rounded>
                        <Input placeholder='Tax ID' onChangeText={text => this.inputChanged('tax_id', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>SSN 4 last digits</Text> 
                    <Item rounded>
                        <Input placeholder='SSN 4 last digits' onChangeText={text =>this.inputChanged('ssn_last_4', text)}/>
                    </Item>
                </View>

                <Button block style={styles.submitButtonContainer} onPress={() => this.save(this.state)}>
                    <Label style={{color: 'white'}}>Save</Label>
                </Button>
            </Form>
        )
    }

    render() {
        console.log(this.state)
        if(this.state.bankSaved) {
            return this._renderAditionalForm()
        } else {
            return this._renderBankForm()
        }
    }

    _renderBankForm() {
        return (
            <Form>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Account Nickname</Text> 
                    <Item rounded>
                        <Input placeholder='Account Nickname' onChangeText={text =>this.inputChanged('accountNickname', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Account Type</Text> 
                    <View style={{borderColor: 'grey', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25}}>
                        <Picker 
                            placeholder='Account Type'
                            iosHeader="Account Type"
                            mode="dropdown"
                            selectedValue={this.state.accountHolderType}
                            onValueChange={value => {
                                console.log(value)
                                this.inputChanged('accountHolderType', value)
                            }}
                        >
                            <Item label="Company" value='company'/>
                            <Item label="Individual" value='individual'/>
                        </Picker>
                    </View>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Country</Text> 
                    <View style={{borderColor: 'grey', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25}}>
                        <Picker 
                            iosHeader="Country"
                            mode="dropdown"
                            selectedValue={this.state.countryCode}
                            onValueChange={value => {
                                console.log(value)
                                this.inputChanged('countryCode', value)
                            }}
                        >
                            <Item label="United States" value='us'/>
                            {/* <Item label="Personal" value='personal'/> */}
                        </Picker>
                    </View>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Currency</Text> 
                    <View style={{borderColor: 'grey', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25}}>
                        <Picker 
                            iosHeader="Currency"
                            mode="dropdown"
                            selectedValue={this.state.currency}
                            onValueChange={value => {
                                // console.log(value)
                                this.inputChanged('currency', value)
                            }}
                        >
                            <Item label="USD" value='usd'/>
                            {/* <Item label="Personal" value='personal'/> */}
                        </Picker>
                    </View>
                </View>
                
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Holder's name</Text> 
                    <Item rounded>
                        <Input value={this.state.accountHolderName} placeholder="Holder's Name" onChangeText={text => this.inputChanged('accountHolderName', text)}/>
                    </Item>
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Account Number</Text> 
                    <Item rounded success={this.state.accountNumberValidated} error={!this.state.accountNumberValidated}>
                        <Input placeholder='Account Number' onChangeText={text => this.inputChanged('accountNumber', text)}/>
                    </Item>
                    {   this.state.accountNumberErrorMessage
                        ? <Text style={{color: 'red', fontSize: 12}}>{this.state.accountNumberErrorMessage}</Text>
                        : null
                    }
                </View>
                <View style={{marginVertical: 5}}>
                    <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>Routing Number</Text> 
                    <Item rounded success={this.state.routingNumberValidated} error={!this.state.routingNumberValidated}>
                        <Input type='number' placeholder='Routing Number' onChangeText={text => this.inputChanged('routingNumber', text)}/>
                    </Item>
                    {   this.state.routingNumberErrorMessage
                        ? <Text style={{color: 'red', fontSize: 12}}>{this.state.routingNumberErrorMessage}</Text>
                        : null
                    }
                </View>
                <Button block style={styles.submitButtonContainer} onPress={() => this.generateToken(this.state)}>
                    <Label style={{color: 'white'}}>Submit</Label>
                </Button>
            </Form>
        )
    }
}

const styles = {
    submitButtonContainer: {
        backgroundColor: PLColors.main,
        marginTop: 20,
        marginBottom: 12
    }
}

const mapStateToProps = (state) => ({
    user: state.user.profile
})
export default connect(mapStateToProps)(PLBankAccount)


// const COUNTRIES = [
//     {name: 'Austria', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'at'},
//     {name: 'Australia', currency: ['aud'], countryCode: 'aud'},
//     {name: 'Belgium', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'be'},
//     {name: 'Canada', currency: ['cad', 'usd'], countryCode: 'ca'},
//     {name: 'Switzerland', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'ch'},
//     {name: 'Germany', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'de'},
//     {name: 'Denmark', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'dk'},
//     {name: 'Spain', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'es'},
//     {name: 'Finland', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'fi'},
//     {name: 'France', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'fr'},
//     {name: 'United Kingdom', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'gb'},
//     {name: 'Ireland', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'ie'},
//     {name: 'Italy', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'it'},
//     {name: 'Italy', currency: ['eur', 'dkk', 'gbp', 'nok', 'sek', 'usd', 'chf'], countryCode: 'it'},
    
// ]