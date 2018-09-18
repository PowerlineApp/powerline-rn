import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Stripe, {PaymentCardTextField} from 'tipsi-stripe';
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
import { showToast } from 'PLToast';
import PLColors from 'PLColors';

class PLAddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressLine1: (props.user.address1 ? `${props.user.address1}` : ''),
            addressLine2: (props.user.address2 ? `${props.user.address2}` : ''),
            name: (props.user.full_name ? `${props.user.full_name}` : ''),
            addressCity: (props.user.city ? `${props.user.city}` : ''),
            addressState: (props.user.state ? `${props.user.state}` : ''),
            addressZip: (props.user.zip ? `${props.user.zip}` : ''),
            addressCountry: (props.user.country ? `${props.user.country}` : ''),
            phone: (props.user.phone ? `${props.user.phone}` : ''),
            email: (props.user.email ? `${props.user.email}` : ''),
            expYear: null,
            expMonth: null,
            cvc: null,
            number: null,
            addressCity: (props.user.city ? `${props.user.city}` : ''),
            currency: 'USD',
            cardValid: false,
            loading: false,
            error: null
        };
        // this.openCardForm = this.openCardForm.bind(this);
    }

    inputChanged(key, prop) {
        this.setState(state => {
            state[key] = prop;
            return state;
        });

    }

    handleFieldParamsChange (valid, params) {
        const number = params.number || '-';
        const expMonth = params.expMonth || '-';
        const expYear = params.expYear || '-';
        const cvc = params.cvc || '-';
        this.setState({
            number,
            expMonth,
            expYear,
            cvc,
            cardValid: valid
        });
    }
      
    save({name, number, addressLine1, addressLine2, addressCity, addressCountry, addressState, addressZip, expMonth, expYear, cvc, currency}) {
        this.setState({loading: true});
        const options = {
            number, 
            addressLine1, 
            addressLine2,
            expMonth,
            expYear,
            addressCity,
            addressState,
            addressZip,
            addressCountry,
            cvc,
            name,
            currency
        };
        try {
            Stripe.createTokenWithCard(options)
            .then(response => {
                this.setState({loading: false, error: null});
                showToast('Thanks! Your credit card was successfully added.');
                this.props.onSave(response);
            })
            .catch(err => {
                this.setState({loading: false, error: err.message});
                console.log(err);
            });
        } catch (error) {
            this.setState({loading: false, error: error.message});        
        }
    }
 //Felipe - This should not be limited to just US
    render() {
        let countryList = [{label:'United States', value:'us'}];
        let currencyList = {
            'us': [{label:'USD', value:'usd'}]
        };
        return (
            <Card style={{padding: 10}}>
                <View style={{width: '100%', flexDirection: 'column'}}>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Credit Card</Text> 
                        <View style={{borderColor: 'grey', borderWidth: StyleSheet.hairlineWidth,  borderRadius: 25}}>
                            <PaymentCardTextField style={{borderColor: 'black'}} onParamsChange={(valid, params) => this.handleFieldParamsChange(valid, params)} />
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
                        <Text style={styles.labelStyle}>Full Name</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='Name' value={this.state.name} onChangeText={text => this.inputChanged('name', text)} />
                        </Item>
                    </View>

                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Address Line 1</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='St.' value={this.state.addressLine1} onChangeText={text => this.inputChanged('addressLine1', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Address Line 2</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='Apt. x' value={this.state.addressLine2} onChangeText={text => this.inputChanged('addressLine2', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>City</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='City' value={this.state.addressCity} onChangeText={text => this.inputChanged('addressCity', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>State</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='State' value={this.state.addressState} onChangeText={text => this.inputChanged('addressState', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Phone</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='5555551234' value={this.state.phone} onChangeText={text => this.inputChanged('phone', text)} />
                        </Item>
                    </View>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.labelStyle}>Postal Code</Text> 
                        <Item rounded>
                            <Input placeholderTextColor={'#ccc'} placeholder='90210' value={this.state.addressZip} onChangeText={text => this.inputChanged('addressZip', text)} />
                        </Item>
                    </View>
                    <Agreement />

                    <Text style={styles.errorMessage}>{this.state.error}</Text>
                    <Button disabled={this.state.loading} block style={styles.submitButtonContainer} onPress={() => this.save(this.state)}>
                        <Label style={{color: 'white'}}>{this.state.loading ? 'Loading' : 'Save'}</Label>
                    </Button>
                </View>
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
    errorMessage: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#D00'
    }
};

const Agreement = () => (
    <View>
        <View style={{padding: 3, paddingBottom: 10}}>
            <Text
                style={{fontSize: 12, color: 'grey'}}
            >
                By setting up your payment information, you agree to our
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
            <Image source={require('../assets/powered_by_stripe.png')} resizeMode='contain' style={{height: 50, flex: 1, borderRadius: 25}} />
            <Image source={require('../assets/comodo_logo.jpg')} resizeMode='contain' style={{height: 50, flex: 1,  borderRadius: 25}} />
        </TouchableOpacity>
    </View>
);

const mapStateToProps = (state) => ({
    user: state.user.profile
});
export default connect(mapStateToProps)(PLAddCard);