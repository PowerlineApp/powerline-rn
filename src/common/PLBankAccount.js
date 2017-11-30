import React, { Component,  } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
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
    Spinner,
    Item,
    List,
    ListItem,
    Input,
    Card,
    Button,
    Icon,
    Form,
    Text,
    Picker
} from 'native-base';
import HyperLink from 'react-native-hyperlink';
import { connect } from 'react-redux';
import moment from 'moment';
import PLColors from 'PLColors';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Stripe from 'tipsi-stripe';

class PLBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountNumber: '',
            countryCode: 'us',
            currency: 'usd',
            routingNumber: '',
            accountHolderName: `${props.user.full_name}`,
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
            dobError: false,
            address_line1: (props.user.address1 ? `${props.user.address1}` : ''),
            address_line1Error: false,
            address_line2: (props.user.address2 ? `${props.user.address2}` : ''),
            city: `${props.user.city}`,
            ssn_last_4Error: false,
            tax_idError: false,
            ssn_last_4: '',
            business_name: '',
            postal_code: `${props.user.zip}`,
            postal_codeError: false,
            state: `${props.user.state}`,
            tokenLoading: false,
            accountNickname: ''
        };
        this.inputChanged = this.inputChanged.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.generateToken = this.generateToken.bind(this);
        this.buildObject = this.buildObject.bind(this);
        this.save = this.save.bind(this);
    } 

    async inputChanged(key, prop) {
        await this.setState(state => {
            state[key] = prop;
            return state;
        });

        if(this.checkNumber(this.state.accountNumber) && this.state.accountNumber.length > 3) {
            this.setState({accountNumberValidated: true});
        } else {
            this.setState({accountNumberValidated: false});
        }
        
        if(key === 'routingNumber'&& this.checkNumber(prop) && prop.length === 9) {
            this.setState({routingNumberValidated: true});
        } else {
            this.setState({routingNumberValidated: false});
        }

        if(moment().diff(moment(this.state.dob).format(), 'year') < 18) {
            this.setState({
                dobError: true
            });
            // Alert.alert('You must be at least 18 to setup a bank account');
        } else {
            this.setState({dobError: false});
        }

        if(key === 'address_line' && prop.length < 8) {
            this.setState({
                address_line1Error: true
            });
        } else {
            this.setState({
                address_line1Error: false
            });
        }

        if(key === 'postal_code' && prop.length <= 4) {
            this.setState({
                postal_codeError: true
            });
        } else {
            this.setState({
                postal_codeError: false
            });
        }

        if(key === 'ssn_last_4' && prop.length < 4 ) {
            this.setState({
                ssn_last_4Error: false
            });            
        } else {
            if(this.checkNumber(prop)) {
                this.setState({
                    ssn_last_4Error: false
                });
            } else {
                this.setState({
                    ssn_last_4Error: true
                });
            }
        }
        
        if(key === 'tax_id' && prop.length < 9) {
            this.setState({
                tax_idError: true
            });
        } else {
            if(this.checkNumber(prop)) {
                this.setState({
                    tax_idError: false
                });
            } else {
                this.setState({
                    tax_idError: true
                });
            }
        }

    }

    checkNumber(number) {
        return /^\d+$/.test(number);
    }

    validateFields() {
        const { routingNumber, accountNumber } = this.state;
        if(!this.checkNumber(this.state.accountNumber) && this.state.accountNumber.length >= 3) {
            this.setState({accountNumberValidated: false});
            this.setState({accountNumberErrorMessage: 'Invalid Account Number'});
            console.log('1');
            return false;
        }
        
        if(!this.checkNumber(this.state.routingNumber) && this.state.routingNumber.length !== 9) {
            this.setState({
                routingNumberValidated: false,
                routingNumberErrorMessage: 'Routing Number must have 9 digits'
            });
            console.log('2');
            return false;
        }
        
        if(this.state.dob && moment().diff(moment(this.state.dob).format(), 'year') < 18) {
            this.setState({
                dobError: true
            });
            console.log('3');
            return false;
        }
        
        if(this.state.postal_code.length < 5) {
            this.setState({
                postal_codeError: true
            });
            console.log('5');
            return false;
        }
        

        return true;
    }

    generateToken({accountNumber, accountHolderName, currency, routingNumber, countryCode, accountHolderType, accountNickname}) {
        this.setState({tokenLoading: true});
        const params = {accountNumber, accountHolderName, currency, routingNumber, countryCode, accountHolderType, metadata: {Label: accountNickname}};
        if(this.validateFields()) {
            Stripe.createTokenWithBankAccount(params)
                .then(token => {
                    console.log(token);
                    if(token.tokenId) {
                        this.setState({token: token.tokenId, bankSaved: true, tokenLoading: false});
                    } else {
                        this.setState({tokenLoading: false, stripeError: 'Please make sure you entered all information correctly.'});
                    }
                })
                .catch(error => {
                    this.setState({stripeError: error.message, tokenLoading: false});
                });
        } else {
            console.log('fields not validated');
            this.setState({saveError: true, tokenLoading: false});
        }
    }

    save(params) {
        const backendData = this.buildObject(params);
        if (!backendData) return;
        this.props.onSave(backendData);
    }

    buildObject(params) {
        const obj = {
            source: params.token,
            tax_id: params.tax_id,
            address_line1: params.address_line1,
            address_line2: params.address_line2,
            currency: params.currency,
            type: params.accountHolderType,
            first_name: params.accountHolderName.split(' ')[0],
            last_name: params.accountHolderName.split(' ')[params.accountHolderName.split(' ').length - 1],
            ssn_last_4: params.ssn_last_4.substr(params.ssn_last_4.length - 4, params.ssn_last_4.length),
            city: params.city,
            state: params.state,
            postal_code: params.postal_code,
            country: params.countryCode.toUpperCase(),
            dob: params.dob
        };
        if(obj.type === 'company') {
            obj.business_name === params.business_name;
        }
        console.log(obj);
        let valid = true;
        Object.keys(obj).map(key => {
            console.log('key, value', key, obj[key]);
            if (!obj[key] && key !== 'address_line2' ){
                console.log('not valid => ', key, obj[key]);
                valid = false;
                let state = this.state;
                state[key + 'Error'] = true;
                this.setState({...state, stripeError: 'Please check all fields'});
            } else {
                let state = this.state;
                state[key + 'Error'] = false;
                this.setState(state, () => console.log('=>', this.state[key + 'Error']));
            }
        });
        console.log(moment().diff(moment(obj.dob).format(), 'year'));
        if(moment().diff(moment(obj.dob).format(), 'year') < 18) {
            this.setState({
                dobError: true
            });
            Alert.alert('User age must be higher than 18 years old');
            valid = false;
        }

        if (!valid){
            return false;
        }
        this.setState({stripeError: ''});

        return obj;

    }

    pickColor(condition, conditionError) {
        if(condition === null) {
            return 'grey';
        } else if(condition !== null && conditionError) {
            return 'red';
        } else {
            return 'green';
        }
    }
    
    _renderAditionalForm() {
        return (
            <Card style={{padding: 10}}>
                <Form>
                    { this.state.accountHolderType === 'company' 
                    ?   <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Business Name</Text> 
                        <Item rounded>
                            <Input placeholder='Business Name' onChangeText={text => this.inputChanged('business_name', text)} />
                        </Item>
                    </View>
                    : null
                    }
                    <Text style={styles.labelStyle}>Date of Birth</Text> 
                    <View style={{borderColor: this.pickColor(this.state.dob, this.state.dobError), borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25, height: 50}}>
                        <DatePicker 
                            showIcon={false}
                            mode='date'
                            format='YYYY-MM-DD'
                            customStyles={{dateInput: {borderWidth: 0, marginLeft: -50}, placeholderText: {color: 'grey', fontSize: 17, marginLeft: 20}, dateText: {fontSize: 17, marginLeft: 20}}}
                            onDateChange={date => this.inputChanged('dob', date)}
                            date={this.state.dob}
                        />
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Address Line 1</Text> 
                        <Item rounded success={!this.state.address_line1Error} error={this.state.address_line1Error}>
                            <Input placeholderTextColor={'#ccc'} placeholder='Address Line 1' value={this.state.address_line1} onChangeText={text => this.inputChanged('address_line1', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Address Line 2</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='Address Line 2' value={this.state.address_line2} onChangeText={text => this.inputChanged('address_line2', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>City</Text> 
                        <Item rounded success={!this.state.cityError} error={this.state.cityError} >
                            <Input placeholderTextColor={'#ccc'} placeholder='City' value={this.state.city} onChangeText={text => this.inputChanged('city', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>State</Text> 
                        <Item rounded error={this.state.stateError} success={!this.state.stateError} >
                            <Input placeholderTextColor={'#ccc'} placeholder='State' value={this.state.state} onChangeText={text => this.inputChanged('state', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Postal Code</Text> 
                        <Item rounded success={!this.state.postal_codeError} error={this.state.postal_codeError}>
                            <Input keyboardType='numeric' placeholderTextColor={'#ccc'} placeholder='Postal Code' value={this.state.postal_code} onChangeText={text => this.inputChanged('postal_code', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Tax ID</Text> 
                        <Item rounded success={!this.state.tax_idError} error={this.state.tax_idError}>
                            <Input keyboardType='numeric' placeholderTextColor={'#ccc'} placeholder='Tax ID' onChangeText={text => this.inputChanged('tax_id', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Last 4 SSN</Text> 
                        <Item rounded success={!this.state.ssn_last_4Error} error={this.state.ssn_last_4Error}>
                            <Input keyboardType='numeric' placeholderTextColor={'#ccc'} maxLength={4} placeholder='SSN' onChangeText={text =>this.inputChanged('ssn_last_4', text)} />
                        </Item>
                    </View>
                    
                    <Agreement />
                    <Text style={styles.bottomError} >{this.state.stripeError}</Text>

                    {
                          this.props.loading 
                          ? <Spinner color={'blue'} />
                          : <Button disabled={this.props.loading} block style={styles.submitButtonContainer} onPress={() => this.save(this.state)}>
                              <Label style={{color: 'white'}}>Save</Label>
                          </Button>
                    }
                </Form>
            </Card>
        );
    }

    render() {
        console.log(this.props.user);
        console.log(this.state.bankSaved);
        if(this.state.bankSaved) {
            return this._renderAditionalForm();
        } else {
            return this._renderBankForm();
        }
    }

    _renderBankForm() {
        // hardcode to prevent future code changes -- just change these objects from whatever stripe endpoint returns and the pickers should work
        let countryList = [{label:'United States', value:'us'}];
        let currencyList = {
            'us': [{label:'USD', value:'usd'}]
        };
        return (
            <Card style={{padding: 10}}>
                <Form>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Account Nickname</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='Account Nickname' onChangeText={text =>this.inputChanged('accountNickname', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Account Type</Text> 
                        <View style={{borderColor: 'grey', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25}}>
                            <Picker 
                                placeholder='Account Type'
                                iosHeader='Account Type'
                                mode='dropdown'
                                selectedValue={this.state.accountHolderType}
                                onValueChange={value => {
                                    this.inputChanged('accountHolderType', value);
                                }}
                            >
                                <Item label='Company' value='company' />
                                <Item label='Individual' value='individual' />
                            </Picker>
                        </View>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Country</Text> 
                        <View style={{borderColor: 'grey', minHeight: 50, justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25}}>
                            {
                                    countryList.length > 1
                                    ?
                                        <Picker 
                                            iosHeader='Country'
                                            mode='dropdown'
                                            selectedValue={this.state.countryCode}
                                            onValueChange={value => {
                                                console.log(value);
                                                this.inputChanged('countryCode', value);
                                            }}
                                    >
                                            {countryList.map(country => 
                                                <Item label={country.label} value={country.value} />
                                            )}
                                        </Picker>
                            : <Text style={{marginLeft: 16}}>{countryList[0].label}</Text>
                            }
                        </View>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Currency</Text> 
                        <View style={{borderColor: 'grey', minHeight: 50, justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25}}>
                            {
                            
                                currencyList[this.state.countryCode].length > 1
                                ?
                                    <Picker 
                                        iosHeader='Currency'
                                        mode='dropdown'
                                        selectedValue={this.state.currency}
                                        onValueChange={value => {
                                            this.inputChanged('currency', value);
                                        }}
                                    >
                                        {currencyList[this.state.countryCode].map(country => <Picker.item label={country.label} value={country.value} />)}
                                    </Picker>
                                : <Text style={{marginLeft: 16}}>{currencyList[this.state.countryCode][0].label}</Text>
                            
                            
                            }
                        </View>
                    </View>
                    
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Account Holder's Name</Text> 
                        <Item rounded>
                            <Input value={this.state.accountHolderName} placeholder="Holder's Name" onChangeText={text => this.inputChanged('accountHolderName', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Account Number</Text> 
                        <Item rounded success={this.state.accountNumberValidated} error={!this.state.accountNumberValidated}>
                            <Input keyboardType='numeric' placeholderTextColor={'#ccc'} placeholder='Account Number' onChangeText={text => this.inputChanged('accountNumber', text)} />
                        </Item>
                        {   this.state.accountNumberErrorMessage
                            ? <Text style={{color: 'red', fontSize: 12}}>{this.state.accountNumberErrorMessage}</Text>
                            : null
                        }
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Routing Number</Text> 
                        <Item rounded success={this.state.routingNumberValidated} error={!this.state.routingNumberValidated}>
                            <Input keyboardType='numeric' placeholderTextColor={'#ccc'} type='number' placeholder='Routing Number' onChangeText={text => this.inputChanged('routingNumber', text)} />
                        </Item>
                        {   this.state.routingNumberErrorMessage
                            ? <Text style={{color: 'red', fontSize: 12}}>{this.state.routingNumberErrorMessage}</Text>
                            : null
                        }
                    </View>
                    <Agreement />
                    <Text style={styles.bottomError} >{this.state.stripeError}</Text>
                    {   !this.state.tokenLoading
                        ?   <Button block style={styles.submitButtonContainer} onPress={() => this.generateToken(this.state)}>
                            <Label style={{color: 'white'}}>Submit</Label>
                        </Button>
                        :   <Spinner color={'blue'} />
                    }
                </Form>
            </Card>
        );
    }
}

const styles = {
    submitButtonContainer: {
        backgroundColor: PLColors.main,
        marginTop: 20,
        marginBottom: 12
    },
    labelStyle: {
        fontSize: 12, 
        color: 'grey', 
        marginLeft: 5,
        marginVertical: 5
    },
    bottomError: {
        fontSize: 16,
        fontWeight: '200',
        marginHorizontal: 20,
        marginTop: 8,
        color: '#D00'
    }
};

const mapStateToProps = (state) => ({
    user: state.user.profile,
    loading: state.groupManagement.loading
});
export default connect(mapStateToProps)(PLBankAccount);

const Agreement = () => (
    <View>
        <View style={{padding: 3, paddingBottom: 10}}>
            <Text
                style={{fontSize: 12, color: 'grey'}}
            >
                By registering your bank account, you agree to our
                <Text
                    style={{fontSize: 12, color: 'blue'}}
                    onPress={() => Linking.openURL('https://www.powerli.ne/terms')}
                >
                    {''} Terms of Service {''} 
                </Text>
                and the
                <Text
                    style={{fontSize: 12, color: 'blue'}}
                    onPress={() => Linking.openURL('https://stripe.com/us/connect-account/legal')}
                >
                    {''} Stripe Connected Account Agreement
                </Text>
                .
            </Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => Linking.openURL('https://stripe.com/us/connect-account/legal')}>
            <Image source={require('../assets/powered_by_stripe@2x.png')} style={{height: 50, flex: 1, borderRadius: 25}} />
            <Image source={require('../assets/comodo_logo.jpg')} style={{height: 50, flex: 1,  borderRadius: 25}} />
        </TouchableOpacity>
    </View>
);
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